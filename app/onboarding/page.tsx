'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

type CommuteMode = 'public_transit' | 'two_wheeler' | 'car_ev' | 'car_petrol' | 'walk_cycle' | 'carpool';
type Diet = 'omnivore' | 'vegetarian' | 'vegan';
type EffortLevel = 'easy' | 'moderate' | 'committed';

const COMMUTE_OPTIONS = [
  {
    value: 'public_transit' as CommuteMode,
    label: 'Metro & Bus',
    cut: 'Up to -1.2t CO₂/yr',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
  },
  {
    value: 'two_wheeler' as CommuteMode,
    label: 'Two-Wheeler',
    cut: 'Up to -0.6t CO₂/yr',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
  },
  {
    value: 'car_ev' as CommuteMode,
    label: 'Electric Car',
    cut: 'Up to -0.9t CO₂/yr',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=80',
  },
  {
    value: 'car_petrol' as CommuteMode,
    label: 'Petrol Car',
    cut: 'Standard base',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80',
  },
  {
    value: 'walk_cycle' as CommuteMode,
    label: 'Walk & Cycle',
    cut: 'Zero emissions',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
  },
  {
    value: 'carpool' as CommuteMode,
    label: 'Carpooling',
    cut: 'Up to -0.5t CO₂/yr',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80',
  },
];

const DIET_OPTIONS = [
  {
    value: 'omnivore' as Diet,
    label: 'Balanced Mix',
    desc: 'Chicken, rice, avocado & fresh harvest bowl',
    cut: 'Standard base',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  },
  {
    value: 'vegetarian' as Diet,
    label: 'Vegetarian',
    desc: 'Hummus, chickpea & Mediterranean bowl',
    cut: '-0.4t CO₂/yr',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  },
  {
    value: 'vegan' as Diet,
    label: 'Plant-Based',
    desc: 'Quinoa, avocado & organic superfoods bowl',
    cut: '-0.8t CO₂/yr',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  },
];

const FOCUS_TOPICS = [
  {
    id: 'transport',
    label: 'Transport',
    tag: 'High impact',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'energy',
    label: 'Clean Energy',
    tag: 'Cost saver',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'food',
    label: 'Sustainable Food',
    tag: 'Everyday',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'waste',
    label: 'Zero Waste',
    tag: 'Habit shift',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'shopping',
    label: 'Mindful Goods',
    tag: 'Low effort',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'travel',
    label: 'Green Travel',
    tag: 'Seasonal',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  },
];

const EFFORT_OPTIONS = [
  {
    val: 'easy' as EffortLevel,
    label: 'Easy swaps only',
    desc: 'No routine change (LED bulbs, aerators, setpoints)',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&auto=format&fit=crop&q=80',
  },
  {
    val: 'moderate' as EffortLevel,
    label: 'Moderate changes',
    desc: 'Light habit shifts (transit 2x/wk, meal swaps, steel bottle)',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
  },
  {
    val: 'committed' as EffortLevel,
    label: 'Willing to invest',
    desc: 'High impact interventions (solar panels, EV, composting)',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=85',
  },
];

const BUDGET_OPTIONS = [
  {
    val: 'low' as const,
    label: 'Low — impact first',
    desc: 'Prioritise gross carbon cuts over upfront cost',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&auto=format&fit=crop&q=80',
  },
  {
    val: 'medium' as const,
    label: 'Medium — balanced',
    desc: 'Balanced between household rupee savings and carbon mitigation',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&auto=format&fit=crop&q=80',
  },
  {
    val: 'high' as const,
    label: 'High — savings first',
    desc: 'Zero or negative net expenditure with quickest payback period',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&auto=format&fit=crop&q=80',
  },
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [commute, setCommute] = useState<CommuteMode>('public_transit');
  const [diet, setDiet] = useState<Diet>('vegetarian');
  const [householdSize, setHouseholdSize] = useState(3);
  const [interests, setInterests] = useState<string[]>(['transport', 'energy', 'food']);
  const [effort, setEffort] = useState<EffortLevel>('moderate');
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');

  const toggleInterest = (id: string) => {
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_completed', 'true');
    }
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#F5F0E8] text-[#1B211E] font-sans pb-16">
      {/* Absolute Skip to Dashboard Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="absolute top-4 right-6 px-4 py-2 text-sm font-semibold text-[#162a20] bg-white/90 hover:bg-white rounded-full transition-all z-50 shadow-sm border border-[#DFD7CA]"
      >
        Skip to Dashboard →
      </button>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DFD7CA] pb-6 mb-8">
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#162A20]">
              GreenSwap<span className="text-[#3EAC6A]">.</span>
            </span>
            <span className="ml-3 text-[11px] font-mono tracking-widest text-[#535C55] uppercase bg-[#E8E0D2] px-2.5 py-1 rounded-full">
              CALIBRATION PROTOCOL
            </span>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                step === 1 ? 'bg-[#162A20] text-white shadow-sm' : 'bg-[#E8E0D2] text-[#535C55] hover:bg-[#DDD4C4]'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>Lifestyle &amp; Commute</span>
            </button>
            <div className="w-4 h-px bg-[#DFD7CA]" />
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                step === 2 ? 'bg-[#162A20] text-white shadow-sm' : 'bg-[#E8E0D2] text-[#535C55] hover:bg-[#DDD4C4]'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>Impact &amp; Priorities</span>
            </button>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 ? (
          <div className="space-y-10">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#3EAC6A] font-semibold uppercase block mb-1">
                STEP 01 OF 02
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#162A20]">
                Tell us about your daily footprint
              </h1>
              <p className="text-sm text-[#535C55] mt-1">
                We use government-verified emission factors (DEFRA, CEA) to tailor swaps for your life.
              </p>
            </div>

            {/* Commute Mode Cards */}
            <div className="space-y-3">
              <label className="text-xs font-mono tracking-wider text-[#535C55] uppercase font-bold block">
                PRIMARY COMMUTE MODE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {COMMUTE_OPTIONS.map((item) => {
                  const isSelected = commute === item.value;
                  return (
                    <div
                      key={item.value}
                      onClick={() => setCommute(item.value)}
                      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden flex flex-col ${
                        isSelected ? 'border-2 border-emerald-600 ring-2 ring-emerald-600/20' : 'border border-[#DFD7CA]'
                      }`}
                    >
                      {/* Image on top, height 180px, object-cover */}
                      <div className="relative w-full h-[180px] bg-[#E8E0D2] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.label}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          priority
                        />
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-1.5 shadow-md flex items-center justify-center z-10">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      {/* Content below image */}
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <strong className="block text-base font-bold text-[#162A20]">{item.label}</strong>
                          <span className="text-xs font-mono text-emerald-700 font-semibold mt-1 block">
                            {item.cut}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dietary Cards */}
            <div className="space-y-3">
              <label className="text-xs font-mono tracking-wider text-[#535C55] uppercase font-bold block">
                DIETARY PREFERENCE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {DIET_OPTIONS.map((item) => {
                  const isSelected = diet === item.value;
                  return (
                    <div
                      key={item.value}
                      onClick={() => setDiet(item.value)}
                      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden flex flex-col ${
                        isSelected ? 'border-2 border-emerald-600 ring-2 ring-emerald-600/20' : 'border border-[#DFD7CA]'
                      }`}
                    >
                      <div className="relative w-full h-[180px] bg-[#E8E0D2] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.label}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-1.5 shadow-md flex items-center justify-center z-10">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <strong className="block text-base font-bold text-[#162A20]">{item.label}</strong>
                          <p className="text-xs text-[#535C55] mt-1 leading-snug">{item.desc}</p>
                        </div>
                        <span className="text-xs font-mono text-emerald-700 font-semibold mt-3 block">
                          {item.cut}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Household Members */}
            <div className="bg-white rounded-2xl p-6 border border-[#DFD7CA] shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div>
                <strong className="text-base font-bold text-[#162A20] block">Household Members</strong>
                <p className="text-xs text-[#535C55] mt-0.5">Calculates shared kitchen, heating, and vehicle emission allocations</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setHouseholdSize((s) => Math.max(1, s - 1))}
                  className="w-10 h-10 rounded-full border border-[#DFD7CA] bg-[#FAF8F4] text-lg font-bold hover:bg-[#E8E0D2] transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-serif font-bold text-lg min-w-[70px] text-center text-[#162A20]">
                  {householdSize} {householdSize === 1 ? 'Person' : 'People'}
                </span>
                <button
                  type="button"
                  onClick={() => setHouseholdSize((s) => Math.min(10, s + 1))}
                  className="w-10 h-10 rounded-full border border-[#DFD7CA] bg-[#FAF8F4] text-lg font-bold hover:bg-[#E8E0D2] transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#162A20] text-white rounded-full font-semibold text-sm hover:bg-[#234333] transition-all shadow-md hover:shadow-lg"
              >
                Continue to Priorities <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2 */
          <div className="space-y-10">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#3EAC6A] font-semibold uppercase block mb-1">
                STEP 02 OF 02
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#162A20]">
                What matters most to you?
              </h1>
              <p className="text-sm text-[#535C55] mt-1">
                Personalize your 7-day swap recommendations based on cost, effort, and interest.
              </p>
            </div>

            {/* 1. FOCUS TOPICS CARDS (Full Cover 220px, Dark Gradient, White Text) */}
            <div className="space-y-3">
              <label className="text-xs font-mono tracking-wider text-[#535C55] uppercase font-bold block">
                FOCUS TOPICS (SELECT MULTIPLE)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {FOCUS_TOPICS.map((topic) => {
                  const isSelected = interests.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => toggleInterest(topic.id)}
                      className={`relative rounded-2xl overflow-hidden h-[220px] text-left transition-all cursor-pointer shadow-md hover:shadow-xl group ${
                        isSelected ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/20' : 'border border-[#DFD7CA]'
                      }`}
                    >
                      {topic.id === 'energy' ? (
                        <img
                          src="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=85"
                          alt={topic.label}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <Image
                          src={topic.image}
                          alt={topic.label}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Dark gradient at bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* White check circle top-left when selected */}
                      {isSelected && (
                        <div className="absolute top-3 left-3 bg-emerald-600 text-white rounded-full p-1.5 shadow-md flex items-center justify-center z-10">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                      )}

                      {/* Content on bottom */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/90 text-white uppercase tracking-wider mb-1.5">
                          {topic.tag}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-white tracking-wide">{topic.label}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. EFFORT YOU WILL TOLERATE (Product Image Thumbnails) */}
            <div className="space-y-3">
              <label className="text-xs font-mono tracking-wider text-[#535C55] uppercase font-bold block">
                EFFORT YOU WILL TOLERATE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {EFFORT_OPTIONS.map((item) => {
                  const isSelected = effort === item.val;
                  return (
                    <div
                      key={item.val}
                      onClick={() => setEffort(item.val)}
                      className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer text-center flex flex-col items-center justify-between ${
                        isSelected ? 'border-2 border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20' : 'border border-[#DFD7CA]'
                      }`}
                    >
                      <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-2xl border border-[#DFD7CA]">
                        <Image
                          src={item.image}
                          alt={item.label}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <strong className="block text-base font-bold text-[#162A20]">{item.label}</strong>
                        <p className="text-xs text-[#535C55] mt-1 leading-snug">{item.desc}</p>
                      </div>
                      {isSelected && (
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                          <Check className="h-3.5 w-3.5" /> Selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. BUDGET SENSITIVITY (Icon / Image Cards) */}
            <div className="space-y-3">
              <label className="text-xs font-mono tracking-wider text-[#535C55] uppercase font-bold block">
                BUDGET SENSITIVITY
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {BUDGET_OPTIONS.map((item) => {
                  const isSelected = budget === item.val;
                  return (
                    <div
                      key={item.val}
                      onClick={() => setBudget(item.val)}
                      className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer text-center flex flex-col items-center justify-between ${
                        isSelected ? 'border-2 border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20' : 'border border-[#DFD7CA]'
                      }`}
                    >
                      {/* Small product/plant image */}
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-3 border border-[#DFD7CA]">
                        <Image
                          src={item.image}
                          alt={item.label}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <strong className="block text-base font-bold text-[#162A20]">{item.label}</strong>
                        <p className="text-xs text-[#535C55] mt-1 leading-snug">{item.desc}</p>
                      </div>
                      {isSelected && (
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                          <Check className="h-3.5 w-3.5" /> Selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Projected Savings Banner */}
            <div className="bg-[#162A20] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold block mb-1">
                  CALIBRATED ESTIMATE
                </span>
                <h3 className="font-serif text-2xl font-bold">Your Projected Impact</h3>
                <p className="text-xs text-white/70 mt-1 max-w-md">
                  Based on your selections, we estimate meaningful reductions with zero lifestyle compromise.
                </p>
              </div>
              <div className="flex items-center gap-6 divide-x divide-white/20">
                <div className="text-right">
                  <span className="block text-xs font-mono text-emerald-400">ESTIMATED CO₂ REDUCTION</span>
                  <strong className="font-serif text-2xl sm:text-3xl font-bold text-white">0.7t <span className="text-xs font-sans font-normal text-white/70">/ mo</span></strong>
                </div>
                <div className="pl-6 text-right">
                  <span className="block text-xs font-mono text-emerald-400">ESTIMATED CASH SAVED</span>
                  <strong className="font-serif text-2xl sm:text-3xl font-bold text-white">₹2,840 <span className="text-xs font-sans font-normal text-white/70">/ mo</span></strong>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#DFD7CA] bg-white text-[#162A20] rounded-full font-semibold text-sm hover:bg-[#FAF8F4] transition-all"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Step 1
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#162A20] text-white rounded-full font-semibold text-sm hover:bg-[#234333] transition-all shadow-md hover:shadow-lg"
              >
                Launch My Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
