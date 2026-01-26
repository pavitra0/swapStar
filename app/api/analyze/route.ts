import { NextRequest, NextResponse } from "next/server";
import { getRepoDetails, getRepoContents, getRepoParticipation } from "@/lib/github";
import { calculateStarScore } from "@/lib/scoring";
import { RepoAnalysis } from "@/lib/types";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing repository URL" }, { status: 400 });
    }

    // Extract owner/repo from URL
    // Supported formats: https://github.com/owner/repo, owner/repo
    let owner = "";
    let repo = "";

    try {
        if (url.startsWith("http")) {
            const parts = new URL(url).pathname.split("/").filter(Boolean);
            owner = parts[0];
            repo = parts[1];
        } else {
            const parts = url.split("/");
            owner = parts[0];
            repo = parts[1];
        }
    } catch (e) {
        return NextResponse.json({ error: "Invalid repository URL" }, { status: 400 });
    }

    if (!owner || !repo) {
        return NextResponse.json({ error: "Invalid repository format" }, { status: 400 });
    }

    const details = await getRepoDetails(owner, repo);
    if (!details) {
        return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    // Parallel fetch for extra data
    const [contents, participation] = await Promise.all([
        getRepoContents(owner, repo, ".github/workflows"),
        getRepoParticipation(owner, repo)
    ]);

    const hasWorkflows = Array.isArray(contents) && contents.length > 0;

    const analysisBase = calculateStarScore(details, participation, hasWorkflows);

    // Analyze Recommendation
    let recommendation: "star" | "consider" | "avoid" = "consider";
    if (analysisBase.score > 75) recommendation = "star";
    if (analysisBase.score < 40) recommendation = "avoid";

    const analysis: RepoAnalysis = {
        ...analysisBase,
        summary: details.description || "No description provided.", // Placeholder for AI
        recommendation,
    };

    return NextResponse.json(analysis);
}
