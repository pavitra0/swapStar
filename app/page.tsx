"use client";

import { useSession, signIn } from "next-auth/react";
import { Zap, Trophy, TrendingUp, Github, ArrowRight, Star } from "lucide-react";
import { HiddenGemsFeed } from "@/components/hidden-gems-feed";

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white selection:bg-indigo-500/30">

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center min-h-[90vh] px-4 overflow-hidden border-b border-white/10">

        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">The Social Network for Code</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            Swipe. Star. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Level Up.
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop searching. Start discovering. SwapStar is the <span className="text-white font-bold">Tinder for Open Source</span>.
            Curate hidden gems, earn XP, and climb the global leaderboard.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            {status === "unauthenticated" && (
              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                disabled={isLoading}
                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <Github className="w-5 h-5" />
                <span>Join with GitHub</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <a
              href="/leaderboard"
              className="px-8 py-4 rounded-full font-bold text-lg border border-zinc-800 hover:bg-zinc-900 transition-colors flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-yellow-500" />
              View Leaderboard
            </a>

            {status === "authenticated" && (
              <a
                href="/dashboard"
                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>

        </div>

        {/* Floating Cards Visual (CSS Only) */}
        <div className="absolute -bottom-20 md:-bottom-32 left-1/2 -translate-x-1/2 w-[300px] h-[400px] md:w-[400px] md:h-[500px] opacity-30 pointer-events-none perspective-1000">
          <div className="w-full h-full bg-zinc-900 border border-white/10 rounded-3xl rotate-[-6deg] absolute top-0 left-0 scale-95 origin-bottom shadow-2xl" />
          <div className="w-full h-full bg-zinc-800 border border-white/10 rounded-3xl rotate-[6deg] absolute top-0 left-0 scale-95 origin-bottom shadow-2xl" />
          <div className="w-full h-full bg-zinc-950 border border-white/20 rounded-3xl absolute top-4 left-0 shadow-2xl flex items-center justify-center">
            <Zap className="w-24 h-24 text-indigo-500/50" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 px-4 bg-zinc-950 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-indigo-500/50 transition-colors group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Swipe to Discover</h3>
            <p className="text-zinc-400 leading-relaxed">
              Say goodbye to boring lists. Our algorithm serves you tailored repos. Swipe right to Star, left to pass. It's that addictive.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Earn XP & Badges</h3>
            <p className="text-zinc-400 leading-relaxed">
              Every contribution counts. Earn XP for curation, unlock badges for your profile, and show off your "SwapScore".
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/50 transition-colors group">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Community Leaderboard</h3>
            <p className="text-zinc-400 leading-relaxed">
              Compete with other developers. Who has the best taste in open source? Climb the ranks and become a legend.
            </p>
          </div>

        </div>
      </section>

      {/* Legacy/Utility Section */}
      <section className="w-full py-24 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Not ready to swipe?
          </h2>
          <p className="text-zinc-400">
            You can still browser the real-time feed of hidden gems without an account.
          </p>
          <div className="mt-8 border border-white/10 rounded-2xl overflow-hidden bg-zinc-900">
            <HiddenGemsFeed />
          </div>
        </div>
      </section>

    </main>
  );
}
