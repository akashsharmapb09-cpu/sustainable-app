import { useState } from 'react';
import { CalendarDays, Download, Leaf, Plus, ShoppingBag, TrainFront, Trophy, Utensils } from 'lucide-react';
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
import { parseCO2ToKg } from '../../shared/lib/co2';
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
  const chartCategories = [
    { key: 'transport' as const, label: 'Transit', color: '#1A3C2A', Icon: TrainFront },
    { key: 'food' as const, label: 'Food', color: '#8AB686', Icon: Utensils },
    { key: 'shopping' as const, label: 'Shopping', color: '#D3A66A', Icon: ShoppingBag },
  ];
  const chartTotal = chartCategories.reduce((sum, category) => sum + (footprint?.byCategory[category.key] ?? 0), 0);
  let chartCursor = 0;
  const chartGradient = chartTotal > 0
    ? chartCategories.map((category) => {
        const start = chartCursor;
        chartCursor += ((footprint?.byCategory[category.key] ?? 0) / chartTotal) * 100;
        return category.color + ' ' + start + '% ' + chartCursor + '%';
      }).join(', ')
    : '#E6EDE3 0% 100%';
  const donutLabel = chartTotal > 0
    ? Math.round((chartTotal / Math.max(footprint?.total ?? chartTotal, 0.1)) * 100) + '%'
    : '0%';

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
    <div className="progress-premium-root mx-auto max-w-5xl px-6 py-10 md:px-12 space-y-6">
      <div className="progress-page-header">
        <div className="progress-page-heading-copy">
          <p className="taxonomy-label mb-1">YOUR IMPACT / 04</p>
          <h1 className="font-serif text-3xl font-semibold">What changed this month</h1>
          <p className="progress-page-subtitle">A thoughtful look at your footprint, habits, and next small step.</p>
        </div>
        <div className="progress-page-actions">
          <label className="progress-date-filter"><CalendarDays size={16} aria-hidden="true" /><select aria-label="Date filter" defaultValue="Oct 2024"><option value="Oct 2024">Oct 2024</option></select></label>
          <button type="button" className="progress-export-btn" onClick={() => window.print()}><Download size={16} aria-hidden="true" /> Export PDF</button>
          <Link to="/log" className="progress-log-cta"><Plus size={17} aria-hidden="true" /> Log your first activity</Link>
        </div>
      </div>
      <section className="progress-kpi-grid" aria-label="Key impact metrics">
        {loading ? <><MetricSkeleton /><MetricSkeleton /><MetricSkeleton /></> : (
          <>
            <article className="progress-kpi-tile progress-kpi-footprint">
              <div className="progress-kpi-heading"><span className="progress-kpi-icon"><Leaf size={20} /></span><span>Footprint</span></div>
              <p className="progress-kpi-number">{footprintError ? '—' : (footprint?.total ?? 0).toFixed(1)}</p>
              <p className="progress-kpi-caption">kg CO₂e logged</p><span className="progress-kpi-note">Current measured footprint</span>
            </article>
            <article className="progress-kpi-tile progress-kpi-goals">
              <div className="progress-kpi-heading"><span className="progress-kpi-icon"><Trophy size={20} /></span><span>Reduction goals</span></div>
              <p className="progress-kpi-number">{goalsError ? '—' : (goals?.length ?? 0) + '/3'}</p>
              <p className="progress-kpi-caption">goals in progress</p><span className="progress-kpi-note">Build a measurable next step</span>
            </article>
            <article className="progress-kpi-tile progress-kpi-adopted">
              <div className="progress-kpi-heading"><span className="progress-kpi-icon"><ShoppingBag size={20} /></span><span>Adopted alternatives</span></div>
              <p className="progress-kpi-number">{actionsError ? '—' : adopted.length}</p>
              <p className="progress-kpi-caption">swaps adopted</p><span className="progress-kpi-note">Small choices add up</span>
            </article>
          </>
        )}
      </section>
      <section className="progress-goal-builder" aria-label="Reduction goal settings">
            <Card taxonomyCode="SET A REDUCTION GOAL">
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
                          <h2 className="font-serif font-semibold text-base">
                            {goal.target_co2e_reduction_pct}% {goal.category === 'all' ? 'overall' : goal.category} reduction
                          </h2>
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
      </section>
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
        <section className="progress-panel progress-breakdown-panel">
          <Card taxonomyCode="ACTIVITY BREAKDOWN">
            <div className="progress-breakdown-layout">
              <div className="progress-donut" style={{ background: 'conic-gradient(' + chartGradient + ')' }} role="img" aria-label={donutLabel + ' of activity impact represented across Transit, Food, and Shopping'}>
                <div className="progress-donut-center"><strong>{donutLabel}</strong><span>tracked mix</span></div>
              </div>
              <div className="progress-breakdown-legend">
                {chartCategories.map(({ key, label, color, Icon }) => {
                  const value = footprint?.byCategory[key] ?? 0;
                  return <div className="progress-legend-row" key={key}><span className="progress-legend-icon" style={{ background: color }}><Icon size={15} /></span><span className="progress-legend-label">{label}</span><strong>{value.toFixed(1)} kg</strong></div>;
                })}
              </div>
            </div>
            {Object.keys(footprint?.byCategory ?? {}).length === 0 ? (
              <p className="progress-empty-inline">No activity logged this month yet. <Link to="/log" className="underline">Record an activity</Link> to start tracking.</p>
            ) : (
              <ul className="progress-other-breakdown">
                {Object.entries(footprint?.byCategory ?? {}).sort((a, b) => b[1] - a[1]).map(([category, kg]) => (
                  <li key={category} className="flex items-center justify-between gap-4 text-sm"><span className="capitalize">{category}</span><span className="font-mono">{kg.toFixed(1)} kg CO2e/mo</span></li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      )}
      <section className="progress-panel progress-adopted-panel">
      <Card taxonomyCode="ADOPTED ALTERNATIVES">
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
      </section>
      <section className="progress-panel progress-badges-panel">
      <Card taxonomyCode="BADGES EARNED">
        {userBadgesError ? (
          <p className="text-sm text-burnt">Badges could not be loaded. Use the retry control above.</p>
        ) : !userBadges?.length ? (
          <div className="progress-badge-empty">
            <div className="progress-badge-art" aria-hidden="true"><Trophy size={30} /><span><Leaf size={17} /></span></div>
            <strong>Your first badge is waiting</strong>
            <p>Complete a field challenge to earn a badge. Awards are based on self-reported completion.</p>
          </div>
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
      </section>
      {!loading && !logsError && (
        <section className="progress-panel progress-logs-panel">
        <Card taxonomyCode="ACTIVITY LOGS">
          {monthLogs.length === 0 ? (
            <div className="progress-logs-empty"><p>No activity logs for this period yet.</p><Link to="/log" className="progress-logs-empty-link"><Plus size={15} /> Log your first activity</Link></div>
          ) : (
          <ul className="divide-y divide-border">
            {monthLogs.slice(0, 5).map((log) => (
              <li key={log.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{log.activity_name}</p>
                  <p className="text-xs text-ink-muted">
                    {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(log.logged_at))}
                  </p>
                </div>
                <p className="font-mono text-xs">{parseCO2ToKg(`${log.calculated_co2e_monthly ?? 0} kg`).toFixed(1)} kg CO2e/mo</p>
              </li>
            ))}
          </ul>
          )}
        </Card>
        </section>
      )}
      <section className="progress-panel progress-challenges-panel">
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
              const ChallengeIcon = challenge.category.toLowerCase().includes('transport') ? TrainFront : challenge.category.toLowerCase().includes('food') ? Utensils : Leaf;
              const statusProgress = status === 'completed' ? 100 : status === 'active' ? 50 : 0;
              return (
                <li key={challenge.id} className="progress-challenge-card">
                  <span className="progress-challenge-icon"><ChallengeIcon size={22} /></span>
                  <div className="progress-challenge-content">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif font-semibold text-base">{challenge.title}</h2>
                        {status && <Badge variant={status === 'completed' ? 'moss' : status === 'active' ? 'clay' : 'outline'}>{status.replace('_', ' ')}</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">{challenge.description}</p>
                      <p className="mt-2 font-mono text-xs text-ink-muted">
                        {challenge.duration_days} days · {challenge.category} · up to {parseCO2ToKg(`${challenge.co2e_impact_potential_kg ?? 0} kg`).toFixed(1)} kg CO2e potential
                      </p>
                      <div className="progress-challenge-bar" role="img" aria-label={challenge.title + ' status indicator'}><span style={{ width: statusProgress + '%' }} /></div>
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
      </section>
    </div>
  );
}
