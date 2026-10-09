import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addLocalGoal, awardLocalChallengeBadge, clearLocalUserData, getLocalBadges, getLocalChallenges, getLocalGoals, upsertLocalChallenge } from './localStore';
import type { Goal } from '../types/database';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, String(value));
  }
}

describe('local challenge store', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MemoryStorage());
  });

  it('persists challenge status transitions and preserves the start date', () => {
    const started = upsertLocalChallenge('demo-user', 'chal-transit-sprint', 'active');
    const completed = upsertLocalChallenge('demo-user', 'chal-transit-sprint', 'completed');

    expect(completed.started_at).toBe(started.started_at);
    expect(completed.status).toBe('completed');
    expect(completed.completed_at).not.toBeNull();
    expect(getLocalChallenges('demo-user')).toEqual([completed]);
  });

  it('clears challenge history with the rest of a deleted demo account', () => {
    upsertLocalChallenge('demo-user', 'chal-transit-sprint', 'active');

    clearLocalUserData('demo-user');

    expect(getLocalChallenges('demo-user')).toEqual([]);
  });

  it('persists demo goals and removes them during account data cleanup', () => {
    const goal: Goal = {
      id: 'goal-1',
      user_id: 'demo-user',
      category: 'all',
      target_co2e_reduction_pct: 20,
      target_date: '2026-12-31',
      baseline_co2e_monthly: 100,
      baseline_month_start: '2026-10-01',
      achieved: false,
      created_at: '2026-10-08T00:00:00.000Z',
    };
    addLocalGoal(goal);
    expect(getLocalGoals('demo-user')).toEqual([goal]);

    clearLocalUserData('demo-user');

    expect(getLocalGoals('demo-user')).toEqual([]);
  });

  it('awards each challenge badge once and clears awards during account cleanup', () => {
    const firstAward = awardLocalChallengeBadge('demo-user', 'badge-plant-power');
    const duplicateAward = awardLocalChallengeBadge('demo-user', 'badge-plant-power');

    expect(firstAward).not.toBeNull();
    expect(duplicateAward).toEqual(firstAward);
    expect(getLocalBadges('demo-user')).toEqual([firstAward]);

    clearLocalUserData('demo-user');

    expect(getLocalBadges('demo-user')).toEqual([]);
  });
});
