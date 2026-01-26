"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeRepo } from "@/lib/scoring";
import { RepoAnalysis } from "@/lib/types";
import { repoStore } from "@/lib/store";
import { fetchUserStarredRepos, getUserProfile as fetchUserProfile, fetchUserStarredReposDetails } from "@/lib/github";

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
    return repoStore.getStats(userId);
}

export async function getLeaderboard() {
    return repoStore.getLeaderboard();
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
