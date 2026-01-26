import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET || "mock_secret_for_build",
    session: {
        strategy: "jwt", // Use JWT to avoid database session lookups on every request if preferred, or "database"
    },
    providers: [
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID || "mock_client_id",
            clientSecret: process.env.AUTH_GITHUB_SECRET || "mock_client_secret",
            authorization: { params: { scope: "read:user user:email public_repo" } },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            if (user) {
                token.id = user.id; // Persist user ID to token
            }
            return token;
        },
        async session({ session, token }) {
            // @ts-ignore
            session.accessToken = token.accessToken;
            if (session.user && token.id) {
                // @ts-ignore
                session.user.id = token.id;
            }
            return session;
        },
    },
};
