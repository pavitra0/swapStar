"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollow } from "@/app/actions";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    className?: string;
    onToggle?: (newState: boolean) => void;
}

export function FollowButton({ targetUserId, initialIsFollowing, className, onToggle }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);

    // We update local state immediately for optimistic UI
    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;
        setIsLoading(true);

        const newState = !isFollowing;
        setIsFollowing(newState);
        if (onToggle) onToggle(newState);

        const res = await toggleFollow(targetUserId);

        if (!res.success) {
            // Revert on failure
            setIsFollowing(!newState);
            if (onToggle) onToggle(!newState);
            alert("Failed to update follow status");
        }

        setIsLoading(false);
    };

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                isFollowing
                    ? "bg-transparent border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                    : "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600",
                className
            )}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isFollowing ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="group-hover:hidden">Following</span>
                    <span className="hidden group-hover:inline">Unfollow</span>
                </>
            ) : (
                <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Follow
                </>
            )}
        </button>
    );
}
