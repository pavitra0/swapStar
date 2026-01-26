# SwapStar

SwapStar is an AI-powered GitHub Repo Star Recommender designed to help developers discover hidden gems, analyze repositories, and find projects that align with their interests.

## Features

-   **Repo Analyzer**: Get deep insights into repository health, activity, and code quality.
-   **AI Repo Review**: AI-generated summaries and reviews of repositories to help you decide if it's worth your time.
-   **Hidden Gems Feed**: Discover high-quality but underappreciated repositories.
-   **Repo Comparison Tool**: Compare multiple repositories side-by-side to choose the best one for your needs.
-   **Personalized Recommendations**: Get tailored repository suggestions based on your starring history and preferences.
-   **Maintainer Mode**: Special tools and metrics for repository maintainers to grow their community.

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Database**: PostgreSQL
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **State Management/Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

-   Node.js (v18+ recommended)
-   PostgreSQL database

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/pavitra0/swapStar.git
    cd swapStar
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables:

    Copy `.env.example` (if available) or create a `.env` file with the following:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/swapstar"
    NEXTAUTH_SECRET="your-super-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    GITHUB_ID="your-github-client-id"
    GITHUB_SECRET="your-github-client-secret"
    ```

4.  Set up the database:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  Run the development server:

    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
