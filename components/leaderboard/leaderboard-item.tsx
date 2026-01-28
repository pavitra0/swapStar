"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardItemProps {
    rank: number;
    username: string;
    image: string;
    score: number;
    techStack: string[];
    trend: number; // Positive, negative, or 0
    isMe?: boolean;
}

export function LeaderboardItem({ rank, username, image, score, techStack, trend, isMe }: LeaderboardItemProps) {
    return (
        <div className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01]",
            isMe
                ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                : "bg-zinc-900/40 border-white/5 hover:bg-zinc-900/60 hover:border-white/10"
        )}>
            {/* Rank */}
            <div className="w-8 font-black text-xl text-zinc-500 text-center">
                {rank}
            </div>

            {/* Avatar */}
            <Avatar className="w-12 h-12 border border-white/10">
                <AvatarImage src={image} />
                <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className={cn("font-bold truncate", isMe ? "text-indigo-400" : "text-white")}>
                        @{username} {isMe && "(You)"}
                    </h3>
                    <div className="hidden sm:flex gap-1">
                        {techStack.map(tech => (
                            <span key={tech} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-zinc-400 border border-white/5">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className={cn("flex items-center gap-0.5 font-medium",
                        trend > 0 ? "text-emerald-400" : trend < 0 ? "text-red-400" : "text-zinc-500"
                    )}>
                        {trend > 0 ? <ArrowUp className="w-3 h-3" /> : trend < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </span>
                    <span>vs last week</span>
                </div>
            </div>

            {/* Score */}
            <div className="text-right">
                <div className="font-black text-white text-lg">
                    {score.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                    SwapScore
                </div>
            </div>
        </div>
    );
}
