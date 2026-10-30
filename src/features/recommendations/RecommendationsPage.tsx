import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardSkeleton } from '../../shared/ui/Skeleton';
import { formatCurrency, formatRange, safeHttpsUrl } from '../../shared/lib/utils';
import {
  useActivityLogs,
  useAlternatives,
  useProfile,
  useUpsertUserAction,
  useUserActions,
} from '../../shared/lib/hooks/useData';
import { getColdStartRecommendations, rankRecommendations } from './engine';
import type { ActivityContext, UserScoringProfile } from './engine/types';
import { useToast } from '../../shared/ui';

const CATEGORY_VISUALS: Record<string, { label: string; emoji: string; image: string; fallback: string; accent: string; tint: string }> = {
  transport: {
    label: 'Transport',
    emoji: '🚆',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=85',
    accent: '#4f7880',
    tint: '#e7f0ef',
  },
  travel: {
    label: 'Travel',
    emoji: '🛤️',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85',
    accent: '#64828b',
    tint: '#eaf0f1',
  },
  energy: {
    label: 'Energy',
    emoji: '☀️',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1400&q=85',
    accent: '#bd9155',
    tint: '#f6efe2',
  },
  food: {
    label: 'Food',
    emoji: '🥬',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85',
    accent: '#9b7556',
    tint: '#f5eee7',
  },
  waste: {
    label: 'Waste',
    emoji: '♻️',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1532996122724-a3c354a0f50b?auto=format&fit=crop&w=1400&q=85',
    accent: '#62816b',
    tint: '#edf2e9',
  },
  shopping: {
    label: 'Shopping',
    emoji: '🧥',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85',
    accent: '#88749a',
    tint: '#f0edf4',
  },
  home: {
    label: 'Home',
    emoji: '⌂',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
    accent: '#7a8a70',
    tint: '#edf0e9',
  },
};

// Keep a distinct photo for each concrete swap. Category-only images caused
// every Transport recommendation to reuse the same train photograph.
const ALTERNATIVE_VISUALS: Record<string, { image: string; fallback: string }> = {
  'alt-metro-commute': {
    // Verified Delhi Metro train arriving at a station — not a bus/coach.
    image: 'https://images.unsplash.com/photo-1760816417540-cb9d731edefe?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1760816417540-cb9d731edefe?auto=format&fit=crop&w=1200&q=80',
  },
  'alt-electric-2w': {
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
  },
  'alt-shared-e-rickshaw': {
    // A clearly identifiable Indian electric three-wheeler/e-rickshaw.
    image: 'https://buscdn.cardekho.com/in/arrow-ev/gem/arrow-ev-gem.jpg',
    fallback: 'https://images.unsplash.com/photo-1760818860357-72a6160ec23a?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-carpool-work': {
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-bicycle-short-trips': {
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1544191696-15693072a0cf?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-train-intercity': {
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
  },
  'alt-bldc-ceiling-fans': {
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
  },
  'alt-ac-26-degrees': {
    image: 'https://images.unsplash.com/photo-1631545806609-3c7c8a0e28d1?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-induction-cooktop': {
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  },
  'alt-solar-water-heater': {
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-meatless-weekdays': {
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-millets-swap-rice': {
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-home-composting-khamba': {
    image: 'https://images.unsplash.com/photo-1532996122724-a3c354a0f50b?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-reusable-steel-flask': {
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1523369364227-249b4a5047d2?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-thrift-clothing': {
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85',
  },
  'alt-refurbished-electronics': {
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1400&q=85',
    fallback: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1400&q=85',
  },
};

function visualFor(category: string, alternativeId: string) {
  const base = CATEGORY_VISUALS[category.toLowerCase()] || CATEGORY_VISUALS.home;
  const specific = ALTERNATIVE_VISUALS[alternativeId];
  return specific ? { ...base, ...specific } : base;
}

export function RecommendationsPage() {
  const [referenceTime] = useState(() => new Date().toISOString());
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: logs, isLoading: logsLoading, isError: logsError, refetch: refetchLogs } = useActivityLogs();
  const { data: alternatives, isLoading: alternativesLoading } = useAlternatives();
  const { data: actions, isLoading: actionsLoading, isError: actionsError, refetch: refetchActions } = useUserActions();
  const upsert = useUpsertUserAction();
  const { toast } = useToast();

  const scoring: UserScoringProfile = {
    region: profile?.region ?? 'IN',
    effort_level: profile?.effort_level ?? 'moderate',
    budget_sensitivity: profile?.budget_sensitivity ?? 'medium',
    interests: profile?.interests ?? [],
    reference_time: referenceTime,
    adopted_alternative_ids: actions?.filter((a) => a.status === 'adopted').map((a) => a.alternative_id),
    action_history: actions?.map((action) => {
      const alternative = alternatives?.find((item) => item.id === action.alternative_id);
      return {
        alternative_id: action.alternative_id,
        status: action.status,
        updated_at: action.updated_at,
        category: alternative?.category,
        tags: alternative?.tags ?? [],
      };
    }),
  };

  const recs = (() => {
    const alts = alternatives ?? [];
    if (logsLoading || actionsLoading || alternativesLoading || profileLoading || logsError || actionsError) return [];
    if (!logs?.length) return getColdStartRecommendations(alts, scoring, 8);
    const latest = logs[0];
    const ctx: ActivityContext = {
      category: latest.category,
      activity_name: latest.activity_name,
      quantity: latest.quantity,
      unit: latest.unit,
      frequency_per_week: latest.frequency_per_week,
      calculated_co2e_monthly: latest.calculated_co2e_monthly,
    };
    return rankRecommendations(ctx, alts, scoring, 8);
  })();

  const act = async (id: string, status: 'adopted' | 'maybe_later' | 'not_for_me') => {
    try {
      await upsert.mutateAsync({ alternative_id: id, status });
      toast({
        title: status === 'adopted' ? 'Added to Your Routine' : 'Preference saved',
        description: status === 'adopted' ? 'You can find this swap in Your swaps.' : 'Your recommendation preference has been updated.',
        type: 'success',
      });
    } catch (error) {
      toast({
        title: 'Could not save preference',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  const isLoading = logsLoading || actionsLoading || alternativesLoading || profileLoading;
  const categoryCount = new Set(recs.map((rec) => rec.alternative.category)).size;
  const adoptedCount = actions?.filter((action) => action.status === 'adopted').length ?? 0;

  return (
    <div className="recommendations-premium">
      <style>{`
        .recommendations-premium {
          width:100%; max-width:1480px; margin:0 auto; padding:38px clamp(20px,3.8vw,64px) 72px;
          color:#20352a;
        }
        .recommendations-premium * { box-sizing:border-box; }
        .rec-hero {
          position:relative; display:grid; grid-template-columns:minmax(0,1.35fr) minmax(250px,.65fr);
          align-items:center; gap:30px; overflow:hidden; padding:36px 40px; border:1px solid #e2d8c8;
          border-radius:28px; background:
            radial-gradient(circle at 92% 0%,rgba(211,190,153,.34),transparent 34%),
            radial-gradient(circle at 0% 100%,rgba(202,217,194,.28),transparent 38%),
            linear-gradient(125deg,#fffdf7 0%,#f2ecdf 100%);
          box-shadow:0 18px 42px rgba(58,51,39,.07),inset 0 1px 0 #fff;
        }
        .rec-eyebrow { display:inline-flex; align-items:center; gap:9px; color:#7b8d70; font-size:12px; font-weight:850; letter-spacing:.17em; text-transform:uppercase; }
        .rec-eyebrow:before { content:""; width:24px; height:2px; background:#9da985; border-radius:2px; }
        .rec-hero h1 { max-width:760px; margin:13px 0 10px; color:#1b3828; font:700 clamp(34px,3.25vw,48px)/1.04 Georgia,serif; letter-spacing:-.045em; }
        .rec-hero-copy { max-width:720px; margin:0; color:#69756b; font-size:16px; line-height:1.7; }
        .rec-hero-side { position:relative; z-index:1; display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .rec-hero-stat { min-height:112px; padding:18px 18px 16px; border:1px solid rgba(255,255,255,.75); border-radius:20px; background:rgba(255,255,255,.62); box-shadow:0 8px 22px rgba(61,57,44,.055); backdrop-filter:blur(10px); }
        .rec-hero-stat strong { display:block; color:#203f2d; font:700 31px/1.05 Georgia,serif; letter-spacing:-.04em; }
        .rec-hero-stat span { display:block; margin-top:9px; color:#788175; font-size:11px; font-weight:850; letter-spacing:.11em; line-height:1.35; text-transform:uppercase; }
        .rec-hero-stat-wide { grid-column:1/-1; min-height:72px; display:flex; align-items:center; justify-content:space-between; gap:15px; background:rgba(29,64,43,.94); }
        .rec-hero-stat-wide strong { color:#fffdf5; font:600 15px/1.5 system-ui,sans-serif; letter-spacing:0; }
        .rec-hero-stat-wide span { max-width:120px; margin:0; color:#c6d4c5; text-align:right; }
        .rec-controls { display:flex; align-items:center; justify-content:space-between; gap:18px; margin:27px 2px 16px; }
        .rec-controls h2 { margin:0; color:#20392b; font:700 25px/1.2 Georgia,serif; }
        .rec-controls p { margin:5px 0 0; color:#849084; font-size:14px; line-height:1.5; }
        .rec-ranked-pill { display:inline-flex; align-items:center; gap:8px; flex:0 0 auto; padding:10px 15px; border:1px solid #dcd8c8; border-radius:999px; background:#fffdf8; color:#5d765f; font-size:12px; font-weight:850; letter-spacing:.08em; text-transform:uppercase; }
        .rec-ranked-pill i { width:8px; height:8px; border-radius:50%; background:#6c9c72; box-shadow:0 0 0 4px rgba(108,156,114,.12); }
        .rec-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px; align-items:stretch; }
        .rec-card {
          display:flex; min-width:0; flex-direction:column; overflow:hidden; border:1px solid #e3dbcf; border-radius:24px;
          background:#fffdf8; box-shadow:0 9px 26px rgba(62,55,43,.055),inset 0 1px 0 #fff;
          transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;
        }
        .rec-card:hover { transform:translateY(-4px); border-color:#c7cbb7; box-shadow:0 18px 36px rgba(62,55,43,.105); }
        .rec-card-visual { position:relative; height:205px; overflow:hidden; background:#d9dfd2; }
        .rec-card-visual img { display:block; width:100%; height:100%; object-fit:cover; object-position:center 48%; transition:transform .55s cubic-bezier(.2,.7,.2,1); }
        .rec-card:hover .rec-card-visual img { transform:scale(1.045); }
        .rec-card-visual:after { content:""; position:absolute; inset:0; background:linear-gradient(180deg,rgba(12,28,18,.04) 15%,rgba(12,28,18,.1) 48%,rgba(12,28,18,.68) 100%); pointer-events:none; }
        .rec-card-topline { position:absolute; z-index:1; inset:15px 16px auto; display:flex; justify-content:space-between; align-items:center; gap:10px; }
        .rec-category-chip { display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border:1px solid rgba(255,255,255,.38); border-radius:999px; color:#fff; background:rgba(16,35,23,.48); font-size:12px; font-weight:800; letter-spacing:.09em; text-transform:uppercase; backdrop-filter:blur(10px); }
        .rec-category-chip b { font-size:15px; line-height:1; }
        .rec-score-chip { padding:8px 12px; border:1px solid rgba(255,255,255,.55); border-radius:999px; color:#21392b; background:#fffdf1; font-size:12px; font-weight:900; letter-spacing:.04em; box-shadow:0 4px 12px rgba(0,0,0,.12); }
        .rec-rank { position:absolute; z-index:1; right:17px; bottom:14px; color:rgba(255,255,255,.9); font:700 52px/.9 Georgia,serif; letter-spacing:-.06em; text-shadow:0 4px 14px rgba(0,0,0,.2); }
        .rec-card-body { display:flex; flex:1; flex-direction:column; padding:23px 24px 22px; }
        .rec-card h3 { margin:0; color:#20372a; font:700 24px/1.2 Georgia,serif; letter-spacing:-.025em; }
        .rec-why { margin:11px 0 0; color:#59685d; font-size:15px; line-height:1.72; }
        .rec-match-context { display:flex; align-items:flex-start; gap:9px; margin-top:14px; padding:11px 13px; border-radius:13px; color:#697967; background:#f2f2e9; font-size:13px; line-height:1.55; }
        .rec-match-context b { color:#49644d; font-weight:800; }
        .rec-factors { display:grid; gap:9px; margin:18px 0 0; padding:0; list-style:none; }
        .rec-factors li { display:flex; align-items:flex-start; gap:10px; color:#47594c; font-size:14px; line-height:1.55; }
        .rec-factors li:before { content:""; flex:0 0 7px; width:7px; height:7px; margin-top:7px; border-radius:50%; background:#9eae88; box-shadow:0 0 0 3px #eef1e7; }
        .rec-metrics { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-top:21px; }
        .rec-metric { min-width:0; padding:14px 15px 13px; border:1px solid #e9e2d6; border-radius:16px; background:linear-gradient(145deg,#fffefa,#f7f3eb); }
        .rec-metric span { display:block; color:#8a8d7f; font-size:10px; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .rec-metric strong { display:block; margin-top:7px; color:#294532; font:700 17px/1.35 Georgia,serif; overflow-wrap:anywhere; }
        .rec-metric small { display:block; margin-top:4px; color:#929489; font-size:11px; line-height:1.4; }
        .rec-caveat { margin:15px 0 0; padding:12px 14px; border-left:3px solid #d4b17e; border-radius:0 12px 12px 0; color:#77766a; background:#f8f2e7; font-size:13px; line-height:1.6; }
        .rec-source { display:flex; flex-wrap:wrap; align-items:center; gap:7px; margin-top:16px; color:#969487; font-size:12px; line-height:1.5; }
        .rec-source a { color:#54755a; font-weight:800; text-decoration:underline; text-underline-offset:3px; }
        .rec-actions { display:flex; flex-wrap:wrap; gap:9px; margin-top:21px; padding-top:17px; border-top:1px solid #eee7dc; }
        .rec-action-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:46px; padding:0 17px; border:1px solid transparent; border-radius:13px; font:750 14px/1 system-ui,sans-serif; cursor:pointer; transition:transform .15s ease,background .15s ease,box-shadow .15s ease; }
        .rec-action-btn:hover:not(:disabled) { transform:translateY(-1px); }
        .rec-action-btn:disabled { opacity:.6; cursor:not-allowed; }
        .rec-action-adopt { color:#fffdf7; background:#193e2a; box-shadow:0 6px 14px rgba(25,62,42,.17); }
        .rec-action-adopt:hover:not(:disabled) { background:#28583b; }
        .rec-action-adopt.is-adopted { color:#315b3c; background:#e8f1e5; border-color:#cdddc8; box-shadow:none; }
        .rec-action-later { color:#596c5b; background:#fffdf8; border-color:#ddd9cb; }
        .rec-action-later:hover:not(:disabled) { background:#f1f2e9; border-color:#c9d1bd; }
        .rec-action-dismiss { color:#8c8c81; background:transparent; border-color:transparent; }
        .rec-action-dismiss:hover:not(:disabled) { color:#71584d; background:#f6efea; }
        .rec-state-message { padding:19px 21px; border:1px solid #e6ded1; border-radius:18px; color:#637166; background:#fffdf7; font-size:15px; line-height:1.65; }
        .rec-state-message a { color:#315b3c; font-weight:800; text-decoration:underline; text-underline-offset:3px; }
        .rec-loading-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px; }
        .rec-loading-grid > * { min-height:240px; }
        @media(max-width:1050px) {
          .recommendations-premium { padding:28px 24px 60px; }
          .rec-hero { grid-template-columns:1fr; }
          .rec-hero-side { grid-template-columns:repeat(3,minmax(0,1fr)); }
          .rec-hero-stat-wide { grid-column:auto; min-height:112px; display:block; }
          .rec-hero-stat-wide span { margin-top:8px; text-align:left; }
        }
        @media(max-width:760px) {
          .recommendations-premium { padding:22px 16px 46px; }
          .rec-hero { padding:25px 22px; border-radius:22px; gap:21px; }
          .rec-hero h1 { font-size:34px; }
          .rec-hero-copy { font-size:15px; }
          .rec-hero-side { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .rec-hero-stat-wide { grid-column:1/-1; min-height:78px; display:flex; }
          .rec-hero-stat-wide span { margin:0; text-align:right; }
          .rec-controls { align-items:flex-start; flex-direction:column; margin-top:23px; }
          .rec-grid,.rec-loading-grid { grid-template-columns:1fr; gap:17px; }
          .rec-card-visual { height:180px; }
          .rec-card-body { padding:20px 18px 18px; }
          .rec-card h3 { font-size:22px; }
          .rec-why { font-size:14px; }
          .rec-metric strong { font-size:16px; }
          .rec-actions { display:grid; grid-template-columns:1fr 1fr; }
          .rec-action-btn { min-height:46px; padding:0 12px; font-size:13px; }
          .rec-action-dismiss { grid-column:1/-1; }
        }
        @media(prefers-reduced-motion:reduce) {
          .rec-card,.rec-card-visual img,.rec-action-btn { transition:none; }
        }
      `}</style>

      <section className="rec-hero">
        <div>
          <div className="rec-eyebrow">Your greener everyday starts here</div>
          <h1>Thoughtful swaps.<br />Measurable impact.</h1>
          <p className="rec-hero-copy">
            Recommendations shaped around your habits, priorities and budget—so the next sustainable choice feels practical, not overwhelming.
          </p>
        </div>
        <div className="rec-hero-side">
          <div className="rec-hero-stat">
            <strong>{isLoading ? '—' : recs.length}</strong>
            <span>Curated swaps</span>
          </div>
          <div className="rec-hero-stat">
            <strong>{isLoading ? '—' : categoryCount}</strong>
            <span>Impact areas</span>
          </div>
          <div className="rec-hero-stat rec-hero-stat-wide">
            <strong>{profile?.region ? `Personalised for ${profile.region}` : 'Personalised for your profile'}</strong>
            <span>{logs?.length ? 'Matched to your latest activity' : 'Ready for your first activity log'}</span>
          </div>
        </div>
      </section>

      <div className="rec-controls">
        <div>
          <h2>Picked for your lifestyle</h2>
          <p>Ranked by environmental impact, feasibility, cost and your saved preferences.</p>
        </div>
        <div className="rec-ranked-pill"><i /> {isLoading ? 'Preparing matches' : `${recs.length} recommendations`}</div>
      </div>

      {!isLoading && !logsError && !actionsError && recs.length > 0 && (
        <div className="rec-grid">
          {recs.map((rec) => {
            const sourceUrl = safeHttpsUrl(rec.alternative.source_url);
            const visual = visualFor(rec.alternative.category, rec.alternative.id);
            const savedAction = actions?.find((action) => action.alternative_id === rec.alternative.id);
            const isAdopted = savedAction?.status === 'adopted';
            const isMaybeLater = savedAction?.status === 'maybe_later';
            const costRange = formatCurrency(rec.cost_delta_range.low, 'INR') + ' to ' + formatCurrency(rec.cost_delta_range.high, 'INR');

            return (
              <article key={rec.alternative.id} className="rec-card">
                <div className="rec-card-visual" style={{ background: visual.tint }}>
                  <img
                    src={visual.image}
                    alt={`${rec.alternative.title} — ${visual.label} sustainable swap`}
                    loading="lazy"
                    onError={(event) => {
                      const image = event.currentTarget;
                      if (image.src !== visual.fallback) image.src = visual.fallback;
                      else image.style.opacity = '0';
                    }}
                  />
                  <div className="rec-card-topline">
                    <span className="rec-category-chip"><b>{visual.emoji}</b>{visual.label}</span>
                    <span className="rec-score-chip">{Math.round(rec.score * 100)} / 100 match</span>
                  </div>
                  <span className="rec-rank">{String(rec.rank).padStart(2, '0')}</span>
                </div>

                <div className="rec-card-body">
                  <h3>{rec.alternative.title}</h3>
                  <p className="rec-why">{rec.alternative.why_better}</p>

                  <div className="rec-match-context">
                    <span>✦</span>
                    <span>
                      <b>{logs?.length ? 'Why this fits:' : 'A good place to begin:'}</b>{' '}
                      {logs?.length
                        ? `Compared with your latest ${logs[0].category} log: ${logs[0].activity_name}.`
                        : 'A practical starting point. Log an activity to estimate your personal savings.'}
                    </span>
                  </div>

                  <ul className="rec-factors">
                    {rec.explanation_factors.slice(0, 3).map((factor) => (
                      <li key={factor}>{factor}</li>
                    ))}
                  </ul>

                  <div className="rec-metrics">
                    <div className="rec-metric">
                      <span>Potential CO₂e saved</span>
                      <strong>
                        {rec.co2e_saved_range
                          ? formatRange(rec.co2e_saved_range.low, rec.co2e_saved_range.high, 'kg/mo')
                          : 'Personal estimate pending'}
                      </strong>
                      <small>Estimated monthly reduction</small>
                    </div>
                    <div className="rec-metric">
                      <span>Monthly cost change</span>
                      <strong>{costRange}</strong>
                      <small>Negative values mean savings</small>
                    </div>
                  </div>

                  {rec.caveats && <p className="rec-caveat"><b>Good to know:</b> {rec.caveats}</p>}

                  <div className="rec-source">
                    <span>Source: {rec.alternative.source_citation}</span>
                    {sourceUrl && (
                      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">View reference ↗</a>
                    )}
                  </div>

                  <div className="rec-actions">
                    <button
                      type="button"
                      className={`rec-action-btn rec-action-adopt ${isAdopted ? 'is-adopted' : ''}`}
                      disabled={upsert.isPending || isAdopted}
                      aria-pressed={isAdopted}
                      onClick={() => void act(rec.alternative.id, 'adopted')}
                    >
                      {isAdopted ? '✓ Added to Your Routine' : upsert.isPending ? 'Saving…' : 'Adopt this swap →'}
                    </button>
                    <button
                      type="button"
                      className="rec-action-btn rec-action-later"
                      disabled={upsert.isPending}
                      aria-pressed={Boolean(isMaybeLater)}
                      onClick={() => void act(rec.alternative.id, 'maybe_later')}
                    >
                      {isMaybeLater ? '✓ Saved for later' : 'Maybe later'}
                    </button>
                    <button
                      type="button"
                      className="rec-action-btn rec-action-dismiss"
                      disabled={upsert.isPending}
                      onClick={() => void act(rec.alternative.id, 'not_for_me')}
                    >
                      Not for me
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isLoading && (
        <div className="rec-loading-grid" role="status" aria-label="Loading recommendations">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {(logsError || actionsError) && (
        <div className="rec-state-message" role="alert">
          <p>{logsError ? 'Activity history' : 'Saved recommendation preferences'} could not be loaded, so rankings are hidden.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
            {logsError && <button type="button" onClick={() => void refetchLogs()}>Retry activity history</button>}
            {actionsError && <button type="button" onClick={() => void refetchActions()}>Retry saved preferences</button>}
          </div>
        </div>
      )}

      {!isLoading && !logsError && !actionsError && recs.length === 0 && (
        <div className="rec-state-message">
          No recommendations currently match your region and saved preferences. Review your settings or update your activity log to see other options.
          <div style={{ marginTop: 14 }}><Link to="/settings">Review your settings →</Link></div>
        </div>
      )}
    </div>
  );
}
