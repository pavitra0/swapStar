import { RepoDetails } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

export async function getRepoDetails(owner: string, name: string, token?: string): Promise<RepoDetails | null> {
    try {
        const headers: HeadersInit = {
            Authorization: `Bearer ${token || process.env.AUTH_GITHUB_SECRET}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github+json",
        };

        const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${name}`, {
            headers,
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data as RepoDetails;
    } catch (error) {
        console.error("Failed to fetch repo details:", error);
        return null;
    }
}

export async function getRepoContents(owner: string, repo: string, path: string = "") {
    // Helper to check for README, CONTRIBUTING, etc.
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
    try {
        const res = await fetch(url, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
            },
            next: { revalidate: 3600 }
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
}

export async function getRepoParticipation(owner: string, name: string, token?: string) {
    try {
        const headers: HeadersInit = {
            Authorization: `Bearer ${token || process.env.AUTH_GITHUB_SECRET}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github+json",
        };

        const res = await fetch(`https://api.github.com/repos/${owner}/${name}/stats/participation`, {
            headers,
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
}

export async function fetchUserStarredRepos(token: string): Promise<string[]> {
    try {
        // Fetch only IDs or full_names to minimize data. 
        // GitHub API allows fetching just starred repos.
        // We might need pagination if user has 1000+ stars, but let's grab top 100 for now.
        const res = await fetch("https://api.github.com/user/starred?per_page=100", {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-GitHub-Api-Version": "2022-11-28",
                Accept: "application/vnd.github+json",
            },
            cache: 'no-store' // Always fetch fresh to avoid showing already starred repos
        });

        if (!res.ok) return [];
        const repos = await res.json();
        return repos.map((r: any) => r.full_name);
    } catch (e) {
        console.error("Failed to fetch user stars", e);
        return [];
    }
}

export async function getUserProfile(username: string, token?: string) {
    try {
        const headers: HeadersInit = {
            Authorization: `Bearer ${token || process.env.AUTH_GITHUB_SECRET}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github+json",
        };

        const res = await fetch(`https://api.github.com/users/${username}`, {
            headers,
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}
export async function fetchUserStarredReposDetails(token: string) {
    try {
        const res = await fetch("https://api.github.com/user/starred?sort=created&direction=desc&per_page=30", {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-GitHub-Api-Version": "2022-11-28",
                Accept: "application/vnd.github+json",
            },
            cache: 'no-store'
        });

        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        console.error("Failed to fetch starred repos details", e);
        return [];
    }
}
