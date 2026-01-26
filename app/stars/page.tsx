"use client";

import { useEffect, useState } from "react";
import { getUserStarredRepos, unstarRepo } from "@/app/actions";
import { Star, GitFork, Eye, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardNavbar } from "@/components/dashboard-navbar";

export default function StarsPage() {
    const queryClient = useQueryClient();
    const { data: repos = [], isLoading: loading } = useQuery({
        queryKey: ['starredRepos'],
        queryFn: () => getUserStarredRepos(),
        refetchOnMount: true,
    });

    return (
        <div className="container mx-auto max-w-5xl p-8 pt-24 space-y-8">
            <DashboardNavbar />
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">My Stars</h1>
                    <p className="text-muted-foreground">Repositories you've collected.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : repos.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                    <Star className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">No stars yet</h3>
                    <p className="text-muted-foreground">Go to the dashboard and swipe right!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map((repo) => (
                        <div
                            key={repo.id}
                            className="group block bg-card border border-border rounded-xl p-6 hover:border-indigo-500/50 hover:shadow-lg transition-all relative"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <img src={repo.owner.avatar_url} className="w-10 h-10 rounded-lg" />
                                <div className="overflow-hidden flex-1">
                                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="block">
                                        <h3 className="font-bold truncate group-hover:text-indigo-400 transition-colors hover:underline">{repo.name}</h3>
                                    </a>
                                    <p className="text-xs text-muted-foreground truncate">@{repo.owner.login}</p>
                                </div>
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (confirm("Are you sure you want to unstar this repo?")) {
                                            // Optimistic update
                                            queryClient.setQueryData(['starredRepos'], (old: any[]) => old.filter(r => r.id !== repo.id));

                                            const res = await unstarRepo(repo.full_name);
                                            if (!res.success) {
                                                queryClient.invalidateQueries({ queryKey: ['starredRepos'] });
                                                alert("Failed to unstar");
                                            }
                                        }
                                    }}
                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                    title="Remove Star"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">
                                {repo.description || "No description provided."}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                                    {repo.stargazers_count}
                                </div>
                                <div className="flex items-center gap-1">
                                    <GitFork className="w-3.5 h-3.5" />
                                    {repo.forks_count}
                                </div>
                                <div className="flex items-center gap-1 ml-auto">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                    {repo.language}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
