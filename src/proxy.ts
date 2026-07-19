import { auth } from "@/server/auth";

/**
 * Next.js 16: `proxy.ts` replaces the deprecated `middleware.ts` convention.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export const proxy = auth;

export const config = {
  matcher: ["/chat/:path*", "/data", "/sign-in"],
};
