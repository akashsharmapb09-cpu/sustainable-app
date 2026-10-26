import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Bike,
  Check,
  CircleCheck,
  Droplets,
  Flame,
  Footprints,
  Leaf,
  Lightbulb,
  Pencil,
  Plus,
  ShieldCheck,
  Shirt,
  ShowerHead,
  Sparkles,
  Sprout,
  Trash2,
  TrainFront,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnalyticsTab } from './AnalyticsTab';
import { getRoutineSwaps, normalizeRoutineCategory, removeRoutineSwap, subscribeToRoutineSwaps, type RoutineSwap } from './routineSwapStore';

interface RoutineAction {
  id: string;
  label: string;
  category: string;
  saving: string;
  completed: boolean;
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


function routineDateKey(value: string | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function routineStreak(swaps: RoutineSwap[]): number {
  const activityDates = new Set(
    swaps
      .map((swap) => routineDateKey(swap.lastActiveAt ?? swap.createdAt))
      .filter((date): date is string => Boolean(date))
  );
  const anchor = new Date();
  anchor.setHours(0, 0, 0, 0);
  const todayKey = routineDateKey(anchor.toISOString());
  if (!todayKey || !activityDates.has(todayKey)) {
    anchor.setDate(anchor.getDate() - 1);
    const yesterdayKey = routineDateKey(anchor.toISOString());
    if (!yesterdayKey || !activityDates.has(yesterdayKey)) return 0;
  }
  let streak = 0;
  while (activityDates.has(routineDateKey(anchor.toISOString()) ?? '')) {
    streak += 1;
    anchor.setDate(anchor.getDate() - 1);
  }
  return streak;
}

function buildRoutineAnalytics(swaps: RoutineSwap[]) {
  if (swaps.length === 0) return undefined;

  const categoryNames = ['Transport', 'Food', 'Energy', 'Shopping & Waste'] as const;
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  const monthlyData: Record<string, {
    monthlyCo2eKg: number;
    waterLitres: number;
    netSavings: number;
    streak: number;
    categories: { name: string; percent: number }[];
  }> = {};

  for (let offset = 11; offset >= 0; offset -= 1) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59, 999);
    const monthKey = monthStart.getFullYear() + '-' + String(monthStart.getMonth() + 1).padStart(2, '0');
    const activeByMonthEnd = swaps.filter((swap) => {
      const created = new Date(swap.createdAt);
      return Number.isNaN(created.getTime()) || created.getFullYear() === 1970 || created <= monthEnd;
    });

    const categoryTotals: Record<(typeof categoryNames)[number], number> = {
      Transport: 0,
      Food: 0,
      Energy: 0,
      'Shopping & Waste': 0,
    };
    let monthlyCo2eKg = 0;
    let waterLitres = 0;
    let netSavings = 0;

    for (const swap of activeByMonthEnd) {
      const co2 = Number.isFinite(swap.co2Saved) ? Math.max(0, swap.co2Saved) : 0;
      monthlyCo2eKg += co2;
      waterLitres += Number.isFinite(swap.waterSaved) ? Math.max(0, swap.waterSaved) : 0;
      netSavings += Number.isFinite(swap.costDiff) ? swap.costDiff : 0;
      categoryTotals[normalizeRoutineCategory(swap.category)] += co2;
    }

    const categoryTotal = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
    const categories = categoryNames.map((name) => ({
      name: name === 'Shopping & Waste' ? 'Shopping' : name,
      percent: categoryTotal > 0 ? Math.round((categoryTotals[name] / categoryTotal) * 100) : 0,
    }));
    monthlyData[monthKey] = {
      monthlyCo2eKg: Math.round(monthlyCo2eKg),
      waterLitres: Math.round(waterLitres),
      netSavings: Math.round(netSavings),
      streak: routineStreak(activeByMonthEnd),
      categories,
    };
  }

  const currentMonthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const current = monthlyData[currentMonthKey] ?? {
    monthlyCo2eKg: 0,
    waterLitres: 0,
    netSavings: 0,
    streak: 0,
    categories: categoryNames.map((name) => ({ name: name === 'Shopping & Waste' ? 'Shopping' : name, percent: 0 })),
  };
  return { ...current, weekly: [0, 0, 0, 0], monthlyData };
}

function getHabitIcon(label: string): LucideIcon {
  const value = label.toLowerCase();
  if (value.includes('shower')) return ShowerHead;
  if (value.includes('water') || value.includes('tap')) return Droplets;
  if (value.includes('plant') || value.includes('garden')) return Sprout;
  if (value.includes('walk') || value.includes('cycle') || value.includes('bike')) return Bike;
  if (value.includes('meal') || value.includes('food') || value.includes('waste')) return Utensils;
  if (value.includes('bulb') || value.includes('led') || value.includes('light')) return Lightbulb;
  if (value.includes('second-hand') || value.includes('clothes') || value.includes('shirt')) return Shirt;
  return Leaf;
}

function getSwapVisual(swap: RoutineSwap): { Icon: LucideIcon; tone: string; label: string } {
  const value = (swap.id + ' ' + swap.title).toLowerCase();
  if (value.includes('ev-2w') || value.includes('electric bike') || value.includes('e-bike') || value.includes('ebike')) {
    return { Icon: Zap, tone: 'blue', label: 'Electric mobility' };
  }
  if (value.includes('metro') || value.includes('train')) {
    return { Icon: TrainFront, tone: 'purple', label: 'Public transit' };
  }
  if (value.includes('bike') || value.includes('cycle')) {
    return { Icon: Bike, tone: 'orange', label: 'Active transport' };
  }
  if (swap.category === 'Transport') return { Icon: Footprints, tone: 'blue', label: 'Low-carbon travel' };
  if (swap.category === 'Food') return { Icon: Sprout, tone: 'green', label: 'Conscious food' };
  if (swap.category === 'Energy') return { Icon: Lightbulb, tone: 'yellow', label: 'Energy saver' };
  return { Icon: Leaf, tone: 'green', label: 'Everyday swap' };
}

export function LogActivityPage() {
  const [actions, setActions] = useState<RoutineAction[]>(INITIAL_ACTIONS);
  const [activeTab, setActiveTab] = useState<'plan' | 'swaps' | 'analytics'>('plan');
  const [routineSwaps, setRoutineSwaps] = useState<RoutineSwap[]>([]);
  const [customHabitOpen, setCustomHabitOpen] = useState(false);
  const [customHabitLabel, setCustomHabitLabel] = useState('');
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [tipsExpanded, setTipsExpanded] = useState(false);

  useEffect(() => {
    const refreshSwaps = () => setRoutineSwaps(getRoutineSwaps());
    refreshSwaps();
    return subscribeToRoutineSwaps(refreshSwaps);
  }, []);

  const toggleAction = (id: string) => {
    setActions((previous) => previous.map((action) =>
      action.id === id ? { ...action, completed: !action.completed } : action
    ));
  };

  const saveCustomHabit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = customHabitLabel.trim();
    if (!label) return;
    setActions((previous) => [...previous, {
      id: 'custom-' + Date.now(),
      label,
      category: 'Custom',
      saving: '-0.5 kg CO₂e',
      completed: false,
    }].slice(0, 12));
    setCustomHabitLabel('');
    setCustomHabitOpen(false);
  };

  const saveEditedHabit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = editingLabel.trim();
    if (!editingActionId || !label) return;
    setActions((previous) => previous.map((action) =>
      action.id === editingActionId ? { ...action, label } : action
    ));
    setEditingActionId(null);
    setEditingLabel('');
  };

  const completedCount = actions.filter((action) => action.completed).length;
  const progressPercent = actions.length ? Math.round((completedCount / actions.length) * 100) : 0;
  const premiumAnalyticsData = useMemo(() => buildRoutineAnalytics(routineSwaps), [routineSwaps]);
  const totalSwapImpact = routineSwaps.reduce((total, swap) => total + Math.max(0, swap.co2Saved), 0);
  const displayCurrency = (value: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(value);
  const impactGoal = 750;
  const impactProgress = Math.min(100, Math.round((totalSwapImpact / impactGoal) * 100));

  return (
    <div className={`routine-app ${activeTab === 'plan' ? 'routine-plan-active' : ''}`}>
      <main className={`routine-main ${activeTab === 'plan' ? 'routine-main-compact' : ''}`}>
        {activeTab !== 'analytics' && (
          <>
            <header className="routine-page-header">
              <div className="routine-eyebrow"><span className="eyebrow-line" /> YOUR EVERYDAY, BETTER</div>
              <div className="routine-heading-row">
                <div>
                  <h1 className="routine-title">Your routine</h1>
                  <p className="routine-sub">Tiny choices. Real momentum. A healthier planet starts here.</p>
                </div>
                <Link to="/impact" className="routine-day-chip" aria-label="Go to your green impact journey"><span className="routine-day-dot" /> YOUR GREEN JOURNEY <span>↗</span></Link>
              </div>
            </header>

            <div className="routine-tabs" role="tablist" aria-label="Routine views">
              <button type="button" role="tab" aria-selected={activeTab === 'plan'} className={`routine-tab ${activeTab === 'plan' ? 'is-active' : ''}`} onClick={() => setActiveTab('plan')}>7-day plan</button>
              <button type="button" role="tab" aria-selected={activeTab === 'swaps'} className={`routine-tab ${activeTab === 'swaps' ? 'is-active' : ''}`} onClick={() => setActiveTab('swaps')}>Your swaps <span className="tab-count">{routineSwaps.length}</span></button>
              <button type="button" role="tab" aria-selected={false} className="routine-tab" onClick={() => setActiveTab('analytics')}>Analytics</button>
            </div>
          </>
        )}

        {activeTab === 'plan' && (
          <>
            <section className="challenge-intro">
              <div className="challenge-intro-copy">
                <span className="mini-overline">YOUR PERSONAL GREEN QUEST</span>
                <div className="challenge-title-row">
                  <h2>Your 7-day challenge</h2>
                  <span className="completed-pill"><Sparkles size={17} /> {completedCount}/{actions.length} completed</span>
                </div>
                <p>Stack tiny wins, build a feel-good streak, and watch your impact grow.</p>
              </div>
              <div className="challenge-confetti" aria-hidden="true">
                <span /><span /><span /><span /><span /><span /><span />
              </div>
            </section>

            <section className="challenge-progress-card" aria-label="Challenge progress">
              <div className="progress-ring-wrap">
                <svg className="progress-ring" viewBox="0 0 132 132" role="img" aria-label={`${completedCount} of ${actions.length} habits completed`}>
                  <circle className="progress-ring-track" cx="66" cy="66" r="52" />
                  <circle className="progress-ring-value" cx="66" cy="66" r="52" strokeDasharray="326.73" strokeDashoffset={String(326.73 * (1 - completedCount / Math.max(1, actions.length)))} />
                </svg>
                <div className="progress-ring-label"><strong>{completedCount}/{actions.length}</strong><span>days done</span></div>
              </div>
              <div className="progress-card-copy">
                <span className="progress-kicker">LOOK AT YOU GO</span>
                <h3>{completedCount}/{actions.length} days done</h3>
                <p>Every completed habit is proof that small choices add up.</p>
                <div className="progress-bar-track" role="progressbar" aria-label="Challenge completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
                  <span style={{ width: progressPercent + '%' }} />
                </div>
                <div className="progress-meta"><span>{progressPercent}% of your challenge</span><strong>{actions.length - completedCount} to go</strong></div>
              </div>
              <div className="progress-card-stats">
                <div className="streak-stat"><span className="streak-fire"><Flame size={21} fill="currentColor" /></span><div><strong>🔥 {completedCount}-day streak</strong><span>Keep it going! You’re on fire.</span></div></div>
                <div className="impact-stat"><span className="impact-stat-icon"><Leaf size={21} /></span><div><strong>6.2 kg CO₂e</strong><span>saved this week</span></div></div>
              </div>
              <div className="progress-doodle" aria-hidden="true">✦<span>✳</span>·</div>
            </section>

            <div className="plan-layout">
              <section className="habits-panel" aria-labelledby="habits-heading">
                <div className="panel-heading-row">
                  <div><span className="panel-overline">THE LITTLE THINGS</span><h2 id="habits-heading">Your daily wins</h2><p>Tap the circle when you’ve done one. Celebrate every win.</p></div>
                  <span className="habits-count">{completedCount} / {actions.length} <CircleCheck size={17} /></span>
                </div>

                <div className="habit-list">
                  {actions.map((action, index) => {
                    const Icon = getHabitIcon(action.label);
                    const isEditing = editingActionId === action.id;
                    return (
                      <article key={action.id} className={`habit-item ${action.completed ? 'is-completed' : ''}`} style={{ animationDelay: (index * 35) + 'ms' }}>
                        {action.completed ? <span className="habit-confetti" aria-hidden="true"><i/><i/><i/><i/><i/></span> : null}
                        <div className="habit-card-top">
                          <button type="button" className="habit-toggle" onClick={() => toggleAction(action.id)} aria-pressed={action.completed} aria-label={action.completed ? 'Mark ' + action.label + ' incomplete' : 'Complete ' + action.label}>
                            {action.completed ? <Check size={15} strokeWidth={3} /> : <span className="habit-number">{String(index + 1).padStart(2, '0')}</span>}
                          </button>
                          <span className={`habit-icon-wrap ${action.completed ? 'completed-icon' : ''}`}><Icon size={16} strokeWidth={1.9} /></span>
                          <button type="button" className="habit-edit" aria-label={'Edit ' + action.label} title="Edit habit" onClick={() => { setEditingActionId(action.id); setEditingLabel(action.label); }}><Pencil size={13}/></button>
                        </div>
                        <div className="habit-copy">
                          {isEditing ? (
                            <form className="habit-edit-form" onSubmit={saveEditedHabit}>
                              <input autoFocus aria-label="Edit habit name" value={editingLabel} onChange={(event) => setEditingLabel(event.target.value)} maxLength={90}/>
                              <button type="submit" aria-label="Save habit name"><Check size={17}/></button>
                              <button type="button" aria-label="Cancel edit" onClick={() => setEditingActionId(null)}>×</button>
                            </form>
                          ) : (
                            <>
                              <span className={`habit-name ${action.completed ? 'has-strike' : ''}`}>{action.label}</span>
                              <span className="habit-subline">{action.category} <i>•</i> One step toward a lighter footprint</span>
                            </>
                          )}
                        </div>
                        <span className="habit-saving"><Leaf size={11} /> {action.saving}</span>
                      </article>
                    );
                  })}
                </div>

                {customHabitOpen ? (
                  <form className="custom-habit-form" onSubmit={saveCustomHabit}>
                    <label htmlFor="custom-habit-name">What small green habit would you like to add?</label>
                    <div><input id="custom-habit-name" autoFocus value={customHabitLabel} onChange={(event) => setCustomHabitLabel(event.target.value)} placeholder="e.g. Bring my own coffee cup" maxLength={90} required/><button type="submit"><Plus size={17}/> Add habit</button></div>
                  </form>
                ) : null}
                <button type="button" className="add-habit-btn" onClick={() => setCustomHabitOpen((open) => !open)}><Plus size={19} strokeWidth={2.5}/>{customHabitOpen ? 'Close custom habit' : 'Add custom habit'}<span>Make it yours</span></button>
              </section>

              <aside className="plan-widgets">
                <article className="tip-card premium-tip-card">
                  <div className="tip-decoration" aria-hidden="true"><Droplets size={56} strokeWidth={1.3}/><span>✳</span></div>
                  <span className="widget-overline">A LITTLE CHANGE, A BIG WIN</span>
                  <h2>Today’s Tip <span>💧</span></h2>
                  <p>Turn the tap off while brushing — saves around <strong>10 litres</strong> of water each time.</p>
                  {tipsExpanded ? <p className="extra-tip">Try keeping a reusable cup by the sink as a friendly reminder. Tiny routines make saving water automatic.</p> : null}
                  <button type="button" className="text-link-button" onClick={() => setTipsExpanded((expanded) => !expanded)}>{tipsExpanded ? 'Less tip' : 'See more tips'} <ArrowRight size={17}/></button>
                </article>

                <article className="quote-card premium-quote-card">
                  <span className="quote-spark quote-spark-one">✳</span><span className="quote-spark quote-spark-two">✦</span>
                  <span className="quote-label">A NOTE TO GROW BY</span>
                  <blockquote>“Progress, not perfection, leads to a cleaner planet.”</blockquote>
                  <div className="quote-footer"><span className="quote-leaf-mark"><Leaf size={23}/></span><span>Every day is a fresh start.</span></div>
                  <svg className="quote-line-art" viewBox="0 0 100 80" aria-hidden="true"><path d="M8 72C13 36 39 10 88 7C83 48 51 72 8 72Z" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M10 70L75 17M34 51L27 30M52 37L74 41" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>
                </article>
              </aside>
            </div>
          </>
        )}

        {activeTab === 'swaps' && (
          <>
            <section className="swaps-intro">
              <div><span className="mini-overline">YOUR BETTER EVERYDAY</span><h2>Your swaps, <em>your impact.</em></h2><p>Every sustainable switch is a vote for the future you want.</p></div>
              <div className="swaps-intro-stamp"><Leaf size={25}/><span>CONSCIOUS<br/>BY CHOICE</span></div>
            </section>

            <div className="swaps-layout">
              <section className="swaps-panel" aria-labelledby="active-swaps-heading">
                <div className="swaps-heading">
                  <div><span className="panel-overline">THE SWAPS YOU’VE CHOSEN</span><h2 id="active-swaps-heading">Active Adopted Swaps</h2><p>Your sustainable switches, all in one place.</p></div>
                  <span className="active-swaps-badge">{routineSwaps.length} active</span>
                </div>

                {routineSwaps.length === 0 ? (
                  <div className="swaps-empty">
                    <span className="empty-leaf"><Leaf size={31}/></span>
                    <h3>Your next small win starts here.</h3>
                    <p>Add a swap from the catalogue and it’ll show up here with its monthly impact.</p>
                    <Link to="/catalogue" className="browse-swaps-button">Explore swaps <ArrowRight size={17}/></Link>
                  </div>
                ) : (
                  <div className="swaps-list-grid">
                    {routineSwaps.map((swap) => {
                      const visual = getSwapVisual(swap);
                      const Icon = visual.Icon;
                      const moneyLabel = swap.costDiff > 0 ? 'Save ' + displayCurrency(swap.costDiff) + '/mo'
                        : swap.costDiff < 0 ? 'Extra cost ' + displayCurrency(Math.abs(swap.costDiff)) + '/mo'
                        : 'No cost estimate';
                      const created = new Date(swap.createdAt);
                      const dateLabel = Number.isNaN(created.getTime()) || created.getFullYear() === 1970
                        ? 'Part of your routine'
                        : 'Added ' + created.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                      return (
                        <article className="adopted-swap-item" key={swap.id}>
                          <span className={`swap-icon-square tone-${visual.tone}`}><Icon size={27} strokeWidth={1.8}/></span>
                          <div className="adopted-item-left">
                            <span className="swap-date-label">{dateLabel} <i>·</i> {visual.label}</span>
                            <h3 className="adopted-item-title">{swap.title}</h3>
                            <p className="adopted-item-meta">{swap.category} <i>•</i> {moneyLabel}</p>
                          </div>
                          <div className="adopted-item-right">
                            <span className="adopted-co2-pill">−{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(swap.co2Saved)} kg CO₂e / mo</span>
                            <button type="button" className="remove-swap-btn" onClick={() => removeRoutineSwap(swap.id)} aria-label={'Remove ' + swap.title} title="Remove swap"><Trash2 size={17}/><span>Remove</span></button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
                <div className="swaps-panel-footer"><span><CircleCheck size={18}/> {routineSwaps.length} sustainable {routineSwaps.length === 1 ? 'choice' : 'choices'} in your toolkit</span><Link to="/catalogue" className="swaps-footer-link">Add another <ArrowRight size={16}/></Link></div>
              </section>

              <aside className="swaps-widgets">
                <article className="impact-widget">
                  <span className="widget-overline">THE BIGGER PICTURE</span>
                  <div className="impact-widget-icon"><TrendingUp size={23}/></div>
                  <h3>Total impact <span>this month</span></h3>
                  <p className="impact-number">{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(totalSwapImpact)} <span>kg CO₂e</span></p>
                  <p className="impact-caption">estimated carbon emissions avoided</p>
                  <div className="impact-progress-track" role="progressbar" aria-label="Monthly carbon goal" aria-valuemin={0} aria-valuemax={100} aria-valuenow={impactProgress}><span style={{ width: impactProgress + '%' }}/></div>
                  <div className="impact-progress-meta"><strong>{impactProgress}% of goal</strong><span>{Math.max(0, impactGoal - totalSwapImpact).toLocaleString('en-IN')} kg to go</span></div>
                  <div className="impact-widget-foot"><Leaf size={17}/> Your choices are adding up.</div>
                </article>
                <article className="streak-widget">
                  <div className="streak-orb"><Flame size={30} fill="currentColor"/></div>
                  <span className="widget-overline">CONSISTENCY IS EVERYTHING</span>
                  <h3>Your streak</h3>
                  <p className="streak-number">12 <span>days</span></p>
                  <div className="streak-week-dots" aria-label="Seven day activity streak"><span/><span/><span/><span/><span/><span/><span/></div>
                  <p className="streak-note">One good choice makes the next one easier.</p>
                </article>
              </aside>
            </div>
          </>
        )}

        {activeTab === 'analytics' && <AnalyticsTab embedded onBack={() => setActiveTab('plan')} {...(premiumAnalyticsData ?? {})} />}

        {activeTab === 'swaps' && (
          <>
            <section id="methodology" className="methodology-panel" aria-labelledby="methodology-heading">
              <div className="methodology-topline"><span className="methodology-icon"><ShieldCheck size={23}/></span><span>OPEN BOOK. HONEST IMPACT.</span><span className="methodology-dashes" /></div>
              <div className="methodology-content">
                <div className="methodology-heading"><span className="mini-overline">THE NUMBERS, EXPLAINED</span><h2 id="methodology-heading">Good choices deserve <em>clear numbers.</em></h2><p>We make the thinking behind your impact visible, so every kilogram and litre has context.</p></div>
                <div className="methodology-facts">
                  <article><span className="methodology-fact-icon"><Leaf size={20}/></span><h3>Carbon estimates</h3><p>Each swap uses GreenSwap’s catalogue estimate for monthly CO₂e avoided.</p></article>
                  <article><span className="methodology-fact-icon"><Wallet size={20}/></span><h3>Money saved</h3><p>Savings are based on the monthly cost difference recorded for each swap.</p></article>
                  <article><span className="methodology-fact-icon"><TrendingUp size={20}/></span><h3>Progress over time</h3><p>Your routine updates as swaps are added or removed. Estimates are directional, not a personal footprint audit.</p></article>
                </div>
              </div>
            </section>

            <section className="discover-banner">
              <div className="discover-leaf-art" aria-hidden="true">
                <svg viewBox="0 0 190 150" fill="none"><path d="M22 129C29 71 78 21 165 12C157 82 101 126 22 129Z" stroke="currentColor" strokeWidth="1.5"/><path d="M25 127L145 27M73 86L65 48M101 63L137 66M48 106L39 82M126 44L124 22" stroke="currentColor" strokeWidth="1.3"/><path d="M13 141C40 137 48 128 58 118" stroke="currentColor" strokeWidth="1.2"/></svg>
              </div>
              <div className="discover-copy"><span className="mini-overline">YOUR NEXT WIN IS WAITING</span><h2>Discover more swaps.</h2><p>Small shifts, better routines, a greener future. Find the swaps that fit your life.</p></div>
              <Link to="/catalogue" className="discover-button">Browse swaps <ArrowRight size={19}/></Link>
              <span className="discover-spark discover-spark-one" aria-hidden="true">✦</span><span className="discover-spark discover-spark-two" aria-hidden="true">✳</span>
            </section>
          </>
        )}
      </main>

      <style>{`
        .routine-app {
          --routine-green: #1A3D2E;
          --routine-green-deep: #123124;
          --routine-leaf: #2E7D52;
          --routine-cream: #FFFEF9;
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          background: var(--routine-cream);
          color: #1d2b22;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
          overflow: clip;
          isolation: isolate;
        }
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 30px 20px 24px;
          background: #1A3D2E;
          color: #f6f8ef;
          overflow: hidden;
        }
        .routine-main { min-width: 0; width: 100%; max-width: none; margin: 0; padding: 38px clamp(22px, 3.6vw, 58px) 48px; }
        .routine-page-header { position: relative; padding: 3px 0 29px; border-bottom: 1px solid #e8e8dc; }
        .routine-eyebrow,.mini-overline,.panel-overline,.widget-overline,.progress-kicker,.quote-label,.methodology-topline { display: flex; align-items: center; gap: 9px; color: #6e8371; font-size: 14px; font-weight: 850; letter-spacing: .15em; }
        .eyebrow-line { display: inline-block; width: 26px; height: 2px; background: #3b8957; }
        .routine-heading-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-top: 13px; }
        .routine-title { margin: 0; color: #14291d; font-size: clamp(48px, 4.8vw, 64px); font-weight: 950; line-height: 1; letter-spacing: -.065em; }
        .routine-sub { max-width: 690px; margin: 16px 0 0; color: #66766a; font-size: 18px; line-height: 1.6; }
        .routine-day-chip { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; margin-bottom: 8px; padding: 11px 15px; border: 1px solid #e3e9db; border-radius: 999px; background: #fff; color: #4f6854; font-size: 14px; font-weight: 800; letter-spacing: .04em; text-decoration: none; cursor: pointer; transition: transform .2s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease; }
        .routine-day-chip:hover { transform: translateY(-2px); border-color: #b8d5b6; background: #f7fbf4; box-shadow: 0 8px 20px #1a3d2e10; }
        .routine-day-chip > span:last-child { color: #358151; font-size: 17px; }
        .routine-day-dot { width: 8px; height: 8px; border-radius: 50%; background: #45a566; box-shadow: 0 0 0 5px #45a56618; }
        .routine-tabs { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin: 28px 0 32px; }
        .routine-tab { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 44px; padding: 10px 24px; border: 1px solid #e7e5dc; border-radius: 999px; background: #fff; color: #5c6b5f; cursor: pointer; font: inherit; font-size: 15px; font-weight: 750; transition: color .2s ease, background .2s ease, box-shadow .2s ease, transform .2s ease; }
        .routine-tab:hover { transform: translateY(-1px); border-color: #a5b9a6; box-shadow: 0 5px 15px #10291b0a; }
        .routine-tab.is-active { border-color: #1A3D2E; background: #1A3D2E; color: #fff; box-shadow: 0 8px 18px #1a3d2e25; }
        .tab-count { display: grid; place-items: center; min-width: 23px; height: 23px; padding: 0 5px; border-radius: 50%; background: #edf3e8; color: #1A3D2E; font-size: 14px; }
        .routine-tab.is-active .tab-count { background: #ffffff20; color: #fff; }
        .challenge-intro { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 19px; overflow: hidden; }
        .challenge-intro-copy { position: relative; z-index: 1; }
        .challenge-intro .mini-overline { margin-bottom: 9px; }
        .challenge-title-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
        .challenge-title-row h2 { margin: 0; color: #152a1d; font-size: clamp(32px, 3vw, 40px); line-height: 1.12; font-weight: 950; letter-spacing: -.05em; }
        .challenge-intro p { max-width: 730px; margin: 10px 0 0; color: #67776b; font-size: 16px; line-height: 1.55; }
        .completed-pill { display: inline-flex; align-items: center; gap: 7px; border-radius: 999px; background: #238446; color: #fff; padding: 9px 14px; font-size: 14px; font-weight: 850; box-shadow: 0 5px 12px #23844624; }
        .challenge-confetti { position: absolute; right: 1%; top: 0; width: 140px; height: 75px; pointer-events: none; opacity: .65; }
        .challenge-confetti span { position: absolute; width: 7px; height: 7px; border-radius: 2px; background: #94c98f; animation: float-confetti 4s ease-in-out infinite; }
        .challenge-confetti span:nth-child(1) { top: 6px; right: 48px; transform: rotate(25deg); }
        .challenge-confetti span:nth-child(2) { top: 23px; right: 13px; width: 5px; height: 5px; background: #df9b62; animation-delay: .5s; }
        .challenge-confetti span:nth-child(3) { top: 43px; right: 69px; background: #a9bedf; animation-delay: .8s; }
        .challenge-confetti span:nth-child(4) { top: 12px; right: 95px; width: 4px; height: 4px; background: #df9b62; animation-delay: 1s; }
        .challenge-confetti span:nth-child(5) { top: 57px; right: 34px; width: 4px; height: 4px; animation-delay: 1.3s; }
        .challenge-confetti span:nth-child(6) { top: 37px; right: 111px; width: 6px; height: 6px; background: #c9b9de; animation-delay: .2s; }
        .challenge-confetti span:nth-child(7) { top: 1px; right: 4px; width: 4px; height: 4px; background: #df9b62; animation-delay: 1.2s; }
        .challenge-progress-card { position: relative; display: grid; grid-template-columns: 150px minmax(210px, 1fr) minmax(210px, .9fr); align-items: center; gap: 25px; padding: 26px 30px; border: 1px solid #dcebdc; border-radius: 22px; background: #E8F5E9; box-shadow: 0 11px 30px #1a3d2e0b; overflow: hidden; }
        .progress-ring-wrap { position: relative; display: grid; place-items: center; width: 142px; height: 142px; }
        .progress-ring { width: 142px; height: 142px; transform: rotate(-90deg); overflow: visible; }
        .progress-ring circle { fill: none; stroke-width: 10; }
        .progress-ring-track { stroke: #c9e1c9; }
        .progress-ring-value { stroke: #1A3D2E; stroke-linecap: round; transition: stroke-dashoffset .7s cubic-bezier(.22,1,.36,1); }
        .progress-ring-label { position: absolute; display: flex; flex-direction: column; align-items: center; color: #1A3D2E; }
        .progress-ring-label strong { font-size: 31px; font-weight: 950; letter-spacing: -1.8px; line-height: 1; }
        .progress-ring-label span { margin-top: 6px; font-size: 14px; font-weight: 750; }
        .progress-card-copy { min-width: 0; }
        .progress-kicker { color: #3d7950; }
        .progress-card-copy h3 { margin: 8px 0 6px; color: #1A3D2E; font-size: 26px; font-weight: 900; letter-spacing: -.04em; }
        .progress-card-copy p { margin: 0; color: #5e7663; font-size: 15px; line-height: 1.55; }
        .progress-bar-track { height: 9px; margin-top: 18px; border-radius: 99px; background: #cfe5cd; overflow: hidden; }
        .progress-bar-track span { display: block; height: 100%; border-radius: inherit; background: #1A3D2E; transition: width .5s ease; }
        .progress-meta { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; color: #617a65; font-size: 14px; }
        .progress-meta strong { color: #1A3D2E; font-weight: 850; }
        .progress-card-stats { display: flex; flex-direction: column; gap: 17px; padding-left: 26px; border-left: 1px solid #c6dfc5; }
        .streak-stat,.impact-stat { display: flex; align-items: center; gap: 12px; }
        .streak-fire,.impact-stat-icon { display: grid; place-items: center; width: 43px; height: 43px; flex-shrink: 0; border-radius: 14px; color: #1A3D2E; background: #fff9e5; box-shadow: 0 5px 14px #1a3d2e0b; }
        .streak-stat > div,.impact-stat > div { display: flex; flex-direction: column; gap: 4px; }
        .streak-stat strong,.impact-stat strong { color: #1A3D2E; font-size: 16px; font-weight: 900; }
        .streak-stat span:not(.streak-fire),.impact-stat span:not(.impact-stat-icon) { color: #5c7462; font-size: 14px; line-height: 1.4; }
        .impact-stat-icon { color: #fff; background: #2e7d52; }
        .progress-doodle { position: absolute; top: 10px; right: 14px; color: #80b987; font-size: 19px; opacity: .7; }
        .progress-doodle span { margin-left: 12px; color: #d39a56; font-size: 22px; }
        .plan-layout { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(275px, .75fr); align-items: start; gap: 24px; margin-top: 25px; }
        .habits-panel,.swaps-panel { min-width: 0; padding: 30px; border: 1px solid #eeede5; border-radius: 24px; background: #fff; box-shadow: 0 8px 32px rgba(0,0,0,.06); }
        .panel-heading-row,.swaps-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 22px; }
        .panel-overline { color: #8a9b87; font-size: 14px; }
        .panel-heading-row h2,.swaps-heading h2 { margin: 8px 0 5px; color: #1a3022; font-size: 26px; font-weight: 900; letter-spacing: -.045em; }
        .panel-heading-row p,.swaps-heading p { margin: 0; color: #7b877d; font-size: 15px; line-height: 1.5; }
        .habits-count { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; border-radius: 999px; padding: 9px 12px; color: #1A3D2E; background: #e8f5e9; font-size: 14px; font-weight: 850; }
        .habit-list { display: flex; flex-direction: column; gap: 11px; }
        .habit-item { position: relative; display: flex; align-items: center; gap: 13px; min-width: 0; padding: 15px 14px; border: 2px solid #eceee6; border-radius: 16px; background: #fff; color: #25392b; transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease, background .22s ease; animation: card-enter .4s both; overflow: hidden; }
        .habit-item:hover { transform: translateY(-2px) scale(1.006); box-shadow: 0 10px 22px #183b260e; border-color: #b9d2b7; }
        .habit-item.is-completed { border-color: #1A3D2E; background: #1A3D2E; color: #fff; box-shadow: 0 8px 17px #1a3d2e14; }
        .habit-item.is-completed:hover { background: #214b39; border-color: #214b39; }
        .habit-toggle { display: grid; place-items: center; width: 34px; height: 34px; flex: 0 0 34px; border: 2px solid #d6e1d4; border-radius: 50%; color: #1A3D2E; background: #f4f8f1; cursor: pointer; transition: transform .2s ease, background .2s ease; }
        .habit-toggle:hover { transform: scale(1.08); }
        .is-completed .habit-toggle { background: #e4f4d9; border-color: #e4f4d9; color: #1A3D2E; animation: pop-check .35s ease both; }
        .habit-number { color: #6d8a72; font-size: 14px; font-weight: 850; }
        .habit-icon-wrap { display: grid; place-items: center; width: 48px; height: 48px; flex: 0 0 48px; border-radius: 14px; color: #347a4b; background: #eaf5e9; }
        .habit-icon-wrap.completed-icon { color: #e2f2da; background: #315846; }
        .habit-copy { display: flex; flex: 1; flex-direction: column; min-width: 90px; gap: 5px; }
        .habit-name { color: #1e3023; font-size: 16px; font-weight: 750; line-height: 1.3; }
        .habit-name.has-strike { color: #fff; text-decoration: line-through; text-decoration-color: #a8d8a7; text-decoration-thickness: 1.5px; }
        .habit-subline { color: #859186; font-size: 14px; line-height: 1.35; }
        .is-completed .habit-subline { color: #c5d8c8; }
        .habit-subline i { padding: 0 4px; color: #88b894; font-style: normal; }
        .habit-saving { display: inline-flex; flex-shrink: 0; align-items: center; gap: 5px; border-radius: 999px; padding: 8px 10px; color: #1A3D2E; background: #e8f5e9; font-size: 14px; font-weight: 850; white-space: nowrap; }
        .habit-edit { display: grid; place-items: center; width: 37px; height: 37px; flex: 0 0 37px; border: 1px solid #e2e8dd; border-radius: 11px; background: #fff; color: #597260; cursor: pointer; transition: background .2s ease, transform .2s ease; }
        .habit-edit:hover { background: #e8f5e9; transform: translateY(-1px); }
        .is-completed .habit-edit { background: #264b38; border-color: #4a7258; color: #e5f0e1; }
        .habit-edit-form { display: flex; gap: 5px; align-items: center; }
        .habit-edit-form input { width: min(100%,260px); min-width: 0; padding: 8px 10px; border: 1px solid #b8c8b6; border-radius: 9px; font: inherit; font-size: 15px; }
        .habit-edit-form button { display: grid; place-items: center; width: 30px; height: 30px; border: 1px solid #dfe8db; border-radius: 8px; background: #f6faf3; color: #1A3D2E; cursor: pointer; font-size: 18px; }
        .habit-confetti { position: absolute; z-index: 1; top: -3px; right: 17%; pointer-events: none; }
        .habit-confetti i { position: absolute; width: 5px; height: 9px; border-radius: 2px; background: #b8e6a9; opacity: 0; animation: confetti-pop .65s ease-out both; }
        .habit-confetti i:nth-child(1) { --dx: -18px; --dy: -17px; background: #f7c66b; }
        .habit-confetti i:nth-child(2) { --dx: 4px; --dy: -23px; background: #8ed7a0; animation-delay: .04s; }
        .habit-confetti i:nth-child(3) { --dx: 21px; --dy: -12px; background: #d0bee8; animation-delay: .08s; }
        .habit-confetti i:nth-child(4) { --dx: -27px; --dy: 2px; background: #f7c66b; animation-delay: .02s; }
        .habit-confetti i:nth-child(5) { --dx: 28px; --dy: 8px; background: #94cfe0; animation-delay: .06s; }
        .custom-habit-form { padding: 17px; margin-top: 13px; border: 1px dashed #a8c8a8; border-radius: 16px; background: #f8fbf4; }
        .custom-habit-form label { display: block; margin-bottom: 10px; color: #335840; font-size: 15px; font-weight: 800; }
        .custom-habit-form > div { display: flex; gap: 9px; }
        .custom-habit-form input { flex: 1; min-width: 0; border: 1px solid #d7e3d2; border-radius: 12px; background: #fff; padding: 12px 14px; color: #25392b; font: inherit; font-size: 15px; outline-color: #49885b; }
        .custom-habit-form button { display: inline-flex; justify-content: center; align-items: center; gap: 7px; border: 0; border-radius: 12px; background: #1A3D2E; color: #fff; padding: 11px 15px; font-size: 14px; font-weight: 800; cursor: pointer; }
        .add-habit-btn { display: flex; align-items: center; gap: 9px; width: 100%; margin-top: 16px; padding: 14px 19px; border: 1px solid #1A3D2E; border-radius: 999px; background: #1A3D2E; color: #fff; cursor: pointer; font: inherit; font-size: 15px; font-weight: 850; transition: transform .2s ease, background .2s ease; }
        .add-habit-btn:hover { transform: translateY(-2px); background: #24513b; }
        .add-habit-btn span { margin-left: auto; color: #bbd4c0; font-size: 14px; font-weight: 600; }
        .plan-widgets,.swaps-widgets { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
        .premium-tip-card { position: relative; padding: 27px 27px 24px; overflow: hidden; border: 1px solid #f3e7b9; border-radius: 23px; background: #FFF8DC; box-shadow: 0 12px 28px #5a49130c; }
        .tip-decoration { position: absolute; top: 10px; right: 16px; display: flex; align-items: center; color: #d6a844; opacity: .6; transform: rotate(9deg); }
        .tip-decoration > span { margin-left: -9px; margin-top: -32px; font-size: 25px; }
        .premium-tip-card .widget-overline { position: relative; max-width: 75%; color: #a88935; font-size: 14px; line-height: 1.5; }
        .premium-tip-card h2 { position: relative; margin: 12px 0 9px; color: #2b3522; font-size: 27px; font-weight: 950; letter-spacing: -.04em; }
        .premium-tip-card h2 span { display: inline-block; transform: rotate(-8deg); }
        .premium-tip-card p { position: relative; margin: 0; color: #665d40; font-size: 16px; line-height: 1.65; }
        .premium-tip-card p strong { color: #3e4b2c; font-weight: 900; }
        .premium-tip-card p.extra-tip { margin-top: 12px; padding-top: 12px; border-top: 1px solid #ecdca6; font-size: 15px; }
        .text-link-button { display: inline-flex; align-items: center; gap: 7px; margin-top: 17px; border: 0; background: transparent; color: #1A3D2E; padding: 0; font: inherit; font-size: 15px; font-weight: 900; cursor: pointer; }
        .text-link-button svg { transition: transform .2s ease; }
        .text-link-button:hover svg { transform: translateX(4px); }
        .premium-quote-card { position: relative; min-height: 310px; padding: 26px 25px; border: 8px solid #2E7D52; border-radius: 22px; background: #fff; box-shadow: 0 13px 30px #1a3d2e10; overflow: hidden; }
        .quote-label { color: #73907a; font-size: 14px; }
        .premium-quote-card blockquote { position: relative; z-index: 1; max-width: 310px; margin: 24px 0 25px; color: #1A3D2E; font-family: Georgia, serif; font-size: clamp(27px,2.2vw,34px); font-weight: 800; font-style: italic; line-height: 1.12; letter-spacing: -.055em; }
        .quote-footer { position: relative; z-index: 1; display: flex; align-items: center; gap: 9px; color: #66806b; font-size: 14px; font-weight: 750; }
        .quote-leaf-mark { display: grid; place-items: center; width: 37px; height: 37px; border-radius: 12px; color: #fff; background: #1A3D2E; }
        .quote-spark { position: absolute; color: #80b68a; opacity: .6; }
        .quote-spark-one { right: 20px; top: 65px; font-size: 23px; }
        .quote-spark-two { right: 53px; bottom: 25px; font-size: 19px; }
        .quote-line-art { position: absolute; width: 92px; right: -10px; bottom: -9px; color: #78a983; opacity: .2; }
        .swaps-intro { display: flex; align-items: center; justify-content: space-between; gap: 22px; margin: 0 0 25px; }
        .swaps-intro .mini-overline { margin-bottom: 9px; }
        .swaps-intro h2 { margin: 0; color: #163222; font-size: clamp(32px,3vw,42px); font-weight: 950; line-height: 1.12; letter-spacing: -.055em; }
        .swaps-intro h2 em { color: #387c4e; font-family: Georgia,serif; font-weight: 500; }
        .swaps-intro p { margin: 10px 0 0; color: #6f7e72; font-size: 16px; line-height: 1.55; }
        .swaps-intro-stamp { display: flex; align-items: center; gap: 10px; flex-shrink: 0; padding: 13px 16px; border: 1px solid #dce8d8; border-radius: 17px; background: #f1f7ec; color: #36794a; }
        .swaps-intro-stamp span { color: #496b4e; font-size: 14px; font-weight: 900; line-height: 1.25; letter-spacing: .08em; }
        .swaps-layout { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(285px, .74fr); align-items: start; gap: 24px; }
        .swaps-panel { padding: 32px; }
        .swaps-heading { align-items: center; margin-bottom: 25px; }
        .active-swaps-badge { flex-shrink: 0; border-radius: 999px; padding: 9px 14px; color: #1A3D2E; background: #e5f5e4; font-size: 14px; font-weight: 900; }
        .swaps-list-grid { display: flex; flex-direction: column; }
        .adopted-swap-item { position: relative; display: flex; align-items: center; gap: 18px; min-width: 0; padding: 19px 12px; border-bottom: 1px solid #efeee7; border-radius: 14px; transition: background .2s ease, transform .2s ease; }
        .adopted-swap-item:first-child { padding-top: 5px; }
        .adopted-swap-item:last-child { border-bottom: 0; }
        .adopted-swap-item:hover { background: #fafaf6; transform: translateX(2px); }
        .swap-icon-square { display: grid; place-items: center; width: 56px; height: 56px; flex: 0 0 56px; border-radius: 14px; }
        .tone-blue { color: #2863a7; background: #e5f1ff; }
        .tone-purple { color: #6d45ad; background: #f0e8ff; }
        .tone-orange { color: #b9641e; background: #fff0df; }
        .tone-green { color: #26704a; background: #e5f4e7; }
        .tone-yellow { color: #987322; background: #fff5d3; }
        .adopted-item-left { flex: 1; min-width: 0; }
        .swap-date-label { display: block; margin-bottom: 5px; color: #8a958b; font-size: 14px; font-weight: 650; }
        .swap-date-label i,.adopted-item-meta i { margin: 0 4px; color: #a1afa1; font-style: normal; }
        .adopted-item-title { margin: 0; color: #1f3324; font-size: 17px; font-weight: 850; line-height: 1.3; }
        .adopted-item-meta { display: block; margin: 6px 0 0; color: #7d897f; font-size: 14px; line-height: 1.4; }
        .adopted-item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 9px; flex-shrink: 0; }
        .adopted-co2-pill { display: inline-flex; align-items: center; border-radius: 999px; padding: 8px 12px; color: #1A3D2E; background: #E8F5E9; font-size: 14px; font-weight: 850; white-space: nowrap; }
        .remove-swap-btn { display: inline-flex; align-items: center; gap: 7px; padding: 7px 10px; border: 1px solid #e5e4dc; border-radius: 11px; background: #fff; color: #707d72; cursor: pointer; font: inherit; font-size: 14px; font-weight: 750; transition: border-color .2s ease, color .2s ease, background .2s ease; }
        .remove-swap-btn:hover { border-color: #d7a29b; color: #9b4037; background: #fff8f6; }
        .swaps-panel-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 15px; padding-top: 17px; border-top: 1px solid #eeeee6; color: #78877b; font-size: 14px; }
        .swaps-panel-footer > span,.swaps-footer-link { display: inline-flex; align-items: center; gap: 7px; }
        .swaps-panel-footer > span svg { color: #3a8a54; }
        .swaps-footer-link { color: #1A3D2E; text-decoration: none; font-weight: 850; }
        .swaps-footer-link:hover { text-decoration: underline; }
        .swaps-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 42px 18px; border: 1px dashed #d6e5d0; border-radius: 19px; background: #fafcf7; }
        .empty-leaf { display: grid; place-items: center; width: 64px; height: 64px; margin-bottom: 15px; border-radius: 20px; color: #2e7d52; background: #e5f5e4; }
        .swaps-empty h3 { margin: 0; color: #1a3d2e; font-size: 21px; font-weight: 900; }
        .swaps-empty p { max-width: 360px; margin: 10px 0 18px; color: #748176; font-size: 15px; line-height: 1.55; }
        .browse-swaps-button { display: inline-flex; align-items: center; gap: 9px; padding: 11px 17px; border-radius: 999px; background: #1A3D2E; color: #fff; text-decoration: none; font-size: 15px; font-weight: 850; transition: transform .2s ease, background .2s ease; }
        .browse-swaps-button:hover { transform: translateY(-2px); background: #28543c; }
        .impact-widget,.streak-widget { position: relative; padding: 27px; border: 1px solid #e8ede2; border-radius: 23px; background: #fff; box-shadow: 0 8px 32px rgba(0,0,0,.055); overflow: hidden; }
        .impact-widget .widget-overline,.streak-widget .widget-overline { max-width: 80%; color: #819482; font-size: 14px; line-height: 1.45; }
        .impact-widget-icon { display: grid; place-items: center; width: 46px; height: 46px; margin-top: 21px; border-radius: 15px; color: #1A3D2E; background: #e8f5e9; }
        .impact-widget h3 { margin: 15px 0 5px; color: #25372a; font-size: 20px; font-weight: 900; letter-spacing: -.04em; }
        .impact-widget h3 span { color: #5f7563; font-weight: 600; }
        .impact-number { margin: 0; color: #1A3D2E; font-size: 38px; font-weight: 950; letter-spacing: -.06em; line-height: 1.15; }
        .impact-number span { font-size: 16px; font-weight: 800; letter-spacing: -.01em; }
        .impact-caption { margin: 7px 0 18px; color: #7a887c; font-size: 14px; }
        .impact-progress-track { height: 10px; overflow: hidden; border-radius: 99px; background: #edf1e9; }
        .impact-progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg,#76bc7f,#2e7d52); transition: width .5s ease; }
        .impact-progress-meta { display: flex; justify-content: space-between; gap: 10px; margin-top: 10px; color: #879388; font-size: 14px; }
        .impact-progress-meta strong { color: #1A3D2E; font-weight: 900; }
        .impact-widget-foot { display: flex; align-items: center; gap: 8px; margin-top: 21px; padding-top: 16px; border-top: 1px solid #edf0e8; color: #55785b; font-size: 14px; font-weight: 750; }
        .streak-widget { padding-top: 29px; background: linear-gradient(145deg,#fffdf5 0%,#f8f8ed 100%); }
        .streak-orb { display: grid; place-items: center; width: 58px; height: 58px; margin: 0 0 17px; border-radius: 19px; background: #fff0d7; color: #e58b2d; box-shadow: 0 9px 20px #e58b2d17; }
        .streak-widget h3 { margin: 12px 0 3px; color: #28392a; font-size: 21px; font-weight: 900; }
        .streak-number { margin: 0; color: #1A3D2E; font-size: 45px; font-weight: 950; letter-spacing: -.07em; }
        .streak-number span { color: #768578; font-size: 17px; font-weight: 750; letter-spacing: 0; }
        .streak-week-dots { display: flex; gap: 7px; margin-top: 15px; }
        .streak-week-dots span { width: 15px; height: 15px; border-radius: 5px; background: #a9d7a6; }
        .streak-week-dots span:nth-child(4) { background: #eab467; }
        .streak-week-dots span:nth-child(6) { background: #7fb68c; }
        .streak-note { margin: 14px 0 0; color: #778579; font-size: 14px; line-height: 1.5; }
        .methodology-panel { position: relative; margin-top: 34px; padding: 29px 31px 31px; border: 1px solid #e0e8da; border-radius: 24px; background: linear-gradient(120deg,#f4f8ef 0%,#fbfcf6 58%,#eef5e8 100%); overflow: hidden; scroll-margin-top: 30px; }
        .methodology-panel::after { content: ''; position: absolute; width: 290px; height: 290px; top: -175px; right: -85px; border: 1px solid #b8d5b6; border-radius: 50%; box-shadow: 0 0 0 22px #d8e8d622,0 0 0 44px #d8e8d622; pointer-events: none; }
        .methodology-topline { position: relative; z-index: 1; color: #6e8a70; }
        .methodology-icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 13px; color: #fff; background: #1A3D2E; }
        .methodology-dashes { width: 45px; height: 2px; margin-left: auto; background: #a5c79f; }
        .methodology-content { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(220px,.8fr) minmax(0,1.6fr); gap: 37px; margin-top: 21px; }
        .methodology-heading h2 { margin: 9px 0 10px; color: #193523; font-size: clamp(28px,2.7vw,36px); line-height: 1.13; font-weight: 950; letter-spacing: -.055em; }
        .methodology-heading h2 em { color: #3a8050; font-family: Georgia,serif; font-weight: 500; }
        .methodology-heading p { margin: 0; color: #687c6b; font-size: 15px; line-height: 1.65; }
        .methodology-facts { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
        .methodology-facts article { padding: 16px; border: 1px solid #e0eadb; border-radius: 17px; background: #fffdf8d9; }
        .methodology-fact-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 12px; color: #2e7d52; background: #e4f2df; }
        .methodology-facts h3 { margin: 12px 0 7px; color: #253e2c; font-size: 16px; font-weight: 900; }
        .methodology-facts p { margin: 0; color: #778579; font-size: 14px; line-height: 1.55; }
        .discover-banner { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 25px; min-height: 182px; margin-top: 22px; padding: 29px 34px; border: 1px solid #d5e7d2; border-radius: 24px; background: linear-gradient(105deg,#e6f3df 0%,#f1f7e8 47%,#dcefd8 100%); overflow: hidden; }
        .discover-copy { position: relative; z-index: 1; max-width: 660px; }
        .discover-copy .mini-overline { color: #6b8b6e; }
        .discover-copy h2 { margin: 8px 0 5px; color: #1A3D2E; font-size: 31px; font-weight: 950; letter-spacing: -.05em; }
        .discover-copy p { margin: 0; color: #5d7662; font-size: 15px; line-height: 1.55; }
        .discover-button { position: relative; z-index: 2; display: inline-flex; align-items: center; justify-content: center; gap: 12px; flex-shrink: 0; padding: 15px 20px; border: 1px solid #1A3D2E; border-radius: 999px; background: #1A3D2E; color: white; text-decoration: none; font-size: 15px; font-weight: 850; transition: transform .2s ease, background .2s ease, box-shadow .2s ease; }
        .discover-button:hover { transform: translateY(-2px); background: #27543d; box-shadow: 0 8px 18px #1a3d2e20; }
        .discover-leaf-art { position: absolute; top: 18px; right: 25%; width: 180px; height: 145px; color: #5a9b66; opacity: .3; transform: rotate(-4deg); }
        .discover-leaf-art svg { width: 100%; height: 100%; }
        .discover-spark { position: absolute; color: #4d9961; opacity: .55; }
        .discover-spark-one { top: 19px; right: 18%; font-size: 22px; }
        .discover-spark-two { bottom: 18px; right: 21%; font-size: 20px; }
        .routine-app .routine-root-premium-analytics { max-width: none; margin: 0; padding: 0; }
        .routine-app #overview { background: var(--routine-cream); }
        .routine-app #pageTitle { color: #183523; }
        .routine-app :is(button,a,input) { -webkit-tap-highlight-color: transparent; }
        .routine-app button:focus-visible,.routine-app a:focus-visible,.routine-app input:focus-visible { outline: 3px solid #73ac7b; outline-offset: 3px; }
        @keyframes float-confetti { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(14deg); } }
        @keyframes card-enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop-check { 0% { transform: scale(.72); } 75% { transform: scale(1.12); } 100% { transform: scale(1); } }
        @keyframes confetti-pop { 0% { opacity: 0; transform: translate(0,0) rotate(0); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx),var(--dy)) rotate(110deg); } }
        @media (max-width: 1260px) {
          .routine-app { grid-template-columns: minmax(0,1fr); }
          .routine-main { padding-inline: 28px; }
          .plan-layout,.swaps-layout { grid-template-columns: minmax(0,1fr); }
          .plan-widgets,.swaps-widgets { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
          .challenge-progress-card { grid-template-columns: 135px minmax(180px,1fr); }
          .progress-card-stats { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); padding: 18px 0 0; border-left: 0; border-top: 1px solid #c6dfc5; }
          .progress-ring-wrap,.progress-ring { width: 128px; height: 128px; }
          .progress-meta { font-size: 14px; }
          .methodology-content { grid-template-columns: 1fr; gap: 22px; }
        }
        @media (max-width: 850px) {
          .routine-app { display: block; }
          .routine-main { padding: 27px 22px 36px; }
          .routine-heading-row { align-items: flex-start; }
          .routine-day-chip { display: inline-flex; align-self: flex-start; margin-top: 4px; }
          .challenge-progress-card { grid-template-columns: 116px minmax(0,1fr); gap: 18px; padding: 23px; }
          .progress-ring-wrap,.progress-ring { width: 112px; height: 112px; }
          .progress-ring-label strong { font-size: 27px; }
          .progress-card-copy h3 { font-size: 23px; }
          .habit-item { flex-wrap: wrap; }
          .habit-copy { min-width: calc(100% - 180px); }
          .habit-saving { margin-left: 48px; }
          .habit-edit { margin-left: auto; }
          .methodology-facts { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 580px) {
          .routine-main { padding: 25px 14px 28px; }
          .routine-title { font-size: 46px; }
          .routine-sub { font-size: 16px; }
          .routine-tabs { margin: 21px 0 25px; gap: 7px; }
          .routine-tab { flex: 1; padding: 10px 11px; min-height: 43px; font-size: 14px; }
          .challenge-title-row { align-items: flex-start; }
          .challenge-title-row h2 { font-size: 32px; }
          .completed-pill { padding: 8px 10px; }
          .challenge-progress-card { grid-template-columns: 1fr; justify-items: center; text-align: center; padding: 22px 19px; }
          .progress-card-copy { width: 100%; }
          .progress-meta { text-align: left; }
          .progress-card-stats { display: flex; width: 100%; align-items: flex-start; text-align: left; }
          .plan-widgets,.swaps-widgets { grid-template-columns: 1fr; }
          .habits-panel,.swaps-panel { padding: 19px 13px; border-radius: 20px; }
          .panel-heading-row,.swaps-heading { gap: 10px; }
          .panel-heading-row h2,.swaps-heading h2 { font-size: 22px; }
          .panel-heading-row p,.swaps-heading p { font-size: 14px; }
          .habits-count { padding: 8px 9px; }
          .habit-item { gap: 8px; padding: 12px 9px; border-radius: 14px; }
          .habit-toggle { width: 30px; height: 30px; flex-basis: 30px; }
          .habit-icon-wrap { width: 39px; height: 39px; flex-basis: 39px; border-radius: 12px; }
          .habit-icon-wrap svg { width: 22px; height: 22px; }
          .habit-copy { min-width: calc(100% - 92px); }
          .habit-name { font-size: 15px; }
          .habit-subline { font-size: 14px; }
          .habit-saving { margin-left: 38px; padding: 7px 8px; font-size: 14px; }
          .habit-edit { width: 33px; height: 33px; flex-basis: 33px; }
          .custom-habit-form > div { flex-direction: column; }
          .swaps-intro { align-items: flex-start; }
          .swaps-intro h2 { font-size: 33px; }
          .swaps-intro-stamp { display: none; }
          .adopted-swap-item { display: grid; grid-template-columns: 48px minmax(0,1fr); gap: 12px; padding: 17px 5px; }
          .swap-icon-square { width: 48px; height: 48px; }
          .adopted-item-left { grid-column: 2; grid-row: 1; }
          .adopted-item-right { grid-column: 2; align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
          .adopted-co2-pill { white-space: normal; font-size: 14px; }
          .swaps-panel-footer { align-items: flex-start; flex-direction: column; }
          .methodology-panel { padding: 21px 17px; }
          .methodology-facts { grid-template-columns: 1fr; }
          .discover-banner { flex-direction: column; align-items: flex-start; padding: 23px 19px; }
          .discover-copy h2 { font-size: 27px; }
          .discover-leaf-art { right: -6%; opacity: .22; }
          .discover-button { align-self: stretch; }
        }
        @media (prefers-reduced-motion: reduce) {
          .routine-app *, .routine-app *::before, .routine-app *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
        }

        /* Compact Linear-inspired daily plan */
        .routine-app.routine-plan-active {
          min-height: auto;
          min-height: 0;
          overflow: visible;
          background: #F7F7F4;
          color: #252A25;
        }
        .routine-app.routine-plan-active .routine-main {
          padding: 10px clamp(16px, 1.8vw, 26px) 14px;
        }
        .routine-app.routine-plan-active .routine-page-header {
          padding: 0 0 11px;
          border-color: #E7E7E0;
        }
        .routine-app.routine-plan-active .routine-eyebrow,
        .routine-app.routine-plan-active .mini-overline,
        .routine-app.routine-plan-active .panel-overline,
        .routine-app.routine-plan-active .widget-overline,
        .routine-app.routine-plan-active .progress-kicker {
          gap: 6px;
          font-size: 9px;
          font-weight: 650;
          letter-spacing: .12em;
        }
        .routine-app.routine-plan-active .eyebrow-line { width: 18px; height: 1px; }
        .routine-app.routine-plan-active .routine-heading-row { margin-top: 6px; align-items: center; gap: 14px; }
        .routine-app.routine-plan-active .routine-title {
          color: #202620;
          font-size: 36px;
          line-height: 1.03;
          font-weight: 650;
          letter-spacing: -.055em;
        }
        .routine-app.routine-plan-active .routine-sub {
          margin-top: 5px;
          font-size: 11px;
          line-height: 1.4;
          color: #747A72;
        }
        .routine-app.routine-plan-active .routine-day-chip {
          margin-bottom: 0;
          gap: 7px;
          padding: 7px 10px;
          font-size: 9px;
          font-weight: 650;
          border-radius: 999px;
          border-color: #E4E5DC;
          color: #58665A;
          box-shadow: none;
        }
        .routine-app.routine-plan-active .routine-day-dot { width: 6px; height: 6px; box-shadow: 0 0 0 3px #45a56618; }
        .routine-app.routine-plan-active .routine-day-chip > span:last-child { font-size: 12px; }
        .routine-app.routine-plan-active .routine-tabs {
          gap: 5px;
          margin: 10px 0 13px;
        }
        .routine-app.routine-plan-active .routine-tab {
          min-height: 30px;
          gap: 6px;
          padding: 6px 12px;
          border-color: #E7E7E1;
          background: #FFFFFF;
          color: #656D65;
          font-size: 10px;
          font-weight: 550;
          box-shadow: none;
        }
        .routine-app.routine-plan-active .routine-tab.is-active {
          color: #F9FAF7;
          background: #252C26;
          border-color: #252C26;
          box-shadow: none;
        }
        .routine-app.routine-plan-active .tab-count {
          min-width: 17px;
          height: 17px;
          font-size: 9px;
        }
        .routine-app.routine-plan-active .challenge-intro {
          align-items: center;
          margin-bottom: 8px;
          min-height: 36px;
        }
        .routine-app.routine-plan-active .challenge-intro .mini-overline { margin-bottom: 3px; }
        .routine-app.routine-plan-active .challenge-title-row { gap: 9px; align-items: center; }
        .routine-app.routine-plan-active .challenge-title-row h2 {
          font-size: 19px;
          font-weight: 650;
          line-height: 1.15;
          letter-spacing: -.035em;
          color: #252B25;
        }
        .routine-app.routine-plan-active .challenge-intro p {
          margin-top: 3px;
          font-size: 10px;
          line-height: 1.35;
          color: #7A8079;
        }
        .routine-app.routine-plan-active .completed-pill {
          gap: 4px;
          padding: 4px 7px;
          background: #E9F3E8;
          color: #2D6138;
          font-size: 9px;
          font-weight: 600;
          box-shadow: none;
        }
        .routine-app.routine-plan-active .completed-pill svg { width: 12px; height: 12px; }
        .routine-app.routine-plan-active .challenge-confetti { display: none; }

        .routine-app.routine-plan-active .challenge-progress-card {
          grid-template-columns: 70px minmax(0, 1fr) minmax(210px, .7fr);
          align-items: center;
          gap: 16px;
          min-height: 94px;
          padding: 11px 16px;
          border: 1px solid #E1E8DE;
          border-radius: 15px;
          background: #EEF4EC;
          box-shadow: 0 2px 7px rgba(24,39,25,.025);
        }
        .routine-app.routine-plan-active .progress-ring-wrap,
        .routine-app.routine-plan-active .progress-ring {
          width: 70px;
          height: 70px;
        }
        .routine-app.routine-plan-active .progress-ring circle { stroke-width: 9; }
        .routine-app.routine-plan-active .progress-ring-label strong {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -.04em;
        }
        .routine-app.routine-plan-active .progress-ring-label span {
          margin-top: 3px;
          font-size: 8px;
          font-weight: 550;
        }
        .routine-app.routine-plan-active .progress-card-copy h3 {
          margin: 0 0 3px;
          color: #273629;
          font-size: 12px;
          font-weight: 650;
          letter-spacing: -.025em;
        }
        .routine-app.routine-plan-active .progress-card-copy p { display: none; }
        .routine-app.routine-plan-active .progress-bar-track {
          height: 5px;
          margin-top: 7px;
          background: #DCE8D8;
        }
        .routine-app.routine-plan-active .progress-bar-track span { background: #2D6B3D; }
        .routine-app.routine-plan-active .progress-meta {
          gap: 8px;
          margin-top: 5px;
          color: #697869;
          font-size: 9px;
        }
        .routine-app.routine-plan-active .progress-meta strong { color: #344936; font-weight: 650; }
        .routine-app.routine-plan-active .progress-card-stats {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          gap: 15px;
          padding-left: 15px;
          border-left: 1px solid #D7E2D3;
        }
        .routine-app.routine-plan-active .streak-stat,
        .routine-app.routine-plan-active .impact-stat { gap: 7px; min-width: 0; }
        .routine-app.routine-plan-active .streak-fire,
        .routine-app.routine-plan-active .impact-stat-icon {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          box-shadow: none;
        }
        .routine-app.routine-plan-active .streak-fire svg,
        .routine-app.routine-plan-active .impact-stat-icon svg { width: 14px; height: 14px; }
        .routine-app.routine-plan-active .streak-stat > div,
        .routine-app.routine-plan-active .impact-stat > div { gap: 2px; }
        .routine-app.routine-plan-active .streak-stat strong,
        .routine-app.routine-plan-active .impact-stat strong {
          color: #344936;
          font-size: 10px;
          line-height: 1.3;
          font-weight: 650;
          white-space: nowrap;
        }
        .routine-app.routine-plan-active .streak-stat span:not(.streak-fire),
        .routine-app.routine-plan-active .impact-stat span:not(.impact-stat-icon) {
          color: #758173;
          font-size: 9px;
          line-height: 1.3;
          white-space: nowrap;
        }
        .routine-app.routine-plan-active .progress-doodle { display: none; }

        .routine-app.routine-plan-active .plan-layout {
          grid-template-columns: minmax(0, 1.7fr) minmax(210px, .65fr);
          gap: 13px;
          margin-top: 13px;
          align-items: stretch;
        }
        .routine-app.routine-plan-active .habits-panel {
          padding: 12px;
          border: 1px solid #E8E8E1;
          border-radius: 15px;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(18, 30, 18, .025);
        }
        .routine-app.routine-plan-active .panel-heading-row {
          align-items: center;
          gap: 10px;
          margin-bottom: 9px;
        }
        .routine-app.routine-plan-active .panel-overline { color: #8A9288; }
        .routine-app.routine-plan-active .panel-heading-row h2 {
          margin: 3px 0 0;
          color: #252B25;
          font-size: 16px;
          font-weight: 650;
          letter-spacing: -.035em;
        }
        .routine-app.routine-plan-active .panel-heading-row p { display: none; }
        .routine-app.routine-plan-active .habits-count {
          gap: 5px;
          padding: 5px 7px;
          border-radius: 999px;
          background: #F1F5EF;
          color: #526B53;
          font-size: 9px;
          font-weight: 600;
        }
        .routine-app.routine-plan-active .habits-count svg { width: 12px; height: 12px; }
        .routine-app.routine-plan-active .habit-list {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 7px;
        }
        .routine-app.routine-plan-active .habit-item {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          gap: 5px;
          min-width: 0;
          min-height: 92px;
          padding: 8px 9px;
          border: 1px solid #E5E7E0;
          border-radius: 11px;
          background: #FFFFFF;
          color: #252D25;
          box-shadow: none;
          overflow: hidden;
        }
        .routine-app.routine-plan-active .habit-item:hover {
          transform: translateY(-1px);
          border-color: #CBD9C7;
          box-shadow: 0 4px 10px rgba(26,48,25,.045);
        }
        .routine-app.routine-plan-active .habit-item.is-completed {
          border-color: #D7E6D4;
          background: #F3F8F1;
          color: #263A29;
          box-shadow: none;
        }
        .routine-app.routine-plan-active .habit-card-top {
          display: flex;
          align-items: center;
          gap: 5px;
          width: 100%;
          min-height: 25px;
        }
        .routine-app.routine-plan-active .habit-toggle {
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          flex: 0 0 23px;
          border: 1px solid #D9E0D6;
          background: #FAFBF9;
          color: #5D7560;
        }
        .routine-app.routine-plan-active .habit-number { font-size: 8px; font-weight: 650; }
        .routine-app.routine-plan-active .is-completed .habit-toggle {
          border-color: #D9E9D5;
          background: #DDEDD9;
          color: #2C653B;
        }
        .routine-app.routine-plan-active .habit-icon-wrap {
          display: grid;
          width: 25px;
          height: 25px;
          flex: 0 0 25px;
          border-radius: 8px;
          color: #4C7952;
          background: #F0F5EE;
        }
        .routine-app.routine-plan-active .habit-icon-wrap.completed-icon {
          color: #3A7545;
          background: #E4F0DF;
        }
        .routine-app.routine-plan-active .habit-icon-wrap svg { width: 14px; height: 14px; }
        .routine-app.routine-plan-active .habit-edit {
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          flex: 0 0 23px;
          margin-left: auto;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: #9AA196;
          opacity: .7;
        }
        .routine-app.routine-plan-active .habit-edit:hover { background: #E9F0E7; color: #345C3A; }
        .routine-app.routine-plan-active .habit-copy {
          display: flex;
          flex: 1;
          min-width: 0;
          gap: 0;
        }
        .routine-app.routine-plan-active .habit-name {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          color: #2A342B;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.28;
          letter-spacing: -.01em;
        }
        .routine-app.routine-plan-active .habit-name.has-strike {
          color: #3F6042;
          text-decoration-color: #A2C59D;
        }
        .routine-app.routine-plan-active .habit-subline { display: none; }
        .routine-app.routine-plan-active .habit-saving {
          display: inline-flex;
          align-self: flex-start;
          flex-shrink: 0;
          gap: 3px;
          margin: 0;
          padding: 3px 5px;
          border-radius: 5px;
          background: #F1F5EE;
          color: #58705A;
          font-size: 8px;
          line-height: 1.1;
          font-weight: 600;
        }
        .routine-app.routine-plan-active .habit-saving svg { width: 10px; height: 10px; }
        .routine-app.routine-plan-active .habit-item.is-completed .habit-saving { background: #E7F0E3; color: #456B48; }
        .routine-app.routine-plan-active .habit-confetti { display: none; }
        .routine-app.routine-plan-active .habit-edit-form { gap: 3px; min-width: 0; }
        .routine-app.routine-plan-active .habit-edit-form input { width: 100%; padding: 4px 5px; font-size: 10px; }
        .routine-app.routine-plan-active .habit-edit-form button { width: 20px; height: 20px; flex: 0 0 20px; }
        .routine-app.routine-plan-active .add-habit-btn {
          min-height: 31px;
          gap: 6px;
          margin-top: 8px;
          padding: 6px 10px;
          border-color: #27332A;
          border-radius: 9px;
          background: #27332A;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 600;
        }
        .routine-app.routine-plan-active .add-habit-btn svg { width: 13px; height: 13px; }
        .routine-app.routine-plan-active .add-habit-btn span { color: #C6D4C6; font-size: 9px; font-weight: 450; }
        .routine-app.routine-plan-active .custom-habit-form {
          margin-top: 7px;
          padding: 10px;
          border-radius: 10px;
          font-size: 10px;
        }
        .routine-app.routine-plan-active .custom-habit-form label { margin-bottom: 6px; font-size: 10px; }
        .routine-app.routine-plan-active .custom-habit-form input { padding: 7px 9px; font-size: 10px; }
        .routine-app.routine-plan-active .custom-habit-form button { padding: 7px 10px; font-size: 10px; }

        .routine-app.routine-plan-active .premium-tip-card {
          min-height: 0;
          padding: 14px;
          border-radius: 15px;
          box-shadow: none;
        }
        .routine-app.routine-plan-active .tip-decoration { top: 6px; right: 8px; opacity: .32; }
        .routine-app.routine-plan-active .tip-decoration svg { width: 32px; height: 32px; }
        .routine-app.routine-plan-active .tip-decoration > span { font-size: 15px; }
        .routine-app.routine-plan-active .premium-tip-card .widget-overline { max-width: 76%; font-size: 8px; }
        .routine-app.routine-plan-active .premium-tip-card h2 { margin: 7px 0 5px; color: #30372B; font-size: 15px; font-weight: 650; }
        .routine-app.routine-plan-active .premium-tip-card p { font-size: 10px; line-height: 1.45; }
        .routine-app.routine-plan-active .premium-tip-card p.extra-tip { margin-top: 6px; padding-top: 6px; font-size: 10px; }
        .routine-app.routine-plan-active .text-link-button { gap: 4px; margin-top: 7px; font-size: 10px; font-weight: 600; }
        .routine-app.routine-plan-active .text-link-button svg { width: 12px; height: 12px; }
        .routine-app.routine-plan-active .premium-quote-card { display: none; }
        .routine-app.routine-plan-active .methodology-panel,
        .routine-app.routine-plan-active .discover-banner { display: none; }

        @media (max-width: 1260px) {
          .routine-app.routine-plan-active .routine-main { padding-inline: 18px; }
          .routine-app.routine-plan-active .challenge-progress-card {
            grid-template-columns: 70px minmax(0, 1fr) minmax(180px, .7fr);
            gap: 10px;
            padding: 10px 12px;
          }
          .routine-app.routine-plan-active .progress-card-stats { gap: 9px; padding-left: 10px; }
          .routine-app.routine-plan-active .plan-layout { grid-template-columns: minmax(0, 1fr) minmax(190px, .56fr); gap: 10px; }
          .routine-app.routine-plan-active .habit-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
          .routine-app.routine-plan-active .habit-item { min-height: 88px; padding: 7px; }
        }
        @media (max-width: 850px) {
          .routine-app.routine-plan-active .routine-main { padding: 14px 16px 20px; }
          .routine-app.routine-plan-active .routine-title { font-size: 32px; }
          .routine-app.routine-plan-active .routine-heading-row { align-items: flex-start; }
          .routine-app.routine-plan-active .routine-day-chip { align-self: flex-start; }
          .routine-app.routine-plan-active .challenge-progress-card {
            grid-template-columns: 64px minmax(0, 1fr);
            gap: 11px;
            padding: 10px 12px;
          }
          .routine-app.routine-plan-active .progress-ring-wrap,
          .routine-app.routine-plan-active .progress-ring { width: 64px; height: 64px; }
          .routine-app.routine-plan-active .progress-card-stats {
            grid-column: 1 / -1;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding: 9px 0 0;
            border-left: 0;
            border-top: 1px solid #D7E2D3;
          }
          .routine-app.routine-plan-active .plan-layout { grid-template-columns: minmax(0, 1fr); }
          .routine-app.routine-plan-active .plan-widgets { display: none; }
          .routine-app.routine-plan-active .habit-list { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 580px) {
          .routine-app.routine-plan-active .routine-title { font-size: 30px; }
          .routine-app.routine-plan-active .routine-sub { max-width: 220px; font-size: 10px; }
          .routine-app.routine-plan-active .routine-day-chip { max-width: 136px; gap: 5px; padding: 6px 7px; font-size: 8px; white-space: nowrap; }
          .routine-app.routine-plan-active .routine-tabs { margin: 9px 0 11px; }
          .routine-app.routine-plan-active .challenge-title-row { align-items: flex-start; flex-direction: column; gap: 5px; }
          .routine-app.routine-plan-active .challenge-title-row h2 { font-size: 17px; }
          .routine-app.routine-plan-active .challenge-intro p { max-width: 290px; }
          .routine-app.routine-plan-active .progress-meta { font-size: 8px; }
          .routine-app.routine-plan-active .streak-stat strong,
          .routine-app.routine-plan-active .impact-stat strong { font-size: 9px; }
          .routine-app.routine-plan-active .habit-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .routine-app.routine-plan-active .habit-item { min-height: 88px; }
        }
      `}</style>
    </div>
  );
}

export default LogActivityPage;
