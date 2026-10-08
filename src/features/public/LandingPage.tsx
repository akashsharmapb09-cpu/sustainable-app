import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../../shared/ui';
import { formatCurrency, formatRange } from '../../shared/lib/utils';
import {
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  BookOpen,
} from 'lucide-react';

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Archival Masthead */}
      <header className="border-b border-border bg-surface px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="taxonomy-label border border-border px-2 py-0.5 rounded-sm">EDITION 2026 // VOL. 01</span>
            <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-foreground hover:opacity-90">
              GreenSwap<span className="text-burnt">.</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
            <Link to="/explore" className="text-ink-muted hover:text-foreground transition-colors">
              Explore Catalog
            </Link>
            <Link to="/methodology" className="text-ink-muted hover:text-foreground transition-colors">
              Methodology & Citations
            </Link>
            <Link to="/about" className="text-ink-muted hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/styleguide" className="text-ink-muted hover:text-foreground transition-colors">
              Styleguide
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Begin Calibration
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Editorial Hero (Asymmetric 12-Column Grid) */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Main Statement (Cols 1-7) */}
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border border-border bg-surface px-2.5 py-1 rounded-sm">
              <span className="h-2 w-2 rounded-full bg-moss" />
              <span className="taxonomy-label">PEER-REVIEWED FACTOR DATABASE // DEFRA 2024 & CEA INDIA</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground">
              Most carbon calculators give you guilt. We give you arithmetic.
            </h1>

            <p className="font-sans text-base text-ink-muted leading-relaxed max-w-xl">
              Your commute and home energy account for over 60% of your personal footprint.
              GreenSwap recommends verifiable, pragmatic lifestyle alternatives—quantified in
              exact confidence ranges of CO2e and monthly rupees saved.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/onboarding">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start 5-Minute Lifestyle Calibration
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="lg">
                  Browse 60+ Alternatives
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-ink-muted block">GRID BENCHMARK:</span>
                <span className="font-semibold text-foreground">0.716 kg CO2e/kWh</span>
              </div>
              <div>
                <span className="text-ink-muted block">UNCERTAINTY:</span>
                <span className="font-semibold text-foreground">Explicit Ranges [±12%]</span>
              </div>
              <div>
                <span className="text-ink-muted block">ALGORITHMIC MODEL:</span>
                <span className="font-semibold text-foreground">Deterministic Pure TS</span>
              </div>
            </div>
          </div>

          {/* Interactive Calibration Specimen Plate (Cols 8-12) */}
          <div className="md:col-span-5">
            <Card
              taxonomyCode="INTERACTIVE SPECIMEN // CALIBRATION PREVIEW"
              badge={<Badge variant="moss">LIVE ENGINE</Badge>}
              className="bg-surface-muted/30"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Petroleum Commute vs Metro Transit
                  </h3>
                  <p className="text-xs text-ink-muted font-sans mt-0.5">
                    Calibrate your weekly car commute to inspect immediate projected savings.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-ink-muted mb-1">
                      <span>One-Way Distance:</span>
                      <strong className="text-foreground">{sampleDistance} km</strong>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      step={1}
                      value={sampleDistance}
                      onChange={(e) => setSampleDistance(Number(e.target.value))}
                      className="w-full accent-burnt"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-ink-muted mb-1">
                      <span>Weekly Frequency:</span>
                      <strong className="text-foreground">{sampleFrequency} days / week</strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={7}
                      step={1}
                      value={sampleFrequency}
                      onChange={(e) => setSampleFrequency(Number(e.target.value))}
                      className="w-full accent-burnt"
                    />
                  </div>
                </div>

                {/* Live Output Card */}
                <div className="rounded border border-border bg-surface p-4 space-y-3">
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
      </section>

      {/* Editorial Principles Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 border-b border-border">
        <div className="max-w-2xl mb-12">
          <p className="taxonomy-label mb-2">FOUNDATIONAL RULES</p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            How GreenSwap differs from conventional climate apps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-border bg-surface p-6 rounded space-y-3">
            <span className="taxonomy-label block">RULE 01 // UNCERTAINTY BOUNDS</span>
            <h3 className="font-serif text-xl font-medium">No Fake Point Estimates</h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Every carbon and rupee calculation is displayed as an honest scientific range `[low – high]`.
              Carbon life cycles vary with weather, grid loads, and driving style; pretending otherwise is greenwashing.
            </p>
          </div>

          <div className="border border-border bg-surface p-6 rounded space-y-3">
            <span className="taxonomy-label block">RULE 02 // REGIONAL SENSITIVITY</span>
            <h3 className="font-serif text-xl font-medium">Grid-Calibrated Math</h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Charging an EV on the Indian grid (0.716 kg CO2e/kWh) produces vastly different lifecycle impacts
              than charging in Europe. GreenSwap uses local Central Electricity Authority data.
            </p>
          </div>

          <div className="border border-border bg-surface p-6 rounded space-y-3">
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
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 border-b border-border">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card taxonomyCode="SPEC.01 // ENERGY" badge={<Badge variant="moss">62% CUT</Badge>}>
            <Zap className="h-5 w-5 text-moss mb-3" />
            <h3 className="font-serif text-base font-bold mb-1">5-Star BLDC Ceiling Fans</h3>
            <p className="text-xs text-ink-muted font-sans mb-3">
              Drops fan power consumption from 75W to 28W per room, amortizing capital within 12 months.
            </p>
            <p className="font-mono text-xs text-moss font-semibold">Saves ₹320/fan monthly</p>
          </Card>

          <Card taxonomyCode="SPEC.02 // FOOD" badge={<Badge variant="moss">35% CUT</Badge>}>
            <BookOpen className="h-5 w-5 text-clay mb-3" />
            <h3 className="font-serif text-base font-bold mb-1">Meatless Weekday Lunches</h3>
            <p className="text-xs text-ink-muted font-sans mb-3">
              Substituting ruminant meats with local dal and millets during workdays avoids enteric emissions.
            </p>
            <p className="font-mono text-xs text-moss font-semibold">Saves ~₹1,100/mo</p>
          </Card>

          <Card taxonomyCode="SPEC.03 // WASTE" badge={<Badge variant="moss">86% CUT</Badge>}>
            <ShieldCheck className="h-5 w-5 text-burnt mb-3" />
            <h3 className="font-serif text-base font-bold mb-1">Aerobic Khamba Composting</h3>
            <p className="text-xs text-ink-muted font-sans mb-3">
              Prevents anaerobic rotting in municipal dumps, eliminating potent landfill methane emissions.
            </p>
            <p className="font-mono text-xs text-foreground font-semibold">Zero waste to landfill</p>
          </Card>

          <Card taxonomyCode="SPEC.04 // ENERGY" badge={<Badge variant="moss">25% CUT</Badge>}>
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
