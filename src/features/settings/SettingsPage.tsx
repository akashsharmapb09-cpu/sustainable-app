import { useState } from 'react';
import { Button, Card, Select } from '../../shared/ui';
import { Input } from '../../shared/ui/Input';
import { useProfile, useUpdateProfile } from '../../shared/lib/hooks/useData';
import { useAuth } from '../auth/context/authContextDef';
import { useToast } from '../../shared/ui';
import type { EffortLevel } from '../../shared/types/database';
import { createUserDataExport } from './dataExport';

export function SettingsPage() {
  const { data: profile, isError: profileError, refetch: refetchProfile } = useProfile();
  const update = useUpdateProfile();
  const { user, logoutAllDevices, deleteAccount } = useAuth();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [effort, setEffort] = useState<EffortLevel | null>(null);
  const [budget, setBudget] = useState<'low' | 'medium' | 'high' | null>(null);
  const currentName = name ?? profile?.full_name ?? '';
  const currentEffort = effort ?? profile?.effort_level ?? 'moderate';
  const currentBudget = budget ?? profile?.budget_sensitivity ?? 'medium';

  const save = async () => {
    try {
      await update.mutateAsync({
        full_name: currentName || null,
        effort_level: currentEffort,
        budget_sensitivity: currentBudget,
      });
      toast({ title: 'Settings saved', type: 'success' });
    } catch (error) {
      toast({
        title: 'Could not save settings',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  const downloadExport = async () => {
    if (!user) {
      toast({ title: 'Export unavailable', description: 'Sign in before downloading account data.', type: 'error' });
      return;
    }
    setExporting(true);
    try {
      const exportData = await createUserDataExport({
        id: user.id,
        email: user.email ?? null,
        created_at: user.created_at,
      });
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `greenswap-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast({ title: 'Data export downloaded', description: 'Your account data was exported as JSON.', type: 'success' });
    } catch (error) {
      toast({
        title: 'Could not export account data',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:px-12 space-y-6">
      <div>
        <p className="taxonomy-label mb-1">SEC.05 // SETTINGS</p>
        <h1 className="font-serif text-3xl font-semibold">Operator preferences</h1>
      </div>
      <Card taxonomyCode="PROFILE">
        <div className="space-y-4">
          {profileError && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-burnt" role="alert">
              <span>Profile preferences could not be loaded. Saving is disabled until they are available.</span>
              <Button variant="outline" size="sm" onClick={() => void refetchProfile()}>Retry</Button>
            </div>
          )}
          <Input label="Display name" value={currentName} onChange={(e) => setName(e.target.value)} />
          <Select
            label="Effort level"
            value={currentEffort}
            onChange={(e) => setEffort(e.target.value as EffortLevel)}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'committed', label: 'Committed' },
            ]}
          />
          <Select
            label="Budget sensitivity"
            value={currentBudget}
            onChange={(e) => setBudget(e.target.value as 'low' | 'medium' | 'high')}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
          <Button variant="primary" onClick={() => void save()} isLoading={update.isPending} disabled={profileError}>Save</Button>
        </div>
      </Card>
      <Card taxonomyCode="SESSION">
        <Button
          variant="outline"
          onClick={() => {
            void logoutAllDevices().then(
              () => toast({ title: "Signed out all devices", type: "success" }),
              (error: unknown) => toast({
                title: "Could not sign out all devices",
                description: error instanceof Error ? error.message : "Please try again.",
                type: "error",
              }),
            );
          }}
        >
          Sign out all devices
        </Button>
      </Card>
      <Card taxonomyCode="DATA & PRIVACY">
        <p className="mb-4 text-sm text-ink-muted">
          Download a JSON copy of your profile, preferences, activity, recommendations, saved actions, and associated account records.
        </p>
        <Button variant="outline" onClick={() => void downloadExport()} isLoading={exporting}>
          Download my data
        </Button>
      </Card>
      <Card taxonomyCode="DANGER">
        <p className="text-sm text-ink-muted mb-3">Permanently delete your account and associated server data. This cannot be undone.</p>
        <Button
          variant="destructive"
          onClick={async () => {
            if (!window.confirm('Permanently delete your account and all associated data? This cannot be undone.')) return;
            const result = await deleteAccount();
            toast({
              title: result.success ? 'Account deleted' : 'Account deletion failed',
              description: result.success ? 'Your account and associated data were removed.' : result.error,
              type: result.success ? 'success' : 'error',
            });
          }}
        >
          Delete account
        </Button>
      </Card>
    </div>
  );
}
