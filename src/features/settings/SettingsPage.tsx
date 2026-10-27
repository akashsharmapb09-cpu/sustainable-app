import { useState } from 'react';
import { Check, Shield, Bell, Sliders, User, Download, Trash2 } from 'lucide-react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'privacy'>('profile');

  // Profile Form State
  const [name, setName] = useState('Akash Sharma');
  const [email] = useState('akash@example.com');
  const [location, setLocation] = useState('India');
  const [interests, setInterests] = useState<string[]>(['Sustainability', 'Clean Energy', 'Healthy Living']);
  const [bio, setBio] = useState('Making small everyday choices for a lighter household carbon footprint.');

  // Preferences Form State
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [budgetSensitivity, setBudgetSensitivity] = useState<'balanced' | 'low-cost' | 'impact-first'>('balanced');
  const [defaultLanding, setDefaultLanding] = useState<'dashboard' | 'routine' | 'explore'>('dashboard');
  const [regionGrid, setRegionGrid] = useState('CEA_INDIA');

  // Notifications State
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [notifyDailyReminder, setNotifyDailyReminder] = useState(true);
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [notifyNewSwaps, setNotifyNewSwaps] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Privacy State
  const [telemetry, setTelemetry] = useState(false);
  const [anonymousBenchmarking, setAnonymousBenchmarking] = useState(true);

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const availableTags = ['Sustainability', 'Clean Energy', 'Healthy Living', 'Zero Waste', 'Plant Diet', 'E-Mobility', 'Composting', 'Public Transit'];

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const triggerSave = (msg: string) => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  const exportUserData = () => {
    const data = {
      profile: { name, email, location, interests, bio },
      preferences: { unit, budgetSensitivity, defaultLanding, regionGrid },
      notifications: { notifyWeekly, notifyDailyReminder, notifyMilestones },
      exportedAt: new Date().toISOString(),
      format: 'GreenSwap-Data-Archive-v1',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greenswap-export-${name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSave('Data export generated and downloaded!');
  };

  return (
    <div className="settings-root">
      {/* ── Page Header ── */}
      <div className="settings-header">
        <h1 className="settings-title">Profile &amp; Settings</h1>
        <p className="settings-sub">Manage your account, calculation parameters, and privacy preferences.</p>
      </div>

      {/* ── Tabs Bar ── */}
      <div className="settings-tabs">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'preferences', label: 'Preferences', icon: Sliders },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'privacy', label: 'Privacy', icon: Shield },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`settings-tab ${activeTab === id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(id as typeof activeTab)}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab 1: Profile View ── */}
      {activeTab === 'profile' && (
        <div className="settings-card">
          <div className="settings-user-row">
            <div className="user-avatar-circle" aria-label="Profile initials">
              {name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'A'}
            </div>
            <div className="user-meta">
              <strong className="user-name">{name}</strong>
              <span className="user-email">{email}</span>
            </div>
            <span className="user-badge">Standard Account</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerSave('Profile information updated successfully!');
            }}
            className="settings-form"
          >
            <div className="form-field">
              <label className="form-label" htmlFor="user-name-input">Full Name</label>
              <input
                id="user-name-input"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="user-email-input">Email Address</label>
              <input
                id="user-email-input"
                type="email"
                className="form-input is-readonly"
                value={email}
                readOnly
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="user-location-select">Primary Region / Country</label>
              <select
                id="user-location-select"
                className="form-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="India">India (CEA Grid Factor 0.716 kg/kWh)</option>
                <option value="United Kingdom">United Kingdom (DEFRA 2024 Factors)</option>
                <option value="United States">United States (US EPA eGRID Factors)</option>
                <option value="Global">Global Weighted Averages</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="user-bio-input">Personal Eco Statement / Bio</label>
              <textarea
                id="user-bio-input"
                className="form-input form-textarea"
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Focus Interests</label>
              <div className="interest-tags-grid">
                {availableTags.map((tag) => {
                  const isSelected = interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-pill ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => toggleInterest(tag)}
                    >
                      {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-settings-btn"
                onClick={() => {
                  setName('Akash Sharma');
                  setLocation('India');
                  setInterests(['Sustainability', 'Clean Energy', 'Healthy Living']);
                  setBio('Making small everyday choices for a lighter household carbon footprint.');
                  setSavedFeedback(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="save-settings-btn">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tab 2: Preferences View ── */}
      {activeTab === 'preferences' && (
        <div className="settings-card">
          <div className="settings-section-title">
            <h2 className="text-lg font-serif font-semibold">Household &amp; Model Calibration</h2>
            <p>Configure how GreenSwap calculates your footprint deltas and displays recommendations.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerSave('Preferences saved!');
            }}
            className="settings-form"
          >
            <div className="form-field">
              <label className="form-label">Footprint Unit Format</label>
              <div className="option-button-group">
                <button
                  type="button"
                  className={`option-btn ${unit === 'metric' ? 'is-selected' : ''}`}
                  onClick={() => setUnit('metric')}
                >
                  <strong>Metric (kg &amp; t CO₂e)</strong>
                  <span>Standard scientific measure used by DEFRA and CEA</span>
                </button>
                <button
                  type="button"
                  className={`option-btn ${unit === 'imperial' ? 'is-selected' : ''}`}
                  onClick={() => setUnit('imperial')}
                >
                  <strong>Imperial (lbs CO₂e)</strong>
                  <span>Pounds of carbon equivalent</span>
                </button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Budget &amp; Expenditure Sensitivity</label>
              <div className="option-button-group">
                <button
                  type="button"
                  className={`option-btn ${budgetSensitivity === 'low-cost' ? 'is-selected' : ''}`}
                  onClick={() => setBudgetSensitivity('low-cost')}
                >
                  <strong>Cost Savings First</strong>
                  <span>Prioritise swaps that save money monthly</span>
                </button>
                <button
                  type="button"
                  className={`option-btn ${budgetSensitivity === 'balanced' ? 'is-selected' : ''}`}
                  onClick={() => setBudgetSensitivity('balanced')}
                >
                  <strong>Balanced (Recommended)</strong>
                  <span>Equal weight between rupee savings and carbon mitigation</span>
                </button>
                <button
                  type="button"
                  className={`option-btn ${budgetSensitivity === 'impact-first' ? 'is-selected' : ''}`}
                  onClick={() => setBudgetSensitivity('impact-first')}
                >
                  <strong>Impact First</strong>
                  <span>Highest gross carbon cuts regardless of upfront cost</span>
                </button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="default-landing-select">Default Start Page</label>
              <select
                id="default-landing-select"
                className="form-select"
                value={defaultLanding}
                onChange={(e) => setDefaultLanding(e.target.value as typeof defaultLanding)}
              >
                <option value="dashboard">Dashboard (Overview &amp; Topics)</option>
                <option value="routine">Your Routine (7-Day Plan)</option>
                <option value="explore">Discover Catalog</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="grid-factor-select">Electricity Grid Factor Model</label>
              <select
                id="grid-factor-select"
                className="form-select"
                value={regionGrid}
                onChange={(e) => setRegionGrid(e.target.value)}
              >
                <option value="CEA_INDIA">India National Grid — 0.716 kg CO₂e / kWh (CEA Baseline v19)</option>
                <option value="DEFRA_UK">UK Grid Average — 0.207 kg CO₂e / kWh (DEFRA 2024)</option>
                <option value="US_EGRID">US National Average — 0.386 kg CO₂e / kWh (EPA eGRID 2024)</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-settings-btn">
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tab 3: Notifications View ── */}
      {activeTab === 'notifications' && (
        <div className="settings-card">
          <div className="settings-section-title">
            <h2 className="text-lg font-serif font-semibold">Notification &amp; Reminder Controls</h2>
            <p>Customize updates and daily routine nudges. Zero spam, ever.</p>
          </div>

          <div className="toggle-list">
            <div className="toggle-row">
              <div>
                <strong>Weekly Footprint Digest</strong>
                <span>Summary of your weekly carbon reductions and savings</span>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={notifyWeekly}
                onChange={(e) => setNotifyWeekly(e.target.checked)}
              />
            </div>

            <div className="toggle-row">
              <div>
                <strong>Daily Habit Reminder</strong>
                <span>Gentle evening prompt to check off completed routine steps</span>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={notifyDailyReminder}
                onChange={(e) => setNotifyDailyReminder(e.target.checked)}
              />
            </div>

            <div className="toggle-row">
              <div>
                <strong>Milestone &amp; Goal Alerts</strong>
                <span>Celebrate passing 100 kg and 0.5t CO₂e milestones</span>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={notifyMilestones}
                onChange={(e) => setNotifyMilestones(e.target.checked)}
              />
            </div>

            <div className="toggle-row">
              <div>
                <strong>New Catalogue Swaps</strong>
                <span>Notified when new research-backed interventions are added</span>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={notifyNewSwaps}
                onChange={(e) => setNotifyNewSwaps(e.target.checked)}
              />
            </div>

            <div className="toggle-row">
              <div>
                <strong>Email Delivery</strong>
                <span>Receive essential alerts directly to {email}</span>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="save-settings-btn"
              onClick={() => triggerSave('Notification rules updated!')}
            >
              Update Notifications
            </button>
          </div>
        </div>
      )}

      {/* ── Tab 4: Privacy View ── */}
      {activeTab === 'privacy' && (
        <div className="settings-card">
          <div className="settings-section-title">
            <h2 className="text-lg font-serif font-semibold">Data Governance &amp; Privacy</h2>
            <p>GreenSwap is built with privacy by design. We never sell your household data or serve advertising.</p>
          </div>

          <div className="privacy-block">
            <div className="privacy-item">
              <div className="privacy-item-header">
                <Shield className="h-4 w-4 text-emerald-700" />
                <strong>DPDP (India) &amp; GDPR Compliant</strong>
              </div>
              <p>Your activity records and inputs are strictly used to compute deterministic emission scores on your behalf.</p>
            </div>

            <div className="toggle-row">
              <div>
                <strong>Anonymous Benchmarking</strong>
                <span>Allow anonymized aggregate statistics to help calibrate regional averages</span>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={anonymousBenchmarking}
                onChange={(e) => setAnonymousBenchmarking(e.target.checked)}
              />
            </div>

            <div className="toggle-row">
              <div>
                <strong>Crash &amp; Telemetry Diagnostics</strong>
                <span>Send anonymous performance logs to help diagnose UI issues</span>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={telemetry}
                onChange={(e) => setTelemetry(e.target.checked)}
              />
            </div>
          </div>

          {/* Export & Danger Zone */}
          <div className="privacy-actions-block">
            <div className="export-box">
              <div>
                <strong>Export Your Footprint Archive</strong>
                <p>Download a complete JSON export of all logged habits, alternatives, and profile preferences.</p>
              </div>
              <button type="button" className="export-btn" onClick={exportUserData}>
                <Download className="h-4 w-4 mr-1.5" />
                Export Archive
              </button>
            </div>

            <div className="danger-box">
              <div>
                <strong className="text-red-700">Clear Local Calibration</strong>
                <p>Reset all saved swaps and return your calibration to fresh baseline defaults.</p>
              </div>
              <button
                type="button"
                className="danger-btn"
                onClick={() => {
                  if (confirm('Are you sure you want to reset your local calibration?')) {
                    triggerSave('Calibration data cleared.');
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {savedFeedback && (
        <div className="settings-toast" role="status">
          <Check className="h-4 w-4 text-emerald-300" />
          <span>{savedFeedback}</span>
        </div>
      )}

      <style>{`
        .settings-root {
          max-width: 860px;
          margin: 0 auto;
          padding: 2.2rem 2.5rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
        }
        .settings-header {
          margin-bottom: 1.6rem;
        }
        .settings-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem;
        }
        .settings-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
        }

        .settings-tabs {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .settings-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 1.25rem;
          border-radius: 999px;
          border: 1px solid #DFD7CA;
          background: #FAF8F4;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .dark .settings-tab {
          background: #141c17;
          border-color: #24352b;
        }
        .settings-tab:hover {
          border-color: #123826;
          color: var(--color-ink);
        }
        .settings-tab.is-active {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
          font-weight: 600;
        }
        .dark .settings-tab.is-active {
          background: #3eac6a;
          border-color: #3eac6a;
          color: #0c130f;
        }

        .settings-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 2.2rem 2.5rem;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
        }

        .settings-section-title {
          margin-bottom: 1.8rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1rem;
        }
        .settings-section-title h3 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.25rem;
        }
        .settings-section-title p {
          font-size: 0.82rem;
          color: var(--color-ink-muted);
          margin: 0;
        }

        .settings-user-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-bottom: 1.8rem;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 2rem;
        }
        .user-avatar-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #d6e8dc;
          color: #123826;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .user-meta { flex: 1; }
        .user-name {
          display: block;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-ink);
        }
        .user-email {
          font-size: 0.82rem;
          color: var(--color-ink-muted);
        }
        .user-badge {
          font-size: 0.7rem;
          font-weight: 600;
          color: #123826;
          background: rgba(18, 56, 38, 0.08);
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .form-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input, .form-select {
          padding: 0.7rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #DFD7CA;
          background: #FAF8F4;
          color: var(--color-ink);
          font-size: 0.88rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-textarea { resize: vertical; }
        .form-input.is-readonly {
          background: rgba(0, 0, 0, 0.03);
          color: var(--color-ink-muted);
          cursor: not-allowed;
        }
        .dark .form-input, .dark .form-select {
          background: #141c17;
          border-color: #24352b;
        }
        .form-input:focus, .form-select:focus {
          border-color: #123826;
        }

        .option-button-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
        }
        .option-btn {
          padding: 0.95rem 1.1rem;
          border-radius: 12px;
          border: 1.5px solid #DFD7CA;
          background: #FAF8F4;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          transition: all 0.15s;
        }
        .dark .option-btn {
          background: #141c17;
          border-color: #24352b;
        }
        .option-btn:hover { border-color: #123826; }
        .option-btn.is-selected {
          border-color: #123826;
          background: rgba(18, 56, 38, 0.08);
          box-shadow: 0 0 0 3px rgba(18, 56, 38, 0.12);
        }
        .option-btn strong { font-size: 0.85rem; color: var(--color-ink); }
        .option-btn span { font-size: 0.72rem; color: var(--color-ink-muted); line-height: 1.35; }

        .interest-tags-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .tag-pill {
          padding: 0.45rem 1rem;
          border-radius: 999px;
          border: 1.5px solid #DFD7CA;
          background: #FAF8F4;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .dark .tag-pill {
          background: #141c17;
          border-color: #24352b;
        }
        .tag-pill:hover { border-color: #123826; color: var(--color-ink); }
        .tag-pill.is-selected {
          background: rgba(18, 56, 38, 0.1);
          border-color: #123826;
          color: #123826;
          font-weight: 700;
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.2rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 12px;
          gap: 1.5rem;
        }
        .dark .toggle-row {
          background: #141c17;
          border-color: #24352b;
        }
        .toggle-row strong {
          display: block;
          font-size: 0.85rem;
          color: var(--color-ink);
          margin-bottom: 0.15rem;
        }
        .toggle-row span {
          font-size: 0.75rem;
          color: var(--color-ink-muted);
        }
        .toggle-checkbox {
          width: 20px;
          height: 20px;
          accent-color: #123826;
          cursor: pointer;
        }

        .privacy-block {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .privacy-item {
          padding: 1rem 1.25rem;
          background: rgba(18, 56, 38, 0.05);
          border: 1px solid rgba(18, 56, 38, 0.2);
          border-radius: 12px;
        }
        .privacy-item-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }
        .privacy-item p {
          font-size: 0.78rem;
          color: var(--color-ink-muted);
          margin: 0;
          line-height: 1.5;
        }

        .privacy-actions-block {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .export-box, .danger-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 1.4rem;
          border-radius: 12px;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .export-box {
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
        }
        .dark .export-box {
          background: #141c17;
          border-color: #24352b;
        }
        .export-box strong { font-size: 0.88rem; color: var(--color-ink); display: block; margin-bottom: 0.2rem; }
        .export-box p { font-size: 0.75rem; color: var(--color-ink-muted); margin: 0; }
        .export-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.6rem 1.25rem;
          background: #123826;
          color: #ffffff;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .export-btn:hover { background: #1c4e36; }

        .danger-box {
          background: #fff5f2;
          border: 1px solid #ffd8cf;
        }
        .dark .danger-box {
          background: #2a1614;
          border-color: #4a221f;
        }
        .danger-box p { font-size: 0.75rem; color: #a14030; margin: 0; }
        .danger-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.55rem 1.15rem;
          background: #c84b26;
          color: #ffffff;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .form-actions {
          margin-top: 1.5rem;
          text-align: right;
        }
        .save-settings-btn {
          padding: 0.75rem 1.8rem;
          background: #123826;
          color: #ffffff;
          border-radius: 999px;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .save-settings-btn:hover {
          background: #1c4e36;
          transform: translateY(-1px);
        }

        .settings-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #123826;
          color: #ffffff;
          padding: 0.8rem 1.4rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          animation: gs-page-in 0.25s ease both;
          z-index: 100;
        }

        @media (max-width: 640px) {
          .settings-root { padding: 1.5rem 1.25rem; }
          .settings-card { padding: 1.5rem; }
          .toggle-row, .export-box, .danger-box { flex-direction: column; align-items: flex-start; }
        }

        /* Premium eco-luxury profile polish — presentation only */
        .settings-root { max-width: 1040px; padding: 2rem 2.25rem 3.5rem; }
        .settings-title { color: #1A3C2A; letter-spacing: -.035em; }
        .settings-sub { max-width: 650px; line-height: 1.65; }
        .settings-tabs { gap: .45rem; padding: .35rem; width: fit-content; max-width: 100%; border: 1px solid #E8E3D9; border-radius: 999px; background: #FBF9F4; }
        .settings-root .settings-tab { border-color: transparent; background: transparent; color: #657267; padding: .65rem 1rem; }
        .settings-root .settings-tab.is-active { background: #D5E7D0; border-color: #D5E7D0; color: #1A3C2A; box-shadow: none; }
        .settings-root .settings-card { background: #F5F1E8; border: 1px solid #E8E3D9; border-radius: 24px; padding: 2rem; box-shadow: 0 16px 42px rgba(33,47,35,.075); }
        .settings-root .settings-user-row { gap: 1.1rem; padding-bottom: 1.6rem; border-color: #E8E3D9; }
        .settings-root .user-avatar-circle { width: 72px; height: 72px; background: #D5E7D0; color: #1A3C2A; font-size: 1.35rem; letter-spacing: -.03em; box-shadow: inset 0 0 0 1px rgba(26,60,42,.06); }
        .settings-root .user-name { font-family: var(--font-sans,'Inter',sans-serif); font-size: 1.05rem; letter-spacing: -.02em; }
        .settings-root .user-badge { background: #D5E7D0; color: #1A3C2A; border: 1px solid #C4D9BE; padding: .45rem .8rem; font-size: .75rem; font-weight: 650; white-space: nowrap; }
        .settings-root .form-label { color: #42584A; text-transform: none; letter-spacing: 0; font-size: .83rem; font-weight: 650; }
        .settings-root .form-input, .settings-root .form-select { min-height: 46px; padding: .75rem .9rem; border-radius: 12px; border: 1px solid #E8E3D9; background: #FFFEFB; color: #1B3024; font: inherit; font-size: .9rem; transition: border-color .18s ease,box-shadow .18s ease,background .18s ease; }
        .settings-root .form-textarea { min-height: 88px; resize: vertical; }
        .settings-root .form-input.is-readonly { background: #EFEBE2; color: #6E796F; }
        .settings-root .form-input:focus, .settings-root .form-select:focus { border-color: #1A3C2A; outline: none; box-shadow: 0 0 0 4px rgba(26,60,42,.14); }
        .settings-root .interest-tags-grid { gap: .6rem; }
        .settings-root .tag-pill { padding: .55rem .9rem; border: 1px solid #E8E3D9; background: #F5F1E8; color: #536557; font-size: .82rem; font-weight: 550; }
        .settings-root .tag-pill:hover { border-color: #1A3C2A; color: #1A3C2A; }
        .settings-root .tag-pill.is-selected { border-color: #1A3C2A; background: #1A3C2A; color: #FFFFFF; font-weight: 650; box-shadow: 0 4px 10px rgba(26,60,42,.12); }
        .settings-root .tag-pill.is-selected svg { color: #FFFFFF; }
        .settings-root .form-actions { display: flex; justify-content: flex-end; align-items: center; gap: .65rem; padding-top: 1.25rem; border-top: 1px solid #E8E3D9; }
        .settings-root .save-settings-btn, .settings-root .cancel-settings-btn { min-height: 44px; padding: .7rem 1.2rem; border-radius: 12px; font-size: .86rem; font-weight: 650; transition: transform .15s ease,background .15s ease,box-shadow .15s ease; }
        .settings-root .save-settings-btn { background: #1A3C2A; box-shadow: 0 6px 14px rgba(26,60,42,.16); }
        .settings-root .save-settings-btn:hover { background: #244C36; box-shadow: 0 9px 18px rgba(26,60,42,.2); }
        .settings-root .cancel-settings-btn { border: 1px solid #D8DCCF; background: transparent; color: #334C3B; cursor: pointer; }
        .settings-root .cancel-settings-btn:hover { background: #EDEFE7; transform: translateY(-1px); }
        .settings-root .settings-toast { background: #1A3C2A; border-radius: 14px; }
        @media (max-width: 640px) {
          .settings-root { padding: 1.4rem .9rem 2rem; }
          .settings-root .settings-card { padding: 1.2rem; border-radius: 20px; }
          .settings-root .settings-tabs { width: 100%; overflow-x: auto; border-radius: 15px; }
          .settings-root .settings-tab { padding: .6rem .8rem; white-space: nowrap; }
          .settings-root .settings-user-row { flex-wrap: wrap; }
          .settings-root .user-badge { margin-left: 84px; }
          .settings-root .form-actions { flex-wrap: wrap; }
          .settings-root .save-settings-btn, .settings-root .cancel-settings-btn { flex: 1; }
        }

      `}</style>
    </div>
  );
}
