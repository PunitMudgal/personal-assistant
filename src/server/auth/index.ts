import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { cache } from "react";

import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema";

import { authConfig } from "./config";

/**
 * Full Auth.js instance for route handlers / server components.
 * Uses Drizzle for user/account persistence + JWT sessions so the
 * Next.js proxy layer does not need a database connection.
 */
const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
