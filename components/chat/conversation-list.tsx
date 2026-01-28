import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
    id: string;
    partner: {
        id: string;
        name: string | null;
        image: string | null;
    };
    lastMessage?: {
        content: string;
        createdAt: Date;
    };
    updatedAt: Date;
}

interface ConversationListProps {
    conversations: Conversation[];
    selectedId?: string;
    onSelect: (id: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
    if (conversations.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground text-sm">
                No active conversations.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 pr-1">
            {conversations.map((conv) => (
                <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={cn(
                        "group flex items-start gap-4 p-3 rounded-2xl transition-all text-left border border-transparent relative overflow-hidden",
                        selectedId === conv.id
                            ? "bg-secondary/40 border-indigo-500/30 shadow-sm"
                            : "hover:bg-muted/50 hover:border-border/50"
                    )}
                >
                    {selectedId === conv.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
                    )}

                    <div className="relative">
                        <Avatar className="w-11 h-11 border border-border shadow-sm">
                            <AvatarImage src={conv.partner.image || ""} />
                            <AvatarFallback>{conv.partner.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        {/* Mock online status for now - random for demo */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
                    </div>

                    <div className="flex-1 overflow-hidden relative z-10">
                        <div className="flex items-center justify-between mb-0.5">
                            <span className={cn("font-bold text-sm truncate", selectedId === conv.id ? "text-foreground" : "text-zinc-300")}>
                                {conv.partner.name}
                            </span>
                            <span className={cn("text-[10px] font-medium", selectedId === conv.id ? "text-indigo-400" : "text-muted-foreground")}>
                                {formatDistanceToNow(new Date(conv.lastMessage?.createdAt || conv.updatedAt), { addSuffix: false })}
                            </span>
                        </div>
                        <p className={cn("text-xs truncate", selectedId === conv.id ? "text-zinc-300 font-medium" : "text-muted-foreground")}>
                            {conv.lastMessage?.content || <span className="italic opacity-50">Start a conversation</span>}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
