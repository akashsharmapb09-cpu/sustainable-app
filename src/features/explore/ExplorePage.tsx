import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, Tabs } from '../../shared/ui';
import { formatCurrency } from '../../shared/lib/utils';
import { useAlternatives } from '../../shared/lib/hooks/useData';
import { useAuth } from '../auth/context/authContextDef';
import { PublicFooter, PublicMasthead } from '../public/PublicMasthead';
import type { ActivityCategory } from '../../shared/types/database';

const CATS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'transport', label: 'Transport' },
  { id: 'energy', label: 'Energy' },
  { id: 'food', label: 'Food' },
  { id: 'waste', label: 'Waste' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'travel', label: 'Travel' },
];

export function ExplorePage({ embedded = false }: { embedded?: boolean }) {
  const { isAuthenticated } = useAuth();
  const { data } = useAlternatives();
  const [tab, setTab] = useState('all');
  const items = useMemo(() => {
    const list = data ?? [];
    if (tab === 'all') return list;
    return list.filter((alt) => alt.category === (tab as ActivityCategory));
  }, [data, tab]);

  const body = (
    <div className={embedded ? 'mx-auto max-w-6xl px-6 py-10 md:px-12' : 'mx-auto max-w-6xl px-6 py-12 md:px-12'}>
      <p className="taxonomy-label mb-1">FIELD CATALOGUE</p>
      <h1 className="font-serif text-3xl font-semibold mb-6">Pragmatic alternatives</h1>
      <Tabs tabs={CATS} activeTab={tab} onChange={setTab} className="mb-8" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((alt) => (
          <Card
            key={alt.id}
            taxonomyCode={alt.category.toUpperCase()}
            badge={<Badge variant="moss">{Math.round(alt.co2e_saved_ratio * 100)}% cut</Badge>}
          >
            <h2 className="font-serif font-semibold mb-2">{alt.title}</h2>
            <p className="text-xs text-ink-muted mb-3">{alt.description}</p>
            <p className="font-mono text-xs text-moss">{formatCurrency(alt.cost_delta_monthly_inr, 'INR')}/mo</p>
            <p className="text-[11px] font-mono text-ink-faint mt-2">{alt.source_citation}</p>
          </Card>
        ))}
      </div>
      {!isAuthenticated && (
        <p className="mt-10 text-sm text-ink-muted">
          <Link to="/onboarding" className="text-moss underline">Build your baseline</Link> to rank these against your household profile.
        </p>
      )}
    </div>
  );

  if (embedded || isAuthenticated) return body;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicMasthead />
      {body}
      <PublicFooter />
    </div>
  );
}
