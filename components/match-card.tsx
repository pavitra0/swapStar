"use client";

import { Star, GitFork, Eye, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface MatchCardProps {
    repo: any;
    index: number;
}

export function MatchCard({ repo, index }: MatchCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-900/10 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="p-6 space-y-4 relative z-10 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                            <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-xl leading-tight text-white truncate group-hover:text-primary transition-colors">
                                {repo.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-zinc-400">
                                <span className="truncate">@{repo.owner.login}</span>
                            </div>
                        </div>
                    </div>
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                        title="View on GitHub"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3 flex-1">
                    {repo.description || "No description provided."}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                    {repo.topics?.slice(0, 3).map((topic: string) => (
                        <span key={topic} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                            {topic}
                        </span>
                    ))}
                </div>

                {/* Footer / Stats */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-zinc-400 text-xs font-medium">
                    <div className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                        <GitFork className="w-4 h-4" />
                        <span className="text-sm">{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{repo.watchers_count}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
