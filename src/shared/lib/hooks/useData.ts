/**
 * TanStack Query hooks for GreenSwap data layer.
 * All queries use typed Supabase client; RLS enforced server-side.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuth } from '../../../features/auth/context/authContextDef';
import type { ActivityCategory, Database } from '../../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
type Alternative = Database['public']['Tables']['alternatives']['Row'];
type UserAction = Database['public']['Tables']['user_actions']['Row'];
type UserActionStatus = UserAction['status'];
type Badge = Database['public']['Tables']['badges']['Row'];
type UserBadge = Database['public']['Tables']['user_badges']['Row'];
type Challenge = Database['public']['Tables']['challenges']['Row'];

// ── Profile ──────────────────────────────────────────────────────────────────

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', user?.id] }),
  });
}

// ── Activity Logs ─────────────────────────────────────────────────────────────

export function useActivityLogs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['activity_logs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*, activities(*)')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });
      if (error) throw error;
      return data as (ActivityLog & { activities: Database['public']['Tables']['activities']['Row'] | null })[];
    },
    enabled: !!user?.id,
  });
}

export function useCreateActivityLog() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Database['public']['Tables']['activity_logs']['Insert']) => {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert({ ...input, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data as ActivityLog;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activity_logs', user?.id] }),
  });
}

export function useDeleteActivityLog() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activity_logs', user?.id] }),
  });
}

// ── Alternatives ──────────────────────────────────────────────────────────────

export function useAlternatives(category?: ActivityCategory) {
  return useQuery({
    queryKey: ['alternatives', category],
    queryFn: async () => {
      let q = supabase
        .from('alternatives')
        .select('*')
        .eq('is_active', true)
        .order('title');
      if (category) q = q.eq('category', category);
      const { data, error } = await q;
      if (error) throw error;
      return data as Alternative[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ── User Actions (adopted/dismissed) ─────────────────────────────────────────

export function useUserActions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user_actions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as UserAction[];
    },
    enabled: !!user?.id,
  });
}

export function useUpsertUserAction() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      alternative_id: string;
      status: UserActionStatus;
    }) => {
      const { data, error } = await supabase
        .from('user_actions')
        .upsert(
          {
            user_id: user!.id,
            alternative_id: input.alternative_id,
            status: input.status,
            adopted_at: input.status === 'adopted' ? new Date().toISOString() : null,
          },
          { onConflict: 'user_id,alternative_id' }
        )
        .select()
        .single();
      if (error) throw error;
      return data as UserAction;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user_actions', user?.id] });
      qc.invalidateQueries({ queryKey: ['recommendations', user?.id] });
    },
  });
}

// ── Badges ────────────────────────────────────────────────────────────────────

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const { data, error } = await supabase.from('badges').select('*').order('name');
      if (error) throw error;
      return data as Badge[];
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useUserBadges() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user_badges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false });
      if (error) throw error;
      return data as (UserBadge & { badges: Badge | null })[];
    },
    enabled: !!user?.id,
  });
}

// ── Challenges ────────────────────────────────────────────────────────────────

export function useChallenges() {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('title');
      if (error) throw error;
      return data as Challenge[];
    },
    staleTime: 60 * 60 * 1000,
  });
}

// ── Computed: Monthly CO2e footprint ──────────────────────────────────────────

export function useMonthlyFootprint() {
  const { user } = useAuth();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  return useQuery({
    queryKey: ['monthly_footprint', user?.id, startOfMonth],
    queryFn: async () => {
      if (!user?.id) return { total: 0, byCategory: {} as Record<string, number> };
      const { data, error } = await supabase
        .from('activity_logs')
        .select('calculated_co2e_monthly, activities(category)')
        .eq('user_id', user.id)
        .gte('logged_at', startOfMonth);
      if (error) throw error;

      let total = 0;
      const byCategory: Record<string, number> = {};

      for (const row of data ?? []) {
        const kg = row.calculated_co2e_monthly ?? 0;
        // Type narrowing for nested join
        const cat =
          row.activities && typeof row.activities === 'object' && 'category' in row.activities
            ? (row.activities as { category: string }).category
            : 'Other';
        total += kg;
        byCategory[cat] = (byCategory[cat] ?? 0) + kg;
      }

      return { total, byCategory };
    },
    enabled: !!user?.id,
  });
}
