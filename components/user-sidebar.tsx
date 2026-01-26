"use client";

import { useSession, signOut } from "next-auth/react";
import { Star, Zap, Award, LogOut, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserStats } from "@/app/actions";

export function UserSidebar() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ xp: 0, level: 1, starsGiven: 0 });

    useEffect(() => {
        if (session?.user) {
            getUserStats().then(setStats);
        }
    }, [session]);

    if (!session?.user) return null;

    const nextLevelXp = stats.level * 100;
    const progress = (stats.xp % 100);

    return (
        <div className="hidden lg:flex flex-col w-64 h-[calc(100vh-2rem)] sticky top-4 bg-card border border-border rounded-xl p-6 ml-4">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-secondary mb-4 overflow-hidden border-4 border-indigo-500/20">
                    <img src={session.user.image || "https://github.com/shadcn.png"} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-lg font-bold truncate w-full">{session.user.name}</h2>
                <p className="text-xs text-muted-foreground truncate w-full">{session.user.email}</p>
            </div>

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
                    <a href="/stars" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors font-medium">
                        <Star className="w-5 h-5" />
                        My Stars
                    </a>
                    <a href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors font-medium">
                        <Award className="w-5 h-5" />
                        My Profile
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
