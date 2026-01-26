import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const repoStore = {
    add: async (repoName: string, userId: string) => {
        try {
            // Check for duplicates
            const existing = await prisma.submittedRepo.findFirst({
                where: { repoFullName: repoName }
            });

            if (!existing) {
                // Determine score (mock logic moved here or kept in actions)
                // For now, simple create
                await prisma.submittedRepo.create({
                    data: {
                        repoFullName: repoName,
                        userId: userId,
                        score: 85 // Default score if not provided
                    }
                });
            }
        } catch (error) {
            console.error("Store Add Error:", error);
        }
    },

    getAll: async () => {
        const repos = await prisma.submittedRepo.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: { user: true }
        });
        return repos.map(r => ({
            repoName: r.repoFullName,
            submittedAt: r.createdAt.getTime(),
            submittedBy: r.user.name
        }));
    },

    // Rejection Logic (Swipe Left)
    reject: async (repoName: string, userId: string) => {
        try {
            await prisma.swipe.create({
                data: {
                    repoFullName: repoName,
                    userId: userId,
                    direction: "LEFT"
                }
            });
        } catch (error) {
            // Ignore duplicate swipes if any
            console.error("Reject Error", error);
        }
    },

    getRejected: async (userId: string) => {
        if (!userId) return [];
        const swipes = await prisma.swipe.findMany({
            where: {
                userId: userId,
                direction: "LEFT"
            },
            select: { repoFullName: true }
        });
        return swipes.map(s => s.repoFullName);
    },

    // Gamification
    addXp: async (userId: string, amount: number) => {
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { badges: true } });
        if (!user) return null;

        let { xp, level, starsGiven } = user;
        const badges = user.badges.map(b => b.badgeId);

        xp += amount;
        starsGiven += 1;
        level = Math.floor(xp / 100) + 1;

        // Badges Logic
        const newBadges = [];
        if (!badges.includes("first_swap") && starsGiven >= 1) newBadges.push("first_swap");
        if (!badges.includes("star_collector") && starsGiven >= 10) newBadges.push("star_collector");
        if (!badges.includes("pioneer") && level >= 5) newBadges.push("pioneer");

        // Update User
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { xp, level, starsGiven }
        });

        // Add new badges
        for (const badgeId of newBadges) {
            await prisma.badge.create({
                data: { userId, badgeId }
            });
        }

        // Return structured stats
        const finalBadges = await prisma.badge.findMany({ where: { userId } });
        return {
            xp: updatedUser.xp,
            level: updatedUser.level,
            starsGiven: updatedUser.starsGiven,
            badges: finalBadges.map(b => b.badgeId)
        };
    },

    getStats: async (userId: string) => {
        if (!userId) return { xp: 0, level: 1, starsGiven: 0, badges: [] };

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { badges: true }
        });

        if (!user) return { xp: 0, level: 1, starsGiven: 0, badges: [] };

        return {
            xp: user.xp,
            level: user.level,
            starsGiven: user.starsGiven,
            badges: user.badges.map(b => b.badgeId)
        };
    },

    getLeaderboard: async (currentUserId?: string) => {
        try {
            const includeParams: any = { badges: true };
            if (currentUserId) {
                includeParams.followedBy = { where: { followerId: currentUserId } };
            }

            const users = await prisma.user.findMany({
                orderBy: { xp: 'desc' },
                take: 10,
                include: includeParams
            });

            return users.map(u => ({
                id: u.id,
                name: u.name || "Anonymous",
                avatar: u.image || "https://github.com/shadcn.png",
                xp: u.xp,
                level: u.level,
                starsGiven: u.starsGiven,
                badges: u.badges.map(b => b.badgeId),
                isUser: u.id === currentUserId,
                isFollowing: (u as any).followedBy ? (u as any).followedBy.length > 0 : false
            }));
        } catch (error: any) {
            console.error("Get Leaderboard Error:", error);
            return [{
                id: "error",
                name: `Error: ${error.message}`,
                avatar: "",
                xp: 0,
                level: 0,
                starsGiven: 0,
                badges: [],
                isUser: false,
                isFollowing: false
            }];
        }
    }
};
