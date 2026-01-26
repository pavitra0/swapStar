"use client";

import { RepoAnalysis } from "@/lib/types";
import { ScoreCard } from "./score-card";
import { Sparkles } from "lucide-react";

// Mock data for Hidden Gems
const HIDDEN_GEMS: RepoAnalysis[] = [
    {
        repo: {
            id: 101,
            name: "awesome-cursor-rules",
            full_name: "patrickjm/awesome-cursor-rules",
            owner: { login: "patrickjm", avatar_url: "https://github.com/patrickjm.png", html_url: "https://github.com/patrickjm" },
            html_url: "https://github.com/patrickjm/awesome-cursor-rules",
            description: "A curated list of awesome Cursor rules for AI coding assistants.",
            stargazers_count: 342,
            watchers_count: 12,
            subscribers_count: 5,
            forks_count: 45,
            open_issues_count: 2,
            language: "Markdown",
            topics: ["ai", "cursor", "coding-assistant"],
            license: { key: "mit", name: "MIT License", url: "" },
            created_at: "2024-09-01T00:00:00Z",
            updated_at: new Date().toISOString(),
            pushed_at: new Date().toISOString(),
            homepage: "",
            size: 1024,
            archived: false,
            disabled: false,
            visibility: "public",
            default_branch: "main",
        },
        score: 85,
        breakdown: {
            documentation: 18,
            maintenance: 20,
            community: 12,
            reliability: 10,
            adoption: 10,
            innovation: 15,
        },
        summary: "Essential collection of rules for Cursor AI. Extremely high maintenance frequency and community value despite low star count.",
        recommendation: "star",
        badges: ["Hidden Gem", "Highly Maintained", "Great Docs"],
    },
    {
        repo: {
            id: 102,
            name: "tiny-query",
            full_name: "johndoe/tiny-query",
            owner: { login: "johndoe", avatar_url: "https://github.com/ghost.png", html_url: "https://github.com/ghost" },
            html_url: "https://github.com/johndoe/tiny-query",
            description: "Zero-dependency fetch wrapper for modern React apps.",
            stargazers_count: 128,
            watchers_count: 5,
            subscribers_count: 2,
            forks_count: 8,
            open_issues_count: 0,
            language: "TypeScript",
            topics: ["react", "fetch", "query"],
            license: { key: "mit", name: "MIT License", url: "" },
            created_at: "2023-11-15T00:00:00Z",
            updated_at: new Date().toISOString(),
            pushed_at: new Date().toISOString(),
            homepage: "",
            size: 512,
            archived: false,
            disabled: false,
            visibility: "public",
            default_branch: "main",
        },
        score: 92,
        breakdown: {
            documentation: 20,
            maintenance: 20,
            community: 10,
            reliability: 15,
            adoption: 5,
            innovation: 12,
        },
        summary: "Implausibly well-documented for its size. 100% test coverage and active releases.",
        recommendation: "star",
        badges: ["Hidden Gem", "Production Ready", "Great Docs"],
    },
];

export function HiddenGemsFeed() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 py-12">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Hidden Gems</h2>
                    <p className="text-muted-foreground">Underrated repositories you should know about.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {HIDDEN_GEMS.map((analysis) => (
                    <div key={analysis.repo.id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="bg-card rounded-xl relative">
                            <ScoreCard analysis={analysis} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
