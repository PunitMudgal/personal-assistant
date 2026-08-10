import NextAuth from "next-auth";

import { authConfig } from "@/server/auth/config";

/**
 * Next.js 16 proxy (replaces middleware).
 * Uses the edge-safe auth config WITHOUT the Drizzle adapter so
 * /chat and /data do not hit the DB during the proxy phase.
 * Full session + DB checks still run in (app)/layout.tsx via `auth()`.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export const { auth: proxy } = NextAuth(authConfig);

export const config = {
  matcher: ["/chat", "/chat/:path*", "/data", "/data/:path*", "/sign-in"],
};
