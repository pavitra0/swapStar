"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/app/actions";
import { useSession } from "next-auth/react";
import { Loader2, MessageSquarePlus } from "lucide-react";

export default function MessagesPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedId = searchParams.get("id");

    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: () => getConversations(),
        refetchInterval: 10000,
    });

    // Determine current view
    const selectedConversation = conversations.find((c: any) => c.id === selectedId);

    const handleSelectConversation = (id: string) => {
        router.push(`/messages?id=${id}`);
    };

    if (!session) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <DashboardNavbar />

            <div className="container mx-auto max-w-6xl flex-1 flex gap-6 p-4 pt-24 h-[calc(100vh-1rem)]">

                {/* Sidebar (Conversation List) */}
                <div className={`w-full md:w-80 flex flex-col gap-4 ${selectedId ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2">
                        <h1 className="text-2xl font-black tracking-tight">Messages</h1>
                        {/* <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                            <MessageSquarePlus className="w-5 h-5" />
                        </button> */}
                    </div>

                    <div className="bg-card border border-border rounded-2xl flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <ConversationList
                                conversations={conversations}
                                selectedId={selectedId || undefined}
                                onSelect={handleSelectConversation}
                            />
                        )}
                    </div>
                </div>

                {/* Main Content (Chat Window) */}
                <div className={`flex-1 flex flex-col ${!selectedId ? "hidden md:flex" : "flex"}`}>
                    {selectedId && selectedConversation ? (
                        <ChatWindow
                            conversationId={selectedId}
                            currentUserId={session.user?.id as string}
                            partnerName={selectedConversation.partner.name || "User"}
                            partnerImage={selectedConversation.partner.image}
                        />
                    ) : (
                        <div className="h-full bg-card/50 border border-border/50 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                            <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                                <MessageSquarePlus className="w-10 h-10 opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Your Messages</h3>
                            <p>Select a conversation from the left to start chatting.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
