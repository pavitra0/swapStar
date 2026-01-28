"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getNewMatches, createConversation } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface NewMatchesListProps {
    // Optional initial data or just unused
    matches?: any[];
}

export function NewMatchesList({ matches: initialMatches }: NewMatchesListProps) {
    const router = useRouter();

    const { data: matches = [], isLoading } = useQuery({
        queryKey: ['newMatches'],
        queryFn: () => getNewMatches(),
        initialData: initialMatches,
        refetchInterval: 30000,
    });

    const handleMatchClick = async (partnerId: string) => {
        // Create conversation and redirect
        try {
            const res = await createConversation(partnerId);
            if (res.success && res.conversationId) {
                router.push(`/messages?id=${res.conversationId}`);
            }
        } catch (error) {
            console.error("Failed to start chat", error);
        }
    };

    if (isLoading) {
        return <div className="h-24 flex items-center justify-center"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>;
    }

    if (matches.length === 0) {
        return (
            <div className="flex flex-col gap-3 py-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">New Matches</h3>
                <div className="px-2 text-sm text-muted-foreground italic">
                    No new matches yet. Star more repos!
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 py-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">New Matches</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-none">
                {matches.map((match: any) => (
                    <button
                        key={match.id}
                        onClick={() => handleMatchClick(match.id)}
                        className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group"
                    >
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-105 transition-transform">
                                <Avatar className="w-full h-full border-2 border-background">
                                    <AvatarImage src={match.image} className="object-cover" />
                                    <AvatarFallback>{match.name[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                            {match.isOnline && (
                                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full" />
                            )}
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate w-full text-center">
                            @{match.username || match.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
