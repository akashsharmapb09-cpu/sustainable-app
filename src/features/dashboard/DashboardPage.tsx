import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../../shared/ui';
import { CardSkeleton, MetricSkeleton } from '../../shared/ui/Skeleton';
import { formatCurrency, formatRange, safeHttpsUrl } from '../../shared/lib/utils';
import { useActivityLogs, useAlternatives, useMonthlyFootprint, useProfile, useUserActions } from '../../shared/lib/hooks/useData';
import { getColdStartRecommendations, rankRecommendations } from '../recommendations/engine';
import type { UserScoringProfile, ActivityContext } from '../recommendations/engine/types';
import { ArrowRight, PenLine } from 'lucide-react';

export function DashboardPage() {
  const [referenceTime] = useState(() => new Date().toISOString());
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: footprint, isLoading: footLoading, isError: footprintError, refetch: refetchFootprint } = useMonthlyFootprint();
  const { data: logs, isLoading: logsLoading, isError: logsError, refetch: refetchLogs } = useActivityLogs();
  const { data: alternatives, isLoading: alternativesLoading } = useAlternatives();
  const { data: actions, isLoading: actionsLoading, isError: actionsError, refetch: refetchActions } = useUserActions();

  const scoring: UserScoringProfile = {
    region: profile?.region ?? 'IN',
    effort_level: profile?.effort_level ?? 'moderate',
    budget_sensitivity: profile?.budget_sensitivity ?? 'medium',
    interests: profile?.interests ?? [],
    reference_time: referenceTime,
    adopted_alternative_ids: actions?.filter((a) => a.status === 'adopted').map((a) => a.alternative_id),
    action_history: actions?.map((action) => {
      const alternative = alternatives?.find((item) => item.id === action.alternative_id);
      return {
        alternative_id: action.alternative_id,
        status: action.status,
        updated_at: action.updated_at,
        category: alternative?.category,
        tags: alternative?.tags ?? [],
      };
    }),
  };

  const recs = (() => {
    const alts = alternatives ?? [];
    if (logsError || actionsError || logsLoading || actionsLoading || alternativesLoading || profileLoading) return [];
    if (!logs?.length) return getColdStartRecommendations(alts, scoring, 3);
    const latest = logs[0];
    const ctx: ActivityContext = {
      category: latest.category,
      activity_name: latest.activity_name,
      quantity: latest.quantity,
      unit: latest.unit,
      frequency_per_week: latest.frequency_per_week,
      calculated_co2e_monthly: latest.calculated_co2e_monthly,
    };
    return rankRecommendations(ctx, alts, scoring, 3);
  })();

  const adopted = actions?.filter((a) => a.status === 'adopted').length;
  const recommendationsLoading = logsLoading || actionsLoading || alternativesLoading || profileLoading;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 space-y-8">
      <div>
        <p className="taxonomy-label mb-1">FIELD LOG // DASHBOARD</p>
        <h1 className="font-serif text-3xl font-semibold">
          {profile?.full_name ? `${profile.full_name}'s household` : 'Household snapshot'}
        </h1>
        <p className="text-sm text-ink-muted mt-1">Ranges, not guilt. Log more activities to tighten the math.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {footLoading || profileLoading || logsLoading || actionsLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <Card taxonomyCode="THIS MONTH">
              <p className="text-xs text-ink-muted font-mono">Logged footprint</p>
              <p className="font-mono text-2xl font-bold mt-1">
                {footprintError ? 'Unavailable' : `${(footprint?.total ?? 0).toFixed(1)} kg CO2e`}
              </p>
            </Card>
            <Card taxonomyCode="ACTIONS">
              <p className="text-xs text-ink-muted font-mono">Adopted swaps</p>
              <p className="font-mono text-2xl font-bold mt-1">{actionsError ? 'Unavailable' : adopted ?? 0}</p>
            </Card>
            <Card taxonomyCode="LOGS">
              <p className="text-xs text-ink-muted font-mono">Activity records</p>
              <p className="font-mono text-2xl font-bold mt-1">{logsError ? 'Unavailable' : logs?.length ?? 0}</p>
            </Card>
          </>
        )}
      </div>

      {(footprintError || logsError || actionsError) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-burnt" role="alert">
          <span>Some household or preference data could not be loaded. Affected totals and rankings are hidden until it is available.</span>
          {footprintError && <button type="button" className="underline" onClick={() => void refetchFootprint()}>Retry footprint</button>}
          {logsError && <button type="button" className="underline" onClick={() => void refetchLogs()}>Retry activity logs</button>}
          {actionsError && <button type="button" className="underline" onClick={() => void refetchActions()}>Retry preferences</button>}
        </div>
      )}

      {!footprintError && footprint && Object.keys(footprint.byCategory).length > 0 && (
        <Card taxonomyCode="CATEGORY SPLIT">
          <div className="space-y-3">
            {Object.entries(footprint.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, kg]) => (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="capitalize font-mono text-xs">{cat}</span>
                  <span className="font-mono">{kg.toFixed(1)} kg</span>
                </div>
              ))}
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">Top ranked swaps</h2>
        <Link to="/recommendations">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>All recommendations</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {!recommendationsLoading && !logsError && !actionsError && recs.map((rec) => {
          const sourceUrl = safeHttpsUrl(rec.alternative.source_url);
          return (
            <Card key={rec.alternative.id} taxonomyCode={`RANK ${rec.rank}`} badge={<Badge variant="moss">{rec.confidence}</Badge>}>
              <h3 className="font-serif font-semibold mb-2">{rec.alternative.title}</h3>
              <p className="text-xs text-ink-muted mb-3">{rec.explanation_factors[0]}</p>
              <p className="font-mono text-xs">
                {rec.co2e_saved_range
                  ? formatRange(rec.co2e_saved_range.low, rec.co2e_saved_range.high, 'kg CO2e/mo')
                  : 'Log an activity for a personal CO2e estimate'}
              </p>
              <p className="font-mono text-xs text-moss mt-1">
                {formatCurrency(rec.cost_delta_range.expected, 'INR')}/mo
              </p>
              <p className="mt-2 text-xs text-ink-muted">
                {rec.alternative.source_citation}
                {sourceUrl && (
                  <>
                    {' · '}
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      Source
                    </a>
                  </>
                )}
              </p>
            </Card>
          );
        })}
      </div>
      {recommendationsLoading && (
        <div className="grid gap-4 md:grid-cols-3" role="status" aria-label="Loading recommendations">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}
      {!recommendationsLoading && !logsError && !actionsError && recs.length === 0 && (
        <p className="text-sm text-ink-muted">
          No swaps match your current activity and preferences. Try logging a different activity or reviewing your settings.
        </p>
      )}

      <Link to="/log">
        <Button variant="primary" leftIcon={<PenLine className="h-4 w-4" />}>Log an activity</Button>
      </Link>
    </div>
  );
}
