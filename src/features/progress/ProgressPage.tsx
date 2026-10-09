import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../../shared/ui';
import { MetricSkeleton } from '../../shared/ui/Skeleton';
import {
  useActivityLogs,
  useAlternatives,
  useChallenges,
  useCreateGoal,
  useGoals,
  useMonthlyFootprint,
  useSetUserChallengeStatus,
  useUserActions,
  useUserBadges,
  useUserChallenges,
} from '../../shared/lib/hooks/useData';
import { useToast } from '../../shared/ui';
import { Input, Select } from '../../shared/ui/Input';
import type { ActivityCategory } from '../../shared/types/database';
import { goalProgress } from './goalTracking';

export function ProgressPage() {
  const { toast } = useToast();
  const [goalCategory, setGoalCategory] = useState<ActivityCategory | 'all'>('all');
  const [goalReduction, setGoalReduction] = useState(20);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [goalDate, setGoalDate] = useState(() => {
    const target = new Date();
    target.setDate(target.getDate() + 30);
    return target.toISOString().slice(0, 10);
  });
  const [monthStart] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  });
  const { data: footprint, isLoading: footprintLoading, isError: footprintError, refetch: refetchFootprint } = useMonthlyFootprint();
  const { data: logs, isLoading: logsLoading, isError: logsError, refetch: refetchLogs } = useActivityLogs();
  const { data: actions, isLoading: actionsLoading, isError: actionsError, refetch: refetchActions } = useUserActions();
  const { data: alternatives, isLoading: alternativesLoading } = useAlternatives();
  const { data: challenges, isLoading: challengesLoading, isError: challengesError, refetch: refetchChallenges } = useChallenges();
  const { data: userChallenges, isLoading: userChallengesLoading, isError: userChallengesError, refetch: refetchUserChallenges } = useUserChallenges();
  const setChallengeStatus = useSetUserChallengeStatus();
  const { data: goals, isLoading: goalsLoading, isError: goalsError, refetch: refetchGoals } = useGoals();
  const { data: userBadges, isLoading: userBadgesLoading, isError: userBadgesError, refetch: refetchUserBadges } = useUserBadges();
  const createGoal = useCreateGoal();
  const adopted = actions?.filter((a) => a.status === 'adopted') ?? [];
  const monthLogs = logs?.filter((log) => log.logged_at >= monthStart) ?? [];
  const loading = footprintLoading || logsLoading || actionsLoading || alternativesLoading || challengesLoading || userChallengesLoading || goalsLoading || userBadgesLoading;
  const unresolved = footprintError || logsError || actionsError || challengesError || userChallengesError || goalsError || userBadgesError;
  const goalBaseline = goalCategory === 'all' ? footprint?.total ?? 0 : footprint?.byCategory[goalCategory] ?? 0;
  const baselineMonthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(monthStart));

  const updateChallenge = async (challengeId: string, status: 'active' | 'completed' | 'abandoned') => {
    try {
      await setChallengeStatus.mutateAsync({ challenge_id: challengeId, status });
      toast({
        title: status === 'active' ? 'Challenge started' : status === 'completed' ? 'Challenge completed' : 'Challenge left',
        description: 'Your self-reported challenge status was saved.',
        type: 'success',
      });
    } catch (error) {
      toast({
        title: 'Could not update challenge',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  const saveGoal = async () => {
    if (goalBaseline <= 0) {
      toast({
        title: 'Log an activity first',
        description: 'A reduction goal needs a real monthly footprint as its baseline.',
        type: 'warning',
      });
      return;
    }
    try {
      await createGoal.mutateAsync({
        category: goalCategory,
        target_co2e_reduction_pct: goalReduction,
        target_date: goalDate,
        baseline_co2e_monthly: Number(goalBaseline.toFixed(2)),
        baseline_month_start: monthStart.slice(0, 10),
      });
      toast({ title: 'Reduction goal saved', description: `Baseline set from ${baselineMonthLabel}.`, type: 'success' });
    } catch (error) {
      toast({
        title: 'Could not save goal',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-12 space-y-6">
      <div>
        <p className="taxonomy-label mb-1">SEC.04 // PROGRESS</p>
        <h1 className="font-serif text-3xl font-semibold">What changed this month</h1>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <Card taxonomyCode="FOOTPRINT">
              <p className="font-mono text-2xl font-bold">{footprintError ? '—' : (footprint?.total ?? 0).toFixed(1)}</p>
              <p className="text-xs text-ink-muted">kg CO2e logged</p>
            </Card>
            <Card taxonomyCode="REDUCTION GOALS">
              <p className="mb-4 text-sm text-ink-muted">
                Set a measurable reduction target using your actual footprint for {baselineMonthLabel}. Progress compares the current month's logged estimate with this saved baseline.
              </p>
              {goalsError ? (
                <p className="text-sm text-burnt">Goals could not be loaded. Use the retry controls above.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Select
                    label="Footprint category"
                    value={goalCategory}
                    onChange={(event) => setGoalCategory(event.target.value as ActivityCategory | 'all')}
                    options={[
                      { value: 'all', label: 'All categories' },
                      { value: 'transport', label: 'Transport' },
                      { value: 'food', label: 'Food' },
                      { value: 'energy', label: 'Energy' },
                      { value: 'shopping', label: 'Shopping' },
                      { value: 'waste', label: 'Waste' },
                      { value: 'travel', label: 'Travel' },
                    ]}
                  />
                  <Input
                    label="Reduction target (%)"
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    value={goalReduction}
                    onChange={(event) => setGoalReduction(Number(event.target.value))}
                  />
                  <Input
                    label="Target date"
                    type="date"
                    min={today}
                    value={goalDate}
                    onChange={(event) => setGoalDate(event.target.value)}
                  />
                  <div className="flex flex-col justify-end gap-2">
                    <p className="text-xs text-ink-muted">
                      Baseline: {goalBaseline.toFixed(1)} kg CO2e/mo
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => void saveGoal()}
                      isLoading={createGoal.isPending}
                      disabled={goalBaseline <= 0}
                    >
                      Save goal
                    </Button>
                  </div>
                </div>
              )}
              {!goalsError && !goalsLoading && (!goals || goals.length === 0) && (
                <p className="mt-5 text-sm text-ink-muted">
                  No goals yet. Log an activity to establish a baseline, then set a reduction target.
                </p>
              )}
              {!goalsError && !!goals?.length && (
                <ul className="mt-6 space-y-4">
                  {goals.map((goal) => {
                    const currentKg = goal.category === 'all' ? footprint?.total ?? 0 : footprint?.byCategory[goal.category] ?? 0;
                    const progress = goalProgress(goal, currentKg);
                    return (
                      <li key={goal.id} className="border-t border-border pt-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-serif font-semibold">
                            {goal.target_co2e_reduction_pct}% {goal.category === 'all' ? 'overall' : goal.category} reduction
                          </h3>
                          <span className="font-mono text-xs text-ink-muted">Target {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(`${goal.target_date}T00:00:00`))}</span>
                        </div>
                        {progress === null ? (
                          <p className="mt-2 text-xs text-ink-muted">A measured baseline is not available for this goal.</p>
                        ) : (
                          <>
                            <div
                              className="mt-3 h-2 overflow-hidden rounded bg-surface-muted"
                              role="progressbar"
                              aria-label={`${goal.category} reduction goal progress`}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={Math.round(progress)}
                            >
                              <div className="h-full bg-moss transition-[width]" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="mt-2 text-xs text-ink-muted">
                              {progress >= 100 ? 'Target met for the current month.' : `${Math.round(progress)}% of target`}.
                              Baseline {goal.baseline_co2e_monthly?.toFixed(1)} kg/mo; current {currentKg.toFixed(1)} kg/mo.
                            </p>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
            <Card taxonomyCode="SWAPS">
              <p className="font-mono text-2xl font-bold">{actionsError ? '—' : adopted.length}</p>
              <p className="text-xs text-ink-muted">adopted alternatives</p>
            </Card>
            <Card taxonomyCode="RECORDS">
              <p className="font-mono text-2xl font-bold">{logsError ? '—' : monthLogs.length}</p>
              <p className="text-xs text-ink-muted">activity logs</p>
            </Card>
          </>
        )}
      </div>
      {unresolved && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-burnt" role="alert">
          <span>Some progress data could not be loaded.</span>
          {footprintError && <Button variant="ghost" size="sm" onClick={() => void refetchFootprint()}>Retry footprint</Button>}
          {logsError && <Button variant="ghost" size="sm" onClick={() => void refetchLogs()}>Retry activity logs</Button>}
          {actionsError && <Button variant="ghost" size="sm" onClick={() => void refetchActions()}>Retry adoption history</Button>}
          {challengesError && <Button variant="ghost" size="sm" onClick={() => void refetchChallenges()}>Retry challenge catalog</Button>}
          {userChallengesError && <Button variant="ghost" size="sm" onClick={() => void refetchUserChallenges()}>Retry challenge history</Button>}
          {goalsError && <Button variant="ghost" size="sm" onClick={() => void refetchGoals()}>Retry goals</Button>}
          {userBadgesError && <Button variant="ghost" size="sm" onClick={() => void refetchUserBadges()}>Retry badges</Button>}
        </div>
      )}
      {!loading && !unresolved && (
        <Card taxonomyCode="ACTIVITY BREAKDOWN">
          {Object.keys(footprint?.byCategory ?? {}).length === 0 ? (
            <p className="text-sm text-ink-muted">
              No activity logged this month yet. <Link to="/log" className="underline">Record an activity</Link> to start tracking.
            </p>
          ) : (
            <ul className="space-y-3">
              {Object.entries(footprint?.byCategory ?? {})
                .sort((a, b) => b[1] - a[1])
                .map(([category, kg]) => (
                  <li key={category} className="flex items-center justify-between gap-4 text-sm">
                    <span className="capitalize">{category}</span>
                    <span className="font-mono">{kg.toFixed(1)} kg CO2e/mo</span>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      )}
      <Card taxonomyCode="ADOPTED">
        {loading || unresolved ? (
          <p className="text-sm text-ink-muted">Adoption history is unavailable.</p>
        ) : adopted.length === 0 ? (
          <p className="text-sm text-ink-muted">No adopted swaps yet. Rank recommendations and mark one as adopted.</p>
        ) : (
          <ul className="space-y-2">
            {adopted.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span>{alternatives?.find((alternative) => alternative.id === item.alternative_id)?.title ?? item.alternative_id}</span>
                <Badge variant="moss" size="sm">{item.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card taxonomyCode="BADGES EARNED">
        {userBadgesError ? (
          <p className="text-sm text-burnt">Badges could not be loaded. Use the retry control above.</p>
        ) : !userBadges?.length ? (
          <p className="text-sm text-ink-muted">Complete a challenge to earn its badge. Awards are based on self-reported completion.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {userBadges.map((award) => (
              <li key={award.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif font-semibold">{award.badges?.name ?? award.badge_key}</span>
                  <Badge variant="moss" size="sm">earned</Badge>
                </div>
                {award.badges?.description && <p className="mt-1 text-sm text-ink-muted">{award.badges.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
      {!loading && !logsError && monthLogs.length > 0 && (
        <Card taxonomyCode="RECENT ACTIVITY">
          <ul className="divide-y divide-border">
            {monthLogs.slice(0, 5).map((log) => (
              <li key={log.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{log.activity_name}</p>
                  <p className="text-xs text-ink-muted">
                    {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(log.logged_at))}
                  </p>
                </div>
                <p className="font-mono text-xs">{log.calculated_co2e_monthly.toFixed(1)} kg CO2e/mo</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card taxonomyCode="FIELD CHALLENGES">
        <p className="mb-4 text-sm text-ink-muted">
          Choose a practical habit challenge and track completion at your own pace. Progress is self-reported and is not independently verified.
        </p>
        {challengesError || userChallengesError ? (
          <p className="text-sm text-burnt">Challenges are unavailable until the challenge data can be loaded. Use the retry controls above.</p>
        ) : loading ? (
          <p className="text-sm text-ink-muted" role="status">Loading challenges…</p>
        ) : !challenges?.length ? (
          <p className="text-sm text-ink-muted">No challenges are available right now.</p>
        ) : (
          <ul className="space-y-3">
            {challenges.map((challenge) => {
              const userChallenge = userChallenges?.find((item) => item.challenge_id === challenge.id);
              const status = userChallenge?.status;
              return (
                <li key={challenge.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif font-semibold">{challenge.title}</h3>
                        {status && <Badge variant={status === 'completed' ? 'moss' : status === 'active' ? 'clay' : 'outline'}>{status.replace('_', ' ')}</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">{challenge.description}</p>
                      <p className="mt-2 font-mono text-xs text-ink-muted">
                        {challenge.duration_days} days · {challenge.category} · up to {challenge.co2e_impact_potential_kg.toFixed(1)} kg CO2e potential
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!status || status === 'abandoned' ? (
                        <Button size="sm" variant="primary" disabled={setChallengeStatus.isPending} onClick={() => void updateChallenge(challenge.id, 'active')}>
                          Start
                        </Button>
                      ) : status === 'active' ? (
                        <>
                          <Button size="sm" variant="primary" disabled={setChallengeStatus.isPending} onClick={() => void updateChallenge(challenge.id, 'completed')}>
                            Mark complete
                          </Button>
                          <Button size="sm" variant="ghost" disabled={setChallengeStatus.isPending} onClick={() => void updateChallenge(challenge.id, 'abandoned')}>
                            Leave
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" disabled={setChallengeStatus.isPending} onClick={() => void updateChallenge(challenge.id, 'active')}>
                          Restart
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
