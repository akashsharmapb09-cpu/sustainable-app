import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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

export default defineSchema({
  ...authTables,
  userData: defineTable({
    ownerId: v.id("users"),
    collection: collections,
    key: v.string(),
    data: v.any(),
    updatedAt: v.number(),
  })
    .index("by_owner_collection", ["ownerId", "collection"])
    .index("by_owner_collection_key", ["ownerId", "collection", "key"]),
  userRoles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("admin")),
  }).index("by_user", ["userId"]),
});
