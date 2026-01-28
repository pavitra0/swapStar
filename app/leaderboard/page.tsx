"use client";

import { DashboardNavbar } from "@/components/dashboard-navbar";
import { Podium } from "@/components/leaderboard/podium";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { useState } from "react";
import { Crown, Trophy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/app/actions";

export default function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "all-time">("weekly");

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: () => getLeaderboard(),
    });

    // We separate top 3 for podium
    // Cast to any for component compatibility if strict typing issues arise, but our shape matches
    const top3 = users.slice(0, 3) as any[];
    const rest = users.slice(3) as any[];

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-indigo-500/30">
            <DashboardNavbar />

            <div className="container mx-auto max-w-2xl px-4 pt-24 pb-12">

                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <Trophy className="w-3 h-3" />
                        Beta Season
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Leaderboard</span>
                    </h1>
                    <p className="text-zinc-400">Top developers ranking by Star Score</p>
                </div>

                {/* Tags */}
                <div className="flex justify-center mb-12">
                    <div className="p-1 bg-zinc-900/50 border border-white/5 rounded-full flex relative">
                        {(["weekly", "monthly", "all-time"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all z-10 ${timeframe === t ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {t === timeframe && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-indigo-600 rounded-full -z-10 shadow-lg shadow-indigo-500/25"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <>
                        {/* Podium */}
                        <Podium users={top3} />

                        {/* List */}
                        <div className="mt-8">
                            <LeaderboardList users={rest} />
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
