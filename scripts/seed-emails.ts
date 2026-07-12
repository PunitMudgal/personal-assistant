import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq, sql } from "drizzle-orm";

import { db } from "../src/db";
import { emails, users } from "../src/db/schema";

type MockEmail = {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  arcId?: string;
  phaseId?: number;
  labels?: string[];
  inReplyTo?: string;
  references?: string[];
};

const BATCH_SIZE = 50;

function parseArgs(argv: string[]): {
  userId?: string;
  email?: string;
  clear: boolean;
} {
  let userId: string | undefined;
  let email: string | undefined;
  let clear = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--user-id" && argv[i + 1]) {
      userId = argv[++i];
    } else if (arg === "--email" && argv[i + 1]) {
      email = argv[++i];
    } else if (arg === "--clear") {
      clear = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return {
    userId: userId ?? process.env.SEED_USER_ID,
    email: email ?? process.env.SEED_USER_EMAIL,
    clear,
  };
}

function printHelp(): void {
  console.log(`Usage:
  pnpm db:seed:emails -- --user-id <id>
  pnpm db:seed:emails -- --email <user@example.com>
  pnpm db:seed:emails -- --email <user@example.com> --clear

Env alternatives:
  SEED_USER_ID
  SEED_USER_EMAIL

Options:
  --clear   Delete existing emails for the user before seeding
`);
}

function loadMockEmails(): MockEmail[] {
  const filePath = resolve(process.cwd(), "src/lib/mock/emails.json");
  const raw = readFileSync(filePath, "utf8");
  const data: unknown = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("emails.json must be an array");
  }

  return data as MockEmail[];
}

async function resolveUserId(opts: {
  userId?: string;
  email?: string;
}): Promise<string> {
  if (opts.userId) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, opts.userId))
      .limit(1);

    if (!existing) {
      throw new Error(`No user found with id: ${opts.userId}`);
    }

    return existing.id;
  }

  if (opts.email) {
    const [existing] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, opts.email))
      .limit(1);

    if (!existing) {
      throw new Error(
        `No user found with email: ${opts.email}. Sign in once first, or pass --user-id.`
      );
    }

    return existing.id;
  }

  const [first] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .limit(1);

  if (!first) {
    throw new Error(
      "No users in the database. Sign in via Google/GitHub first, then re-run the seeder."
    );
  }

  console.warn(
    `No --user-id / --email provided — seeding into first user: ${first.email ?? first.id}`
  );
  return first.id;
}

function toEmailRow(userId: string, mock: MockEmail) {
  return {
    userId,
    sourceId: mock.id,
    threadId: mock.threadId,
    from: mock.from,
    to: mock.to,
    subject: mock.subject,
    body: mock.body,
    sentAt: new Date(mock.timestamp),
    raw: mock as Record<string, unknown>,
  };
}

async function seedEmails(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const userId = await resolveUserId(opts);
  const mocks = loadMockEmails();

  console.log(`Seeding ${mocks.length} emails for user ${userId}…`);

  if (opts.clear) {
    const deleted = await db
      .delete(emails)
      .where(eq(emails.userId, userId))
      .returning({ id: emails.id });
    console.log(`Cleared ${deleted.length} existing email(s).`);
  }

  let processed = 0;

  for (let i = 0; i < mocks.length; i += BATCH_SIZE) {
    const batch = mocks
      .slice(i, i + BATCH_SIZE)
      .map((mock) => toEmailRow(userId, mock));

    const result = await db
      .insert(emails)
      .values(batch)
      .onConflictDoUpdate({
        target: [emails.userId, emails.sourceId],
        set: {
          threadId: sql`excluded.thread_id`,
          from: sql`excluded."from"`,
          to: sql`excluded."to"`,
          subject: sql`excluded.subject`,
          body: sql`excluded.body`,
          sentAt: sql`excluded.sent_at`,
          raw: sql`excluded.raw`,
        },
      })
      .returning({ id: emails.id });

    processed += result.length;
    console.log(
      `  batch ${Math.floor(i / BATCH_SIZE) + 1}: upserted ${result.length} (total ${processed})`
    );
  }

  console.log(`Done. Upserted ${processed} email row(s) for user ${userId}.`);
}

seedEmails().catch((error: unknown) => {
  console.error("Email seed failed:");
  console.error(error);
  process.exit(1);
});

// # after you've signed in at least once
// pnpm db:seed:emails -- --email you@example.com

// # or by user id
// pnpm db:seed:emails -- --user-id <uuid>

// # wipe that user's emails first, then reseed
// pnpm db:seed:emails -- --email you@example.com --clear