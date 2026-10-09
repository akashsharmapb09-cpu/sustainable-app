import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

const collections = v.union(
  v.literal("profiles"),
  v.literal("user_preferences"),
  v.literal("activity_logs"),
  v.literal("recommendations"),
  v.literal("user_actions"),
  v.literal("goals"),
  v.literal("user_challenges"),
  v.literal("user_badges"),
  v.literal("audit_log"),
  v.literal("feedback"),
  v.literal("data_export_requests"),
);

async function requireUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("Authentication required");
  const sessionId = await getAuthSessionId(ctx);
  if (!sessionId || !(await ctx.db.get(sessionId))) {
    throw new ConvexError("Session expired. Sign in again.");
  }
  if (!(await ctx.db.get(userId))) throw new ConvexError("Account no longer exists.");
  return userId;
}

export const list = query({
  args: { collection: collections },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const records = await ctx.db
      .query("userData")
      .withIndex("by_owner_collection", (q) =>
        q.eq("ownerId", userId).eq("collection", args.collection),
      )
      .collect();
    return records.map((record) => record.data);
  },
});

export const save = mutation({
  args: {
    collection: collections,
    key: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    if (!args.data || typeof args.data !== "object" || Array.isArray(args.data)) {
      throw new ConvexError("Invalid record");
    }

    const existing = await ctx.db
      .query("userData")
      .withIndex("by_owner_collection_key", (q) =>
        q.eq("ownerId", userId).eq("collection", args.collection).eq("key", args.key),
      )
      .unique();

    const now = Date.now();
    const owner = await ctx.db.get(userId);
    const data = {
      ...args.data,
      id: args.key,
      user_id: userId,
      ...(args.collection === "profiles" ? { email: owner?.email ?? null } : {}),
      updated_at: new Date(now).toISOString(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, { data, updatedAt: now });
    } else {
      await ctx.db.insert("userData", {
        ownerId: userId,
        collection: args.collection,
        key: args.key,
        data,
        updatedAt: now,
      });
    }
    return data;
  },
});

export const remove = mutation({
  args: { collection: collections, key: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const record = await ctx.db
      .query("userData")
      .withIndex("by_owner_collection_key", (q) =>
        q.eq("ownerId", userId).eq("collection", args.collection).eq("key", args.key),
      )
      .unique();
    if (!record) throw new ConvexError("Record not found");
    await ctx.db.delete(record._id);
  },
});

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const records = await ctx.db
      .query("userData")
      .withIndex("by_owner_collection", (q) => q.eq("ownerId", userId))
      .collect();
    for (const record of records) await ctx.db.delete(record._id);

    const roles = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const role of roles) await ctx.db.delete(role._id);

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) {
      const tokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const token of tokens) await ctx.db.delete(token._id);
      await ctx.db.delete(session._id);
    }

    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) {
      const codes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const code of codes) await ctx.db.delete(code._id);
      await ctx.db.delete(account._id);
    }

    const user = await ctx.db.get(userId);
    if (user) await ctx.db.delete(userId);
  },
});

export const exportMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const records = await ctx.db
      .query("userData")
      .withIndex("by_owner_collection", (q) => q.eq("ownerId", userId))
      .collect();
    const result: Record<string, unknown[]> = {};
    for (const record of records) {
      (result[record.collection] ??= []).push(record.data);
    }
    return result;
  },
});
