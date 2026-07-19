"use server";

import { z } from "zod";
import {
  activateMemory,
  createMemory,
  deactivateMemory,
  deleteMemory,
  getMemoryByIdForUser,
  listMemoriesByUserId,
  updateMemory,
} from "@/db/queries";
import type { Memory } from "@/db/schema";
import { auth } from "@/server/auth";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function fail(error: string): ActionResult<never> {
  return { success: false, error };
}

function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

async function requireUserId(): Promise<ActionResult<string>> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail("Unauthorized");
  return ok(userId);
}

const memoryIdSchema = z.string().uuid("Invalid memory id");

const listMemoriesSchema = z.object({
  category: z.string().min(1).optional(),
  activeOnly: z.boolean().optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

const createMemorySchema = z.object({
  content: z.string().trim().min(1, "content is required"),
  category: z.string().trim().min(1).nullable().optional(),
  importance: z.number().int().min(0).max(100).optional(),
});

const updateMemorySchema = z.object({
  id: memoryIdSchema,
  content: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).nullable().optional(),
  importance: z.number().int().min(0).max(100).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
  sourceChatId: z.string().min(1).nullable().optional(),
  sourceMessageId: z.string().min(1).nullable().optional(),
});

/** Defined for parity — not called from UI; layout loads via listMemoriesByUserId. */
export async function listMemoriesAction(input?: {
  category?: string;
  activeOnly?: boolean;
  limit?: number;
}): Promise<ActionResult<Memory[]>> {
  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  const parsed = listMemoriesSchema.safeParse(input ?? {});
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const memories = await listMemoriesByUserId(authResult.data, parsed.data);
    return ok(memories);
  } catch {
    return fail("Failed to list memories");
  }
}

/** Defined for parity — not called from UI yet. */
export async function getMemoryAction(input: {
  id: string;
}): Promise<ActionResult<Memory>> {
  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  const parsed = memoryIdSchema.safeParse(input.id);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid memory id");
  }

  const memory = await getMemoryByIdForUser(parsed.data, authResult.data);
  if (!memory) return fail("Memory not found");
  return ok(memory);
}

/** Wired from sidebar create dialog. */
export async function createMemoryAction(input: {
  content: string;
  category?: string | null;
  importance?: number;
}): Promise<ActionResult<Memory>> {
  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  const parsed = createMemorySchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const memory = await createMemory({
      userId: authResult.data,
      content: parsed.data.content,
      category: parsed.data.category ?? null,
      importance: parsed.data.importance ?? 0,
      sourceChatId: null,
      sourceMessageId: null,
    });
    return ok(memory);
  } catch {
    return fail("Failed to create memory");
  }
}

/** Defined but unused — no edit UI. */
export async function updateMemoryAction(input: {
  id: string;
  content?: string;
  category?: string | null;
  importance?: number;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
  sourceChatId?: string | null;
  sourceMessageId?: string | null;
}): Promise<ActionResult<Memory>> {
  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  const parsed = updateMemorySchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { id, ...data } = parsed.data;
  if (Object.keys(data).length === 0) {
    return fail("No fields to update");
  }

  const updated = await updateMemory(id, authResult.data, data);
  if (!updated) return fail("Memory not found");
  return ok(updated);
}

/** Soft-delete — wired from sidebar detail dialog. */
export async function deactivateMemoryAction(input: {
  id: string;
}): Promise<ActionResult<Memory>> {
  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  const parsed = memoryIdSchema.safeParse(input.id);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid memory id");
  }

  const updated = await deactivateMemory(parsed.data, authResult.data);
  if (!updated) return fail("Memory not found");
  return ok(updated);
}

/** Defined but unused. */
export async function activateMemoryAction(input: {
  id: string;
}): Promise<ActionResult<Memory>> {
  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  const parsed = memoryIdSchema.safeParse(input.id);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid memory id");
  }

  const updated = await activateMemory(parsed.data, authResult.data);
  if (!updated) return fail("Memory not found");
  return ok(updated);
}

/** Defined but unused — prefer deactivateMemoryAction for sidebar delete. */
export async function deleteMemoryAction(input: {
  id: string;
}): Promise<ActionResult<Memory>> {
  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  const parsed = memoryIdSchema.safeParse(input.id);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid memory id");
  }

  const deleted = await deleteMemory(parsed.data, authResult.data);
  if (!deleted) return fail("Memory not found");
  return ok(deleted);
}
