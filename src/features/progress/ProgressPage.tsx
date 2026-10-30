import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BadgeCheck, Compass, Flame, Leaf, LockKeyhole, Recycle, RefreshCw, Sparkles, TrainFront, Zap } from 'lucide-react';
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

const BADGE_COLLECTION = [
  { key: 'badge-first-step', name: 'First Light', description: 'Logged your first lifestyle activity on GreenSwap.', requirement: 'Log any single activity', icon: Compass, tone: 'gold', category: 'First steps' },
  { key: 'badge-transit-commuter', name: 'Metro Pioneer', description: 'Made public transport or cycling part of your regular commute.', requirement: 'Adopt a metro, bus or cycling alternative', icon: TrainFront, tone: 'blue', category: 'Mobility' },
  { key: 'badge-watt-shaver', name: 'Kilowatt Tamer', description: 'Put practical household energy-saving actions into place.', requirement: 'Adopt two or more power-saving actions', icon: Zap, tone: 'amber', category: 'Energy' },
  { key: 'badge-plant-power', name: 'Field Forager', description: 'Chose more plant-rich meals with local pulses and millets.', requirement: 'Adopt a plant-rich diet alternative', icon: Leaf, tone: 'sage', category: 'Food' },
  { key: 'badge-zero-waste-scout', name: 'Compost Sentinel', description: 'Started composting or sorting household waste at the source.', requirement: 'Adopt composting or source waste segregation', icon: Recycle, tone: 'forest', category: 'Circular living' },
  { key: 'badge-circular-patron', name: 'Second-Life Patron', description: 'Gave products a longer life through thrift or refurbished choices.', requirement: 'Adopt thrift clothing or refurbished electronics', icon: RefreshCw, tone: 'plum', category: 'Second life' },
  { key: 'badge-half-ton-club', name: 'Half-Ton Club', description: 'Reached the 500 kg CO₂e projected annual-savings milestone.', requirement: 'Reach 500 kg CO₂e projected annual savings', icon: Award, tone: 'gold', category: 'Milestone' },
  { key: 'badge-30-day-streak', name: 'Steady Stride', description: 'Built a 30-day habit of recording sustainable actions.', requirement: 'Log activities across 30 distinct days', icon: Flame, tone: 'clay', category: 'Consistency' },
] as const;


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

  const badgeCards = [
    ...BADGE_COLLECTION.map((definition) => {
      const award = userBadges?.find((item) => item.badge_key === definition.key);
      return {
        ...definition,
        earned: Boolean(award),
        awardedAt: award?.awarded_at ?? null,
        displayName: award?.badges?.name ?? definition.name,
        displayDescription: award?.badges?.description ?? definition.description,
      };
    }),
    ...(userBadges ?? [])
      .filter((award) => !BADGE_COLLECTION.some((definition) => definition.key === award.badge_key))
      .map((award) => ({
        key: award.badge_key,
        name: award.badges?.name ?? award.badge_key,
        description: award.badges?.description ?? 'A GreenSwap milestone you have unlocked.',
        requirement: 'Achievement unlocked',
        icon: Award,
        tone: 'gold',
        category: 'Milestone',
        earned: true,
        awardedAt: award.awarded_at,
        displayName: award.badges?.name ?? award.badge_key,
        displayDescription: award.badges?.description ?? 'A GreenSwap milestone you have unlocked.',
      })),
  ];
  const earnedBadgeCount = userBadges?.length ?? 0;
  const badgeProgress = badgeCards.length > 0 ? Math.min(100, Math.round((earnedBadgeCount / badgeCards.length) * 100)) : 0;

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
      <section className="badge-showcase" aria-labelledby="badge-showcase-title">
        <style>{`
          .badge-showcase{overflow:hidden;border:1px solid #e2d9c9;border-radius:26px;background:linear-gradient(145deg,#fffdf8,#f4efe6);box-shadow:0 16px 38px rgba(49,57,43,.07),inset 0 1px 0 #fff}
          .badge-showcase-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:25px 28px 23px;border-bottom:1px solid #e8dfd1;background:radial-gradient(circle at 92% 0%,rgba(222,204,167,.28),transparent 34%),linear-gradient(110deg,rgba(255,255,255,.5),rgba(242,238,227,.68))}
          .badge-showcase-eyebrow{display:inline-flex;align-items:center;gap:8px;color:#718368;font:800 10px/1.2 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase}
          .badge-showcase-title{margin:9px 0 6px;color:#203a2a;font:700 clamp(25px,2.4vw,32px)/1.12 Georgia,serif;letter-spacing:-.035em}
          .badge-showcase-subtitle{max-width:590px;margin:0;color:#69766b;font-size:14px;line-height:1.65}
          .badge-progress-box{flex:0 0 208px;padding:13px 15px 12px;border:1px solid #fff;border-radius:17px;background:rgba(255,255,255,.65);box-shadow:0 6px 18px rgba(54,51,40,.05)}
          .badge-progress-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
          .badge-progress-top strong{color:#1e3c2a;font:700 24px/1 Georgia,serif}
          .badge-progress-top span{color:#7e8778;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
          .badge-progress-track{height:7px;margin-top:12px;overflow:hidden;border-radius:99px;background:#e6e5d9}
          .badge-progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#a8b98e,#315c3c);transition:width .35s ease}
          .badge-progress-foot{display:flex;justify-content:space-between;gap:8px;margin-top:7px;color:#858b7e;font-size:11px}
          .badge-collection-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px;padding:20px}
          .badge-collection-card{position:relative;display:flex;min-width:0;align-items:center;gap:15px;min-height:142px;overflow:hidden;padding:16px 17px;border:1px solid #e6dfd3;border-radius:19px;background:linear-gradient(135deg,#fffefa,#fbf8f1);box-shadow:0 4px 12px rgba(47,53,41,.035);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
          .badge-collection-card:after{content:"";position:absolute;width:110px;height:110px;right:-44px;bottom:-62px;border:1px solid rgba(113,129,101,.12);border-radius:50%;pointer-events:none}
          .badge-collection-card.is-earned{border-color:#d4ddca;background:linear-gradient(135deg,#fffefa,#f5f7ef)}
          .badge-collection-card.is-earned:hover{transform:translateY(-2px);border-color:#b7c9aa;box-shadow:0 10px 22px rgba(45,69,45,.09)}
          .badge-collection-card.is-locked{background:linear-gradient(135deg,#fbfaf6,#f2efe8)}
          .badge-medallion{position:relative;display:grid;flex:0 0 76px;width:76px;height:76px;place-items:center;border:1px solid var(--medal-border);border-radius:23px;color:var(--medal-ink);background:radial-gradient(circle at 32% 23%,#fff 0%,var(--medal-soft) 57%,var(--medal-deep) 100%);box-shadow:inset 0 2px 0 rgba(255,255,255,.88),0 7px 15px rgba(45,55,39,.08)}
          .badge-medallion:before{content:"";position:absolute;inset:6px;border:1px solid rgba(255,255,255,.75);border-radius:17px}
          .badge-medallion svg{position:relative;z-index:1;width:30px;height:30px;stroke-width:1.7}
          .badge-tone-gold{--medal-soft:#f7ecd0;--medal-deep:#e7d4a6;--medal-border:#e5d5ae;--medal-ink:#9b7130}
          .badge-tone-blue{--medal-soft:#e4eff2;--medal-deep:#c3d8dc;--medal-border:#cbdde0;--medal-ink:#527986}
          .badge-tone-amber{--medal-soft:#f8edce;--medal-deep:#ead6a4;--medal-border:#e8d8b4;--medal-ink:#a47735}
          .badge-tone-sage{--medal-soft:#e7efdf;--medal-deep:#cdddc1;--medal-border:#d1ddc7;--medal-ink:#63805a}
          .badge-tone-forest{--medal-soft:#dfede3;--medal-deep:#bfd7c4;--medal-border:#cadfce;--medal-ink:#3f7652}
          .badge-tone-plum{--medal-soft:#eee8f1;--medal-deep:#d8cadd;--medal-border:#ddd2e2;--medal-ink:#836b91}
          .badge-tone-clay{--medal-soft:#f5e6dc;--medal-deep:#e7c8b7;--medal-border:#e8d1c2;--medal-ink:#a96b4d}
          .badge-card-copy{position:relative;z-index:1;flex:1;min-width:0}
          .badge-card-meta{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-bottom:6px}
          .badge-card-category{color:#929184;font:800 9px/1.2 ui-monospace,monospace;letter-spacing:.13em;text-transform:uppercase}
          .badge-card-state{display:inline-flex;align-items:center;gap:5px;padding:4px 7px;border-radius:999px;color:#4f7653;background:#e7efe2;font:800 9px/1 ui-monospace,monospace;letter-spacing:.07em;text-transform:uppercase}
          .badge-card-state.is-locked{color:#8b8a7e;background:#ebe9e2}
          .badge-card-copy h3{margin:0;color:#2b3c2f;font:700 19px/1.18 Georgia,serif;letter-spacing:-.018em}
          .badge-card-copy p{margin:6px 0 0;color:#6f796e;font-size:13px;line-height:1.55}
          .badge-card-requirement,.badge-awarded-date{display:flex;align-items:flex-start;gap:6px;margin-top:8px;color:#899080;font-size:11px;line-height:1.4}
          .badge-awarded-date{align-items:center;color:#668060;font-weight:700}
          .badge-card-requirement svg,.badge-awarded-date svg{flex:0 0 13px}
          .badge-showcase-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:15px 23px 17px;border-top:1px solid #e8dfd1;background:rgba(255,255,255,.34);color:#858a7e;font-size:12px;line-height:1.5}
          .badge-showcase-footer a{display:inline-flex;align-items:center;gap:7px;color:#315d3e;font-weight:800;text-decoration:none}
          .badge-showcase-footer a:hover{text-decoration:underline;text-underline-offset:3px}
          @media(max-width:760px){.badge-showcase-head{align-items:stretch;flex-direction:column;padding:22px 19px}.badge-progress-box{flex-basis:auto;width:100%}.badge-collection-grid{grid-template-columns:1fr;gap:10px;padding:14px}.badge-collection-card{min-height:125px;padding:14px;gap:12px}.badge-medallion{flex-basis:65px;width:65px;height:65px;border-radius:20px}.badge-medallion svg{width:26px;height:26px}.badge-card-copy h3{font-size:18px}.badge-showcase-footer{padding:14px 17px}}
          @media(prefers-reduced-motion:reduce){.badge-collection-card,.badge-progress-fill{transition:none}}
        `}</style>
        <div className="badge-showcase-head">
          <div>
            <div className="badge-showcase-eyebrow"><Sparkles size={13} /> Your GreenSwap milestones</div>
            <h2 id="badge-showcase-title" className="badge-showcase-title">A little progress. A lot of impact.</h2>
            <p className="badge-showcase-subtitle">Every badge celebrates a sustainable choice you have put into practice. Your collection grows as your habits do.</p>
          </div>
          <div className="badge-progress-box" aria-label={`${earnedBadgeCount} of ${badgeCards.length} badges earned`}>
            <div className="badge-progress-top">
              <strong>{userBadgesLoading ? '—' : earnedBadgeCount}<span style={{ fontSize: 14, color: '#9a9b8d' }}> / {badgeCards.length}</span></strong>
              <span>Unlocked</span>
            </div>
            <div className="badge-progress-track" role="progressbar" aria-label="Badge collection progress" aria-valuemin={0} aria-valuemax={badgeCards.length} aria-valuenow={earnedBadgeCount}>
              <div className="badge-progress-fill" style={{ width: userBadgesLoading ? '0%' : `${badgeProgress}%` }} />
            </div>
            <div className="badge-progress-foot"><span>{userBadgesLoading ? 'Checking your collection…' : `${badgeProgress}% collected`}</span><span>{Math.max(0, badgeCards.length - earnedBadgeCount)} to go</span></div>
          </div>
        </div>

        {userBadgesError ? (
          <div className="badge-showcase-footer" role="alert">
            <span>We couldn't load your badge collection yet.</span>
            <button type="button" className="font-semibold text-[#315d3e] underline underline-offset-4" onClick={() => void refetchUserBadges()}>Try again</button>
          </div>
        ) : userBadgesLoading ? (
          <div className="badge-collection-grid" role="status" aria-label="Loading badges">
            {[0, 1, 2, 3].map((item) => <div key={item} className="min-h-[125px] animate-pulse rounded-[19px] border border-[#e6dfd3] bg-white/60" />)}
          </div>
        ) : (
          <div className="badge-collection-grid">
            {badgeCards.map((badge) => {
              const Icon = badge.icon;
              const awardDate = badge.awardedAt ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(badge.awardedAt)) : null;
              return (
                <article key={badge.key} className={`badge-collection-card ${badge.earned ? 'is-earned' : 'is-locked'}`}>
                  <div className={`badge-medallion badge-tone-${badge.tone}`} aria-hidden="true">
                    {badge.earned ? <Icon /> : <LockKeyhole />}
                  </div>
                  <div className="badge-card-copy">
                    <div className="badge-card-meta">
                      <span className="badge-card-category">{badge.category}</span>
                      <span className={`badge-card-state ${badge.earned ? '' : 'is-locked'}`}>
                        {badge.earned ? <><BadgeCheck size={11} /> Earned</> : <><LockKeyhole size={10} /> Locked</>}
                      </span>
                    </div>
                    <h3>{badge.displayName}</h3>
                    <p>{badge.displayDescription}</p>
                    {badge.earned && awardDate ? (
                      <div className="badge-awarded-date"><BadgeCheck size={12} /> Earned {awardDate}</div>
                    ) : !badge.earned ? (
                      <div className="badge-card-requirement"><Sparkles size={12} /> {badge.requirement}</div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="badge-showcase-footer">
          <span>Badges are awarded when GreenSwap records the qualifying milestone.</span>
          <Link to="#field-challenges">Explore field challenges <span aria-hidden="true">→</span></Link>
        </div>
      </section>
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
      <Card taxonomyCode="FIELD CHALLENGES" id="field-challenges">
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
                        <h2 className="font-serif font-semibold text-base">{challenge.title}</h2>
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
