import { UserSidebar } from "@/components/user-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />
            <div className="flex max-w-7xl mx-auto pt-24 pb-12 px-4 gap-8">
                <main className="flex-1 w-full min-w-0">
                    {children}
                </main>
                <UserSidebar />
            </div>
        </div>
    );
}
