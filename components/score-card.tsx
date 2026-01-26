import { RepoAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Star, AlertTriangle, Shield, BookOpen, Activity, Users, Zap } from "lucide-react";
import { BadgeGenerator } from "@/components/badge-generator";

export function ScoreCard({ analysis }: { analysis: RepoAnalysis }) {
    const { score, breakdown, badges, recommendation } = analysis;

    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-green-500";
        if (s >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const scoreColor = getScoreColor(score);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    {/* Main Score */}
                    <div className="flex flex-col items-center justify-center p-6 bg-secondary/50 rounded-2xl min-w-[200px]">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">StarScore</span>
                        <span className={cn("text-6xl font-bold my-2", scoreColor)}>{score}</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${recommendation === "star" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            recommendation === "avoid" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}>
                            {recommendation}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-4 w-full">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {analysis.repo.full_name}
                                <a href={analysis.repo.html_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                    <BookOpen className="w-4 h-4" />
                                </a>
                            </h2>
                            <p className="text-muted-foreground line-clamp-2">{analysis.summary}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {badges.map((badge) => (
                                <span key={badge} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20">
                                    {badge}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                            <ScoreItem label="Documentation" value={breakdown.documentation} max={20} icon={BookOpen} tooltip="Evaluates README quality, examples, and site links." />
                            <ScoreItem label="Maintenance" value={breakdown.maintenance} max={20} icon={Activity} tooltip="Based on recent commits and release cadence." />
                            <ScoreItem label="Community" value={breakdown.community} max={15} icon={Users} tooltip="Metrics: Forks, Watchers, Subscribers." />
                            <ScoreItem label="Reliability" value={breakdown.reliability} max={15} icon={Shield} tooltip="Checks for License, CI/CD, Testing." />
                            <ScoreItem label="Adoption" value={breakdown.adoption} max={15} icon={Star} tooltip="Star count normalized for age/hype." />
                            <ScoreItem label="Innovation" value={breakdown.innovation} max={15} icon={Zap} tooltip="AI estimation of uniqueness." />
                        </div>

                        {score > 70 && (
                            <div className="pt-4 border-t border-border">
                                <BadgeGenerator repoName={analysis.repo.full_name} score={score} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ScoreItem({ label, value, max, icon: Icon, tooltip }: { label: string, value: number, max: number, icon: any, tooltip?: string }) {
    const percentage = (value / max) * 100;
    return (
        <div className="space-y-1 group relative" title={tooltip}>
            <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground cursor-help decoration-dotted underline underline-offset-2">
                    <Icon className="w-3 h-3" /> {label}
                </span>
                <span className="font-mono font-medium">{value}/{max}</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
