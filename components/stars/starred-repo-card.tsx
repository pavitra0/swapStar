"use client";

import { Star, GitFork, ArrowUpRight, Code2, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

interface StarredRepoCardProps {
    repo: {
        id: number;
        name: string;
        full_name: string;
        description: string | null;
        stargazers_count: number;
        forks_count: number;
        language: string;
        owner: {
            login: string;
            avatar_url: string;
        };
        html_url: string;
    };
    onUnstar: () => void;
}

export function StarredRepoCard({ repo, onUnstar }: StarredRepoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex items-center gap-5 p-5 pr-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 hover:border-indigo-500/20 transition-all hover:scale-[1.01]"
        >
            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] rounded-[2rem] pointer-events-none opacity-50" />

            {/* Icon / Image */}
            <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    {/* Try to use owner avatar, essentially acting as the 'icon' */}
                    {/* <Code2 className="w-7 h-7 text-indigo-400" /> */}
                    <img src={repo.owner.avatar_url} className="w-8 h-8 rounded-lg" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors truncate">
                        {repo.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        {repo.language || "Unknown"}
                    </span>
                </div>

                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-3 pr-4">
                    {repo.description || "No description provided."}
                </p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                            <img src={repo.owner.avatar_url} className="w-full h-full rounded-full opacity-70" />
                        </div>
                        @{repo.owner.login}
                    </div>

                    <div className="w-1 h-1 rounded-full bg-zinc-800" />

                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-400">
                        <Star className="w-3 h-3 text-indigo-400 fill-indigo-400/20" />
                        {repo.stargazers_count.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Action Area (Right) */}
            <div className="flex flex-col gap-2 shrink-0 relative z-10">
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    title="View on GitHub"
                >
                    <ArrowUpRight className="w-5 h-5" />
                </a>

                <button
                    onClick={onUnstar}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors"
                    title="Unstar"
                >
                    <Star className="w-5 h-5 fill-current" />
                </button>
            </div>

            {/* Glow Helper */}
            <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        </motion.div>
    );
}
