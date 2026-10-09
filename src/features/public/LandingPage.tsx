import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../../shared/ui';
import { formatCurrency, formatRange } from '../../shared/lib/utils';
import { publicNavLinkClass } from './PublicMasthead';
import {
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  BookOpen,
} from 'lucide-react';
import './LandingPage.css';

export function LandingPage() {
  const [sampleDistance, setSampleDistance] = useState(15);
  const [sampleFrequency, setSampleFrequency] = useState(5);

  // Live interactive calculation for petrol car vs metro transit
  // Petrol car: 0.1705 kg/km, Metro: 0.0150 kg/km
  const monthlyKm = sampleDistance * 2 * sampleFrequency * 4.33;
  const carCO2eMonthly = monthlyKm * 0.1705;
  const metroCO2eMonthly = monthlyKm * 0.015;
  const co2eSavedMonthly = carCO2eMonthly - metroCO2eMonthly;
  const rupeesSavedMonthly = monthlyKm * 7.5 - monthlyKm * 2.5; // ~₹5/km net savings

  return (
    <div className="landing-page min-h-screen bg-background text-foreground">
      <header className="landing-header sticky top-0 z-50">
        <div className="landing-header__inner mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="landing-edition taxonomy-label">EDITION 2026 <span aria-hidden="true">/</span> VOL. 01</span>
            <Link to="/" className="landing-brand font-serif text-2xl font-bold tracking-tight text-foreground hover:opacity-90">
              GreenSwap<span className="text-burnt">.</span>
            </Link>
          </div>

          <nav aria-label="Main navigation" className="landing-nav hidden md:flex items-center gap-6 text-xs font-mono">
            <Link to="/explore" className={publicNavLinkClass}>
              Explore Catalog
            </Link>
            <Link to="/methodology" className={publicNavLinkClass}>
              Methodology & Citations
            </Link>
            <Link to="/about" className={publicNavLinkClass}>
              About
            </Link>
            <Link to="/styleguide" className={publicNavLinkClass}>
              Styleguide
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/explore" className="landing-compact-explore">Explore</Link>
            <Link to="/onboarding">
              <Button
                variant="primary"
                size="md"
                className="landing-header__cta rounded-full px-5 shadow-none transition hover:-translate-y-0.5"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
      <section className="landing-hero mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16 border-b border-border">
        <div className="landing-hero__inner grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Main Statement (Cols 1-7) */}
          <div className="landing-hero__copy md:col-span-7 space-y-6">
            <div className="landing-proof inline-flex items-center gap-2 border border-border bg-surface px-2.5 py-1 rounded-sm">
              <span className="landing-proof__dot h-2 w-2 rounded-full bg-moss" />
              <span className="taxonomy-label">Evidence-led · India-calibrated · Built for real life</span>
            </div>

            <h1 className="landing-hero__title font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground">
              Make a lighter footprint. <em>Keep the good life.</em>
            </h1>

            <p className="landing-hero__description font-sans text-base text-ink-muted leading-relaxed max-w-xl">
              Find practical changes that fit your routine—and see the carbon and cost impact
              with transparent, source-backed numbers.
            </p>

            <div className="landing-hero__actions flex flex-wrap items-center gap-4 pt-2">
              <Link to="/onboarding">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Build my baseline
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="lg">
                  Explore the swaps
                </Button>
              </Link>
            </div>

            <div className="landing-trust">
              <div className="landing-trust__avatars" aria-hidden="true">
                <span>G</span><span>+</span><span>CO₂</span>
              </div>
              <p><strong>Small steps, clear evidence.</strong><br />No guilt. No black boxes. Just useful next moves.</p>
            </div>
          </div>

          {/* Interactive Calibration Specimen Plate (Cols 8-12) */}
          <div className="landing-hero__visual md:col-span-5">
            <div className="landing-scene" aria-hidden="true">
              <div className="landing-scene__glow" />
              <div className="landing-scene__grid" />
              <div className="landing-orbit landing-orbit--outer"><span /></div>
              <div className="landing-orbit landing-orbit--inner"><span /></div>
              <div className="landing-globe">
                <div className="landing-globe__land landing-globe__land--one" />
                <div className="landing-globe__land landing-globe__land--two" />
                <div className="landing-globe__land landing-globe__land--three" />
                <div className="landing-globe__shine" />
              </div>
              <div className="landing-scene__spark landing-scene__spark--one" />
              <div className="landing-scene__spark landing-scene__spark--two" />
              <div className="landing-scene__stamp">FIELD NOTE<br /><strong>01 / 04</strong></div>
              <div className="landing-scene__caption">ONE PLANET<br />MANY BETTER CHOICES</div>
            </div>
            <Card
              taxonomyCode="INTERACTIVE SPECIMEN // CALIBRATION PREVIEW"
              badge={<Badge variant="moss">LIVE PREVIEW</Badge>}
              className="landing-calculator bg-surface-muted/30"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Trade the car for the metro
                  </h3>
                  <p className="text-xs text-ink-muted font-sans mt-0.5">
                    Adjust your commute to preview a practical monthly difference.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="flex justify-between text-ink-muted mb-1" htmlFor="sample-distance">
                      <span>One-Way Distance:</span>
                      <strong className="text-foreground">{sampleDistance} km</strong>
                    </label>
                    <input
                      id="sample-distance"
                      type="range"
                      min={5}
                      max={50}
                      step={1}
                      value={sampleDistance}
                      onChange={(e) => setSampleDistance(Number(e.target.value))}
                      className="w-full accent-burnt"
                      aria-label="One-way commute distance in kilometres"
                    />
                  </div>

                  <div>
                    <label className="flex justify-between text-ink-muted mb-1" htmlFor="sample-frequency">
                      <span>Weekly Frequency:</span>
                      <strong className="text-foreground">{sampleFrequency} days / week</strong>
                    </label>
                    <input
                      id="sample-frequency"
                      type="range"
                      min={1}
                      max={7}
                      step={1}
                      value={sampleFrequency}
                      onChange={(e) => setSampleFrequency(Number(e.target.value))}
                      className="w-full accent-burnt"
                      aria-label="Commute days per week"
                    />
                  </div>
                </div>

                {/* Live Output Card */}
                <div className="landing-calculator__result rounded border border-border bg-surface p-4 space-y-3" aria-live="polite">
                  <div className="flex items-center justify-between border-b border-border pb-2 text-xs">
                    <span className="taxonomy-label">PROJECTED MONTHLY MITIGATION</span>
                    <TrendingDown className="h-4 w-4 text-moss" />
                  </div>

                  <div>
                    <p className="text-xs text-ink-muted font-mono">Carbon Reduction Range:</p>
                    <p className="font-mono text-xl font-bold text-foreground">
                      {formatRange(co2eSavedMonthly * 0.9, co2eSavedMonthly * 1.1, 'kg CO2e/mo')}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-muted">Net Expenditure Delta:</span>
                    <strong className="text-moss font-semibold">
                      {formatCurrency(-rupeesSavedMonthly, 'INR')}/mo
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-ink-faint font-mono">
                  * Based on ARAI petrol emission factor (0.1705 kg/km) vs DMRC metro rail benchmark (0.0150 kg/km).
                </p>
              </div>
            </Card>
          </div>
        </div>
        <div className="landing-metrics">
          <div><strong>60+</strong><span>practical lifestyle swaps</span></div>
          <div><strong>±12%</strong><span>uncertainty made visible</span></div>
          <div><strong>India-first</strong><span>regional data and costs</span></div>
        </div>
      </section>

      {/* Editorial Principles Section */}
      <section className="landing-section mx-auto max-w-7xl px-6 py-20 md:px-12 border-b border-border">
        <div className="max-w-2xl mb-12">
          <p className="taxonomy-label mb-2">FOUNDATIONAL RULES</p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            How GreenSwap differs from conventional climate apps
          </h2>
        </div>

        <div className="landing-principles grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="landing-principle border border-border bg-surface p-6 rounded space-y-3">
            <span className="taxonomy-label block">RULE 01 // UNCERTAINTY BOUNDS</span>
            <h3 className="font-serif text-xl font-medium">No Fake Point Estimates</h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Every carbon and rupee calculation is displayed as an honest scientific range `[low – high]`.
              Carbon life cycles vary with weather, grid loads, and driving style; pretending otherwise is greenwashing.
            </p>
          </div>

          <div className="landing-principle border border-border bg-surface p-6 rounded space-y-3">
            <span className="taxonomy-label block">RULE 02 // REGIONAL SENSITIVITY</span>
            <h3 className="font-serif text-xl font-medium">Grid-Calibrated Math</h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Charging an EV on the Indian grid (0.716 kg CO2e/kWh) produces vastly different lifecycle impacts
              than charging in Europe. GreenSwap uses local Central Electricity Authority data.
            </p>
          </div>

          <div className="landing-principle border border-border bg-surface p-6 rounded space-y-3">
            <span className="taxonomy-label block">RULE 03 // FULL TRANSPARENCY</span>
            <h3 className="font-serif text-xl font-medium">Open Formula Ranking</h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              No black-box algorithms. Every suggestion shows "Why you're seeing this" with the top 2
              mathematical scoring factors and links to scientific source citations.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Botanical Catalog Preview */}
      <section className="landing-section landing-catalogue mx-auto max-w-7xl px-6 py-20 md:px-12 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="taxonomy-label mb-1">FIELD CATALOGUE EXCERPTS</p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
              Four High-Impact Interventions
            </h2>
          </div>
          <Link to="/explore">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
              View All 60+ Entries
            </Button>
          </Link>
        </div>

        <div className="landing-swaps grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="landing-swap-card" taxonomyCode="SPEC.01 // ENERGY" badge={<Badge variant="moss">62% CUT</Badge>}>
            <Zap className="h-5 w-5 text-moss mb-3" />
            <h3 className="font-serif text-base font-bold mb-1">5-Star BLDC Ceiling Fans</h3>
            <p className="text-xs text-ink-muted font-sans mb-3">
              Drops fan power consumption from 75W to 28W per room, amortizing capital within 12 months.
            </p>
            <p className="font-mono text-xs text-moss font-semibold">Saves ₹320/fan monthly</p>
          </Card>

          <Card className="landing-swap-card" taxonomyCode="SPEC.02 // FOOD" badge={<Badge variant="moss">35% CUT</Badge>}>
            <BookOpen className="h-5 w-5 text-clay mb-3" />
            <h3 className="font-serif text-base font-bold mb-1">Meatless Weekday Lunches</h3>
            <p className="text-xs text-ink-muted font-sans mb-3">
              Substituting ruminant meats with local dal and millets during workdays avoids enteric emissions.
            </p>
            <p className="font-mono text-xs text-moss font-semibold">Saves ~₹1,100/mo</p>
          </Card>

          <Card className="landing-swap-card" taxonomyCode="SPEC.03 // WASTE" badge={<Badge variant="moss">86% CUT</Badge>}>
            <ShieldCheck className="h-5 w-5 text-burnt mb-3" />
            <h3 className="font-serif text-base font-bold mb-1">Aerobic Khamba Composting</h3>
            <p className="text-xs text-ink-muted font-sans mb-3">
              Prevents anaerobic rotting in municipal dumps, eliminating potent landfill methane emissions.
            </p>
            <p className="font-mono text-xs text-foreground font-semibold">Zero waste to landfill</p>
          </Card>

          <Card className="landing-swap-card" taxonomyCode="SPEC.04 // ENERGY" badge={<Badge variant="moss">25% CUT</Badge>}>
            <TrendingDown className="h-5 w-5 text-moss mb-3" />
            <h3 className="font-serif text-base font-bold mb-1">AC 24°C–26°C Setpoint</h3>
            <p className="text-xs text-ink-muted font-sans mb-3">
              Every 1°C increase in thermostat saves 6% compressor load without sacrificing comfort.
            </p>
            <p className="font-mono text-xs text-moss font-semibold">Saves ~₹680/mo</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      </main>
      <footer className="border-t border-border bg-surface px-6 py-12 md:px-12 text-xs font-mono">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="font-serif text-lg font-bold text-foreground">GreenSwap.</span>
            <p className="text-ink-muted font-sans text-xs mt-1">
              Field Guide & Sustainable Lifestyle Recommendation System.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-ink-muted">
            <Link to="/methodology" className="hover:text-foreground">Methodology</Link>
            <Link to="/explore" className="hover:text-foreground">Catalog</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy (DPDP)</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/cookies" className="hover:text-foreground">Cookies</Link>
            <Link to="/about" className="hover:text-foreground">About</Link>
          </div>

          <span className="text-ink-faint">WCAG 2.2 AA // 2026 EDITION</span>
        </div>
      </footer>
    </div>
  );
}
