import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { validateActivityLogForm, type ActivityLogFormInput } from "../../../features/activities/data/activityCatalog";
import { ALL_ALTERNATIVES } from "../../../features/explore/data/alternativesData";
import { useAuth } from "../../../features/auth/context/authContextDef";
import { goalFormSchema, type GoalFormInput } from "../../../features/progress/goalTracking";
import type { ActivityCategory, Database } from "../../types/database";
import {
  addLocalGoal,
  awardLocalChallengeBadge,
  defaultProfile,
  deleteLocalLog,
  DEMO_BADGES,
  DEMO_CHALLENGES,
  getLocalActions,
  getLocalBadges,
  getLocalChallenges,
  getLocalGoals,
  getLocalLogs,
  getLocalProfile,
  setLocalProfile,
  upsertLocalAction,
  upsertLocalChallenge,
  upsertLocalLog,
} from "../localStore";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
type UserAction = Database["public"]["Tables"]["user_actions"]["Row"];
type UserActionStatus = UserAction["status"];
type Badge = Database["public"]["Tables"]["badges"]["Row"];
type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type UserChallenge = Database["public"]["Tables"]["user_challenges"]["Row"];
type Goal = Database["public"]["Tables"]["goals"]["Row"];
type ProfileUpdates = Partial<Omit<Profile, "id" | "email" | "created_at" | "updated_at">>;
type UserCollection =
  | "profiles"
  | "activity_logs"
  | "user_actions"
  | "goals"
  | "user_challenges"
  | "user_badges";

const getMonthStartIso = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
};

async function listRecords<T>(client: ReturnType<typeof useConvex>, collection: UserCollection): Promise<T[]> {
  return await client.query(api.data.list, { collection }) as T[];
}

async function saveRecord<T>(
  client: ReturnType<typeof useConvex>,
  collection: UserCollection,
  key: string,
  data: object,
): Promise<T> {
  return await client.mutation(api.data.save, { collection, key, data }) as T;
}

export function useProfile() {
  const client = useConvex();
  const { user, profile: authProfile } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      if (user.id === "demo-user") {
        return getLocalProfile(user.id)
          ?? authProfile
          ?? defaultProfile(user.id, user.email ?? "", user.user_metadata.full_name);
      }
      const profiles = await listRecords<Profile>(client, "profiles");
      return profiles[0]
        ?? authProfile
        ?? defaultProfile(user.id, user.email ?? "", user.user_metadata.full_name);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const client = useConvex();
  const qc = useQueryClient();
  const { user, refreshProfile } = useAuth();
  return useMutation({
    mutationFn: async (updates: ProfileUpdates) => {
      if (!user?.id) throw new Error("Not authenticated");
      const current = getLocalProfile(user.id)
        ?? defaultProfile(user.id, user.email ?? "", user.user_metadata.full_name);
      const next: Profile = {
        ...current,
        ...updates,
        id: user.id,
        email: user.email ?? current.email,
        updated_at: new Date().toISOString(),
      };
      if (user.id === "demo-user") {
        setLocalProfile(next);
        return next;
      }
      return saveRecord<Profile>(client, "profiles", user.id, next);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      await refreshProfile();
    },
  });
}

export function useActivityLogs() {
  const client = useConvex();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["activity_logs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const logs = user.id === "demo-user"
        ? getLocalLogs(user.id)
        : await listRecords<ActivityLog>(client, "activity_logs");
      return logs
        .sort((a, b) => b.logged_at.localeCompare(a.logged_at))
        .map((log) => ({ ...log, activities: null }));
    },
    enabled: !!user?.id,
  });
}

export function useCreateActivityLog() {
  const client = useConvex();
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: ActivityLogFormInput) => {
      if (!user?.id) throw new Error("Not authenticated");
      const parsed = validateActivityLogForm({
        activity_id: input.activity_id,
        quantity: input.quantity,
        frequency_per_week: input.frequency_per_week,
        notes: input.notes ?? "",
        logged_at: input.logged_at,
      });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the activity details and try again.");

      const { activity, quantity, frequency_per_week, notes, logged_at, calculated_co2e_monthly } = parsed.data;
      const now = new Date().toISOString();
      const row: ActivityLog = {
        id: crypto.randomUUID(),
        user_id: user.id,
        activity_id: activity.id,
        category: activity.category,
        activity_name: activity.name,
        quantity,
        unit: activity.unit,
        frequency_per_week,
        calculated_co2e_monthly,
        notes: notes || null,
        logged_at: logged_at ?? now,
        created_at: now,
        updated_at: now,
      };
      if (user.id === "demo-user") {
        upsertLocalLog(user.id, row);
        return row;
      }
      return saveRecord<ActivityLog>(client, "activity_logs", row.id, row);
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["activity_logs", user?.id] }),
        qc.invalidateQueries({ queryKey: ["monthly_footprint", user?.id] }),
      ]);
    },
  });
}

export function useDeleteActivityLog() {
  const client = useConvex();
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error("Not authenticated");
      if (user.id === "demo-user") {
        deleteLocalLog(user.id, id);
        return;
      }
      await client.mutation(api.data.remove, { collection: "activity_logs", key: id });
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["activity_logs", user?.id] }),
        qc.invalidateQueries({ queryKey: ["monthly_footprint", user?.id] }),
      ]);
    },
  });
}

export function useAlternatives(category?: ActivityCategory) {
  return useQuery({
    queryKey: ["alternatives", category],
    queryFn: () => {
      const catalog = ALL_ALTERNATIVES.filter((alternative) => alternative.is_active);
      return category ? catalog.filter((alternative) => alternative.category === category) : catalog;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserActions() {
  const client = useConvex();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_actions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      if (user.id === "demo-user") return getLocalActions(user.id);
      const actions = await listRecords<UserAction>(client, "user_actions");
      return actions.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    },
    enabled: !!user?.id,
  });
}

export function useUpsertUserAction() {
  const client = useConvex();
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { alternative_id: string; status: UserActionStatus }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const updatedAt = new Date().toISOString();
      if (user.id === "demo-user") return upsertLocalAction(user.id, input.alternative_id, input.status);
      const current = (await listRecords<UserAction>(client, "user_actions"))
        .find((action) => action.alternative_id === input.alternative_id);
      return saveRecord<UserAction>(client, "user_actions", input.alternative_id, {
        ...current,
        user_id: user.id,
        alternative_id: input.alternative_id,
        status: input.status,
        adopted_at: input.status === "adopted" ? updatedAt : null,
        created_at: current?.created_at ?? updatedAt,
        updated_at: updatedAt,
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["user_actions", user?.id] });
      void qc.invalidateQueries({ queryKey: ["recommendations", user?.id] });
    },
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => DEMO_BADGES as Badge[],
    staleTime: 30 * 60 * 1000,
  });
}

export function useUserBadges() {
  const client = useConvex();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_badges", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const awards = user.id === "demo-user"
        ? getLocalBadges(user.id)
        : await listRecords<UserBadge>(client, "user_badges");
      return awards
        .sort((a, b) => b.awarded_at.localeCompare(a.awarded_at))
        .map((award) => ({
          ...award,
          badges: DEMO_BADGES.find((badge) => badge.key === award.badge_key) ?? null,
        }));
    },
    enabled: !!user?.id,
  });
}

export function useChallenges() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["challenges"],
    queryFn: async () => DEMO_CHALLENGES as Challenge[],
    enabled: !!user?.id,
    staleTime: 60 * 60 * 1000,
  });
}

export function useUserChallenges() {
  const client = useConvex();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_challenges", user?.id],
    queryFn: async () => {
      if (!user?.id) return [] as UserChallenge[];
      const records = user.id === "demo-user"
        ? getLocalChallenges(user.id)
        : await listRecords<UserChallenge>(client, "user_challenges");
      return records.sort((a, b) => b.started_at.localeCompare(a.started_at));
    },
    enabled: !!user?.id,
  });
}

export function useSetUserChallengeStatus() {
  const client = useConvex();
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { challenge_id: string; status: UserChallenge["status"] }) => {
      if (!user?.id) throw new Error("Not authenticated");
      if (user.id === "demo-user") {
        const updated = upsertLocalChallenge(user.id, input.challenge_id, input.status);
        if (input.status === "completed") {
          const challenge = DEMO_CHALLENGES.find((item) => item.id === input.challenge_id);
          if (challenge) awardLocalChallengeBadge(user.id, challenge.badge_key);
        }
        return updated;
      }

      const existing = (await listRecords<UserChallenge>(client, "user_challenges"))
        .find((item) => item.challenge_id === input.challenge_id);
      const now = new Date().toISOString();
      const updated: UserChallenge = {
        id: existing?.id ?? crypto.randomUUID(),
        user_id: user.id,
        challenge_id: input.challenge_id,
        status: input.status,
        started_at: existing?.started_at ?? now,
        completed_at: input.status === "completed" ? now : null,
      };
      const saved = await saveRecord<UserChallenge>(
        client,
        "user_challenges",
        input.challenge_id,
        updated,
      );

      if (input.status === "completed") {
        const challenge = DEMO_CHALLENGES.find((item) => item.id === input.challenge_id);
        if (challenge?.badge_key) {
          const badge: UserBadge = {
            id: crypto.randomUUID(),
            user_id: user.id,
            badge_key: challenge.badge_key,
            awarded_at: now,
          };
          await saveRecord(client, "user_badges", challenge.badge_key, badge);
        }
      }
      return saved;
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["user_challenges", user?.id] }),
        qc.invalidateQueries({ queryKey: ["user_badges", user?.id] }),
      ]);
    },
  });
}

export function useGoals() {
  const client = useConvex();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      if (!user?.id) return [] as Goal[];
      const goals = user.id === "demo-user"
        ? getLocalGoals(user.id)
        : await listRecords<Goal>(client, "goals");
      return goals.sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
    enabled: !!user?.id,
  });
}

export function useCreateGoal() {
  const client = useConvex();
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (
      input: GoalFormInput & { baseline_co2e_monthly: number; baseline_month_start: string },
    ) => {
      if (!user?.id) throw new Error("Not authenticated");
      const parsed = goalFormSchema.safeParse({
        category: input.category,
        target_co2e_reduction_pct: input.target_co2e_reduction_pct,
        target_date: input.target_date,
      });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the goal details and try again.");
      if (!Number.isFinite(input.baseline_co2e_monthly) || input.baseline_co2e_monthly <= 0) {
        throw new Error("Log activity in this category before setting a reduction goal.");
      }

      const goal: Goal = {
        id: crypto.randomUUID(),
        user_id: user.id,
        category: parsed.data.category,
        target_co2e_reduction_pct: parsed.data.target_co2e_reduction_pct,
        target_date: parsed.data.target_date,
        baseline_co2e_monthly: input.baseline_co2e_monthly,
        baseline_month_start: input.baseline_month_start,
        achieved: false,
        created_at: new Date().toISOString(),
      };
      if (user.id === "demo-user") return addLocalGoal(goal);
      return saveRecord<Goal>(client, "goals", goal.id, goal);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["goals", user?.id] });
    },
  });
}

export function useMonthlyFootprint() {
  const client = useConvex();
  const { user } = useAuth();
  const startOfMonth = useMemo(() => getMonthStartIso(), []);

  return useQuery({
    queryKey: ["monthly_footprint", user?.id, startOfMonth],
    queryFn: async () => {
      if (!user?.id) return { total: 0, byCategory: {} as Record<string, number> };
      const logs = user.id === "demo-user"
        ? getLocalLogs(user.id)
        : await listRecords<ActivityLog>(client, "activity_logs");
      const rows = logs
        .filter((log) => log.logged_at >= startOfMonth)
        .map((log) => ({
          calculated_co2e_monthly: log.calculated_co2e_monthly,
          category: log.category,
        }));

      let total = 0;
      const byCategory: Record<string, number> = {};
      for (const row of rows) {
        const kg = row.calculated_co2e_monthly ?? 0;
        const category = row.category ?? "Other";
        total += kg;
        byCategory[category] = (byCategory[category] ?? 0) + kg;
      }
      return { total, byCategory };
    },
    enabled: !!user?.id,
  });
}
