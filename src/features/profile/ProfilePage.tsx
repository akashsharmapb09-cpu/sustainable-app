import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type ProfileData = {
  name: string;
  email: string;
  region: string;
  householdSize: string;
  travel: string;
  diet: string;
  budget: string;
  effort: string;
  interests: string[];
  foodWaste: string;
  electricity: string;
  priority: string;
};

const defaults: ProfileData = {
  name: '',
  email: '',
  region: 'India',
  householdSize: '3',
  travel: 'mixed',
  diet: 'mixed',
  budget: 'low',
  effort: 'moderate',
  interests: ['Food waste', 'Energy saving', 'Reuse & repair'],
  foodWaste: 'often',
  electricity: 'medium',
  priority: 'impact',
};

const interestOptions = ['Travel', 'Food choices', 'Food waste', 'Energy saving', 'Reuse & repair', 'Shopping less', 'Water saving'];

function readSavedProfile(): Partial<ProfileData> {
  try {
    const raw = localStorage.getItem('sustainable_profile') || localStorage.getItem('profile');
    if (!raw) return {};
    const saved = JSON.parse(raw);
    return {
      name: saved.name ?? saved.full_name ?? '',
      email: saved.email ?? '',
      region: saved.region ?? 'India',
      householdSize: String(saved.householdSize ?? saved.household_size ?? 3),
      travel: saved.travel ?? saved.primary_commute ?? 'mixed',
      diet: saved.diet ?? 'mixed',
      budget: saved.budget ?? saved.budget_sensitivity ?? 'low',
      effort: saved.effort ?? saved.effort_tolerance ?? saved.effort_level ?? 'moderate',
      interests: Array.isArray(saved.interests) ? saved.interests : defaults.interests,
      foodWaste: saved.foodWaste ?? 'often',
      electricity: saved.electricity ?? 'medium',
      priority: saved.priority ?? 'impact',
    };
  } catch {
    return {};
  }
}

const fieldClass = 'mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2d4a22] focus:ring-2 focus:ring-[#2d4a22]/10';
const labelClass = 'block text-sm font-semibold text-[#252820]';

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile({ ...defaults, ...readSavedProfile() });
  }, []);

  const update = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const toggleInterest = (interest: string) => {
    update('interests', profile.interests.includes(interest)
      ? profile.interests.filter((item) => item !== interest)
      : [...profile.interests, interest]);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const existing: Record<string, unknown> = {};
    try {
      Object.assign(existing, JSON.parse(localStorage.getItem('sustainable_profile') || localStorage.getItem('profile') || '{}'));
    } catch {
      // Start fresh if older saved data is malformed.
    }
    const updated = {
      ...existing,
      name: profile.name.trim(),
      full_name: profile.name.trim(),
      email: profile.email.trim(),
      region: profile.region,
      householdSize: Number(profile.householdSize) || 1,
      household_size: Number(profile.householdSize) || 1,
      travel: profile.travel,
      primary_commute: profile.travel,
      diet: profile.diet,
      budget: profile.budget,
      budget_sensitivity: profile.budget,
      effort: profile.effort,
      effort_tolerance: profile.effort,
      foodWaste: profile.foodWaste,
      electricity: profile.electricity,
      priority: profile.priority,
      interests: profile.interests,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('sustainable_profile', JSON.stringify(updated));
    localStorage.setItem('profile', JSON.stringify(updated));
    setSaved(true);
  };

  const initials = profile.name.trim()
    ? profile.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'GS';

  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#1a1a1a]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-5 py-4 sm:px-8">
        <Link to="/dashboard" className="flex items-center gap-3" aria-label="GreenSwap dashboard">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2d4a22] text-sm font-bold text-white">G.</span>
          <span className="font-serif text-xl font-black">GreenSwap<span className="text-[#2d4a22]">.</span></span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/dashboard" className="rounded-full px-4 py-2 hover:bg-black/5">Dashboard</Link>
          <span className="rounded-full bg-[#e8eee3] px-4 py-2 font-semibold text-[#2d4a22]">My profile</span>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#59704d]">Your preferences · Your pace</p>
          <h1 className="mt-3 font-serif text-4xl font-black tracking-tight sm:text-5xl">Make GreenSwap <span className="italic font-normal text-[#2d4a22]">yours.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65 sm:text-base">Tell us what everyday life looks like for you. We’ll use these preferences to shape practical, affordable sustainable alternatives—not to score or judge your lifestyle.</p>
        </div>

        <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#e8eee3] font-serif text-xl font-bold text-[#2d4a22]">{initials}</div>
                <div><h2 className="font-serif text-2xl font-bold">About you</h2><p className="mt-1 text-sm text-black/55">Basic details for your profile.</p></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>Display name<input className={fieldClass} value={profile.name} onChange={(e) => update('name', e.target.value)} placeholder="What should we call you?" autoComplete="name" /></label>
                <label className={labelClass}>Email (optional)<input className={fieldClass} type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
                <label className={labelClass}>Region<select className={fieldClass} value={profile.region} onChange={(e) => update('region', e.target.value)}><option>India</option><option>South Asia</option><option>Europe</option><option>North America</option><option>Other</option></select></label>
                <label className={labelClass}>People in your household<input className={fieldClass} type="number" min="1" max="20" value={profile.householdSize} onChange={(e) => update('householdSize', e.target.value)} /></label>
              </div>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="font-serif text-2xl font-bold">Everyday lifestyle</h2>
              <p className="mb-6 mt-1 text-sm text-black/55">Choose the options that most closely fit your current routine.</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>Travel habits<select className={fieldClass} value={profile.travel} onChange={(e) => update('travel', e.target.value)}><option value="mixed">A mix of walking, transit and vehicles</option><option value="walk_cycle">Mostly walk or cycle</option><option value="public_transit">Mostly public transport</option><option value="two_wheeler">Mostly two-wheeler</option><option value="car">Mostly car</option><option value="carpool">Carpool when possible</option></select></label>
                <label className={labelClass}>Diet<select className={fieldClass} value={profile.diet} onChange={(e) => update('diet', e.target.value)}><option value="mixed">Mixed diet</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option><option value="flexitarian">Mostly plant-based, flexible</option><option value="pescatarian">Pescatarian</option></select></label>
                <label className={labelClass}>Food waste at home<select className={fieldClass} value={profile.foodWaste} onChange={(e) => update('foodWaste', e.target.value)}><option value="rarely">Rarely</option><option value="sometimes">Sometimes</option><option value="often">Often</option></select></label>
                <label className={labelClass}>Electricity use<select className={fieldClass} value={profile.electricity} onChange={(e) => update('electricity', e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="unsure">Not sure</option></select></label>
              </div>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="font-serif text-2xl font-bold">What works for you?</h2>
              <p className="mb-5 mt-1 text-sm text-black/55">Recommendations should match your budget, time and priorities.</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>Budget for changes<select className={fieldClass} value={profile.budget} onChange={(e) => update('budget', e.target.value)}><option value="low">Low — prefer free or low-cost changes</option><option value="medium">Medium — some flexibility</option><option value="high">High — willing to invest</option></select></label>
                <label className={labelClass}>Effort level<select className={fieldClass} value={profile.effort} onChange={(e) => update('effort', e.target.value)}><option value="easy">Easy — quick changes</option><option value="moderate">Moderate — build a new habit</option><option value="committed">Committed — bigger lifestyle changes</option><option value="low">Low effort only</option><option value="medium">Medium effort</option><option value="high">High effort</option></select></label>
                <label className={labelClass}>Main priority<select className={fieldClass} value={profile.priority} onChange={(e) => update('priority', e.target.value)}><option value="impact">Meaningful environmental impact</option><option value="cost">Save money</option><option value="convenience">Convenience and time</option><option value="health">Health and wellbeing</option><option value="waste">Reduce waste</option></select></label>
              </div>
              <div className="mt-6">
                <p className={labelClass}>Topics you care about</p>
                <p className="mt-1 text-xs text-black/50">Pick as many as you like.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {interestOptions.map((interest) => (
                    <label key={interest} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${profile.interests.includes(interest) ? 'border-[#2d4a22] bg-[#eef3e9] text-[#263f20]' : 'border-black/10 hover:bg-black/[0.02]'}`}>
                      <input type="checkbox" className="h-4 w-4 accent-[#2d4a22]" checked={profile.interests.includes(interest)} onChange={() => toggleInterest(interest)} />
                      {interest}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="rounded-full bg-[#2d4a22] px-7 py-3 font-semibold text-white transition hover:bg-[#203619] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d4a22]">Save my preferences</button>
              {saved && <p role="status" className="text-sm font-medium text-[#2d4a22]">✓ Profile saved on this device.</p>}
            </div>
            <p className="text-xs leading-5 text-black/45">Your profile is stored in this browser on this device. It is not synced to an account or other devices.</p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-[#e8eee3] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#53694a]">Your profile snapshot</p>
              <h3 className="mt-3 font-serif text-2xl font-bold">{profile.name.trim() || 'Your everyday choices'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#41503b]">A {profile.budget === 'low' ? 'low-cost' : profile.budget === 'medium' ? 'balanced-budget' : 'investment-friendly'} approach, with {profile.effort === 'easy' || profile.effort === 'low' ? 'easy-to-start' : profile.effort === 'committed' || profile.effort === 'high' ? 'bigger-step' : 'steady'} actions focused on {profile.priority === 'impact' ? 'environmental impact' : profile.priority === 'cost' ? 'saving money' : profile.priority === 'convenience' ? 'convenience' : profile.priority === 'health' ? 'health and wellbeing' : 'reducing waste'}.</p>
              <div className="mt-5 flex flex-wrap gap-2">{profile.interests.slice(0, 4).map((interest) => <span key={interest} className="rounded-full border border-[#2d4a22]/20 bg-white/70 px-3 py-1 text-xs text-[#2d4a22]">{interest}</span>)}{profile.interests.length === 0 && <span className="text-xs text-[#53694a]">Choose a topic to personalise your suggestions.</span>}</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <p className="font-semibold">Why this matters</p>
              <p className="mt-2 text-sm leading-6 text-black/60">A useful recommendation should fit your real routine. You can change these details any time as your habits, budget or priorities change.</p>
            </div>
            <Link to="/dashboard" className="block rounded-2xl border border-black/10 p-5 text-sm font-semibold transition hover:border-[#2d4a22]/40 hover:bg-white">← Back to dashboard</Link>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default ProfilePage;
