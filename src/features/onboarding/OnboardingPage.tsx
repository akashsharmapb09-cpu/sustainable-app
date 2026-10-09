import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Select } from '../../shared/ui';
import { Input } from '../../shared/ui/Input';
import { useUpdateProfile } from '../../shared/lib/hooks/useData';
import { useAuth } from '../auth/context/authContextDef';
import type { CommuteMode, Diet, EffortLevel } from '../../shared/types/database';

const INTERESTS = [
  { id: 'transport', label: 'Transport' },
  { id: 'energy', label: 'Home energy' },
  { id: 'food', label: 'Food' },
  { id: 'waste', label: 'Waste' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'travel', label: 'Travel' },
];

const DIET_OPTIONS: { value: Diet; label: string }[] = [
  { value: 'omnivore', label: 'Mixed / omnivore' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Plant-based' },
];

const COMMUTE_OPTIONS: { value: CommuteMode; label: string }[] = [
  { value: 'car_petrol', label: 'Petrol car' },
  { value: 'car_diesel', label: 'Diesel car' },
  { value: 'two_wheeler', label: 'Two-wheeler' },
  { value: 'public_transit', label: 'Metro / bus' },
  { value: 'walk_cycle', label: 'Walk / cycle' },
  { value: 'car_ev', label: 'Electric car' },
  { value: 'carpool', label: 'Carpool' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [householdSize, setHouseholdSize] = useState(3);
  const [region, setRegion] = useState('IN');
  const [diet, setDiet] = useState<Diet>('omnivore');
  const [commute, setCommute] = useState<CommuteMode>('car_petrol');
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');
  const [effort, setEffort] = useState<EffortLevel>('moderate');
  const [interests, setInterests] = useState<string[]>(['energy', 'transport']);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (id: string) => {
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submit = async () => {
    setError(null);
    try {
      await updateProfile.mutateAsync({
        full_name: user?.user_metadata?.full_name ?? null,
        region,
        household_size: householdSize,
        diet,
        commute_mode: commute,
        budget_sensitivity: budget,
        effort_level: effort,
        interests,
        onboarding_completed: true,
      });
      navigate('/dashboard');
     } catch (err: any) {
    console.error(err);
    setError(err?.message || 'Could not save calibration. Try again.');
  }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:px-12">
      <p className="taxonomy-label mb-2">SEC.01 // LIFESTYLE CALIBRATION</p>
      <h1 className="font-serif text-3xl font-semibold mb-2">Five minutes. Honest inputs.</h1>
      <p className="text-sm text-ink-muted mb-8">
        These answers weight recommendations. Nothing is sold as a point estimate.
      </p>
      <Card taxonomyCode="HOUSEHOLD BASELINE">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Household size"
            type="number"
            min={1}
            max={12}
            value={householdSize}
            onChange={(e) => setHouseholdSize(Number(e.target.value))}
          />
          <Select
            label="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            options={[
              { value: 'IN', label: 'India' },
              { value: 'GLOBAL', label: 'Other / global factors' },
            ]}
          />
          <Select
            label="Diet"
            value={diet}
            onChange={(e) => {
              const option = DIET_OPTIONS.find(({ value }) => value === e.target.value);
              if (option) setDiet(option.value);
            }}
            options={DIET_OPTIONS}
          />
          <Select
            label="Primary commute"
            value={commute}
            onChange={(e) => {
              const option = COMMUTE_OPTIONS.find(({ value }) => value === e.target.value);
              if (option) setCommute(option.value);
            }}
            options={COMMUTE_OPTIONS}
          />
          <Select
            label="Budget sensitivity"
            value={budget}
            onChange={(e) => setBudget(e.target.value as 'low' | 'medium' | 'high')}
            options={[
              { value: 'low', label: 'Low — impact first' },
              { value: 'medium', label: 'Medium — balanced' },
              { value: 'high', label: 'High — savings first' },
            ]}
          />
          <Select
            label="Effort you will tolerate"
            value={effort}
            onChange={(e) => setEffort(e.target.value as EffortLevel)}
            options={[
              { value: 'easy', label: 'Easy swaps only' },
              { value: 'moderate', label: 'Moderate changes' },
              { value: 'committed', label: 'Willing to invest' },
            ]}
          />
        </div>
        <div className="mt-6">
          <p className="text-xs font-mono text-ink-muted mb-2">Focus areas</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleInterest(item.id)}
                className={`rounded border px-3 py-1.5 text-xs font-mono ${
                  interests.includes(item.id)
                    ? 'border-moss bg-moss/10 text-moss'
                    : 'border-border text-ink-muted'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="mt-4 text-xs text-burnt">{error}</p>}
        <div className="mt-8">
          <Button variant="primary" size="lg" onClick={submit} isLoading={updateProfile.isPending}>
            Save calibration
          </Button>
        </div>
      </Card>
    </div>
  );
}
