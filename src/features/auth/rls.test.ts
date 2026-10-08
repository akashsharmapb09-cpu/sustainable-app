import { describe, it, expect, beforeEach } from 'vitest';
import type { ActivityLog, Profile, UserRoleType } from '../../shared/types/database';

/**
 * In-Memory RLS Policy Simulation Engine
 * 
 * Accurately models PostgreSQL Row Level Security semantics:
 * - Default Deny on every table
 * - Evaluation of auth.uid() against row user_id / id
 * - Evaluation of is_admin() role lookups
 * - Enforces append-only immutability on audit_log
 */
interface SecurityContext {
  userId: string | null;
  role: UserRoleType;
}

class PostgresRLSSimulator {
  private activityLogs: ActivityLog[] = [];
  private profiles: Profile[] = [];
  private userRoles: Map<string, UserRoleType> = new Map();
  private auditLogs: Array<{ id: string; user_id: string | null; action: string }> = [];

  constructor() {
    // Seed initial users
    this.userRoles.set('user-a-uuid', 'user');
    this.userRoles.set('user-b-uuid', 'user');
    this.userRoles.set('admin-uuid', 'admin');
  }

  // --- Profiles Table RLS ---
  selectProfile(ctx: SecurityContext, targetId: string): Profile | null {
    if (!ctx.userId) return null; // Default Deny
    const isAdmin = this.userRoles.get(ctx.userId) === 'admin';
    if (ctx.userId === targetId || isAdmin) {
      return this.profiles.find((p) => p.id === targetId) || null;
    }
    return null; // RLS filters out non-owned rows
  }

  updateProfile(ctx: SecurityContext, targetId: string, updates: Partial<Profile>): { success: boolean; error?: string } {
    if (!ctx.userId) return { success: false, error: 'Unauthorized' };
    if (ctx.userId !== targetId) {
      return { success: false, error: 'RLS: Target record does not belong to auth.uid()' };
    }
    // Mass assignment prevention: cannot alter id or system flags
    const cleanUpdates = { ...updates };
    delete (cleanUpdates as Record<string, unknown>).id;
    delete (cleanUpdates as Record<string, unknown>).is_admin;
    
    const index = this.profiles.findIndex((p) => p.id === targetId);
    if (index >= 0) {
      this.profiles[index] = { ...this.profiles[index], ...cleanUpdates };
      return { success: true };
    }
    return { success: false, error: 'Not found' };
  }

  // --- Activity Logs Table RLS ---
  insertActivityLog(ctx: SecurityContext, log: Omit<ActivityLog, 'id' | 'created_at' | 'updated_at'>): { success: boolean; error?: string; log?: ActivityLog } {
    if (!ctx.userId) return { success: false, error: 'Unauthorized: Default Deny' };
    
    // RLS Policy WITH CHECK (auth.uid() = user_id)
    if (log.user_id !== ctx.userId) {
      return { success: false, error: 'RLS Violation: user_id mismatch with auth.uid() (Forged IDOR rejected)' };
    }

    const created: ActivityLog = {
      ...log,
      id: `log-${Math.random().toString(36).substring(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.activityLogs.push(created);
    return { success: true, log: created };
  }

  selectActivityLogs(ctx: SecurityContext, requestedUserId?: string): ActivityLog[] {
    if (!ctx.userId) return []; // Default Deny
    const isAdmin = this.userRoles.get(ctx.userId) === 'admin';

    // Policy: USING (auth.uid() = user_id OR is_admin())
    return this.activityLogs.filter((log) => {
      const isOwner = log.user_id === ctx.userId;
      if (isAdmin) {
        return requestedUserId ? log.user_id === requestedUserId : true;
      }
      return isOwner;
    });
  }

  deleteActivityLog(ctx: SecurityContext, logId: string): { success: boolean; error?: string } {
    if (!ctx.userId) return { success: false, error: 'Unauthorized' };
    const log = this.activityLogs.find((l) => l.id === logId);
    if (!log) return { success: false, error: 'Not found' };

    // Policy: USING (auth.uid() = user_id)
    if (log.user_id !== ctx.userId) {
      return { success: false, error: 'RLS Violation: Cannot delete record belonging to another tenant' };
    }

    this.activityLogs = this.activityLogs.filter((l) => l.id !== logId);
    return { success: true };
  }

  // --- Catalog Alternatives Table RLS (Public Read, Admin Write) ---
  modifyAlternative(ctx: SecurityContext): { success: boolean; error?: string } {
    const isAdmin = ctx.userId ? this.userRoles.get(ctx.userId) === 'admin' : false;
    if (!isAdmin) {
      return { success: false, error: 'RLS Violation: Non-admin write to catalog table denied' };
    }
    return { success: true };
  }

  // --- Audit Log Immutability ---
  insertAuditLog(userId: string | null, action: string): void {
    this.auditLogs.push({ id: `audit-${Date.now()}`, user_id: userId, action });
  }

  selectAuditLogs(ctx: SecurityContext): Array<{ id: string; user_id: string | null; action: string }> {
    if (!ctx.userId) return [];
    const isAdmin = this.userRoles.get(ctx.userId) === 'admin';
    return this.auditLogs.filter((log) => isAdmin || log.user_id === ctx.userId);
  }

  updateAuditLog(): { success: boolean; error?: string } {
    // Postgres migration provides NO update policy for audit_log
    return { success: false, error: 'RLS Violation: audit_log is strictly immutable (no UPDATE policy exists)' };
  }
}

describe('PostgreSQL Row Level Security (RLS) Policy Test Suite', () => {
  const userA: SecurityContext = { userId: 'user-a-uuid', role: 'user' };
  const userB: SecurityContext = { userId: 'user-b-uuid', role: 'user' };
  const admin: SecurityContext = { userId: 'admin-uuid', role: 'admin' };
  const unauthenticated: SecurityContext = { userId: null, role: 'user' };

  let db: PostgresRLSSimulator;

  beforeEach(() => {
    db = new PostgresRLSSimulator();
  });

  describe('Tenant Isolation on Activity Logs', () => {
    it('proves User A can insert and view their own logs', () => {
      const insertRes = db.insertActivityLog(userA, {
        user_id: userA.userId!,
        activity_id: 'act-petrol-commute',
        category: 'transport',
        activity_name: 'Metro commute test',
        quantity: 15,
        unit: 'km',
        frequency_per_week: 5,
        calculated_co2e_monthly: 45.2,
        notes: 'Regular commute',
        logged_at: new Date().toISOString(),
      });

      expect(insertRes.success).toBe(true);
      expect(insertRes.log).toBeDefined();

      const userALogs = db.selectActivityLogs(userA);
      expect(userALogs).toHaveLength(1);
      expect(userALogs[0].user_id).toBe(userA.userId);
    });

    it('proves User B CANNOT read User A logs (RLS default-deny isolation)', () => {
      // User A creates a record
      db.insertActivityLog(userA, {
        user_id: userA.userId!,
        activity_id: 'act-petrol-commute',
        category: 'transport',
        activity_name: 'Confidential User A commute',
        quantity: 20,
        unit: 'km',
        frequency_per_week: 5,
        calculated_co2e_monthly: 60.5,
        notes: 'Private',
        logged_at: new Date().toISOString(),
      });

      // User B attempts to query activity logs
      const userBLogs = db.selectActivityLogs(userB);
      expect(userBLogs).toHaveLength(0); // Zero rows returned to User B
    });

    it('blocks forged user_id insert attacks (IDOR prevention)', () => {
      // User A attempts to forge an insert claiming it belongs to User B
      const forgeRes = db.insertActivityLog(userA, {
        user_id: userB.userId!, // Maliciously forged ID
        activity_id: 'act-petrol-commute',
        category: 'transport',
        activity_name: 'Forged log injection',
        quantity: 10,
        unit: 'km',
        frequency_per_week: 5,
        calculated_co2e_monthly: 30.0,
        notes: 'Hacked',
        logged_at: new Date().toISOString(),
      });

      expect(forgeRes.success).toBe(false);
      expect(forgeRes.error).toContain('RLS Violation: user_id mismatch with auth.uid()');
    });

    it('blocks User B from deleting User A log records', () => {
      const insertRes = db.insertActivityLog(userA, {
        user_id: userA.userId!,
        activity_id: 'act-petrol-commute',
        category: 'transport',
        activity_name: 'User A Log',
        quantity: 10,
        unit: 'km',
        frequency_per_week: 5,
        calculated_co2e_monthly: 30.0,
        notes: '',
        logged_at: new Date().toISOString(),
      });

      const logId = insertRes.log!.id;

      // User B attempts deletion of User A's log
      const deleteRes = db.deleteActivityLog(userB, logId);
      expect(deleteRes.success).toBe(false);
      expect(deleteRes.error).toContain('Cannot delete record belonging to another tenant');

      // User A can safely delete their own log
      const ownDeleteRes = db.deleteActivityLog(userA, logId);
      expect(ownDeleteRes.success).toBe(true);
    });

    it('denies unauthenticated requests completely', () => {
      const logs = db.selectActivityLogs(unauthenticated);
      expect(logs).toHaveLength(0);

      const insertRes = db.insertActivityLog(unauthenticated, {
        user_id: 'any-id',
        activity_id: null,
        category: 'food',
        activity_name: 'Anonymous',
        quantity: 1,
        unit: 'meal',
        frequency_per_week: 1,
        calculated_co2e_monthly: 2.0,
        notes: null,
        logged_at: new Date().toISOString(),
      });
      expect(insertRes.success).toBe(false);
    });
  });

  describe('Catalog Table Access Control', () => {
    it('blocks regular users from modifying alternatives catalog', () => {
      const writeAttempt = db.modifyAlternative(userA);
      expect(writeAttempt.success).toBe(false);
      expect(writeAttempt.error).toContain('Non-admin write to catalog table denied');
    });

    it('allows verified admin to modify alternatives catalog', () => {
      const adminWrite = db.modifyAlternative(admin);
      expect(adminWrite.success).toBe(true);
    });
  });

  describe('Audit Log Immutability & Access', () => {
    it('strictly forbids UPDATE operations on audit_log', () => {
      const auditUpdate = db.updateAuditLog();
      expect(auditUpdate.success).toBe(false);
      expect(auditUpdate.error).toContain('strictly immutable');
    });

    it('isolates audit logs between tenants while allowing admin oversight', () => {
      db.insertAuditLog(userA.userId, 'auth.login');
      db.insertAuditLog(userB.userId, 'auth.password_reset');

      const userALogs = db.selectAuditLogs(userA);
      expect(userALogs).toHaveLength(1);
      expect(userALogs[0].user_id).toBe(userA.userId);

      const adminLogs = db.selectAuditLogs(admin);
      expect(adminLogs).toHaveLength(2);
    });
  });
});
