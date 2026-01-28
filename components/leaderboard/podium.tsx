"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

interface PodiumUser {
    id: string;
    username: string;
    image: string;
    score: number;
    rank: 1 | 2 | 3;
}

interface PodiumProps {
    users: PodiumUser[];
}

export function Podium({ users }: PodiumProps) {
    const first = users.find(u => u.rank === 1);
    const second = users.find(u => u.rank === 2);
    const third = users.find(u => u.rank === 3);

    return (
        <div className="flex items-end justify-center gap-4 md:gap-8 pb-8 pt-4">
            {/* Second Place */}
            {second && <PodiumStep user={second} delay={0.2} />}

            {/* First Place */}
            {first && <PodiumStep user={first} delay={0} isFirst />}

            {/* Third Place */}
            {third && <PodiumStep user={third} delay={0.4} />}
        </div>
    );
}

function PodiumStep({ user, delay, isFirst = false }: { user: PodiumUser; delay: number; isFirst?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, type: "spring" }}
            className={`flex flex-col items-center relative ${isFirst ? "-mt-12 z-10" : ""}`}
        >
            <div className="relative mb-3 group">
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full blur-xl opacity-40 transition-opacity group-hover:opacity-70 ${isFirst ? "bg-yellow-500" : user.rank === 2 ? "bg-zinc-400" : "bg-amber-600"
                    }`} />

                {/* Crown for #1 */}
                {isFirst && (
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                    >
                        <Crown className="fill-yellow-400 w-8 h-8" />
                    </motion.div>
                )}

                {/* Avatar Ring */}
                <div className={`p-1 rounded-full border-4 ${isFirst ? "border-yellow-500" : user.rank === 2 ? "border-zinc-400" : "border-amber-700"
                    } bg-black relative`}>
                    <Avatar className={`${isFirst ? "w-24 h-24 md:w-32 md:h-32" : "w-20 h-20 md:w-24 md:h-24"} border-4 border-black`}>
                        <AvatarImage src={user.image} className="object-cover" />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>

                    {/* Rank Badge */}
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-black border-2 border-black ${isFirst ? "bg-yellow-500" : user.rank === 2 ? "bg-zinc-400" : "bg-amber-700"
                        }`}>
                        {user.rank}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="text-center">
                <h3 className={`font-bold truncate max-w-[120px] ${isFirst ? "text-lg text-white" : "text-sm text-zinc-300"}`}>
                    @{user.username}
                </h3>
                <p className={`font-black ${isFirst ? "text-yellow-500 text-base" : "text-indigo-400 text-sm"}`}>
                    {user.score.toLocaleString()} Stars
                </p>
            </div>

            {/* Pedestal (Visual only, usually in design but simplified here to spacing or explicit block) */}
            <div className={`w-20 md:w-32 rounded-t-lg bg-gradient-to-b from-white/5 to-transparent mt-4 backdrop-blur-sm border-t border-white/5 ${isFirst ? "h-32 opacity-100" : user.rank === 2 ? "h-20 opacity-70" : "h-12 opacity-50"
                }`} />
        </motion.div>
    );
}
