import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card } from '../../shared/ui';
import { CardSkeleton } from '../../shared/ui/Skeleton';
import { formatCurrency, formatRange, safeHttpsUrl } from '../../shared/lib/utils';
import {
  useActivityLogs,
  useAlternatives,
  useProfile,
  useUpsertUserAction,
  useUserActions,
} from '../../shared/lib/hooks/useData';
import { getColdStartRecommendations, rankRecommendations } from './engine';
import type { ActivityContext, UserScoringProfile } from './engine/types';
import { useToast } from '../../shared/ui';

export function RecommendationsPage() {
  const [referenceTime] = useState(() => new Date().toISOString());
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: logs, isLoading: logsLoading, isError: logsError, refetch: refetchLogs } = useActivityLogs();
  const { data: alternatives, isLoading: alternativesLoading } = useAlternatives();
  const { data: actions, isLoading: actionsLoading, isError: actionsError, refetch: refetchActions } = useUserActions();
  const upsert = useUpsertUserAction();
  const { toast } = useToast();

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
    if (logsLoading || actionsLoading || alternativesLoading || profileLoading || logsError || actionsError) return [];
    if (!logs?.length) return getColdStartRecommendations(alts, scoring, 8);
    const latest = logs[0];
    const ctx: ActivityContext = {
      category: latest.category,
      activity_name: latest.activity_name,
      quantity: latest.quantity,
      unit: latest.unit,
      frequency_per_week: latest.frequency_per_week,
      calculated_co2e_monthly: latest.calculated_co2e_monthly,
    };
    return rankRecommendations(ctx, alts, scoring, 8);
  })();

  const act = async (id: string, status: 'adopted' | 'maybe_later' | 'not_for_me') => {
    try {
      await upsert.mutateAsync({ alternative_id: id, status });
      toast({ title: status === 'adopted' ? 'Marked adopted' : 'Preference saved', type: 'success' });
    } catch (error) {
      toast({
        title: 'Could not save preference',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-12 space-y-6">
      <div>
        <p className="taxonomy-label mb-1">SEC.03 // RANKED ALTERNATIVES</p>
        <h1 className="font-serif text-3xl font-semibold">Why you are seeing these</h1>
        <p className="text-sm text-ink-muted mt-1">
          Deterministic scoring: impact, feasibility, cost, preference, effort. No black box.
        </p>
      </div>
      {recs.map((rec) => {
          const sourceUrl = safeHttpsUrl(rec.alternative.source_url);
          return (
            <Card
              key={rec.alternative.id}
              taxonomyCode={`${rec.alternative.category.toUpperCase()} // RANK ${rec.rank}`}
              badge={(
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {actions?.find((action) => action.alternative_id === rec.alternative.id)?.status === 'maybe_later' && (
                    <Badge variant="outline">Saved for later</Badge>
                  )}
                  <Badge variant="moss">{Math.round(rec.score * 100)} score</Badge>
                </div>
              )}
            >
              <h2 className="font-serif text-xl font-semibold">{rec.alternative.title}</h2>
              <p className="text-sm text-ink-muted mt-2">{rec.alternative.why_better}</p>
              <p className="mt-2 text-xs text-ink-muted">
                Source: {rec.alternative.source_citation}
                {sourceUrl && (
                  <>
                    {' · '}
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      View reference
                    </a>
                  </>
                )}
              </p>
              <p className="mt-2 text-xs text-ink-muted">
                {logs?.length
                  ? `Compared with your latest ${logs[0].category} log: ${logs[0].activity_name}.`
                  : 'A general starting point; log an activity to estimate personal savings.'}
              </p>
              <ul className="mt-4 space-y-1 text-sm">
                {rec.explanation_factors.map((factor) => (
                  <li key={factor} className="text-foreground">• {factor}</li>
                ))}
              </ul>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 font-mono text-xs">
                <p>
                  CO2e:{' '}
                  {rec.co2e_saved_range
                    ? formatRange(rec.co2e_saved_range.low, rec.co2e_saved_range.high, 'kg/mo')
                    : 'Log an activity for a personal estimate'}
                </p>
                <p>
                  Estimated monthly cost change:{' '}
                  {formatCurrency(rec.cost_delta_range.low, 'INR')} to {formatCurrency(rec.cost_delta_range.high, 'INR')}
                </p>
              </div>
              {rec.caveats && <p className="mt-3 text-xs text-ink-muted">Caveat: {rec.caveats}</p>}
              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" variant="primary" disabled={upsert.isPending} onClick={() => void act(rec.alternative.id, 'adopted')}>Adopt</Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={upsert.isPending}
                  aria-pressed={actions?.some((action) => action.alternative_id === rec.alternative.id && action.status === 'maybe_later')}
                  onClick={() => void act(rec.alternative.id, 'maybe_later')}
                >
                  {actions?.some((action) => action.alternative_id === rec.alternative.id && action.status === 'maybe_later') ? 'Saved for later' : 'Maybe later'}
                </Button>
                <Button size="sm" variant="ghost" disabled={upsert.isPending} onClick={() => void act(rec.alternative.id, 'not_for_me')}>Not for me</Button>
              </div>
            </Card>
          );
      })}
      {(logsLoading || actionsLoading || alternativesLoading || profileLoading) && (
        <div className="space-y-4" role="status" aria-label="Loading recommendations">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}
      {(logsError || actionsError) && (
        <div className="space-y-3 text-sm text-burnt" role="alert">
          <p>{logsError ? 'Activity history' : 'Saved recommendation preferences'} could not be loaded, so rankings are hidden.</p>
          {logsError && <Button variant="outline" size="sm" onClick={() => void refetchLogs()}>Retry activity history</Button>}
          {actionsError && <Button variant="outline" size="sm" onClick={() => void refetchActions()}>Retry saved preferences</Button>}
        </div>
      )}
      {!logsLoading && !actionsLoading && !alternativesLoading && !profileLoading
        && !logsError && !actionsError && recs.length === 0 && (
          <Card taxonomyCode="NO MATCHES">
            <p className="text-sm text-ink-muted">
              No recommendations currently match your region and saved preferences. Review your settings or update your activity log to see other options.
            </p>
            <Link to="/settings" className="mt-4 inline-flex text-sm underline">Review your settings</Link>
          </Card>
        )}
    </div>
  );
}
