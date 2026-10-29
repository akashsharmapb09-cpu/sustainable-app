import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateProfile } from '../../shared/lib/hooks/useData';
import { useAuth } from '../auth/context/authContextDef';
import type { CommuteMode, Diet, EffortLevel } from '../../shared/types/database';

const DIET_ITEMS: { value: Diet; label: string; icon: string; desc: string; cut: string }[] = [
  { value: 'omnivore', label: 'Balanced Mix', icon: '🥩🥗', desc: 'Everyday variety of food', cut: 'Standard base' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🌱🧀', desc: 'Plant & dairy focused', cut: '-0.4t CO₂/yr' },
  { value: 'vegan', label: 'Plant-Based', icon: '🌿🥑', desc: '100% plant centered', cut: '-0.8t CO₂/yr' },
];

const COMMUTE_ITEMS: { value: CommuteMode; label: string; icon: string; cut: string }[] = [
  { value: 'public_transit', label: 'Metro & Bus', icon: '🚇', cut: 'Up to -1.2t CO₂/yr' },
  { value: 'two_wheeler', label: 'Two-Wheeler', icon: '🛵', cut: 'Up to -0.6t CO₂/yr' },
  { value: 'car_ev', label: 'Electric Car', icon: '⚡🚗', cut: 'Up to -0.9t CO₂/yr' },
  { value: 'car_petrol', label: 'Petrol Car', icon: '⛽🚗', cut: 'Standard base' },
  { value: 'walk_cycle', label: 'Walk & Cycle', icon: '🚲', cut: 'Zero emissions' },
  { value: 'carpool', label: 'Carpooling', icon: '👥', cut: 'Up to -0.5t CO₂/yr' },
];

const TOPIC_CHIPS = [
  { id: 'transport', label: '🚗 Transport', tag: 'High impact' },
  { id: 'energy', label: '⚡ Clean Energy', tag: 'Cost saver' },
  { id: 'food', label: '🌿 Sustainable Food', tag: 'Everyday' },
  { id: 'waste', label: '♻️ Zero Waste', tag: 'Habit' },
  { id: 'shopping', label: '🛍️ Mindful Goods', tag: 'Low effort' },
  { id: 'travel', label: '✈️ Green Travel', tag: 'Seasonal' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();

  const [step, setStep] = useState<1 | 2>(1);
  const [householdSize, setHouseholdSize] = useState(3);
  const [region] = useState('IN');
  const [diet, setDiet] = useState<Diet>('vegetarian');
  const [commute, setCommute] = useState<CommuteMode>('public_transit');
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');
  const [effort, setEffort] = useState<EffortLevel>('moderate');
  const [interests, setInterests] = useState<string[]>(['energy', 'transport', 'food']);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (id: string) => {
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleFinish = async () => {
    setError(null);
    try {
      await updateProfile.mutateAsync({
        full_name: user?.user_metadata?.full_name ?? 'Akash Sharma',
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
    } catch {
      // Direct access fallback
      navigate('/dashboard');
    }
  };

  return (
    <div className="onboard-root">
      {/* Background ambient orbs */}
      <div className="onboard-orb onboard-orb-1" aria-hidden="true" />
      <div className="onboard-orb onboard-orb-2" aria-hidden="true" />

      <div className="onboard-shell">
        {/* Top Header */}
        <header className="onboard-header">
          <div className="onboard-brand">
            <span className="onboard-logo">GreenSwap<span className="dot">.</span></span>
            <span className="onboard-badge">CALIBRATION PROTOCOL</span>
          </div>
          <button
            type="button"
            className="onboard-skip-btn absolute top-4 right-6"
            onClick={() => navigate('/dashboard')}
          >
            Skip to Dashboard →
          </button>
        </header>

        {/* Stepper bar */}
        <div className="onboard-stepper">
          <div
            className={`onboard-step-pill ${step === 1 ? 'is-active' : 'is-done'}`}
            onClick={() => setStep(1)}
          >
            <span className="step-num">1</span>
            <span>Lifestyle & Routine</span>
          </div>
          <div className="onboard-step-line" />
          <div
            className={`onboard-step-pill ${step === 2 ? 'is-active' : ''}`}
            onClick={() => setStep(2)}
          >
            <span className="step-num">2</span>
            <span>Impact & Priorities</span>
          </div>
        </div>

        {/* Main Card Container */}
        <main className="onboard-card">
          {step === 1 ? (
            <div className="onboard-step-content">
              <div className="onboard-title-group">
                <span className="onboard-eyebrow">STEP 01 OF 02</span>
                <h2>Tell us about your daily footprint</h2>
                <p>We use government-verified emission factors (DEFRA, CEA) to tailor swaps for your life.</p>
              </div>

              {/* Commute Mode Selector */}
              <div className="onboard-section">
                <label className="onboard-label">PRIMARY COMMUTE</label>
                <div className="onboard-grid-commute">
                  {COMMUTE_ITEMS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`commute-card ${commute === item.value ? 'is-selected' : ''}`}
                      onClick={() => setCommute(item.value)}
                    >
                      <span className="commute-icon">{item.icon}</span>
                      <strong className="commute-label">{item.label}</strong>
                      <span className="commute-cut">{item.cut}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Choice */}
              <div className="onboard-section">
                <label className="onboard-label">DIETARY PREFERENCE</label>
                <div className="onboard-grid-diet">
                  {DIET_ITEMS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`diet-card ${diet === item.value ? 'is-selected' : ''}`}
                      onClick={() => setDiet(item.value)}
                    >
                      <span className="diet-icon">{item.icon}</span>
                      <div className="diet-info">
                        <strong>{item.label}</strong>
                        <span>{item.desc}</span>
                      </div>
                      <span className="diet-cut">{item.cut}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Household Size */}
              <div className="onboard-section onboard-split">
                <div>
                  <label className="onboard-label">HOUSEHOLD MEMBERS</label>
                  <p className="onboard-subhint">Helps calculate shared utility and energy deltas</p>
                </div>
                <div className="household-stepper">
                  <button
                    type="button"
                    onClick={() => setHouseholdSize((s) => Math.max(1, s - 1))}
                    disabled={householdSize <= 1}
                  >
                    -
                  </button>
                  <span className="household-val">{householdSize} {householdSize === 1 ? 'Person' : 'People'}</span>
                  <button
                    type="button"
                    onClick={() => setHouseholdSize((s) => Math.min(10, s + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="onboard-actions">
                <button
                  type="button"
                  className="onboard-next-btn"
                  onClick={() => setStep(2)}
                >
                  Continue to Priorities →
                </button>
              </div>
            </div>
          ) : (
            <div className="onboard-step-content">
              <div className="onboard-title-group">
                <span className="onboard-eyebrow">STEP 02 OF 02</span>
                <h2>What matters most to you?</h2>
                <p>Personalize your 7-day swap recommendations based on cost, effort, and interest.</p>
              </div>

              {/* Topics of Interest */}
              <div className="onboard-section">
                <label className="onboard-label">FOCUS TOPICS (SELECT MULTIPLE)</label>
                <div className="topics-chips-grid">
                  {TOPIC_CHIPS.map((chip) => {
                    const isSelected = interests.includes(chip.id);
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        className={`topic-chip ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => toggleInterest(chip.id)}
                      >
                        <span className="chip-label">{chip.label}</span>
                        <span className="chip-tag">{chip.tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Effort Tolerated */}
              <div className="onboard-section">
                <label className="onboard-label">EFFORT YOU WILL TOLERATE</label>
                <div className="effort-cards">
                  {[
                    { val: 'easy', label: 'Easy swaps only', desc: 'No routine change (LEDs, aerators, setpoints)' },
                    { val: 'moderate', label: 'Moderate changes', desc: 'Light habit shifts (transit 2x/wk, meal swaps)' },
                    { val: 'committed', label: 'Willing to invest', desc: 'High impact interventions (solar, EV, composting)' },
                  ].map((e) => (
                    <button
                      key={e.val}
                      type="button"
                      className={`effort-card ${effort === e.val ? 'is-selected' : ''}`}
                      onClick={() => setEffort(e.val as EffortLevel)}
                    >
                      <strong>{e.label}</strong>
                      <span>{e.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Sensitivity */}
              <div className="onboard-section">
                <label className="onboard-label">BUDGET SENSITIVITY</label>
                <div className="effort-cards">
                  {[
                    { val: 'low', label: 'Low — impact first', desc: 'Prioritise carbon cuts over costs' },
                    { val: 'medium', label: 'Medium — balanced', desc: 'Good balance of savings and cuts' },
                    { val: 'high', label: 'High — savings first', desc: 'Zero or negative net expenditure' },
                  ].map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      className={`effort-card ${budget === b.val ? 'is-selected' : ''}`}
                      onClick={() => setBudget(b.val as 'low' | 'medium' | 'high')}
                    >
                      <strong>{b.label}</strong>
                      <span>{b.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="onboard-preview-box">
                <div className="preview-stat">
                  <span className="preview-label">PROJECTED MONTHLY CO₂ SAVINGS</span>
                  <strong className="preview-num">0.7t <span>CO₂e / mo</span></strong>
                </div>
                <div className="preview-div" />
                <div className="preview-stat">
                  <span className="preview-label">ESTIMATED EXPENSE REDUCTION</span>
                  <strong className="preview-num preview-cash">₹2,840 <span>/ mo</span></strong>
                </div>
              </div>

              {error && <p className="onboard-error">{error}</p>}

              <div className="onboard-actions-row">
                <button
                  type="button"
                  className="onboard-back-btn"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="onboard-finish-btn"
                  onClick={handleFinish}
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? 'Preparing your dashboard…' : 'Launch My GreenSwap Dashboard →'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .onboard-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #F4EFE6 0%, #EDE5D8 50%, #F5F0E8 100%);
          color: #1B211E;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
          padding: 2.5rem 1.5rem 4rem;
        }
        .onboard-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .onboard-orb-1 {
          width: 500px;
          height: 500px;
          top: -100px;
          left: -100px;
          background: radial-gradient(circle, rgba(51, 89, 58, 0.12), transparent 70%);
        }
        .onboard-orb-2 {
          width: 450px;
          height: 450px;
          bottom: 0;
          right: -100px;
          background: radial-gradient(circle, rgba(163, 90, 56, 0.08), transparent 70%);
        }
        .onboard-shell {
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .onboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .onboard-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .onboard-logo {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #1B211E;
        }
        .onboard-logo .dot { color: #33593A; }
        .onboard-badge {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 0.25rem 0.6rem;
          background: rgba(51, 89, 58, 0.1);
          color: #33593A;
          border: 1px solid rgba(51, 89, 58, 0.2);
          border-radius: 999px;
        }
        .onboard-skip-btn {
          background: none;
          border: none;
          color: #535C55;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        .onboard-skip-btn:hover { color: #1B211E; }
        .onboard-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .onboard-step-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid #DFD7CA;
          border-radius: 999px;
          font-size: 0.78rem;
          color: #535C55;
          cursor: pointer;
          transition: all 0.2s;
        }
        .onboard-step-pill.is-active {
          background: #1B2B1F;
          border-color: #1B2B1F;
          color: #F5F0E8;
          font-weight: 600;
        }
        .onboard-step-pill.is-done {
          background: rgba(51, 89, 58, 0.12);
          border-color: #33593A;
          color: #33593A;
        }
        .step-num {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(0, 0, 0, 0.08);
        }
        .onboard-step-pill.is-active .step-num {
          background: rgba(255, 255, 255, 0.25);
          color: #fff;
        }
        .onboard-step-line {
          width: 32px;
          height: 2px;
          background: #DFD7CA;
        }
        .onboard-card {
          background: rgba(253, 251, 247, 0.85);
          border: 1px solid #DFD7CA;
          box-shadow: 0 16px 48px rgba(27, 43, 31, 0.08);
          border-radius: 20px;
          padding: 2.8rem;
          backdrop-filter: blur(16px);
        }
        .onboard-title-group {
          margin-bottom: 2rem;
        }
        .onboard-eyebrow {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #7A8A7D;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.5rem;
        }
        .onboard-title-group h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1B211E;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .onboard-title-group p {
          font-size: 0.9rem;
          color: #535C55;
          margin: 0;
          line-height: 1.5;
        }
        .onboard-section {
          margin-bottom: 2rem;
        }
        .onboard-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #848E86;
          text-transform: uppercase;
          margin-bottom: 0.85rem;
        }
        .onboard-grid-commute {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }
        .commute-card {
          padding: 1rem;
          background: #FAF8F4;
          border: 1.5px solid #DFD7CA;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .commute-card:hover {
          border-color: #33593A;
          transform: translateY(-2px);
        }
        .commute-card.is-selected {
          border-color: #33593A;
          background: rgba(51, 89, 58, 0.08);
          box-shadow: 0 0 0 3px rgba(51, 89, 58, 0.18);
        }
        .commute-icon { font-size: 1.4rem; }
        .commute-label { font-size: 0.85rem; color: #1B211E; font-weight: 700; }
        .commute-cut { font-size: 0.68rem; color: #33593A; font-weight: 600; }

        .onboard-grid-diet {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }
        .diet-card {
          padding: 1rem 1.2rem;
          background: #FAF8F4;
          border: 1.5px solid #DFD7CA;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .diet-card:hover { border-color: #33593A; transform: translateY(-2px); }
        .diet-card.is-selected {
          border-color: #33593A;
          background: rgba(51, 89, 58, 0.08);
          box-shadow: 0 0 0 3px rgba(51, 89, 58, 0.18);
        }
        .diet-icon { font-size: 1.6rem; }
        .diet-info strong { display: block; font-size: 0.85rem; color: #1B211E; }
        .diet-info span { font-size: 0.72rem; color: #535C55; }
        .diet-cut { font-size: 0.68rem; font-weight: 700; color: #33593A; margin-left: auto; }

        .onboard-split {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 12px;
        }
        .onboard-split .onboard-label { margin-bottom: 0.2rem; }
        .onboard-subhint { font-size: 0.75rem; color: #848E86; margin: 0; }
        .household-stepper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .household-stepper button {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #DFD7CA;
          background: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1B211E;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .household-stepper button:hover:not(:disabled) {
          border-color: #33593A;
          color: #33593A;
        }
        .household-val {
          font-weight: 700;
          font-size: 0.9rem;
          min-width: 70px;
          text-align: center;
        }

        .topics-chips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .topic-chip {
          padding: 0.85rem 1rem;
          background: #FAF8F4;
          border: 1.5px solid #DFD7CA;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          transition: all 0.2s;
        }
        .topic-chip:hover { border-color: #33593A; }
        .topic-chip.is-selected {
          border-color: #33593A;
          background: rgba(51, 89, 58, 0.1);
        }
        .chip-label { font-size: 0.82rem; font-weight: 700; color: #1B211E; }
        .chip-tag { font-size: 0.65rem; color: #33593A; font-weight: 600; }

        .effort-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .effort-card {
          padding: 1rem;
          background: #FAF8F4;
          border: 1.5px solid #DFD7CA;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .effort-card:hover { border-color: #33593A; }
        .effort-card.is-selected {
          border-color: #33593A;
          background: rgba(51, 89, 58, 0.1);
          box-shadow: 0 0 0 3px rgba(51, 89, 58, 0.18);
        }
        .effort-card strong { font-size: 0.85rem; color: #1B211E; }
        .effort-card span { font-size: 0.72rem; color: #535C55; line-height: 1.4; }

        .onboard-preview-box {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1.4rem 2rem;
          background: #1B2B1F;
          color: #F5F0E8;
          border-radius: 16px;
          margin-bottom: 2rem;
        }
        .preview-stat { text-align: center; }
        .preview-label { font-size: 0.62rem; letter-spacing: 0.12em; color: rgba(245, 240, 232, 0.7); display: block; margin-bottom: 0.35rem; }
        .preview-num { font-family: 'Fraunces', Georgia, serif; font-size: 1.8rem; font-weight: 700; color: #c8dfca; }
        .preview-num span { font-size: 0.85rem; font-family: 'DM Sans', sans-serif; font-weight: 500; color: rgba(245, 240, 232, 0.65); }
        .preview-cash { color: #e6ad7c; }
        .preview-div { width: 1px; height: 44px; background: rgba(255, 255, 255, 0.15); }

        .onboard-actions { margin-top: 2rem; text-align: right; }
        .onboard-actions-row { display: flex; align-items: center; justify-content: space-between; margin-top: 2rem; }
        .onboard-next-btn, .onboard-finish-btn {
          padding: 0.85rem 2rem;
          background: #1B2B1F;
          color: #F5F0E8;
          border-radius: 999px;
          border: none;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .onboard-next-btn:hover, .onboard-finish-btn:hover {
          background: #27452d;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(27, 43, 31, 0.25);
        }
        .onboard-back-btn {
          background: none;
          border: none;
          color: #535C55;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .onboard-back-btn:hover { color: #1B211E; }
        .onboard-error { color: #C84B26; font-size: 0.8rem; margin-top: 1rem; text-align: center; }

        @media (max-width: 768px) {
          .onboard-card { padding: 1.5rem; }
          .onboard-grid-commute, .onboard-grid-diet, .topics-chips-grid, .effort-cards {
            grid-template-columns: 1fr;
          }
          .onboard-preview-box { flex-direction: column; gap: 1rem; }
          .preview-div { display: none; }
        }
      `}</style>
    </div>
  );
}
