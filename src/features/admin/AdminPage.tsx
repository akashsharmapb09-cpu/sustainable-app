import { Card, Badge } from '../../shared/ui';
import { useAlternatives } from '../../shared/lib/hooks/useData';

export function AdminPage() {
  const { data } = useAlternatives();
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-12">
      <p className="taxonomy-label mb-1">ADMIN // CATALOG</p>
      <h1 className="font-serif text-3xl font-semibold mb-6">Active alternatives</h1>
      <div className="space-y-3">
        {(data ?? []).map((alt) => (
          <Card key={alt.id} taxonomyCode={alt.id} badge={<Badge variant={alt.is_active ? 'moss' : 'outline'}>{alt.difficulty}</Badge>}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif font-semibold">{alt.title}</h2>
                <p className="text-xs text-ink-muted mt-1">{alt.source_citation}</p>
              </div>
              <span className="font-mono text-xs capitalize">{alt.category}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
