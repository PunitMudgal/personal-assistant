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

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function fail(error: string): ActionResult<never> {
  return { success: false, error };
}

function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

const userIdSchema = z.string().min(1, "userId is required");
const memoryIdSchema = z.string().uuid("Invalid memory id");

const listMemoriesSchema = z.object({
  userId: userIdSchema,
  category: z.string().min(1).optional(),
  activeOnly: z.boolean().optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

const createMemorySchema = z.object({
  userId: userIdSchema,
  content: z.string().trim().min(1, "content is required"),
  category: z.string().trim().min(1).nullable().optional(),
  importance: z.number().int().min(0).max(100).optional(),
  sourceChatId: z.string().min(1).nullable().optional(),
  sourceMessageId: z.string().min(1).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const updateMemorySchema = z.object({
  id: memoryIdSchema,
  userId: userIdSchema,
  content: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).nullable().optional(),
  importance: z.number().int().min(0).max(100).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
  sourceChatId: z.string().min(1).nullable().optional(),
  sourceMessageId: z.string().min(1).nullable().optional(),
});

const memoryIdForUserSchema = z.object({
  id: memoryIdSchema,
  userId: userIdSchema,
});

export async function getMemoryAction(input: {
  id: string;
  userId: string;
}): Promise<ActionResult<Memory>> {
  const parsed = memoryIdForUserSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const memory = await getMemoryByIdForUser(parsed.data.id, parsed.data.userId);
  if (!memory) {
    return fail("Memory not found");
  }

  return ok(memory);
}

export async function listMemoriesAction(input: {
  userId: string;
  category?: string;
  activeOnly?: boolean;
  limit?: number;
}): Promise<ActionResult<Memory[]>> {
  const parsed = listMemoriesSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { userId, ...options } = parsed.data;
  const memories = await listMemoriesByUserId(userId, options);
  return ok(memories);
}

export async function createMemoryAction(input: {
  userId: string;
  content: string;
  category?: string | null;
  importance?: number;
  sourceChatId?: string | null;
  sourceMessageId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<ActionResult<Memory>> {
  const parsed = createMemorySchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const memory = await createMemory(parsed.data);
    return ok(memory);
  } catch {
    return fail("Failed to create memory");
  }
}

export async function updateMemoryAction(input: {
  id: string;
  userId: string;
  content?: string;
  category?: string | null;
  importance?: number;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
  sourceChatId?: string | null;
  sourceMessageId?: string | null;
}): Promise<ActionResult<Memory>> {
  const parsed = updateMemorySchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { id, userId, ...data } = parsed.data;
  if (Object.keys(data).length === 0) {
    return fail("No fields to update");
  }

  const updated = await updateMemory(id, userId, data);
  if (!updated) {
    return fail("Memory not found");
  }

  return ok(updated);
}

export async function deactivateMemoryAction(input: {
  id: string;
  userId: string;
}): Promise<ActionResult<Memory>> {
  const parsed = memoryIdForUserSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const updated = await deactivateMemory(parsed.data.id, parsed.data.userId);
  if (!updated) {
    return fail("Memory not found");
  }

  return ok(updated);
}

export async function activateMemoryAction(input: {
  id: string;
  userId: string;
}): Promise<ActionResult<Memory>> {
  const parsed = memoryIdForUserSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const updated = await activateMemory(parsed.data.id, parsed.data.userId);
  if (!updated) {
    return fail("Memory not found");
  }

  return ok(updated);
}

export async function deleteMemoryAction(input: {
  id: string;
  userId: string;
}): Promise<ActionResult<Memory>> {
  const parsed = memoryIdForUserSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const deleted = await deleteMemory(parsed.data.id, parsed.data.userId);
  if (!deleted) {
    return fail("Memory not found");
  }

  return ok(deleted);
}
