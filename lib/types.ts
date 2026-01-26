export interface RepoDetails {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
    html_url: string;
    description: string | null;
    stargazers_count: number;
    watchers_count: number;
    subscribers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string | null;
    topics: string[];
    license: {
        key: string;
        name: string;
        url: string;
    } | null;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    homepage: string | null;
    size: number;
    archived: boolean;
    disabled: boolean;
    visibility: string;
    default_branch: string;
}

export interface RepoAnalysis {
    repo: RepoDetails;
    score: number;
    breakdown: {
        documentation: number;
        maintenance: number;
        community: number;
        reliability: number;
        adoption: number;
        innovation: number;
    };
    summary: string;
    recommendation: "star" | "consider" | "avoid";
    badges: string[];
}
