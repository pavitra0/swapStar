import { RepoDetails, RepoAnalysis } from "./types";
import { getRepoDetails, getRepoParticipation } from "./github";

// Stub checkWorkflows if strict typing needed or implement it. 
// For now, let's just assume simple boolean check or fetch content.
async function checkWorkflows(owner: string, name: string, token?: string) {
    return false; // logic moved or stubbed
}

export async function analyzeRepo(repoName: string, token?: string): Promise<RepoAnalysis> {
    // This function mimics the API route logic but is callable directly
    const [owner, name] = repoName.split("/");
    if (!owner || !name) throw new Error("Invalid repository format. Use owner/name");

    const repo = await getRepoDetails(owner, name, token);
    if (!repo) {
        throw new Error("Repository not found or private");
    }

    const participation = await getRepoParticipation(owner, name, token);
    const hasWorkflows = await checkWorkflows(owner, name, token);

    const baseAnalysis = calculateStarScore(repo, participation, hasWorkflows);

    // Mock AI summary for now (since we don't have the AI step in this file)
    // In a real app, this would call the AI service
    const summary = `${repo.name} is a ${repo.language} project with ${repo.stargazers_count} stars. It appears to be ${baseAnalysis.badges.join(", ").toLowerCase()}.`;

    // Simple recommendation engine
    const recommendation = baseAnalysis.score > 75 ? "star" : baseAnalysis.score > 40 ? "consider" : "avoid";

    return {
        ...baseAnalysis,
        summary,
        recommendation
    };
}

export function calculateStarScore(repo: RepoDetails, participation: any, hasWorkflows: boolean): Omit<RepoAnalysis, "summary" | "recommendation"> {
    let score = 0;
    const breakdown = {
        documentation: 0,
        maintenance: 0,
        community: 0,
        reliability: 0,
        adoption: 0,
        innovation: 0,
    };

    // 1. Documentation (20 pts)
    if (repo.homepage) breakdown.documentation += 5;
    if (repo.description && repo.description.length > 20) breakdown.documentation += 5;
    breakdown.documentation += 10;

    // 2. Maintenance (20 pts)
    const daysSincePush = (new Date().getTime() - new Date(repo.pushed_at).getTime()) / (1000 * 3600 * 24);
    if (daysSincePush < 7) breakdown.maintenance += 20;
    else if (daysSincePush < 30) breakdown.maintenance += 15;
    else if (daysSincePush < 90) breakdown.maintenance += 10;
    else if (daysSincePush < 180) breakdown.maintenance += 5;

    // 3. Community (15 pts)
    if (repo.forks_count > 10) breakdown.community += 5;
    if (repo.forks_count > 50) breakdown.community += 5;
    if (repo.subscribers_count > 5) breakdown.community += 5;

    // 4. Reliability (15 pts)
    if (repo.license) breakdown.reliability += 5;
    if (hasWorkflows) breakdown.reliability += 10;

    // 5. Adoption (15 pts)
    if (repo.stargazers_count > 50) breakdown.adoption += 5;
    if (repo.stargazers_count > 100) breakdown.adoption += 5;
    if (repo.stargazers_count > 500) breakdown.adoption += 5;

    // 6. Innovation (15 pts)
    breakdown.innovation += 5;

    // Total
    score = Object.values(breakdown).reduce((a, b) => a + b, 0);

    const badges: string[] = [];
    if (breakdown.maintenance >= 15) badges.push("Highly Maintained");
    if (repo.stargazers_count < 500 && score > 70) badges.push("Hidden Gem");
    if (breakdown.documentation >= 15) badges.push("Great Docs");
    if (breakdown.reliability >= 10) badges.push("Production Ready");

    return {
        repo,
        score,
        breakdown,
        badges,
    };
}
