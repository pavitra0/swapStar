"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket, CheckCircle } from "lucide-react";
import { submitRepo } from "@/app/actions";
import { RepoAnalysis } from "@/lib/types";
import { ScoreCard } from "@/components/score-card";

export function SubmitRepo() {
    const [isOpen, setIsOpen] = useState(false);
    const [repoUrl, setRepoUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RepoAnalysis | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setResult(null);

        // Extract owner/name
        const match = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
        const repoName = match ? match[1] : repoUrl;

        if (!repoName.includes("/")) {
            setError("Invalid URL. Please enter 'owner/name' or full GitHub URL.");
            setIsLoading(false);
            return;
        }

        try {
            const analysis = await submitRepo(repoName);
            if (analysis) {
                setResult(analysis);
            } else {
                setError("Failed to analyze repository. Make sure it exists and is public.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-lg transition-all hover:scale-105">
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch Your Repo
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-indigo-500" />
                        Launchpad
                    </DialogTitle>
                    <DialogDescription>
                        Submit your repository for analysis. If it scores &gt; 70, you'll earn the <strong>Hidden Gem</strong> badge.
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="https://github.com/username/repo"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                className="bg-secondary/50 border-input"
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Analyze & Launch"}
                        </Button>
                    </form>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                                <p className="font-semibold text-green-500">Analysis Complete!</p>
                                <p className="text-sm text-muted-foreground">Here is your detailed report.</p>
                            </div>
                        </div>

                        <ScoreCard analysis={result} />

                        <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); setResult(null); setRepoUrl(""); }}>
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
