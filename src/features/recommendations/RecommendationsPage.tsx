import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '../../shared/ui';
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
import type { ActivityContext, ScoredRecommendation, UserScoringProfile } from './engine/types';
import { useToast } from '../../shared/ui';

type RecommendationPhotoKind = 'bottle' | 'train';

const FEATURED_ALTERNATIVE_IDS = [
  'alt-reusable-steel-flask',
  'alt-train-intercity',
] as const;

function getRecommendationPhoto(alternative: { id: string; title: string; category: string }): RecommendationPhotoKind | null {
  const title = alternative.title.toLowerCase();
  if (alternative.id === 'alt-reusable-steel-flask' || /reusable|insulated stainless steel water bottle|water bottle/.test(title)) return 'bottle';
  if (alternative.id === 'alt-train-intercity' || /vande bharat|intercity.*train|express train/.test(title)) return 'train';
  return null;
}

const PHOTO_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNlOGYwZTgiLz48L3N2Zz4=';

function RecommendationPhoto({ kind, priority }: { kind: RecommendationPhotoKind; priority: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [parallaxY, setParallaxY] = useState(0);
  const isBottle = kind === 'bottle';
  const src = isBottle
    ? 'https://sageandcooper.au/cdn/shop/files/Allegracreativelifestyle.jpg?v=1739844790&width=1445'
    : 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Vande_Bharat_train.jpg';

  useEffect(() => {
    const updateParallax = () => {
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const displacement = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.018;
      const nextOffset = Math.max(-10, Math.min(10, displacement));
      setParallaxY((current) => Math.abs(current - nextOffset) < 0.5 ? current : nextOffset);
    };
    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax);
    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="recommendation-photo group relative isolate h-full min-h-[320px] overflow-hidden rounded-[16px] bg-[#DDE5D8] sm:min-h-[390px] lg:min-h-[420px]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -inset-y-3 inset-x-0 will-change-transform"
          style={{ transform: 'translate3d(0, ' + parallaxY + 'px, 0)' }}
        >
          <Image
            src={src}
            alt={isBottle
              ? 'Sage-toned insulated stainless steel bottles arranged on a minimalist product podium'
              : 'Blue and white Vande Bharat Express at an Indian railway platform'}
            fill
            sizes="(max-width: 767px) 100vw, 44vw"
            quality={90}
            priority={priority}
            placeholder="blur"
            blurDataURL={PHOTO_PLACEHOLDER}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            style={{ objectPosition: isBottle ? 'center 54%' : 'center 48%' }}
          />
        </div>
      </div>
      {isBottle ? (
        <>
          <div className="absolute inset-0 bg-[#DCE8D4]/16 mix-blend-multiply" />
          <div className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-[#28372B]/20 to-transparent" />
          <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[#D9E4D1]/45 blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-[#F8F7F0]/80 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#294633] shadow-sm backdrop-blur-md">
            Refill · Reuse · Repeat
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#101914]/60 via-[#101914]/5 to-transparent" />
          <div className="absolute bottom-4 left-4 rounded-full border border-white/35 bg-[#17221C]/55 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-md">
            Lower-impact journeys
          </div>
          <a
            href="https://commons.wikimedia.org/wiki/File:Vande_Bharat_train.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 rounded-full bg-black/35 px-2.5 py-1.5 text-[9px] text-white/90 backdrop-blur-md underline underline-offset-2"
            aria-label="Photo credit: Radhika41, licensed under Creative Commons Attribution Share Alike 4.0"
          >
            Photo: Radhika41 · CC BY-SA 4.0
          </a>
        </>
      )}
    </div>
  );
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

  const editorialRecs = (() => {
    if (logsLoading || actionsLoading || alternativesLoading || profileLoading || logsError || actionsError) return [];
    const alts = alternatives ?? [];
    const editorialProfile: UserScoringProfile = {
      ...scoring,
      adopted_alternative_ids: [],
      action_history: [],
    };
    const broadRankings = getColdStartRecommendations(alts, editorialProfile, alts.length);
    return FEATURED_ALTERNATIVE_IDS.map((id, index) => {
      const recommendation = recs.find((item) => item.alternative.id === id)
        ?? broadRankings.find((item) => item.alternative.id === id);
      return recommendation ? { ...recommendation, rank: index + 1 } : undefined;
    }).filter((item): item is ScoredRecommendation => Boolean(item));
  })();

  const act = async (id: string, status: 'adopted' | 'maybe_later' | 'not_for_me') => {
    try {
      await upsert.mutateAsync({ alternative_id: id, status });
      toast({ title: status === 'adopted' ? 'Marked adopted' : 'Preference saved', type: 'success' });
    } catch (error) {
      toast({
        title: 'Could not save preference',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  const isLoading = logsLoading || actionsLoading || alternativesLoading || profileLoading;

  return (
    <div className="recommendations-editorial mx-auto max-w-[1480px] px-5 py-8 sm:px-8 sm:py-10 xl:px-12 xl:py-14">
      <header className="mb-9 flex items-end justify-between gap-8 sm:mb-11 max-lg:flex-col max-lg:items-start">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.19em] text-[#647166] sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4D7858]" aria-hidden="true" />
            The Green Edit <span className="text-[#A5AA9F]">/</span> Considered swaps
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-[42px] font-normal leading-[0.99] tracking-[-0.045em] text-[#202720] sm:text-[56px]">
            Good choices,
            <br />
            beautifully simple.
          </h1>
          <p className="mt-5 max-w-xl text-[14px] leading-7 text-[#667066] sm:text-[15px]">
            A considered edit of small changes that make everyday living lighter — without changing what makes it good.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 border-t border-[#DCD7CB] pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#747D72] max-lg:w-full sm:pt-0 sm:border-t-0">
          <span className="text-[#202720]">02</span>
          <span>Featured alternatives</span>
          <span className="ml-1 h-px w-12 bg-[#B8C2B5]" />
        </div>
      </header>

      <div className="space-y-6 sm:space-y-7">
        {editorialRecs.map((rec, index) => {
          const photo = getRecommendationPhoto(rec.alternative);
          if (!photo) return null;
          const sourceUrl = safeHttpsUrl(rec.alternative.source_url);
          const action = actions?.find((item) => item.alternative_id === rec.alternative.id);
          const isAdopted = action?.status === 'adopted';
          const isSaved = action?.status === 'maybe_later';

          return (
            <article
              key={rec.alternative.id}
              className="recommendation-card group grid overflow-hidden rounded-[26px] border border-[#E7E2D8] bg-[#FCFAF6] shadow-[0_14px_44px_rgba(33,39,32,0.055)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(33,39,32,0.11)] md:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]"
            >
              <div className="flex min-w-0 flex-col p-6 sm:p-8 lg:p-10">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#798477]">
                    0{index + 1} <span className="mx-1 text-[#C4C7BE]">/</span> {photo === 'bottle' ? 'Daily essentials' : 'Conscious travel'}
                  </p>
                  <span className="rounded-full border border-[#E2E6DD] bg-[#F2F4EC] px-2.5 py-1 text-[10px] font-medium tabular-nums text-[#435A46]">
                    {Math.round(rec.score * 100)} match
                  </span>
                </div>

                <h2 className="mt-5 font-serif text-[29px] font-normal leading-[1.08] tracking-[-0.035em] text-[#202720] sm:text-[34px]">
                  {rec.alternative.title}
                </h2>
                <p className="mt-4 text-[13px] leading-6 text-[#687166] sm:text-[14px]">
                  {rec.alternative.description}
                </p>

                <div className="mt-6 border-t border-[#E9E4DA] pt-5">
                  <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-[#8A9387]">Why it makes sense</p>
                  <p className="mt-2 text-[13px] leading-6 text-[#364139] sm:text-[14px]">
                    {rec.alternative.why_better}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#E9E4DA] pt-5">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8A9387]">Monthly cost shift</p>
                    <p className="mt-2 text-[15px] font-medium tracking-[-0.02em] text-[#26352A]">
                      {formatCurrency(rec.cost_delta_range.low, 'INR')} <span className="text-[#A1A79C]">—</span> {formatCurrency(rec.cost_delta_range.high, 'INR')}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8A9387]">Carbon estimate</p>
                    <p className="mt-2 text-[13px] font-medium leading-5 text-[#26352A]">
                      {rec.co2e_saved_range
                        ? formatRange(rec.co2e_saved_range.low, rec.co2e_saved_range.high, 'kg/mo')
                        : 'Personalise with a log'}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-1.5">
                  {rec.explanation_factors.slice(0, 2).map((factor) => (
                    <li key={factor} className="flex gap-2 text-[11px] leading-5 text-[#667066]">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#7D987A]" aria-hidden="true" />
                      {factor}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                  <Button
                    size="lg"
                    disabled={upsert.isPending}
                    onClick={() => void act(rec.alternative.id, 'adopted')}
                    className="h-11 rounded-full border border-[#171B17] bg-[#171B17] px-6 font-sans text-[12px] font-semibold text-white shadow-[0_5px_14px_rgba(23,27,23,0.16)] hover:bg-[#354438] hover:border-[#354438]"
                  >
                    {isAdopted ? 'Adopted' : 'Adopt'}
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <button
                    type="button"
                    disabled={upsert.isPending}
                    onClick={() => void act(rec.alternative.id, 'maybe_later')}
                    aria-pressed={isSaved}
                    className="rounded-full px-3 py-2 text-[11px] font-medium text-[#677166] transition-colors hover:bg-[#F0F0E8] hover:text-[#202720] disabled:opacity-40"
                  >
                    {isSaved ? 'Saved for later ✓' : 'Maybe later'}
                  </button>
                  <button
                    type="button"
                    disabled={upsert.isPending}
                    onClick={() => void act(rec.alternative.id, 'not_for_me')}
                    className="rounded-full px-2 py-2 text-[11px] text-[#969B91] transition-colors hover:text-[#5E695F] disabled:opacity-40"
                  >
                    Not for me
                  </button>
                </div>

                <p className="mt-6 border-t border-[#E9E4DA] pt-3 text-[10px] leading-5 text-[#8A9387]">
                  Source: {rec.alternative.source_citation}
                  {sourceUrl && (
                    <>
                      {' · '}
                      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#374B3B]">
                        Read reference
                      </a>
                    </>
                  )}
                </p>
              </div>

              <div className="min-w-0 bg-[#E9EEE5] p-3 sm:p-3">
                <RecommendationPhoto kind={photo} priority={index === 0} />
              </div>
            </article>
          );
        })}
      </div>

      {isLoading && (
        <div className="mt-6 space-y-5" role="status" aria-label="Loading recommendations">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}
      {(logsError || actionsError) && (
        <div className="mt-6 space-y-3 rounded-2xl border border-[#E6CFC4] bg-[#FCF5F0] p-5 text-sm text-[#8C432B]" role="alert">
          <p>{logsError ? 'Activity history' : 'Saved recommendation preferences'} could not be loaded, so rankings are hidden.</p>
          {logsError && <Button variant="outline" size="sm" onClick={() => void refetchLogs()}>Retry activity history</Button>}
          {actionsError && <Button variant="outline" size="sm" onClick={() => void refetchActions()}>Retry saved preferences</Button>}
        </div>
      )}
      {!isLoading && !logsError && !actionsError && editorialRecs.length === 0 && (
        <div className="mt-6 rounded-[24px] border border-[#E7E2D8] bg-[#FCFAF6] p-8">
          <p className="font-serif text-2xl text-[#202720]">Your edit is taking shape.</p>
          <p className="mt-2 text-sm leading-6 text-[#687166]">
            No featured recommendations are available for the current catalogue. Review your settings or return after refreshing your alternatives.
          </p>
          <Link to="/settings" className="mt-4 inline-flex text-sm underline underline-offset-4">Review settings</Link>
        </div>
      )}
    </div>
  );
}
