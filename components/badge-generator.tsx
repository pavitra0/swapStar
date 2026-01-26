"use client";

import { useState } from "react";
import { Check, Copy, Shield, Trophy } from "lucide-react";

export function BadgeGenerator({ repoName, score }: { repoName: string, score: number }) {
    const [copied, setCopied] = useState(false);

    const badgeUrl = `https://img.shields.io/badge/SwapStar-${score}-blue?style=for-the-badge&logo=github`;
    const markdown = `[![SwapStar Score](${badgeUrl})](https://swapstar.vercel.app/analyze?repo=${repoName})`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Show off your score!</h3>
            </div>

            <div className="flex justify-center p-4 bg-secondary/30 rounded-lg">
                <img src={badgeUrl} alt="SwapStar Badge" className="h-8" />
            </div>

            <div className="relative">
                <pre className="bg-secondary/50 p-3 rounded-lg text-xs overflow-x-auto font-mono text-muted-foreground">
                    {markdown}
                </pre>
                <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-1.5 hover:bg-background rounded-md transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
                Add this to your README.md to help others discover your score.
            </p>
        </div>
    );
}
