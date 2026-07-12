import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema";

/**
 * Auth.js (NextAuth v5) config.
 *
 * Env vars (Auth.js auto-reads AUTH_*):
 * - AUTH_SECRET
 * - AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
 * - AUTH_GITHUB_ID / AUTH_GITHUB_SECRET
 * - AUTH_URL (optional in prod; e.g. https://your-domain.com)
 */
export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      // Protect the chat app shell
      if (pathname.startsWith("/chat")) {
        return isLoggedIn;
      }

      // Signed-in users hitting /sign-in go to chat
      if (pathname.startsWith("/sign-in") && isLoggedIn) {
        return Response.redirect(new URL("/chat", request.nextUrl));
      }

      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
