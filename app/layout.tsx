import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SwapStar | Swap Stars, Build Connections",
  description: "The social network for developers to swap repository recommendations and find hidden gems.",
  openGraph: {
    title: "SwapStar | Swap Stars, Build Connections",
    description: "Don't let star count fool you. Analyze GitHub repo health, documentation, and community maintenance.",
    type: "website",
    url: "https://swapstar.vercel.app",
    siteName: "SwapStar",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwapStar | GitHub Repo Analyzer",
    description: "AI-powered repository quality analyzer.",
    creator: "@swapstar",
  },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "antialiased bg-background text-foreground font-sans")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
