"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Zap, Trophy, Star, User } from "lucide-react";

export function DashboardNavbar() {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-1.5 rounded-lg">
                    <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="font-black text-xl tracking-tighter">SwapStar</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Swap
                </Link>
                <Link href="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                </Link>
                <Link href="/messages" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Messages
                </Link>
                <Link href="/stars" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    My Stars
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 hover:bg-secondary/50 p-1.5 rounded-full pr-3 transition-colors border border-transparent hover:border-border">
                    <img src={session?.user?.image || "https://github.com/shadcn.png"} alt="User" className="w-8 h-8 rounded-full border border-border" />
                    <span className="text-sm font-bold hidden md:block">{session?.user?.name?.split(' ')[0]}</span>
                </Link>
            </div>
        </nav>
    );
}
