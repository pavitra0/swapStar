"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BarChart2, Star, MessageSquare, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
    user: {
        name: string;
        image?: string;
        username: string; // e.g. @infinite-table
        title?: string;
    };
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Swap", icon: LayoutDashboard },
        { href: "/leaderboard", label: "Leaderboard", icon: BarChart2 },
        { href: "/stars", label: "My Stars", icon: Star },
        { href: "/messages", label: "Messages", icon: MessageSquare },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <div className="w-64 h-screen bg-[#0A0A0B] border-r border-white/5 flex flex-col p-6 fixed top-0 left-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-xl tracking-tight text-white">SwapStar</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                            )}
                        >
                            <link.icon className={cn("w-5 h-5", isActive ? "fill-indigo-400/20" : "")} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="relative">
                        <Avatar className="w-10 h-10 border border-white/10 group-hover:border-white/20">
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-[#0A0A0B]">
                            42
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate max-w-[120px]">{user.username}</h4>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{user.title || "Developer"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
