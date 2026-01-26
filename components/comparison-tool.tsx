"use client";

import { useState } from "react";
import { RepoAnalysis } from "@/lib/types";
import { Search, ArrowRight, Loader2, X } from "lucide-react";
import { ScoreCard } from "./score-card";

export function ComparisonTool() {
    const [urls, setUrls] = useState<string[]>([""]);
    const [analyses, setAnalyses] = useState<RepoAnalysis[]>([]);
    const [loading, setLoading] = useState(false);

    const addUrlField = () => {
        if (urls.length < 3) setUrls([...urls, ""]);
    };

    const updateUrl = (index: number, value: string) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const removeUrlField = (index: number) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls);
    };

    const handleCompare = async () => {
        const validUrls = urls.filter(u => u.includes("github.com"));
        if (validUrls.length < 2) return;

        setLoading(true);
        setAnalyses([]);

        try {
            const results = await Promise.all(validUrls.map(async (url) => {
                const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
                if (!res.ok) return null;
                return res.json();
            }));
            setAnalyses(results.filter(Boolean) as RepoAnalysis[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 py-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Compare Repositories</h2>
                <p className="text-muted-foreground">Side-by-side analysis to make the best choice.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end justify-center">
                {urls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex items-center bg-card border border-border rounded-lg p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/50 transition-all w-full md:w-80">
                            <Search className="ml-2 w-4 h-4 text-muted-foreground shrink-0" />
                            <input
                                type="text"
                                placeholder="GitHub URL..."
                                className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-1 outline-none text-sm placeholder:text-muted-foreground/50"
                                value={url}
                                onChange={(e) => updateUrl(index, e.target.value)}
                            />
                            {index > 0 && (
                                <button onClick={() => removeUrlField(index)} className="hover:bg-destructive/10 hover:text-destructive p-1 rounded-md transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {urls.length < 3 && (
                    <button onClick={addUrlField} className="px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
                        + Add Repo
                    </button>
                )}
                <button
                    onClick={handleCompare}
                    disabled={loading || urls.filter(u => u).length < 2}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Compare"}
                </button>
            </div>

            {analyses.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {analyses.map((analysis) => (
                        <div key={analysis.repo.id} className="scale-90 origin-top">
                            <ScoreCard analysis={analysis} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
