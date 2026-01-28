"use client";

import { useEffect, useState } from "react";
import { getUserStarredRepos, unstarRepo } from "@/app/actions";
import { Search, SlidersHorizontal, Loader2, Star } from "lucide-react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { StarredRepoCard } from "@/components/stars/starred-repo-card";
import { useSession } from "next-auth/react";

export default function StarsPage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

    const { data: repos = [], isLoading: loading } = useQuery({
        queryKey: ['starredRepos'],
        queryFn: () => getUserStarredRepos(),
        refetchOnMount: true,
    });

    // Filtering Logic
    const filteredRepos = repos.filter((repo: any) => {
        const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesLang = selectedLanguage ? repo.language === selectedLanguage : true;
        return matchesSearch && matchesLang;
    });

    // Extract Languages for Filter
    const languages = Array.from(new Set(repos.map((r: any) => r.language).filter(Boolean)));

    const handleUnstar = async (repo: any) => {
        if (confirm("Are you sure you want to unstar this repo?")) {
            // Optimistic update
            queryClient.setQueryData(['starredRepos'], (old: any[]) => old.filter(r => r.id !== repo.id));

            const res = await unstarRepo(repo.full_name);
            if (!res.success) {
                queryClient.invalidateQueries({ queryKey: ['starredRepos'] });
                alert("Failed to unstar");
            }
        }
    };

    if (!session) return (
        <div className="flex h-screen items-center justify-center bg-[#0A0A0B] text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );

    const userProfile = {
        name: session.user?.name || "User",
        username: "@" + (session.user?.name?.replace(/\s/g, '').toLowerCase() || "user"),
        image: session.user?.image || undefined,
        title: "Master Architect" // Static for now, could be dynamic
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white flex">
            {/* Sidebar */}
            <Sidebar user={userProfile} />

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8 lg:p-12 relative">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto space-y-10 relative z-10">

                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black tracking-tighter leading-[1.1]">
                            <span className="text-indigo-500">My</span> <br />
                            Starred <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Repos</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-sm leading-relaxed">
                            Your curated inventory of gems. <br />
                            Keep track of what inspires you.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search repositories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-600"
                            />
                        </div>

                        {/* Filter Button (Visual or Functional) */}
                        <div className="relative">
                            <button className="h-full px-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-white/5 flex items-center gap-2 font-bold text-sm text-zinc-400 transition-colors">
                                <SlidersHorizontal className="w-4 h-4" />
                                {selectedLanguage || "Language"}
                            </button>
                            {/* Simple Dropdown for Languages could go here */}
                        </div>
                    </div>

                    {/* Language Pills */}
                    {languages.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedLanguage(null)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${!selectedLanguage ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/20'}`}
                            >
                                All
                            </button>
                            {languages.map((lang: any) => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang === selectedLanguage ? null : lang)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${lang === selectedLanguage ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/20'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            </div>
                        ) : filteredRepos.length === 0 ? (
                            <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-white/5">
                                <Star className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-zinc-500">No stars found</h3>
                                <p className="text-zinc-600 mt-2">Try adjusting your filters or go swipe some gems!</p>
                            </div>
                        ) : (
                            filteredRepos.map((repo: any) => (
                                <StarredRepoCard
                                    key={repo.id}
                                    repo={repo}
                                    onUnstar={() => handleUnstar(repo)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
