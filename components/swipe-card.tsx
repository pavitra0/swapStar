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
                <div className="relative flex items-center justify-center w-14 h-14 bg-background/80 backdrop-blur-xl border border-white/10 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 text-indigo-500" viewBox="0 0 36 36">
                        <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path className="" strokeDasharray={`${repo.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                    <span className="text-sm font-bold">{repo.score}</span>
                </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end h-full pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-32">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <a href={`/profile/${repo.owner.login}`} className="block relative z-20 hover:opacity-80 transition-opacity">
                            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 overflow-hidden shadow-sm shrink-0">
                                <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-full h-full object-cover" />
                            </div>
                        </a>
                        <div>
                            <h3 className="text-2xl font-bold leading-tight text-white drop-shadow-md line-clamp-1">{repo.name}</h3>
                            <a href={`/profile/${repo.owner.login}`} className="relative z-20 text-sm font-medium text-zinc-300 hover:text-white transition-colors">@{repo.owner.login}</a>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
                        {repo.description || "No description provided."}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2">
                        {repo.topics.slice(0, 3).map((topic: string) => (
                            <span key={topic} className="px-2 py-1 rounded-md bg-white/10 border border-white/5 text-[10px] uppercase font-semibold tracking-wider text-white/80">
                                {topic}
                            </span>
                        ))}
                    </div>

                    {/* Metrics Line */}
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-sm">{(repo.stargazers_count / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="h-4 w-px bg-white/20" />
                        <div className="flex items-center gap-2">
                            <GitFork className="w-4 h-4 text-blue-400" />
                            <span className="font-bold text-sm">{repo.forks_count}</span>
                        </div>
                        <div className="h-4 w-px bg-white/20" />
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-emerald-400" />
                            <span className="font-bold text-sm">{repo.watchers_count}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
