"use client";

// import { useEffect, useState } from "react";
import { getLeaderboard } from "@/app/actions";
import { Trophy, Star, Medal, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";

export default function LeaderboardPage() {
    const { data: users = [], isLoading: loading } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: () => getLeaderboard()
    });

    return (
        <div className="container mx-auto max-w-4xl p-8 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent inline-flex items-center gap-2">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                    Hall of Fame
                </h1>
                <p className="text-muted-foreground">Top swappers in the community</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {users.map((user, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01]",
                                index === 0 ? "bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/50" :
                                    index === 1 ? "bg-gradient-to-r from-zinc-400/20 to-transparent border-zinc-400/50" :
                                        index === 2 ? "bg-gradient-to-r from-orange-500/20 to-transparent border-orange-500/50" :
                                            "bg-card border-border"
                            )}
                        >
                            <div className="w-12 flex justify-center font-black text-xl text-muted-foreground">
                                {index === 0 ? <Medal className="w-8 h-8 text-yellow-500" /> :
                                    index === 1 ? <Medal className="w-8 h-8 text-zinc-400" /> :
                                        index === 2 ? <Medal className="w-8 h-8 text-orange-500" /> :
                                            `#${index + 1}`}
                            </div>

                            <div className="relative">
                                <div className={cn("w-12 h-12 rounded-full overflow-hidden border-2",
                                    index === 0 ? "border-yellow-500" : "border-border"
                                )}>
                                    <img src={user.avatar} className="w-full h-full object-cover" />
                                </div>
                                {user.isUser && (
                                    <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        YOU
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className={cn("font-bold text-lg", user.isUser && "text-indigo-400")}>{user.name}</h3>
                                <p className="text-sm text-muted-foreground">Level {user.level}</p>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1 font-mono font-bold text-lg">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    {user.starsGiven}
                                </div>
                                <span className="text-xs text-muted-foreground">{user.xp} XP</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
