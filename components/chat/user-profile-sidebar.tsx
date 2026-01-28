"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Loader2, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDetailedUserProfile, toggleFollow } from "@/app/actions";
import { useState, useEffect } from "react";

interface UserProfileSidebarProps {
    partnerName: string;
    partnerImage?: string | null;
}

export function UserProfileSidebar({ partnerName, partnerImage }: UserProfileSidebarProps) {
    const queryClient = useQueryClient();
    // Clean up username for API call (remove spaces, etc if needed, though usually strict)
    // Assuming partnerName is close to username for this demo
    // If partnerName is "Pavitra Golchha", we might guess "PavitraGolchha" or just try.
    // Ideally we pass the real username.
    const safeUsername = partnerName.replace(/\s+/g, '');

    const { data, isLoading } = useQuery({
        queryKey: ['userProfile', safeUsername],
        queryFn: () => getDetailedUserProfile(safeUsername),
        enabled: !!safeUsername,
    });

    const profile = data?.profile;
    const topRepos = data?.topRepos || [];
    const initialIsFollowing = data?.isFollowing || false;
    const dbUserId = data?.dbUserId;

    // Use local state for optimistic UI, sync with data when loaded
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (data) {
            setIsFollowing(data.isFollowing);
        }
    }, [data]);

    const followMutation = useMutation({
        mutationFn: async () => {
            if (!dbUserId) return;
            return toggleFollow(dbUserId);
        },
        onMutate: async () => {
            // Optimistic update
            setIsFollowing(prev => !prev);
        },
        onError: () => {
            // Revert on error
            setIsFollowing(prev => !prev);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', safeUsername] });
            queryClient.invalidateQueries({ queryKey: ['newMatches'] }); // Following might appear/disappear from matches
        }
    });

    const handleFollow = () => {
        if (dbUserId) {
            followMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="h-full bg-black/40 border-l border-white/5 p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    // Fallback if no profile found (private user or matching error)
    if (!profile) {
        return (
            <div className="h-full bg-black/40 border-l border-white/5 p-6 flex flex-col items-center justify-center text-center">
                <Avatar className="w-20 h-20 mb-4 opacity-50">
                    <AvatarImage src={partnerImage || ""} />
                    <AvatarFallback>{partnerName[0]}</AvatarFallback>
                </Avatar>
                <p className="text-zinc-500">Could not load full profile for {partnerName}.</p>
                <div className="mt-4">
                    {/* Static Fallback for demo if API fails/rate limits */}
                    <p className="text-xs text-zinc-600">Showing cached view:</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-black/40 border-l border-white/5 p-6 flex flex-col gap-8 overflow-y-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-3xl p-1 bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl">
                    <Avatar className="w-full h-full rounded-[22px] border-4 border-black">
                        <AvatarImage src={profile.avatar_url || partnerImage || ""} className="object-cover" />
                        <AvatarFallback className="rounded-[22px] text-4xl">{partnerName[0]}</AvatarFallback>
                    </Avatar>
                </div>
                <h2 className="text-2xl font-black text-white mb-1">{profile.name || partnerName}</h2>
                <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 font-medium text-sm hover:text-indigo-400 transition-colors flex items-center gap-1"
                >
                    @{profile.login}
                    <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex gap-3 mt-6 w-full">
                    <button
                        onClick={handleFollow}
                        disabled={!dbUserId || followMutation.isPending}
                        className={`flex-1 py-2.5 rounded-xl border border-white/10 font-bold text-sm transition-colors ${isFollowing
                                ? "bg-white text-black hover:bg-zinc-200"
                                : "bg-zinc-900/50 text-white hover:bg-zinc-800"
                            }`}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                        Collaborate
                    </button>
                </div>
            </div>

            {/* Bio */}
            {profile.bio && (
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Bio</h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                        {profile.bio}
                    </p>
                </div>
            )}

            {/* Tech Stack (Inferred from top repo languages) */}
            <div>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Top Languages</h3>
                <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(topRepos.map((r: any) => r.language).filter(Boolean))).slice(0, 5).map((tech: any) => (
                        <span key={tech} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-400 font-medium">
                            {tech}
                        </span>
                    ))}
                    {topRepos.length === 0 && <span className="text-xs text-zinc-600 italic">No public repos found</span>}
                </div>
            </div>

            {/* Top Repositories */}
            {topRepos.length > 0 && (
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Top Repositories</h3>
                    <div className="space-y-3">
                        {topRepos.map((repo: any) => (
                            <a
                                key={repo.id}
                                href={`https://github.com/${profile.login}/${repo.name}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block p-4 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors truncate pr-2">{repo.name}</h4>
                                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold whitespace-nowrap">
                                        <Star className="w-3 h-3 fill-current" />
                                        {repo.stargazers_count}
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-500 line-clamp-1">{repo.description || "No description"}</p>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
