"use client";

import { useState } from "react";
import { RepoAnalysis } from "@/lib/types";
import { ScoreCard } from "./score-card";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RepoAnalyzer() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.includes("github.com")) {
            setError("Please enter a valid GitHub repository URL.");
            return;
        }

        setError("");
        setLoading(true);
        setAnalysis(null);

        try {
            const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to analyze repo");

            setAnalysis(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <form onSubmit={handleAnalyze} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-70" />
                <div className="relative flex items-center bg-card border border-border rounded-full p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/50 transition-all">
                    <Search className="ml-4 w-5 h-5 text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        placeholder="https://github.com/owner/repo"
                        className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 outline-none placeholder:text-muted-foreground/50"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !url}
                        className="bg-primary text-primary-foreground rounded-full px-6 py-2 font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </form>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-center text-sm animate-in fade-in zoom-in-95">
                    {error}
                </div>
            )}

            {analysis && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <ScoreCard analysis={analysis} />
                </div>
            )}
        </div>
    );
}
