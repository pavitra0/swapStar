"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/app/actions";
import { Award, Star, Zap, Settings, Shield, Activity, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MyProfilePage() {
    const { data: session } = useSession();

    const { data: stats = { xp: 0, level: 1, starsGiven: 0, badges: [] as string[] }, isLoading } = useQuery({
        queryKey: ['userStats'],
        queryFn: () => getUserStats(),
        enabled: !!session?.user, // Only fetch if user is logged in
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!session?.user) return null;

    const nextLevelXp = stats.level * 100;
    const progress = (stats.xp % 100);

    return (
        <div className="container mx-auto max-w-5xl p-8 space-y-12">

            {/* Header / Banner */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-card border border-border rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />

                <div className="relative z-10 w-32 h-32 rounded-full border-4 border-indigo-500/20 overflow-hidden shadow-2xl">
                    <img src={session.user.image || "https://github.com/shadcn.png"} alt="User" className="w-full h-full object-cover" />
                </div>

                <div className="relative z-10 text-center md:text-left space-y-2 flex-1">
                    <h1 className="text-4xl font-black tracking-tight">{session.user.name}</h1>
                    <p className="text-muted-foreground font-medium text-lg">@{session.user.email?.split('@')[0]}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
                            Beta Tester
                        </span>
                    </div>
                </div>

                {/* Level Card (Moved from Sidebar) */}
                <div className="relative z-10 w-full md:w-80 p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-6 h-6 text-yellow-300" />
                        <span className="font-bold text-lg">SwapScore</span>
                    </div>
                    <div className="text-5xl font-black mb-2">Level {stats.level}</div>
                    <div className="w-full bg-black/20 h-3 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-yellow-400 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-indigo-100 text-sm mt-3 text-right font-medium">{100 - progress} XP to next level</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-secondary/20 border border-border/50 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-xl">
                        <Star className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Stars Given</p>
                        <p className="text-3xl font-black">{stats.starsGiven}</p>
                    </div>
                </div>
                <div className="p-6 bg-secondary/20 border border-border/50 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-purple-500/10 text-purple-500 rounded-xl">
                        <Zap className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total XP</p>
                        <p className="text-3xl font-black">{stats.xp}</p>
                    </div>
                </div>
                <div className="p-6 bg-secondary/20 border border-border/50 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-green-500/10 text-green-500 rounded-xl">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Current Streak</p>
                        <p className="text-3xl font-black">1 Day</p>
                    </div>
                </div>
            </div>

            {/* Tabs / Navigation (Placeholder for future features) */}
            <div className="w-full">
                <div className="flex border-b border-border mb-8">
                    <button className="px-6 py-3 border-b-2 border-primary text-primary font-bold">Overview</button>
                    <button className="px-6 py-3 border-b-2 border-transparent text-muted-foreground font-medium hover:text-foreground transition-colors">Badges</button>
                    <button className="px-6 py-3 border-b-2 border-transparent text-muted-foreground font-medium hover:text-foreground transition-colors">Settings</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: "first_swap", name: "First Swap", icon: Zap, desc: "Swiped right for the first time" },
                        { id: "star_collector", name: "Star Collector", icon: Star, desc: "Collected 10 stars" },
                        { id: "pioneer", name: "Pioneer", icon: Shield, desc: "Reached Level 5" },
                        { id: "influencer", name: "Influencer", icon: Users, desc: "Submitted a popular repo" },
                    ].map((badge) => {
                        const isUnlocked = stats.badges?.includes(badge.id);
                        return (
                            <div key={badge.id} className={`p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all ${isUnlocked ? "bg-card border-indigo-500/50 shadow-lg shadow-indigo-500/10" : "bg-card/50 border-border/50 opacity-50 grayscale"}`}>
                                <div className={`p-3 rounded-full ${isUnlocked ? "bg-indigo-500/20 text-indigo-400" : "bg-secondary text-muted-foreground"}`}>
                                    <badge.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{badge.name}</h3>
                                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                                </div>
                                {isUnlocked ? (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Unlocked</span>
                                ) : (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Locked</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}
