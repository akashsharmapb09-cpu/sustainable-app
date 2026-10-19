import { Link } from 'react-router-dom';
import { Card } from '../../shared/ui';
import { ArrowLeft, Database, HelpCircle, Scale, ShieldAlert, Cpu } from 'lucide-react';

export function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1c2e24]">
      {/* Header */}
      <header className="border-b border-[#e2dacb] bg-[#ede5d8]/80 backdrop-blur-sm px-6 py-4 md:px-12 sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#4a6b57] hover:text-[#162a20] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to GreenSwap
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/data-sources"
              className="text-xs font-mono text-[#5b7566] hover:text-[#162a20] underline transition-colors"
            >
              View Primary Data Sources Catalog →
            </Link>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-[#7a8f82] uppercase">
              METHODOLOGY // ALGORITHM SPECIFICATION
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12 space-y-12">
        {/* Hero Title */}
        <div className="border-b border-[#e2dacb] pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider bg-[#dbe8dc] text-[#162a20] border border-[#bcd3be]">
              <Cpu className="h-3.5 w-3.5 text-[#2c5e3f]" />
              SCIENTIFIC CALCULATION SPECIFICATION
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#162a20]">
            How GreenSwap Computes Footprints & Swap Utility
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4a5f51] leading-relaxed">
            We reject marketing greenwashing, speculative point estimates, and opaque black-box algorithms.
            Every calculation in GreenSwap is governed by deterministic formulas, statistical confidence intervals,
            and Multi-Criteria Decision Analysis (MCDA).
          </p>
        </div>

        {/* Section 1: Multi-Criteria Utility Function */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#2c5e3f]" />
            <h2 className="font-serif text-2xl font-bold text-[#162a20]">
              1. The Swap Utility Scoring Function: U(s)
            </h2>
          </div>
          <p className="font-sans text-sm text-[#4a5f51] leading-relaxed">
            Sustainability habits fail when they ignore economic realities or demand unreasonable lifestyle sacrifice.
            GreenSwap ranks every recommended swap <span className="font-mono font-semibold text-[#162a20]">s</span> using
            a weighted utility function balancing carbon impact against financial savings, implementation friction, and contextual feasibility:
          </p>

          <div className="rounded-2xl border border-[#cfe0d1] bg-white p-5 font-mono text-xs space-y-3 shadow-sm">
            <div className="text-[11px] uppercase tracking-wider text-[#7a8f82] font-semibold">
              Mathematical Recommendation Formulation
            </div>
            <div className="text-sm font-bold text-[#123826] bg-[#f2f7f3] p-3 rounded-xl border border-[#d6e6d8]">
              U(s) = [ w_c · ΔCO₂(s) ] + [ w_m · ΔMoney(s) ] + [ w_e · (1 - Friction(s)) ] + [ w_f · Feasibility(s, User) ]
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#4a5f51] pt-1">
              <div><strong className="text-[#162a20]">ΔCO₂(s):</strong> Normalized annual GHG reduction [kg CO₂e]</div>
              <div><strong className="text-[#162a20]">ΔMoney(s):</strong> Net annualized household savings (₹ or $)</div>
              <div><strong className="text-[#162a20]">Friction(s):</strong> Behavioral resistance scale (0.0 easy to 1.0 hard)</div>
              <div><strong className="text-[#162a20]">Feasibility(s, User):</strong> Constraint filter (e.g. rental vs homeowner)</div>
            </div>
          </div>
        </section>

        {/* Section 2: Uncertainty Bounds & Real Physical Reality */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#162a20]">
            2. Confidence Ranges [Low – High] vs False Precision
          </h2>
          <p className="font-sans text-sm text-[#4a5f51] leading-relaxed">
            Conventional apps display deceptively precise claims like <em>"You saved 41.24 kg of carbon today."</em> In physical reality,
            carbon accounting is inherently stochastic: automotive fuel burn fluctuates with ambient temperature and traffic congestion,
            while grid carbon intensity shifts hourly depending on peak thermal vs solar/wind dispatch.
          </p>

          <div className="rounded-2xl border border-[#ded5c5] bg-white p-5 font-mono text-xs space-y-3 shadow-sm">
            <p className="text-[#162a20] font-semibold">Scientific Range Propagation Equation:</p>
            <p className="text-[#2c5e3f] bg-[#faf6f0] p-3 rounded-lg border border-[#e8dfcf] font-bold">
              CO₂e Saved = Baseline &times; Activity Delta &times; Factor_nominal &times; (1 &plusmn; &sigma;_uncertainty)
            </p>
            <ul className="list-disc list-inside text-[11px] text-[#556c5e] space-y-1">
              <li><strong>Continuous Grid Electricity:</strong> &plusmn;5% uncertainty via metered Central Electricity Authority (CEA) disclosures.</li>
              <li><strong>Vehicular Combustion:</strong> &plusmn;8% to &plusmn;10% variance based on ARAI drive cycles vs highway cruising.</li>
              <li><strong>Landfill & Biogenic Methane Decay:</strong> &plusmn;15% due to varying ambient moisture and soil depth kinetics.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Jevons Paradox & Rebound Effect Guards */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#845e2a]" />
            <h2 className="font-serif text-2xl font-bold text-[#162a20]">
              3. Guarding Against Jevons Paradox & Rebound Effects
            </h2>
          </div>
          <p className="font-sans text-sm text-[#4a5f51] leading-relaxed">
            The Jevons Paradox states that increases in efficiency often induce lower operational costs, paradoxically
            stimulating higher total consumption. GreenSwap explicitly incorporates embedded lifecycle debt and behavioral warnings:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card taxonomyCode="CAVEAT // ELECTRIC VEHICLES">
              <h3 className="font-serif font-bold text-sm mb-1 text-[#162a20]">Electric Vehicle Embodied Debt</h3>
              <p className="text-xs text-[#52705e] font-sans leading-relaxed">
                A battery electric car incurs an upfront carbon penalty of 4,000–8,000 kg CO₂e during lithium mining and cell cathode baking.
                On India's current thermal-dominant grid, the vehicle must be driven 8,500–12,000 km before crossing net parity against a lightweight petrol hatchback.
              </p>
            </Card>

            <Card taxonomyCode="CAVEAT // REUSABLE COTTON TOTES">
              <h3 className="font-serif font-bold text-sm mb-1 text-[#162a20]">Cotton Bag Embodied Water & Carbon</h3>
              <p className="text-xs text-[#52705e] font-sans leading-relaxed">
                Producing an organic cotton canvas tote requires up to 2,500 liters of water and substantial harvesting footprint.
                A user must reuse a single cotton tote at least 50 to 100 times before its environmental footprint breaks even with a single recycled HDPE grocery bag.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 4: Boundaries & Accounting Scopes */}
        <section className="space-y-4 border-t border-[#ded5c5] pt-8">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#2c5e3f]" />
            <h2 className="font-serif text-2xl font-bold text-[#162a20]">
              4. GHG Protocol Accounting Scopes & Boundaries
            </h2>
          </div>
          <p className="font-sans text-sm text-[#4a5f51] leading-relaxed">
            GreenSwap strictly adopts the Greenhouse Gas (GHG) Protocol Corporate and Household Standard:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="rounded-xl border border-[#ded5c5] bg-white p-4 space-y-1">
              <span className="font-bold text-[#162a20] block">Scope 1 (Direct)</span>
              <p className="font-sans text-[11px] text-[#556c5e]">
                Direct combustion: gasoline/diesel vehicles, LPG cooking cylinders, natural gas heating.
              </p>
            </div>
            <div className="rounded-xl border border-[#ded5c5] bg-white p-4 space-y-1">
              <span className="font-bold text-[#162a20] block">Scope 2 (Electricity)</span>
              <p className="font-sans text-[11px] text-[#556c5e]">
                Purchased grid electricity for residential cooling, lighting, appliances, and EV home charging.
              </p>
            </div>
            <div className="rounded-xl border border-[#ded5c5] bg-white p-4 space-y-1">
              <span className="font-bold text-[#162a20] block">Scope 3 (Embodied)</span>
              <p className="font-sans text-[11px] text-[#556c5e]">
                Supply chain footprint: apparel production, food lifecycle, consumer electronics, and municipal waste decay.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Link to Data Sources */}
        <section className="rounded-2xl border border-[#cfe0d1] bg-[#eef5ef] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#2c5e3f]">
              <Database className="h-4 w-4" />
              LOOKING FOR INDIVIDUAL EMISSION FACTORS?
            </div>
            <h3 className="font-serif text-xl font-bold text-[#162a20]">
              Explore Our Comprehensive Primary Data Catalog
            </h3>
            <p className="text-xs font-sans text-[#4a5f51] leading-relaxed">
              Browse all DEFRA, CEA India, US EPA eGRID, ARAI, and Poore & Nemecek conversion factors, complete with uncertainty percentages and direct links to public source registries.
            </p>
          </div>
          <Link
            to="/data-sources"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162a20] text-white text-xs font-mono font-semibold hover:bg-[#254233] transition-colors shadow-sm shrink-0"
          >
            <Database className="h-3.5 w-3.5" /> View Data Sources Catalog
          </Link>
        </section>
      </main>
    </div>
  );
}
