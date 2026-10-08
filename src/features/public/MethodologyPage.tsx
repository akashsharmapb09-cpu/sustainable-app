import { Link } from 'react-router-dom';
import { Card, Badge } from '../../shared/ui';
import { ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';

export function MethodologyPage() {
  const factors = [
    {
      category: 'Transport',
      name: 'Passenger Car (Petrol, Average ARAI)',
      value: '0.1705 kg CO2e / km',
      source: 'DEFRA 2024 / ARAI India',
      url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
      uncertainty: '±10%',
    },
    {
      category: 'Transport',
      name: 'Metro Rail (Urban Rapid Transit)',
      value: '0.0150 kg CO2e / passenger-km',
      source: 'DMRC Sustainability Report 2023 / DEFRA 2024',
      url: 'https://www.delhimetrorail.com/',
      uncertainty: '±10%',
    },
    {
      category: 'Energy',
      name: 'Grid Electricity (India National Weighted Avg)',
      value: '0.7160 kg CO2e / kWh',
      source: 'CEA India CO2 Baseline Database v19 (2023)',
      url: 'https://cea.nic.in/cdm-co2-baseline-database',
      uncertainty: '±5%',
    },
    {
      category: 'Energy',
      name: 'Grid Electricity (US eGRID Average)',
      value: '0.3860 kg CO2e / kWh',
      source: 'US EPA eGRID 2024',
      url: 'https://www.epa.gov/egrid',
      uncertainty: '±5%',
    },
    {
      category: 'Energy',
      name: 'LPG Cooking Gas Cylinder',
      value: '2.9830 kg CO2e / kg LPG',
      source: 'IPCC AR6 / DEFRA 2024',
      url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
      uncertainty: '±5%',
    },
    {
      category: 'Food',
      name: 'Poultry / Chicken Meat',
      value: '6.1000 kg CO2e / kg',
      source: 'DEFRA 2024 / FAO',
      url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
      uncertainty: '±10%',
    },
    {
      category: 'Food',
      name: 'Lentils / Dal / Indigenous Millets',
      value: '0.8500 kg CO2e / kg',
      source: 'Poore & Nemecek (Science 2018) / ICRISAT',
      url: 'https://science.sciencemag.org/content/360/6392/987',
      uncertainty: '±10%',
    },
    {
      category: 'Waste',
      name: 'Landfilled Mixed Solid Waste (Methane)',
      value: '0.5800 kg CO2e / kg waste',
      source: 'US EPA WARM 2024 / IPCC AR6',
      url: 'https://www.epa.gov/warm',
      uncertainty: '±15%',
    },
    {
      category: 'Waste',
      name: 'Aerobic Home Compost',
      value: '0.0800 kg CO2e / kg waste',
      source: 'US EPA WARM 2024',
      url: 'https://www.epa.gov/warm',
      uncertainty: '±15%',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-ink-muted hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to GreenSwap
          </Link>
          <span className="taxonomy-label">CALIBRATION & SCIENTIFIC METHODOLOGY</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12 space-y-12">
        <div className="border-b border-border pb-6 space-y-3">
          <span className="taxonomy-label">DOCUMENTATION // METHODOLOGY & CITATIONS</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            How GreenSwap Computes Footprints & Reductions
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            We reject marketing greenwashing and speculative point estimates. All calculations in GreenSwap
            are grounded in peer-reviewed scientific literature and public grid disclosures.
          </p>
        </div>

        {/* Section 1: Scientific Uncertainty Ranges */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">1. Why We Use Confidence Ranges [Low – High]</h2>
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            Conventional apps display deceptively precise claims like "You saved 41.24 kg of carbon today."
            In physical reality, carbon accounting is inherently uncertain: automotive fuel burn fluctuates
            with ambient temperature and city traffic, while electricity grid emissions shift hourly depending
            on peak thermal vs renewable dispatch.
          </p>
          <div className="rounded border border-border bg-surface p-4 font-mono text-xs space-y-2">
            <p className="text-foreground font-semibold">Scientific Uncertainty Formula:</p>
            <p className="text-ink-muted">
              CO2e Saved = Baseline &times; Reduction Ratio &times; (1 &plusmn; Factor Uncertainty)
            </p>
            <p className="text-[11px] text-ink-faint">
              Standard life-cycle conversion uncertainties range from &plusmn;5% (metered electricity) to &plusmn;15% (agricultural and landfill methane decay).
            </p>
          </div>
        </section>

        {/* Section 2: Emission Factors Catalog */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">2. Public Emission Factors Table</h2>
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            The database is seeded with factors from the UK Department for Environment, Food & Rural Affairs (DEFRA 2024),
            the Central Electricity Authority of India (CEA 2023), US EPA, and IPCC AR6.
          </p>

          <div className="overflow-x-auto rounded border border-border bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border bg-surface-muted/50 text-ink-muted">
                  <th className="p-3">Category</th>
                  <th className="p-3">Activity / Commodity</th>
                  <th className="p-3">Conversion Factor</th>
                  <th className="p-3">Source & Year</th>
                  <th className="p-3">Uncertainty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {factors.map((f, i) => (
                  <tr key={i} className="hover:bg-surface-muted/30">
                    <td className="p-3">
                      <Badge variant="subtle" size="sm">{f.category}</Badge>
                    </td>
                    <td className="p-3 font-semibold text-foreground">{f.name}</td>
                    <td className="p-3 text-moss">{f.value}</td>
                    <td className="p-3 text-ink-muted">
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline text-burnt"
                      >
                        {f.source} <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="p-3 text-ink-faint">{f.uncertainty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Honest Caveats & Rebound Effects */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">3. Rebound Effects & System Caveats</h2>
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            Every GreenSwap recommendation contains explicit caveat labels to guard against Jevons Paradox
            (where efficiency gains induce higher consumption):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card taxonomyCode="CAVEAT // ELECTRIC VEHICLES">
              <h3 className="font-serif font-bold text-sm mb-1">Electric Vehicle Embodied Debt</h3>
              <p className="text-xs text-ink-muted font-sans">
                A battery electric car emits significant carbon during lithium and cathode refining.
                On the Indian grid, it must be driven for approximately 8,000 km before achieving net lifecycle parity over a petrol car.
              </p>
            </Card>

            <Card taxonomyCode="CAVEAT // REUSABLE TOTES">
              <h3 className="font-serif font-bold text-sm mb-1">Cotton Tote Bag Manufacturing</h3>
              <p className="text-xs text-ink-muted font-sans">
                Virgin organic cotton bags have high agricultural water and harvesting footprint.
                A single cotton tote must be reused 50 to 100 times before its net impact beats a standard plastic bag.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 4: Boundary Limits */}
        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-ink-muted" />
            <h2 className="font-serif text-lg font-bold">Accounting Scope & Boundaries</h2>
          </div>
          <p className="font-sans text-xs text-ink-muted leading-relaxed">
            GreenSwap focuses on Scope 1 (direct residential fuel/gas combustion and personal travel) and Scope 2
            (purchased electricity). For physical goods (apparel, smartphones, appliances), we incorporate cradle-to-consumer
            Scope 3 lifecycle embodied estimates. We do not currently track institutional or public infrastructure footprint.
          </p>
        </section>
      </main>
    </div>
  );
}
