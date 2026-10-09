import { useMemo, useState } from 'react';
import { Button, Card, Select } from '../../shared/ui';
import { Input } from '../../shared/ui/Input';
import { useActivityLogs, useCreateActivityLog, useDeleteActivityLog } from '../../shared/lib/hooks/useData';
import { useToast } from '../../shared/ui';
import { ACTIVITY_CATALOG, monthlyCo2e, validateActivityLogForm } from './data/activityCatalog';

const getLoggedAtTimestamp = () => new Date().toISOString();

export function LogActivityPage() {
  const { data: logs, isLoading: logsLoading, isError: logsError, refetch: refetchLogs } = useActivityLogs();
  const createLog = useCreateActivityLog();
  const deleteLog = useDeleteActivityLog();
  const { toast } = useToast();
  const [activityId, setActivityId] = useState(ACTIVITY_CATALOG[0].id);
  const selected = useMemo(
    () => ACTIVITY_CATALOG.find((a) => a.id === activityId) ?? ACTIVITY_CATALOG[0],
    [activityId]
  );
  const [quantity, setQuantity] = useState(selected.default_quantity);
  const [frequency, setFrequency] = useState(selected.default_frequency_per_week);
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const parsedForm = validateActivityLogForm({
    activity_id: activityId,
    quantity,
    frequency_per_week: frequency,
    notes,
  });
  const preview = parsedForm.success
    ? parsedForm.data.calculated_co2e_monthly
    : Number.isFinite(quantity) && Number.isFinite(frequency)
      ? monthlyCo2e(quantity, frequency, selected.co2e_per_unit)
      : null;

  const onActivityChange = (id: string) => {
    const next = ACTIVITY_CATALOG.find((a) => a.id === id) ?? ACTIVITY_CATALOG[0];
    setActivityId(id);
    setQuantity(next.default_quantity);
    setFrequency(next.default_frequency_per_week);
    setFormErrors({});
  };

  const submit = async () => {
    setFormErrors({});
    const parsed = validateActivityLogForm({
      activity_id: selected.id,
      quantity,
      frequency_per_week: frequency,
      notes,
      logged_at: getLoggedAtTimestamp(),
    });
    if (!parsed.success) {
      setFormErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
      return;
    }
    try {
      await createLog.mutateAsync({
        activity_id: parsed.data.activity_id,
        quantity: parsed.data.quantity,
        frequency_per_week: parsed.data.frequency_per_week,
        notes: parsed.data.notes,
        logged_at: parsed.data.logged_at,
      });
      toast({ title: 'Activity recorded', description: 'Your activity log was saved.', type: 'success' });
    } catch (error) {
      toast({
        title: 'Could not save activity',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
      return;
    }
    setNotes('');
  };

  const removeLog = async (id: string) => {
    try {
      await deleteLog.mutateAsync(id);
      toast({ title: 'Activity removed', type: 'success' });
    } catch (error) {
      toast({
        title: 'Could not remove activity',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-12 space-y-8">
      <div>
        <p className="taxonomy-label mb-1">SEC.02 // ACTIVITY LOG</p>
        <h1 className="font-serif text-3xl font-semibold">Record a household activity</h1>
        <p className="text-sm text-ink-muted mt-1">Monthly CO2e uses 4.33 weeks and published emission factors.</p>
      </div>

      <Card taxonomyCode="NEW ENTRY">
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Activity"
            value={activityId}
            onChange={(e) => onActivityChange(e.target.value)}
            options={ACTIVITY_CATALOG.map((a) => ({ value: a.id, label: `${a.name} (${a.category})` }))}
          />
          <Input
            label="Quantity"
            type="number"
            min={0.01}
            max={99_999_999.99}
            step="0.1"
            value={quantity}
            unitSuffix={selected.unit}
            onChange={(e) => setQuantity(Number(e.target.value))}
            error={formErrors.quantity}
          />
          <Input
            label="Times per week"
            type="number"
            min={0.1}
            max={28}
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            error={formErrors.frequency_per_week}
          />
          <Input
            label="Notes (optional)"
            value={notes}
            maxLength={500}
            onChange={(e) => setNotes(e.target.value)}
            error={formErrors.notes}
          />
        </div>
        <p className="mt-5 font-mono text-sm">
          Projected monthly: <strong>{preview === null ? '—' : `${preview.toFixed(1)} kg CO2e`}</strong>
          <span className="text-ink-muted"> ±12%</span>
        </p>
        <div className="mt-6">
          <Button variant="primary" onClick={submit} isLoading={createLog.isPending} disabled={!parsedForm.success}>
            Save log
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Recent logs</h2>
        {logsLoading && <p className="text-sm text-ink-muted" role="status">Loading activity logs…</p>}
        {logsError && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-burnt" role="alert">
            <span>Activity logs could not be loaded. Your data has not been changed.</span>
            <Button variant="outline" size="sm" onClick={() => void refetchLogs()}>Try again</Button>
          </div>
        )}
        {!logsLoading && !logsError && (logs ?? []).length === 0 && <p className="text-sm text-ink-muted">No records yet.</p>}
        {!logsError && (logs ?? []).map((log) => (
          <div key={log.id} className="flex items-center justify-between border border-border bg-surface rounded px-4 py-3">
            <div>
              <p className="font-medium text-sm">{log.activity_name}</p>
              <p className="text-xs font-mono text-ink-muted">
                {log.quantity} {log.unit} × {log.frequency_per_week}/wk → {log.calculated_co2e_monthly.toFixed(1)} kg/mo
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => void removeLog(log.id)} isLoading={deleteLog.isPending}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
