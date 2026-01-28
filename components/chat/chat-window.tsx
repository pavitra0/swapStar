import { useState, useRef, useEffect } from "react";
import { MessageCard } from "./message-card";
import { Send, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "@/app/actions";

interface ChatWindowProps {
    conversationId: string;
    currentUserId: string;
    currentUserImage?: string | null;
    partnerName: string;
    partnerImage?: string | null;
}

export function ChatWindow({ conversationId, currentUserId, currentUserImage, partnerName, partnerImage }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("");
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch messages with polling
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => getMessages(conversationId),
        refetchInterval: 3000, // Poll every 3 seconds
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

    // Auto-scroll to bottom - Improved reliability
    useEffect(() => {
        if (scrollRef.current) {
            const scrollElement = scrollRef.current;
            // Timeout to ensure DOM is updated and layout is calculated
            setTimeout(() => {
                scrollElement.scrollTo({
                    top: scrollElement.scrollHeight,
                    behavior: "smooth"
                });
            }, 100);
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMutation.mutate(newMessage);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0 bg-black/40 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl backdrop-blur-sm relative">
            {/* Grid Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-black/20 backdrop-blur-xl flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={partnerImage || ""} className="w-10 h-10 rounded-full border border-white/10" />
                        {/* Offline/Online Logic would go here */}
                    </div>
                    <div>
                        <div className="font-bold text-white flex items-center gap-2">
                            @{partnerName.toLowerCase().replace(/\s/g, '')}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-500">
                            {/* Removed misleading "Online" status */}
                            <span className="text-zinc-500">Developer</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 hover:bg-zinc-800 hover:border-white/10 transition-colors text-xs font-bold text-zinc-300 flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        View Repo
                    </button>
                </div>
            </div>

            {/* Connected Badge */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="px-3 py-1 rounded-full bg-zinc-900/80 border border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest backdrop-blur-md">
                    Connected via SwapStar
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent relative z-10" ref={scrollRef}>
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
                            senderImage={msg.senderId === currentUserId ? currentUserImage : partnerImage}
                        />
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/20 backdrop-blur-xl border-t border-white/5 relative z-10">
                <form onSubmit={handleSend} className="flex gap-3 items-end bg-zinc-900/50 border border-white/5 p-2 rounded-2xl focus-within:border-indigo-500/50 focus-within:bg-zinc-900 transition-all shadow-lg">
                    <button type="button" className="p-3 text-zinc-500 hover:text-zinc-300 transition-colors rounded-xl bg-transparent hover:bg-white/5">
                        <span className="text-xl leading-none">+</span>
                    </button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message or paste code snippet..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600 py-3 font-medium"
                        disabled={sendMutation.isPending}
                    />

                    <div className="flex gap-1 pr-1 pb-1">
                        <button type="button" className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <button type="button" className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sendMutation.isPending}
                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95"
                    >
                        {sendMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
