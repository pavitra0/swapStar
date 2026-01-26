"use client";

import { DeveloperProfile } from "@/components/developer-profile";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;

    return (
        <div className="container mx-auto max-w-4xl p-8 space-y-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="mx-auto max-w-lg">
                <DeveloperProfile username={username} />
            </div>

            <div className="text-center text-muted-foreground text-sm">
                <p>Showing public profile for @{username}</p>
            </div>
        </div>
    );
}
