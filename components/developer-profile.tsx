"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/actions";
import { Loader2, MapPin, Link as LinkIcon, Twitter, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeveloperProfileProps {
    username: string;
}

export function DeveloperProfile({ username }: DeveloperProfileProps) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (username) {
            getUserProfile(username).then(data => {
                setProfile(data);
                setLoading(false);
            });
        }
    }, [username]);

    if (!username) return null;

    return (
        <div className="w-full bg-card border border-border rounded-3xl p-6 shadow-xl h-[600px] flex flex-col relative overflow-hidden">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Developer Profile</h3>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : profile ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col items-center text-center space-y-6"
                    >
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 overflow-hidden shadow-2xl">
                                <img src={profile.avatar_url} alt={profile.login} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                Lvl {Math.floor((profile.public_repos + profile.followers) / 10)}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black">{profile.name || profile.login}</h2>
                            <p className="text-indigo-400 font-medium">@{profile.login}</p>
                        </div>

                        {profile.bio && (
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap justify-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-lg text-xs font-medium">
                                <Users className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{profile.followers} followers</span>
                            </div>
                            {profile.location && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-lg text-xs font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 w-full pt-4 border-t border-border/50">
                            {profile.blog && (
                                <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-xs font-medium">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    Website
                                </a>
                            )}
                            {profile.twitter_username && (
                                <a href={`https://twitter.com/${profile.twitter_username}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-xs font-medium">
                                    <Twitter className="w-3.5 h-3.5 text-sky-400" />
                                    Twitter
                                </a>
                            )}
                            <a href={profile.html_url} target="_blank" rel="noreferrer" className="col-span-2 flex items-center justify-center gap-2 p-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity text-xs font-bold">
                                View on GitHub
                            </a>
                        </div>
                    </motion.div>
                </AnimatePresence>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    User not found
                </div>
            )}

            {/* Decoding Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[url('/grid.svg')] opacity-5" />
        </div>
    );
}
