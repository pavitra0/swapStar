
"use client";

import { useSession, signIn } from "next-auth/react";
import { SwipeCard } from "@/components/swipe-card";
import { RepoAnalysis } from "@/lib/types";
import { useEffect, useState } from "react";
import { Loader2, Shuffle, CheckCircle, Smartphone, X, Star } from "lucide-react";
import { starRepo, fetchHiddenGems } from "@/app/actions";
import { AnimatePresence } from "framer-motion";
import { SubmitRepo } from "@/components/submit-repo";
import { DeveloperProfile } from "@/components/developer-profile";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [feed, setFeed] = useState<(RepoAnalysis["repo"] & { score: number })[]>([]);
    const [loadingFeed, setLoadingFeed] = useState(true);
    const [currentTopic, setCurrentTopic] = useState("react");

    useEffect(() => {
        if (status === "authenticated") {
            loadGems(currentTopic);
        }
    }, [status, currentTopic]);

    const loadGems = async (topic: string) => {
        setLoadingFeed(true);
        try {
            const gems = await fetchHiddenGems(topic);
            setFeed(gems);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingFeed(false);
        }
    };

    const removeCard = (id: number) => {
        setFeed((prev) => prev.filter((repo) => repo.id !== id));
    };

    const handleSwipe = async (direction: "left" | "right", repo: RepoAnalysis["repo"]) => {
        removeCard(repo.id);

        if (direction === "right") {
            try {
                const result = await starRepo(repo.full_name);
                if (!result.success) {
                    console.error("Failed to star:", result.error);
                }
            } catch (e) {
                console.error(e);
            }
        } else if (direction === "left") {
            // Reject Logic
            try {
                // Dynamic import to avoid circular dep if needed, or just standard import
                const { rejectRepo } = await import("@/app/actions");
                await rejectRepo(repo.full_name);
            } catch (e) {
                console.error(e);
            }
        }
    };

    if (status === "loading" || loadingFeed) {
        return (
            <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Finding your next swap...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Sign in to SwapStars</h2>
                <button
                    onClick={() => signIn("github")}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                    Connect GitHub
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center max-w-6xl mx-auto px-4 py-6 space-y-8">

            {/* Header */}
            <div className="text-center space-y-2 w-full">
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Star Exchange
                </h1>

                <p className="text-muted-foreground flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Swap stars with the community
                </p>

                <SubmitRepo />
            </div>

            {/* Topics */}
            <div className="w-full overflow-x-auto">
                <div className="flex gap-2 min-w-max px-1">
                    {["react", "ai", "cli", "tools", "nextjs", "rust", "web3"].map((topic) => (
                        <button
                            key={topic}
                            onClick={() => setCurrentTopic(topic)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all duration-300
              ${currentTopic === topic
                                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                    : "bg-secondary/30 backdrop-blur-md text-muted-foreground border-white/5 hover:bg-secondary/50 hover:border-white/10"
                                }`}
                        >
                            #{topic}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split View Content */}
            <div className="grid lg:grid-cols-2 gap-8 w-full items-start">

                {/* Left Column: Swipe Stack */}
                <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-sm aspect-[3/4]">
                        <AnimatePresence>
                            {feed.map((repo, index) => {
                                const isTop = index === feed.length - 1
                                return (
                                    <SwipeCard
                                        key={repo.id}
                                        repo={repo}
                                        frontCard={isTop}
                                        onSwipe={(dir) => handleSwipe(dir, repo)}
                                    />
                                )
                            })}
                        </AnimatePresence>

                        {feed.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-3xl bg-secondary/10 h-full">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2">All caught up!</h3>
                                <p className="text-muted-foreground mb-6">
                                    You've reviewed all suggested repositories for now.
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                                    title="Shuffle Feed"
                                >
                                    <Shuffle className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground/50 text-center mt-4">
                        Use arrow keys or swipe
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => feed.length > 0 && handleSwipe("left", feed[feed.length - 1])}
                            className="w-16 h-16 rounded-full bg-secondary/80 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-lg hover:scale-110 active:scale-95 transition-all group"
                        >
                            <X className="w-8 h-8 text-red-500 group-hover:text-red-400" />
                        </button>
                        <button
                            onClick={() => feed.length > 0 && handleSwipe("right", feed[feed.length - 1])}
                            className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/50 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-110 active:scale-95 transition-all group"
                        >
                            <Star className="w-8 h-8 text-primary group-hover:text-white fill-current" />
                        </button>
                    </div>
                </div>

                {/* Right Column: Repo Owner Profile */}
                <div className="hidden lg:block sticky top-24">
                    {feed.length > 0 ? (
                        <DeveloperProfile key={feed[feed.length - 1].id} username={feed[feed.length - 1].owner.login} />
                    ) : (
                        <div className="w-full h-[600px] border border-border border-dashed rounded-3xl flex items-center justify-center text-muted-foreground bg-secondary/10">
                            No active card
                        </div>
                    )}
                </div>

            </div>

            <div className="text-xs text-muted-foreground/50 text-center">
                Use arrow keys or swipe
            </div>
        </div>
    )
}
