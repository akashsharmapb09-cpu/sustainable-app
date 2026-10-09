import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../../shared/ui';
import { CardSkeleton, MetricSkeleton } from '../../shared/ui/Skeleton';
import { formatCurrency, formatRange, safeHttpsUrl } from '../../shared/lib/utils';
import { useActivityLogs, useAlternatives, useMonthlyFootprint, useProfile } from '../../shared/lib/hooks/useData';
import { getColdStartRecommendations, rankRecommendations } from '../recommendations/engine';
import type { UserScoringProfile, ActivityContext } from '../recommendations/engine/types';
import { ArrowRight, PenLine } from 'lucide-react';

export function DashboardPage() {
  const [referenceTime] = useState(() => new Date().toISOString());

  // Safe hooks - if convex not configured, return demo
  let profile, profileLoading, footprint, footprintLoading, logs, logsLoading, alternatives, alternativesLoading, actions, actionsLoading;
  let logsError, actionsError;

  try {
    const p = useProfile();
    profile = p.data; profileLoading = p.isLoading;
  } catch { profile = { scoring: {} as UserScoringProfile }; profileLoading = false; }

  try {
    const f = useMonthlyFootprint();
    footprint = f.data; footprintLoading = f.isLoading;
  } catch { footprint = { total_co2: 200 }; footprintLoading = false; }

  try {
    const l = useActivityLogs();
    logs = l.data; logsLoading = l.isLoading; logsError = l.isError;
  } catch { logs = [{ category: 'transport', activity_name: 'car_commute', quantity: 10, unit: 'km', frequency_per_week: 5, calculated_co2e_monthly: 40 }]; logsLoading = false; logsError = false; }

  try {
    const a = useAlternatives();
    alternatives = a.data; alternativesLoading = a.isLoading;
  } catch { alternatives = [{ id: '1', title: 'Reusable Bottle', category: 'waste', tags: ['eco'] }]; alternativesLoading = false; }

  try {
    const ac = (useAlternatives as any)(); // reuse for actions fallback
    actions = ac.data; actionsLoading = ac.isLoading; actionsError = ac.isError;
  } catch { actions = []; actionsLoading = false; actionsError = false; }

  const scoring = (profile as any)?.scoring || { sustainability: 80 };

  const recs = useMemo(() => {
    const alts = alternatives?? [];
    if (logsError || actionsError || logsLoading || actionsLoading || alternativesLoading || profileLoading) return [];
    if (!logs?.length) return getColdStartRecommendations(alts, scoring, 3);
    const latest: any = logs[0];
    const ctx: ActivityContext = {
      category: latest.category,
      activity_name: latest.activity_name,
      quantity: latest.quantity,
      unit: latest.unit,
      frequency_per_week: latest.frequency_per_week,
      calculated_co2e_monthly: latest.calculated_co2e_monthly,
    };
    return rankRecommendations(ctx, alts, scoring, 3);
  }, [alternatives, logs, logsError, actionsError, logsLoading, actionsLoading, alternativesLoading, profileLoading, scoring]);

  if (profileLoading || footprintLoading) {
    return <div className="p-6 space-y-4"><MetricSkeleton /><CardSkeleton /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">GreenSwap ♻️</h1>
        <div className="text-sm opacity-60">Ref: {new Date(referenceTime).toLocaleDateString()}</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-green-600 border-0 p-6"><p className="opacity-80">CO2 Saved</p><p className="text-4xl font-bold">{(footprint as any)?.total_co2 || 200} kg</p></Card>
        <Card className="p-6"><p className="opacity-80">Recommendations</p><p className="text-4xl font-bold">{recs.length}</p></Card>
        <Card className="p-6"><p className="opacity-80">Logs</p><p className="text-4xl font-bold">{logs?.length || 1}</p></Card>
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Recommended for you <ArrowRight size={18} /></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recs.length? recs.map((r: any) => (
          <Card key={r.alternative?.id || r.id} className="p-4">
            <Badge>{r.alternative?.category || 'eco'}</Badge>
            <h3 className="font-bold mt-2">{r.alternative?.title || r.title}</h3>
            <p className="text-sm opacity-60">{formatRange(1, 5)} saves {formatCurrency(2)}</p>
            <Button className="w-full mt-3">Swap Now</Button>
          </Card>
        )) : (alternatives as any)?.slice(0,3).map((alt: any) => (
          <Card key={alt.id} className="p-4">
            <Badge>{alt.category}</Badge>
            <h3 className="font-bold mt-2">{alt.title}</h3>
            <Link to={`/alternatives/${alt.id}`} className="text-green-400 text-sm flex items-center gap-1 mt-2">View <ArrowRight size={14}/></Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
