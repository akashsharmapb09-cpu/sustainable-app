"use client";

import { useState } from "react";
import { Bell, Check, Shield, SlidersHorizontal } from "lucide-react";

const tabs = [
  { name: "General", icon: SlidersHorizontal },
  { name: "Notifications", icon: Bell },
  { name: "Privacy", icon: Shield },
] as const;

type TabName = (typeof tabs)[number]["name"];

export default function SettingsTabs() {
  const [tab, setTab] = useState<TabName>("General");
  const [weekly, setWeekly] = useState(true);
  const [newIdeas, setNewIdeas] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(true);
  const [saved, setSaved] = useState(false);
  const [profileName, setProfileName] = useState("Green Member");
  const [language, setLanguage] = useState("en");

  function markChanged() { setSaved(false); }

  return (
    <div className="max-w-3xl">
      <div role="tablist" aria-label="Settings sections" className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map(({ name, icon: Icon }) => (
          <button key={name} type="button" role="tab" aria-selected={tab === name} onClick={() => setTab(name)}
            className={"-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition " + (
              tab === name ? "border-forest text-ink" : "border-transparent text-gray-400 hover:text-ink"
            )}>
            <Icon size={15} aria-hidden="true" />{name}
          </button>
        ))}
      </div>

      <div className="divide-y divide-line rounded-b-2xl border-x border-b border-line px-5 sm:px-7">
        {tab === "General" && (
          <>
            <SettingRow title="Profile name" description="How you appear around GreenSwap.">
              <input aria-label="Profile name" value={profileName} onChange={(event) => { setProfileName(event.target.value); markChanged(); }}
                className="w-full max-w-52 rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-forest" />
            </SettingRow>
            <SettingRow title="Language" description="Choose the language for your experience.">
              <select aria-label="Language" value={language} onChange={(event) => { setLanguage(event.target.value); markChanged(); }}
                className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
                <option value="en">English</option><option value="hi">हिन्दी</option>
              </select>
            </SettingRow>
          </>
        )}

        {tab === "Notifications" && (
          <>
            <SettingRow title="Weekly progress note" description="A gentle reminder of the progress you have made.">
              <Toggle checked={weekly} onChange={(value) => { setWeekly(value); markChanged(); }} />
            </SettingRow>
            <SettingRow title="New swap ideas" description="A notice when fresh ideas are added.">
              <Toggle checked={newIdeas} onChange={(value) => { setNewIdeas(value); markChanged(); }} />
            </SettingRow>
          </>
        )}

        {tab === "Privacy" && (
          <>
            <SettingRow title="Private profile" description="Keep your demo profile visible only to you.">
              <Toggle checked={privateProfile} onChange={(value) => { setPrivateProfile(value); markChanged(); }} />
            </SettingRow>
            <p className="py-5 text-xs leading-5 text-gray-400">These are in-page demo preferences only; they are not synced to a backend.</p>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setSaved(true)} className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest">
          <Check size={15} aria-hidden="true" />Save preferences
        </button>
        {saved && <p role="status" className="text-sm text-forest">Preferences confirmed for this page preview. Cloud sync is not connected.</p>}
      </div>
    </div>
  );
}

function SettingRow({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={"relative h-6 w-11 shrink-0 rounded-full transition " + (checked ? "bg-forest" : "bg-gray-200")}>
      <span className={"absolute top-1 h-4 w-4 rounded-full bg-white shadow transition " + (checked ? "left-6" : "left-1")} />
    </button>
  );
}
