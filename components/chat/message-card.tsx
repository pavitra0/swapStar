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
        <div className={cn("flex gap-3", isOwn ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="w-8 h-8">
                <AvatarImage src={senderImage || ""} />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className={cn(
                "p-3 rounded-2xl max-w-[70%]",
                isOwn ? "bg-indigo-500 text-white rounded-tr-sm" : "bg-card border border-border rounded-tl-sm"
            )}>
                <p className="text-sm">{content}</p>
                <div className={cn("text-[10px] mt-1 opacity-70", isOwn ? "text-indigo-100" : "text-muted-foreground")}>
                    {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}
