import { getAuthSessionId, getAuthUserId, invalidateSessions } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { action, query } from "./_generated/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const sessionId = await getAuthSessionId(ctx);
    if (!sessionId || !(await ctx.db.get(sessionId))) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const role = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return {
      id: user._id,
      email: user.email ?? null,
      name: user.name ?? null,
      createdAt: user._creationTime,
      emailVerificationTime: user.emailVerificationTime ?? null,
      role: role?.role ?? "user",
    };
  },
});

export const logoutAllSessions = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Authentication required");
    await invalidateSessions(ctx, { userId });
  },
});
