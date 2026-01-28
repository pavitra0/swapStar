"use client";

import { LeaderboardItem } from "./leaderboard-item";

interface LeaderboardUser {
    id: string;
    username: string;
    image: string;
    score: number;
    techStack: string[];
    trend: number;
    rank: number;
    isMe?: boolean;
}

interface LeaderboardListProps {
    users: LeaderboardUser[];
}

export function LeaderboardList({ users }: LeaderboardListProps) {
    return (
        <div className="flex flex-col gap-3 pb-24">
            {users.map((user, index) => (
                <div
                    key={user.id}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <LeaderboardItem {...user} />
                </div>
            ))}
        </div>
    );
}
