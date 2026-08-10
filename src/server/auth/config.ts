import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

/**
 * Edge/proxy-safe Auth.js config (NO database adapter).
 * Full adapter + JWT session live in `./index.ts`.
 *
 * Env vars (Auth.js auto-reads AUTH_*):
 * - AUTH_SECRET
 * - AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
 * - AUTH_GITHUB_ID / AUTH_GITHUB_SECRET
 * - AUTH_URL (e.g. https://your-domain.com in production)
 */
export const authConfig = {
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

      if (pathname.startsWith("/chat") || pathname.startsWith("/data")) {
        return isLoggedIn;
      }

      if (pathname.startsWith("/sign-in") && isLoggedIn) {
        return Response.redirect(new URL("/chat", request.nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const id = (token.id as string | undefined) ?? token.sub;
        if (id) session.user.id = id;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
