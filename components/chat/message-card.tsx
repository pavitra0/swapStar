import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageCardProps {
    content: string;
    isOwn: boolean;
    senderImage?: string | null;
    timestamp: Date;
}

export function MessageCard({ content, isOwn, senderImage, timestamp }: MessageCardProps) {
    return (
        <div className={cn("flex gap-3 mb-6", isOwn ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="w-9 h-9 border border-border mt-1 shadow-sm">
                <AvatarImage src={senderImage || ""} />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className={cn("flex flex-col max-w-[75%]", isOwn ? "items-end" : "items-start")}>
                <div className={cn(
                    "p-4 rounded-2xl shadow-sm relative group overflow-hidden border",
                    isOwn
                        ? "bg-indigo-600 text-white rounded-tr-sm border-indigo-500/50"
                        : "bg-zinc-900 border-zinc-800 rounded-tl-sm text-zinc-100"
                )}>
                    {/* Glow effect for own messages */}
                    {isOwn && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}

                    <p className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">{content}</p>
                </div>

                <span className="text-[10px] font-medium text-muted-foreground mt-1.5 px-1 opacity-60">
                    {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isOwn && <span className="ml-1 text-indigo-400">YOU</span>}
                </span>
            </div>
        </div>
    );
}
