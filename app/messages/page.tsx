"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { NewMatchesList } from "@/components/chat/new-matches-list";
import { UserProfileSidebar } from "@/components/chat/user-profile-sidebar";
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
        <div className="h-screen bg-black flex flex-col overflow-hidden">
            <DashboardNavbar />

            <div className="flex-1 container mt-14 mx-auto max-w-[1600px] p-4 lg:p-6 h-[calc(100vh-64px)]">
                <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[350px_1fr_350px] gap-6 h-full">

                    {/* Left Sidebar (Matches & Chats) */}
                    <div className={`flex flex-col gap-6 h-full ${selectedId ? "hidden md:flex" : "flex"}`}>
                        {/* New Matches */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2 mb-3">New Matches</h3>
                            <NewMatchesList />
                        </div>

                        {/* Active Chats */}
                        <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-inner">
                            <div className="p-4 border-b border-white/5">
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Active Chats</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-800">
                                {isLoading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
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
                    </div>

                    {/* Middle Column (Chat Window) */}
                    <div className={`flex-1 flex flex-col h-full min-h-0 ${!selectedId ? "hidden md:flex" : "flex"}`}>
                        {selectedId && selectedConversation ? (
                            <ChatWindow
                                conversationId={selectedId}
                                currentUserId={session.user?.id as string}
                                currentUserImage={session.user?.image}
                                partnerName={selectedConversation.partner.name || "User"}
                                partnerImage={selectedConversation.partner.image}
                            />
                        ) : (
                            <div className="h-full bg-black/40 border border-zinc-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-zinc-500 p-8 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                                <div className="relative z-10 w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-xl">
                                    <MessageSquarePlus className="w-10 h-10 opacity-50 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 relative z-10">Your Messages</h3>
                                <p className="relative z-10 max-w-xs mx-auto">Select a conversation from the left to start chatting with your matches.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar (Profile Details) - Only visible on large screens when chat is selected */}
                    <div className="hidden lg:block h-full">
                        {selectedId && selectedConversation ? (
                            <UserProfileSidebar
                                partnerName={selectedConversation.partner.name || "User"}
                                partnerImage={selectedConversation.partner.image}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-600 text-sm italic border-l border-white/5">
                                Select a chat to view details
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
