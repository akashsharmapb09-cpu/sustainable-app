import { supabase } from "@/lib/supabase"
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
  try {
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    if (!user) {
      alert("Not logged in - naya signup karo")
      return
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      primary_commute: commute,
      budget_sensitivity: budget,
      effort_tolerance: effort,
    })
    if (error) throw error
    window.location.href = "/dashboard"
  } catch (err: any) {
    alert(err.message)
  }
}
