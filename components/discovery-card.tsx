"use client";

import { RepoAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star, GitFork, Eye, Heart } from "lucide-react";
import { useState } from "react";

export function DiscoveryCard({ repo }: { repo: RepoAnalysis["repo"] & { score: number } }) {
    const [liked, setLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);

    const handleDoubleClick = () => {
        setLiked(!liked);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
    };

    return (
        <div
            onDoubleClick={handleDoubleClick}
            className="relative w-full max-w-md aspect-[3/4] bg-card border border-border rounded-3xl shadow-xl overflow-hidden cursor-pointer select-none group transition-transform hover:scale-[1.02]"
        >
            {/* Animated Heart Overlay */}
            <div className={cn(
                "absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300",
                showHeart ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                <Heart className={cn("w-32 h-32 text-red-500 fill-red-500 transition-transform duration-500", showHeart ? "scale-100" : "scale-0")} />
            </div>

            {/* Card Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-border">
                Score: {repo.score}
            </div>

            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent pt-24">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="text-2xl font-bold leading-tight">{repo.name}</h3>
                        <p className="text-sm text-muted-foreground">{repo.owner.login}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                        className={cn("p-2 rounded-full transition-colors", liked ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:bg-secondary")}
                    >
                        <Heart className={cn("w-6 h-6", liked && "fill-current")} />
                    </button>
                </div>

                <p className="text-muted-foreground line-clamp-3 mb-6 text-sm">
                    {repo.description}
                </p>

                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{(repo.stargazers_count / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-lg">
                        <GitFork className="w-4 h-4 text-blue-500" />
                        <span>{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-lg">
                        <Eye className="w-4 h-4 text-green-500" />
                        <span>{repo.watchers_count}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
