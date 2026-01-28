"use client";

import { useSession, signOut } from "next-auth/react";
import { Star, Zap, Award, LogOut, Trophy, Loader2, MapPin, Link as LinkIcon, Twitter, Users, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserStats, getUserProfile } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

export function UserSidebar() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>({ xp: 0, level: 1, starsGiven: 0, followers: 0, following: 0 });
    const [githubProfile, setGithubProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.name) {
            setLoading(true);
            Promise.all([
                getUserStats(),
                // Assuming session.user.name maps to GitHub username (which it usually does for NextAuth GitHub provider)
                getUserProfile(session.user.name)
            ]).then(([dbStats, ghProfile]) => {
                setStats(dbStats || { xp: 0, level: 1, starsGiven: 0, followers: 0, following: 0 });
                setGithubProfile(ghProfile);
                setLoading(false);
            });
        }
    }, [session]);

    if (!session?.user) return null;

    return (
        <div className="hidden lg:flex flex-col w-64 h-[calc(100vh-2rem)] sticky top-4 bg-card border border-border rounded-xl p-6 ml-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 text-center">Developer Profile</h3>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="flex flex-col items-center text-center mb-6 relative">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 overflow-hidden shadow-2xl">
                            <img src={session.user.image || "https://github.com/shadcn.png"} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Lvl {Math.floor(((githubProfile?.public_repos || 0) + (stats.followers || 0)) / 10) || stats.level}
                        </div>
                    </div>

                    <h2 className="text-xl font-black mt-4">{session.user.name}</h2>
                    {githubProfile?.login && (
                        <p className="text-indigo-400 font-medium text-sm">@{githubProfile.login}</p>
                    )}

                    {githubProfile?.bio && (
                        <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mt-2 line-clamp-2">
                            {githubProfile.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-lg text-xs font-medium">
                            <Users className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="font-bold">{stats.followers || 0}</span>
                            <span className="text-muted-foreground">followers</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-lg text-xs font-medium">
                            <span className="font-bold">{stats.following || 0}</span>
                            <span className="text-muted-foreground">following</span>
                        </div>
                    </div>

                    {githubProfile?.location && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 text-red-400" />
                            <span>{githubProfile.location}</span>
                        </div>
                    )}
                </div>
            )}

            <a
                href={`https://github.com/${session.user.name?.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity text-xs font-bold mb-4"
            >
                View on GitHub
            </a>

            <div className="flex-1">
                <nav className="space-y-2">
                    <a href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors font-medium">
                        <Zap className="w-5 h-5" />
                        Swap
                    </a>
                    <a href="/leaderboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors font-medium">
                        <Trophy className="w-5 h-5" />
                        Leaderboard
                    </a>
                    <a href="/matches" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors font-medium">
                        <Zap className="w-5 h-5" />
                        Matches
                    </a>
                    <a href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors font-medium">
                        <Award className="w-5 h-5" />
                        My Profile
                    </a>
                    <a href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors font-medium">
                        <Settings className="w-5 h-5" />
                        Settings
                    </a>
                </nav>
            </div>

            <button
                onClick={() => signOut()}
                className="flex items-center justify-center gap-2 w-full p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium mt-auto"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </div>
    );
}
