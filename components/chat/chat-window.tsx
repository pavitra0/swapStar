import { useState, useRef, useEffect } from "react";
import { MessageCard } from "./message-card";
import { Send, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "@/app/actions";

interface ChatWindowProps {
    conversationId: string;
    currentUserId: string;
    partnerName: string;
    partnerImage?: string | null;
}

export function ChatWindow({ conversationId, currentUserId, partnerName, partnerImage }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("");
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch messages with polling
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => getMessages(conversationId),
        refetchInterval: 5000, // Poll every 5 seconds
    });

    // Send mutation
    const sendMutation = useMutation({
        mutationFn: async (content: string) => {
            const res = await sendMessage(conversationId, content);
            if (!res.success) throw new Error(res.error);
            return res.message;
        },
        onSuccess: () => {
            setNewMessage("");
            queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] }); // Update last message in list
        }
    });

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMutation.mutate(newMessage);
        }
    };

    return (
        <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-3">
                <img src={partnerImage || ""} className="w-8 h-8 rounded-full" />
                <span className="font-bold">{partnerName}</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 text-sm">
                        Start a conversation with {partnerName}!
                    </div>
                ) : (
                    messages.map((msg: any) => (
                        <MessageCard
                            key={msg.id}
                            content={msg.content}
                            timestamp={msg.createdAt}
                            isOwn={msg.senderId === currentUserId}
                            senderImage={msg.senderId === currentUserId ? null : partnerImage} // Optimisation: Don't need sender image for own messages usually
                        />
                    ))
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-background flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-secondary/50 border border-transparent focus:border-indigo-500 rounded-xl px-4 py-2 outline-none transition-all"
                    disabled={sendMutation.isPending}
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sendMutation.isPending}
                    className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                >
                    {sendMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
}
