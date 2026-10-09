import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type BasicProfile = {
  name: string;
  email: string;
  region: string;
  householdSize: string;
};

const basicDefaults: BasicProfile = {
  name: '',
  email: '',
  region: 'India',
  householdSize: '3',
};

function readBasicProfile(): Partial<BasicProfile> {
  try {
    const raw = localStorage.getItem('sustainable_profile') || localStorage.getItem('profile');
    if (!raw) return {};
    const saved = JSON.parse(raw) as Record<string, unknown>;
    return {
      name: String(saved.name ?? saved.full_name ?? ''),
      email: String(saved.email ?? ''),
      region: String(saved.region ?? 'India'),
      householdSize: String(saved.householdSize ?? saved.household_size ?? 3),
    };
  } catch {
    return {};
  }
}

const fieldClass = 'mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2d4a22] focus:ring-2 focus:ring-[#2d4a22]/10';
const labelClass = 'block text-sm font-semibold text-[#252820]';

export function ProfilePage() {
  const [profile, setProfile] = useState<BasicProfile>(basicDefaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile({ ...basicDefaults, ...readBasicProfile() });
  }, []);

  const update = <K extends keyof BasicProfile>(key: K, value: BasicProfile[K]) => {
    setProfile(current => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let existing: Record<string, unknown> = {};
    try {
      existing = JSON.parse(localStorage.getItem('sustainable_profile') || localStorage.getItem('profile') || '{}') as Record<string, unknown>;
    } catch {
      existing = {};
    }
    const updated = {
      ...existing,
      name: profile.name.trim(),
      full_name: profile.name.trim(),
      email: profile.email.trim(),
      region: profile.region,
      householdSize: Number(profile.householdSize) || 1,
      household_size: Number(profile.householdSize) || 1,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('sustainable_profile', JSON.stringify(updated));
    localStorage.setItem('profile', JSON.stringify(updated));
    setSaved(true);
  };

  const initials = profile.name.trim()
    ? profile.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
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

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#59704d]">Basic details</p>
          <h1 className="mt-3 font-serif text-4xl font-black tracking-tight sm:text-5xl">Your profile<span className="italic font-normal text-[#2d4a22]">.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65 sm:text-base">Keep your basic details here. Your everyday lifestyle, budget, priorities and topics now live directly on the dashboard.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#e8eee3] font-serif text-xl font-bold text-[#2d4a22]">{initials}</div>
              <div><h2 className="font-serif text-2xl font-bold">About you</h2><p className="mt-1 text-sm text-black/55">Just the details you want to keep on this device.</p></div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>Display name<input className={fieldClass} value={profile.name} onChange={event => update('name', event.target.value)} placeholder="What should we call you?" autoComplete="name" /></label>
              <label className={labelClass}>Email (optional)<input className={fieldClass} type="email" value={profile.email} onChange={event => update('email', event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
              <label className={labelClass}>Region<select className={fieldClass} value={profile.region} onChange={event => update('region', event.target.value)}><option>India</option><option>South Asia</option><option>Europe</option><option>North America</option><option>Other</option></select></label>
              <label className={labelClass}>People in your household<input className={fieldClass} type="number" min="1" max="20" value={profile.householdSize} onChange={event => update('householdSize', event.target.value)} /></label>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="rounded-full bg-[#2d4a22] px-7 py-3 font-semibold text-white transition hover:bg-[#203619] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d4a22]">Save basic details</button>
            {saved && <p role="status" className="text-sm font-medium text-[#2d4a22]">Saved on this device.</p>}
          </div>
        </form>

        <Link to="/dashboard#lifestyle-preferences" className="mt-6 block rounded-2xl border border-[#2d4a22]/20 bg-[#e8eee3] p-5 transition hover:border-[#2d4a22]/50">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#53694a]">Lifestyle and priorities</p>
          <h2 className="mt-2 font-serif text-2xl font-bold">Change your everyday choices on the dashboard ↗</h2>
          <p className="mt-2 text-sm leading-6 text-[#41503b]">Travel, food, food waste, energy, budget, effort and the topics you care about are all together in one place.</p>
        </Link>
        <p className="mt-5 text-xs leading-5 text-black/45">Details are stored in this browser on this device. They are not synced to an account or other devices.</p>
      </div>
    </main>
  );
}

export default ProfilePage;
