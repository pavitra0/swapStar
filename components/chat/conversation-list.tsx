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
            <div className="p-8 text-center text-muted-foreground">
                No conversations yet.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-2">
            {conversations.map((conv) => (
                <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={cn(
                        "flex items-start gap-3 p-3 rounded-xl transition-all text-left",
                        selectedId === conv.id ? "bg-secondary" : "hover:bg-secondary/50"
                    )}
                >
                    <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={conv.partner.image || ""} />
                        <AvatarFallback>{conv.partner.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm truncate">{conv.partner.name}</span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(conv.lastMessage?.createdAt || conv.updatedAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage?.content || "No messages"}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
