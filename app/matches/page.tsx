"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserStarredRepos } from "@/app/actions";
import { MatchCard } from "@/components/match-card";
import { Loader2, Sparkles } from "lucide-react";

export default function MatchesPage() {
    const { data: session, status } = useSession();
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            loadMatches();
        }
    }, [status]);

    const loadMatches = async () => {
        try {
            const data = await getUserStarredRepos();
            setMatches(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading your matches...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Your Matches</h1>
                    <p className="text-muted-foreground">Repositories you've starred</p>
                </div>
            </div>

            {matches.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-secondary/5">
                    <h3 className="text-xl font-bold mb-2">No matches yet</h3>
                    <p className="text-muted-foreground">Start swiping to find your next favorite repo!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((repo, index) => (
                        <MatchCard key={repo.id} repo={repo} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
