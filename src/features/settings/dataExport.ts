import { getLocalActions, getLocalBadges, getLocalChallenges, getLocalGoals, getLocalLogs, getLocalProfile } from '../../shared/lib/localStore';
import { api } from '../../../convex/_generated/api';
import { convex } from '../../shared/lib/convex';
import type { Database, Profile, UserAction, ActivityLog } from '../../shared/types/database';

type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
type Recommendation = Database['public']['Tables']['recommendations']['Row'];
type Goal = Database['public']['Tables']['goals']['Row'];
type UserChallenge = Database['public']['Tables']['user_challenges']['Row'];
type UserBadge = Database['public']['Tables']['user_badges']['Row'];
type AuditLog = Database['public']['Tables']['audit_log']['Row'];
type Feedback = Database['public']['Tables']['feedback']['Row'];
type DataExportRequest = Database['public']['Tables']['data_export_requests']['Row'];

export interface UserDataExport {
  formatVersion: 1;
  exportedAt: string;
  account: {
    id: string;
    email: string | null;
    createdAt: string;
  };
  profile: Profile | null;
  preferences: UserPreferences[];
  activityLogs: ActivityLog[];
  recommendations: Recommendation[];
  actions: UserAction[];
  goals: Goal[];
  challenges: UserChallenge[];
  badges: UserBadge[];
  auditLog: AuditLog[];
  feedback: Feedback[];
  previousExportRequests: DataExportRequest[];
}

export async function createUserDataExport(user: { id: string; email: string | null; created_at: string }): Promise<UserDataExport> {
  if (user.id === 'demo-user') {
    return {
      formatVersion: 1,
      exportedAt: new Date().toISOString(),
      account: { id: user.id, email: user.email, createdAt: user.created_at },
      profile: getLocalProfile(user.id),
      preferences: [],
      activityLogs: getLocalLogs(user.id),
      recommendations: [],
      actions: getLocalActions(user.id),
      goals: getLocalGoals(user.id),
      challenges: getLocalChallenges(user.id),
      badges: getLocalBadges(user.id),
      auditLog: [],
      feedback: [],
      previousExportRequests: [],
    };
  }

  const records = await convex.query(api.data.exportMine, {});
  const preferences = (records.user_preferences ?? []) as UserPreferences[];
  const activityLogs = (records.activity_logs ?? []) as ActivityLog[];
  const recommendations = (records.recommendations ?? []) as Recommendation[];
  const actions = (records.user_actions ?? []) as UserAction[];
  const goals = (records.goals ?? []) as Goal[];
  const challenges = (records.user_challenges ?? []) as UserChallenge[];
  const badges = (records.user_badges ?? []) as UserBadge[];
  const auditLog = (records.audit_log ?? []) as AuditLog[];
  const feedback = (records.feedback ?? []) as Feedback[];
  const previousExportRequests = (records.data_export_requests ?? []) as DataExportRequest[];

  return {
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    account: { id: user.id, email: user.email, createdAt: user.created_at },
    profile: ((records.profiles ?? [])[0] as Profile | undefined) ?? null,
    preferences,
    activityLogs,
    recommendations,
    actions,
    goals,
    challenges,
    badges,
    auditLog,
    feedback,
    previousExportRequests,
  };
}
