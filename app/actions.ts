"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeRepo } from "@/lib/scoring";
import { RepoAnalysis } from "@/lib/types";
import { repoStore } from "@/lib/store";
import { fetchUserStarredRepos, getUserProfile as fetchUserProfile, fetchUserStarredReposDetails } from "@/lib/github";
import prisma from "@/lib/prisma";

export async function starRepo(repoName: string) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session?.accessToken) {
        throw new Error("Unauthorized");
    }

    try {
        const res = await fetch(`https://api.github.com/user/starred/${repoName}`, {
            method: "PUT",
            headers: {
                // @ts-ignore
                Authorization: `Bearer ${session.accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
                Accept: "application/vnd.github+json",
            },
        });

        if (!res.ok) {
            const error = await res.text();
            console.error("Failed to star repo:", error);
            return { success: false, error };
        }

        // Award XP!
        // @ts-ignore
        const userId = session.user?.id;
        if (userId) {
            const newStats = await repoStore.addXp(userId, 10); // 10 XP per star
            return { success: true, stats: newStats };
        }

        return { success: true };
    } catch (error) {
        console.error("Star repo action error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function unstarRepo(repoName: string) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session?.accessToken) {
        throw new Error("Unauthorized");
    }

    try {
        const res = await fetch(`https://api.github.com/user/starred/${repoName}`, {
            method: "DELETE",
            headers: {
                // @ts-ignore
                Authorization: `Bearer ${session.accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
                Accept: "application/vnd.github+json",
            },
        });

        if (!res.ok) {
            const error = await res.text();
            console.error("Failed to unstar repo:", error);
            return { success: false, error };
        }

        return { success: true };
    } catch (error) {
        console.error("Unstar repo action error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function rejectRepo(repoName: string) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        const userId = session?.user?.id;
        if (userId) {
            await repoStore.reject(repoName, userId);
        }
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function fetchHiddenGems(topic: string = "react") {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken || process.env.AUTH_GITHUB_SECRET;

    // 0. Smart Sync: Get repos user already starred
    let starredRepos: string[] = [];
    if ((session as any)?.accessToken) {
        starredRepos = await fetchUserStarredRepos((session as any).accessToken);
    }

    // Get rejected repos
    // @ts-ignore
    const userId = session?.user?.id;
    const rejectedRepos = userId ? await repoStore.getRejected(userId) : [];

    // 1. Get recent user submissions first! (The "Swap" aspect)
    const userSubmissions = await repoStore.getAll();
    const submissionProms = userSubmissions.slice(0, 5).map(sub =>
        analyzeRepo(sub.repoName, token).catch(() => null)
    );

    // 2. Fetch from GitHub Search
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    const pushedAfter = date.toISOString().split('T')[0];
    const query = `topic:${topic} stars:10..2000 pushed:>${pushedAfter} archived:false`;

    const searchPromise = fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=30`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 }
    }).then(res => res.ok ? res.json() : { items: [] });

    try {
        const [submissions, searchResults] = await Promise.all([
            Promise.all(submissionProms),
            searchPromise
        ]);

        const validSubmissions = submissions.filter(s => s !== null) as RepoAnalysis[];

        // Map search results to our format
        const gemsFromSearch = (searchResults.items || []).map((repo: any) => ({
            ...repo,
            score: Math.min(Math.floor((repo.watchers_count / repo.stargazers_count) * 1000) + 70, 98),
            summary: repo.description || "No description provided."
        })) as (RepoAnalysis["repo"] & { score: number })[];

        // Combine: Submissions first, then organic discovery
        // Filter out duplicates AND already starred repos AND rejected repos
        const combined = [...validSubmissions.map(s => ({ ...s.repo, score: s.score, summary: s.summary })), ...gemsFromSearch];

        // Remove duplicates by ID and filter out starred/rejected
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values())
            .filter(repo => !starredRepos.includes(repo.full_name))
            .filter(repo => !rejectedRepos.includes(repo.full_name));

        return unique.slice(0, 15); // Return mostly top 15 after filtering

    } catch (e) {
        console.error("Fetch Gems Error", e);
        return [];
    }
}

export async function submitRepo(repoName: string) {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken || process.env.AUTH_GITHUB_SECRET;

    try {
        const result = await analyzeRepo(repoName, token);

        // Persistence Hook: Add to global feed
        if (result) {
            // @ts-ignore
            const userId = session?.user?.id;
            if (userId) {
                await repoStore.add(repoName, userId);
            }
        }

        return result;
    } catch (e) {
        console.error("Submit Repo Error", e);
        return null;
    }
}

export async function getUserStats() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    const [stats, followStats] = await Promise.all([
        repoStore.getStats(userId),
        getFollowStats(userId)
    ]);
    return { ...stats, ...followStats };
}



export async function getUserProfile(username: string) {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken || process.env.AUTH_GITHUB_SECRET;
    return fetchUserProfile(username, token);
}

export async function getUserStarredRepos() {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken;

    if (!token) return [];


    return fetchUserStarredReposDetails(token);
}

// --- Messaging Actions ---

export async function createConversation(recipientId: string) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;

    if (!currentUserId || !recipientId) return { success: false, error: "Invalid users" };
    if (currentUserId === recipientId) return { success: false, error: "Cannot message yourself" };

    try {
        // Check if conversation exists
        let conversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: currentUserId } } },
                    { participants: { some: { id: recipientId } } }
                ]
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participants: {
                        connect: [{ id: currentUserId }, { id: recipientId }]
                    }
                }
            });
        }

        return { success: true, conversationId: conversation.id };
    } catch (error) {
        console.error("Create conversation error:", error);
        return { success: false, error: "Failed to create conversation" };
    }
}

export async function sendMessage(conversationId: string, content: string) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;

    if (!currentUserId || !conversationId || !content) return { success: false, error: "Missing data" };

    try {
        const message = await prisma.message.create({
            data: {
                content,
                senderId: currentUserId,
                conversationId,
            }
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        return { success: true, message };
    } catch (error) {
        console.error("Send message error:", error);
        return { success: false, error: "Failed to send message" };
    }
}

export async function getConversations() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;

    if (!currentUserId) return [];

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: { some: { id: currentUserId } }
            },
            include: {
                participants: {
                    where: { id: { not: currentUserId } },
                    select: { id: true, name: true, image: true, email: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return conversations.map(c => ({
            id: c.id,
            partner: c.participants[0],
            lastMessage: c.messages[0],
            updatedAt: c.updatedAt
        }));
    } catch (error) {
        console.error("Get conversations error:", error);
        return [];
    }
}

export async function getMessages(conversationId: string) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;

    if (!currentUserId) return [];

    try {
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            include: { sender: { select: { id: true, name: true, image: true } } }
        });
        return messages;
    } catch (error) {
        return [];
    }
}

// --- Follow Actions ---

export async function toggleFollow(targetUserId: string) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;

    if (!currentUserId || !targetUserId) return { success: false, error: "Invalid users" };
    if (currentUserId === targetUserId) return { success: false, error: "Cannot follow yourself" };

    try {
        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId
                }
            }
        });

        if (existingFollow) {
            // Unfollow
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: targetUserId
                    }
                }
            });
            return { success: true, isFollowing: false };
        } else {
            // Follow
            await prisma.follows.create({
                data: {
                    followerId: currentUserId,
                    followingId: targetUserId
                }
            });
            return { success: true, isFollowing: true };
        }
    } catch (error) {
        console.error("Toggle follow error:", error);
        return { success: false, error: "Database error" };
    }
}

export async function getFollowStats(userId: string) {
    try {
        const [followers, following] = await Promise.all([
            prisma.follows.count({ where: { followingId: userId } }),
            prisma.follows.count({ where: { followerId: userId } })
        ]);
        return { followers, following };
    } catch (error) {
        return { followers: 0, following: 0 };
    }
}

export async function checkIsFollowing(targetUserId: string) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;

    if (!currentUserId) return false;

    const follow = await prisma.follows.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId
            }
        }
    });


    return !!follow;
}

export async function getSwapStarUserByGithubId(githubId: number) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;

    try {
        const account = await prisma.account.findFirst({
            where: {
                provider: 'github',
                providerAccountId: githubId.toString()
            },
            include: {
                user: {
                    include: {
                        followedBy: currentUserId ? {
                            where: { followerId: currentUserId }
                        } : false
                    }
                }
            }
        });

        if (!account || !(account as any).user) return null;

        const user = (account as any).user;

        return {
            id: user.id,
            isFollowing: user.followedBy ? user.followedBy.length > 0 : false,
            // We can add internal stats here if we want to mix them
        };
    } catch (error) {
        return null;
    }
}

export async function getNewMatches() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;
    if (!currentUserId) return [];

    try {
        // 1. Get all users I follow
        const follows = await prisma.follows.findMany({
            where: { followerId: currentUserId },
            include: { following: true }
        });

        // 2. Get all users I have a conversation with
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: { some: { id: currentUserId } }
            },
            include: { participants: true }
        });

        // Get IDs of people I'm already talking to
        const existingPartnerIds = new Set();
        conversations.forEach(c => {
            c.participants.forEach(p => {
                if (p.id !== currentUserId) existingPartnerIds.add(p.id);
            });
        });

        // 3. Filter: Followed users NOT in existing conversations
        const matches = follows
            .map(f => f.following)
            .filter(u => !existingPartnerIds.has(u.id))
            .map(u => ({
                id: u.id,
                name: u.name || "Unknown",
                username: u.name || "user", // Fallback, distinct from GitHub login potentially
                image: u.image || "",
                isOnline: false // Mock for now
                // We'll need to fetch actual online status or just mock it
            }));

        return matches;
    } catch (error) {
        console.error("Get new matches error:", error);
        return [];
    }
}

export async function getDetailedUserProfile(username: string) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const currentUserId = session?.user?.id;
    const token = (session as any)?.accessToken;

    try {
        // 1. Fetch GitHub Profile
        const profile = await fetchUserProfile(username, token);

        let isFollowing = false;
        let dbUser = null;

        // Try to find the user in our DB to check follow status
        // We need to map github username -> our user ID
        // This relies on name or username match if they are synced
        // A better way is if we had the ID. But we have username here.
        // Let's try to find a user with this name or providerAccountId if we could (but we only have username).
        // For now, let's try to find by name if possible, or just skip if not found.
        if (currentUserId && profile) {
            // Find user where name ~ username or just assume we can't fully link without ID
            // Actually, `profile.login` is the github username.
            // If they signed up, we might have their data.
            // Let's check accounts for this user
            const account = await prisma.account.findFirst({
                where: {
                    provider: 'github',
                    // This is fragile if we don't have the ID, but we can't easily get providerAccountId from username without another call or knowing it.
                    // Actually profile.id is the github ID!
                    providerAccountId: profile.id.toString()
                },
                include: { user: true }
            });

            if (account && account.user) {
                dbUser = account.user;
                // Check if I follow them
                const follow = await prisma.follows.findUnique({
                    where: {
                        followerId_followingId: {
                            followerId: currentUserId,
                            followingId: account.user.id
                        }
                    }
                });
                isFollowing = !!follow;
            }
        }

        // 2. Fetch Top Repos (Pinned or just recently updated)
        // We'll use a simple search or user repos endpoint
        let topRepos = [];
        if (token) {
            const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-GitHub-Api-Version": "2022-11-28",
                    Accept: "application/vnd.github+json",
                }
            });
            if (res.ok) {
                topRepos = await res.json();
            }
        }

        return {
            profile,
            isFollowing,
            dbUserId: dbUser?.id, // Useful for the follow action
            topRepos: topRepos.map((r: any) => ({
                id: r.id,
                name: r.name,
                description: r.description,
                stargazers_count: r.stargazers_count,
                language: r.language
            }))
        };
    } catch (error) {
        console.error("Get detailed profile error:", error);
        return null;
    }
}

export async function getLeaderboard() {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        const currentUserId = session?.user?.id;

        const users = await prisma.user.findMany({
            take: 100,
            orderBy: { xp: 'desc' },
            select: {
                id: true,
                name: true,
                image: true,
                xp: true,
            }
        });

        // Add rank and isMe flag
        return users.map((user, index) => ({
            id: user.id,
            rank: index + 1,
            username: user.name || `User ${user.id.slice(0, 4)}`,
            image: user.image || "",
            score: user.xp,
            // Mocking trend and tech stack for now
            trend: Math.floor(Math.random() * 20) - 5,
            techStack: ["React", "Next.js"],
            isMe: user.id === currentUserId
        }));
    } catch (error) {
        console.error("Get leaderboard error:", error);
        return [];
    }
}
