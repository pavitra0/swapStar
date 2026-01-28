"use client";

import { RepoAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star, GitFork, Eye, X, Heart } from "lucide-react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useState } from "react";

interface SwipeCardProps {
    repo: RepoAnalysis["repo"] & { score: number };
    onSwipe: (direction: "left" | "right") => void;
    frontCard?: boolean;
}

export function SwipeCard({ repo, onSwipe, frontCard = false }: SwipeCardProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Rotation based on X position
    const rotate = useTransform(x, [-200, 200], [-25, 25]);

    // Opacity overlays
    const likeOpacity = useTransform(x, [20, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-20, -150], [0, 1]);

    const handleDragEnd = async (event: any, info: any) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset > 100 || velocity > 800) {
            await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
            onSwipe("right");
        } else if (offset < -100 || velocity < -800) {
            await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
            onSwipe("left");
        } else {
            controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    if (!frontCard) {
        return (
            <div className="absolute top-0 w-full max-w-md aspect-[3/4] bg-card border border-border rounded-3xl shadow-xl overflow-hidden pointer-events-none scale-95 opacity-50 translate-y-4">
                {/* Background placeholder card */}
                <div className="absolute inset-0 bg-muted/20" />
            </div>
        );
    }

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate }}
            animate={controls}
            onDragEnd={handleDragEnd}
            className="absolute top-0 w-full max-w-md aspect-[3/4] bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none ring-1 ring-white/10"
        >
            {/* Swiping Overlays */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-50 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-15deg] bg-black/20 backdrop-blur-sm">
                <span className="text-4xl font-black text-green-500 uppercase tracking-widest drop-shadow-sm">LIKE</span>
            </motion.div>

            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 z-50 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg] bg-black/20 backdrop-blur-sm">
                <span className="text-4xl font-black text-red-500 uppercase tracking-widest drop-shadow-sm">NOPE</span>
            </motion.div>

            {/* Card Background & Content */}
            <div className="absolute inset-0 bg-zinc-900 border border-white/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-900/20" />

            {/* Score Badge */}
            <div className="absolute top-6 right-6 z-10">
                <div className="relative flex flex-col items-center justify-center w-20 h-20 bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" viewBox="0 0 36 36">
                        <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                        <path className="" strokeDasharray={`${repo.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    </svg>
                    <span className="text-2xl font-black text-white leading-none mt-1">{repo.score}</span>
                    <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">HEALTH</span>
                </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end h-full pointer-events-none bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-32">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-3">
                        <a href={`/profile/${repo.owner.login}`} className="block relative z-20 hover:opacity-80 transition-opacity w-fit">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg">
                                <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-full h-full object-cover" />
                            </div>
                        </a>
                        <div>
                            <h3 className="text-4xl font-black leading-tight text-white drop-shadow-md line-clamp-2">{repo.name}</h3>
                            <a href={`/profile/${repo.owner.login}`} className="relative z-20 flex items-center gap-1 text-lg font-medium text-blue-400 hover:text-blue-300 transition-colors w-fit">
                                @{repo.owner.login}
                                <span className="opacity-50">v{repo.default_branch || "main"}</span>
                            </a>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 font-medium">
                        {repo.description || "No description provided."}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2">
                        {repo.topics.slice(0, 3).map((topic: string) => (
                            <span key={topic} className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-white/5 text-[10px] uppercase font-bold tracking-widest text-zinc-400 shadow-sm">
                                {topic}
                            </span>
                        ))}
                    </div>

                    {/* Metrics Line */}
                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-zinc-400">
                        <div className="flex flex-col items-center gap-0.5 min-w-[60px]">
                            <div className="flex items-center gap-1.5 text-yellow-400">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="font-black text-white text-lg">{(repo.stargazers_count / 1000).toFixed(1)}k</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider opacity-60">STARS</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex flex-col items-center gap-0.5 min-w-[60px]">
                            <div className="flex items-center gap-1.5 text-blue-400">
                                <GitFork className="w-5 h-5" />
                                <span className="font-black text-white text-lg">{repo.forks_count}</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider opacity-60">FORKS</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex flex-col items-center gap-0.5 min-w-[60px]">
                            <div className="flex items-center gap-1.5 text-emerald-400">
                                <Eye className="w-5 h-5" />
                                <span className="font-black text-white text-lg">{repo.watchers_count}</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider opacity-60">VIEWS</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
