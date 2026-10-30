import { useMemo, useState } from 'react';
import {
  Check, Flame, TrendingDown, Droplets, Wallet, Calendar, Leaf,
  ArrowUpRight, TrainFront, Utensils, Lightbulb, ShoppingBag, Bike,
  Sparkles, ChevronRight, Zap, Clock3, ShieldCheck, Recycle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { useActivityLogs, useAlternatives, useUserActions } from '../../shared/lib/hooks/useData';
import { calculateRoutineAnalytics } from './data/routineAnalytics';

interface RoutineAction {
  id: string; label: string; category: string; saving: string; completed: boolean;
}

const INITIAL_ACTIONS: RoutineAction[] = [
  { id: '1', label: 'Use a reusable water bottle', category: 'Shopping', saving: '-1.5 kg CO₂e', completed: true },
  { id: '2', label: 'Try a plant-based meal', category: 'Food', saving: '-2.8 kg CO₂e', completed: true },
  { id: '3', label: 'Walk or cycle for short trips', category: 'Transport', saving: '-4.2 kg CO₂e', completed: true },
  { id: '4', label: 'Avoid food waste', category: 'Food', saving: '-3.0 kg CO₂e', completed: true },
  { id: '5', label: 'Use LED bulbs', category: 'Energy', saving: '-1.8 kg CO₂e', completed: false },
  { id: '6', label: 'Choose second-hand', category: 'Shopping', saving: '-2.2 kg CO₂e', completed: false },
  { id: '7', label: 'Take shorter showers', category: 'Home', saving: '-2.0 kg CO₂e', completed: false },
];

interface AdoptedSwap {
  title: string;
  cat: string;
  co2: string;
  money: string;
  status: string;
  icon: LucideIcon;
  tone: 'transport' | 'food' | 'energy' | 'shopping';
  detail: string;
  benefit: string;
  image: string;
  fallbackImage?: string;
}

const actionIcons = { Shopping: ShoppingBag, Food: Utensils, Transport: Bike, Energy: Lightbulb, Home: Droplets };
interface SwapVisual {
  icon: LucideIcon;
  tone: AdoptedSwap['tone'];
  image: string;
  fallbackImage?: string;
}

const swapVisuals: { [key: string]: SwapVisual } = {
  transport: {
    icon: TrainFront,
    tone: 'transport',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=85',
  },
  travel: {
    icon: TrainFront,
    tone: 'transport',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=85',
  },
  food: {
    icon: Utensils,
    tone: 'food',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=85',
  },
  energy: {
    icon: Zap,
    tone: 'energy',
    image: 'https://images.unsplash.com/photo-1745187946672-2c1d8cf26a2b?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1662340712175-349cd23a63d6?auto=format&fit=crop&w=1600&q=85',
  },
  shopping: {
    icon: ShoppingBag,
    tone: 'shopping',
    image: 'https://images.unsplash.com/photo-1772890753143-24991d807710?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1778996525689-cbbbc33a5185?auto=format&fit=crop&w=1600&q=85',
  },
  waste: {
    icon: Recycle,
    tone: 'shopping',
    image: 'https://images.unsplash.com/photo-1532996122724-a3c354a0f50b?w=1200&auto=format&fit=crop&q=85',
  },
};

const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(amount));

function formatAdoptedStatus(value: string | null): string {
  if (!value) return 'Adopted';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Adopted';
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
  if (days === 0) return 'Adopted today';
  if (days === 1) return 'Adopted yesterday';
  if (days < 30) return `Adopted ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Adopted ${months} ${months === 1 ? 'month' : 'months'} ago`;
}

function formatNetSavings(value: number): string {
  if (value > 0) return formatINR(value);
  if (value < 0) return `−${formatINR(value)}`;
  return formatINR(0);
}


export function LogActivityPage() {
  const activityQuery = useActivityLogs();
  const actionQuery = useUserActions();
  const alternativeQuery = useAlternatives();
  const liveAnalytics = calculateRoutineAnalytics(activityQuery.data || [], actionQuery.data || [], alternativeQuery.data || []);
  return (
    <div className="routine-premium">
      <h1>Your routine</h1>
      <p>{liveAnalytics.monthlyCo2SavedKg}</p>
    </div>
  );
}
