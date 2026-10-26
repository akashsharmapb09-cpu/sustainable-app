import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../shared/ui';
import { ArrowLeft, ExternalLink, Search, Download, Database, ShieldCheck, BookOpen, Layers } from 'lucide-react';

interface DataSourceItem {
  id: string;
  category: 'Energy & Grid' | 'Mobility & Transit' | 'Food & Agriculture' | 'Materials & Waste';
  title: string;
  organization: string;
  jurisdiction: string;
  year: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3' | 'Scope 1 & 2' | 'Scope 1, 2 & 3';
  factorSample: string;
  uncertainty: string;
  description: string;
  url: string;
}

const DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'cea-india',
    category: 'Energy & Grid',
    title: 'CO₂ Baseline Database for the Indian Power Sector (v19/v20)',
    organization: 'Central Electricity Authority (CEA), Ministry of Power, Govt. of India',
    jurisdiction: 'India (National & Regional Grids)',
    year: '2023–2024',
    scope: 'Scope 2',
    factorSample: '0.7160 kg CO₂e / kWh (National Weighted Average)',
    uncertainty: '±5% (continuous generation meter reporting)',
    description: 'Calculates the weighted average emission factor of all grid-connected generation units in India, factoring in thermal coal, hydro, nuclear, and growing renewable solar/wind mix.',
    url: 'https://cea.nic.in/cdm-co2-baseline-database',
  },
  {
    id: 'us-egrid',
    category: 'Energy & Grid',
    title: 'Emissions & Generation Resource Integrated Database (eGRID 2024)',
    organization: 'United States Environmental Protection Agency (US EPA)',
    jurisdiction: 'United States (Subregional Grids)',
    year: '2024',
    scope: 'Scope 2',
    factorSample: '0.3860 kg CO₂e / kWh (US National Average)',
    uncertainty: '±4% (Continuous Emission Monitoring Systems - CEMS)',
    description: 'Comprehensive environmental inventory of almost all electric power generation plants in the US, attributing nitrogen oxides, sulfur dioxide, and carbon dioxide.',
    url: 'https://www.epa.gov/egrid',
  },
  {
    id: 'defra-ghg',
    category: 'Mobility & Transit',
    title: 'Greenhouse Gas Reporting: Conversion Factors 2024',
    organization: 'UK Department for Environment, Food & Rural Affairs (DEFRA) / DESNZ',
    jurisdiction: 'United Kingdom & International Proxies',
    year: '2024',
    scope: 'Scope 1, 2 & 3',
    factorSample: '0.1705 kg CO₂e / km (Petrol Passenger Car)',
    uncertainty: '±10% (real-world driving telemetry variance)',
    description: 'Gold-standard government emission factors for company and individual greenhouse gas reporting, covering road transport, passenger rail, domestic aviation, and fuel supply chains.',
    url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
  },
  {
    id: 'arai-india',
    category: 'Mobility & Transit',
    title: 'Indian Driving Cycle Fuel Consumption & EV Efficiency Registry',
    organization: 'Automotive Research Association of India (ARAI)',
    jurisdiction: 'India',
    year: '2023–2024',
    scope: 'Scope 1 & 2',
    factorSample: '1.42 kg CO₂e / 100km (2-Wheeler EV at Indian Grid)',
    uncertainty: '±8% (modified Indian driving cycle benchmarks)',
    description: 'Standardized dynamometer and road testing certifications for passenger vehicles, motorbikes, and commercial light vehicles operating under tropical ambient conditions.',
    url: 'https://www.araiindia.com',
  },
  {
    id: 'dmrc-transit',
    category: 'Mobility & Transit',
    title: 'Urban Rapid Rail Clean Mobility & Solarization Disclosures',
    organization: 'Delhi Metro Rail Corporation (DMRC) / MoHUA',
    jurisdiction: 'India (Urban Transit)',
    year: '2023',
    scope: 'Scope 2',
    factorSample: '0.0150 kg CO₂e / passenger-km',
    uncertainty: '±10% (occupancy rate and regenerative braking variance)',
    description: 'Regenerative braking energy capture and dedicated captive solar feed-in metrics for grade-separated municipal mass rapid transit systems.',
    url: 'https://www.delhimetrorail.com/',
  },
  {
    id: 'poore-nemecek',
    category: 'Food & Agriculture',
    title: 'Reducing food’s environmental impacts through producers and consumers',
    organization: 'Science (Poore & Nemecek 2018) / University of Oxford & Agroscope',
    jurisdiction: 'Global (38,700 farms across 119 countries)',
    year: '2018 (Continuous updates)',
    scope: 'Scope 3',
    factorSample: '0.85 kg CO₂e / kg Dal & Millets vs 6.10 kg / kg Chicken',
    uncertainty: '±12% (farm-gate to retail distribution)',
    description: 'The most comprehensive meta-analysis of global food supply chains, assessing land use, freshwater withdrawals, GHG emissions, and eutrophication potential.',
    url: 'https://science.sciencemag.org/content/360/6392/987',
  },
  {
    id: 'fao-stat',
    category: 'Food & Agriculture',
    title: 'FAOSTAT Agri-Environmental Indicators & Emissions Database',
    organization: 'Food and Agriculture Organization of the United Nations (FAO)',
    jurisdiction: 'Global / Regional Agricultural Zones',
    year: '2023',
    scope: 'Scope 3',
    factorSample: 'Enteric fermentation, manure management & crop residue',
    uncertainty: '±15% (soil biology and regional seasonal weather)',
    description: 'International benchmark for agricultural land use change, livestock methane emissions, synthetic nitrogen fertilizer manufacturing, and food waste rotting kinetics.',
    url: 'https://www.fao.org/faostat',
  },
  {
    id: 'epa-warm',
    category: 'Materials & Waste',
    title: 'Waste Reduction Model (WARM v16)',
    organization: 'United States Environmental Protection Agency (US EPA)',
    jurisdiction: 'Global / Municipal Solid Waste',
    year: '2024',
    scope: 'Scope 3',
    factorSample: '0.58 kg CO₂e / kg Landfilled vs 0.08 kg / kg Aerobic Compost',
    uncertainty: '±15% (landfill gas recovery capture efficiency)',
    description: 'Calculates greenhouse gas emissions and energy conservation metrics across 60 material types comparing source reduction, recycling, composting, anaerobic digestion, and landfilling.',
    url: 'https://www.epa.gov/warm',
  },
  {
    id: 'ipcc-ar6',
    category: 'Materials & Waste',
    title: 'IPCC Sixth Assessment Report (AR6) - Climate Change 2021/2022',
    organization: 'Intergovernmental Panel on Climate Change (IPCC / WMO / UNEP)',
    jurisdiction: 'Global Scientific Consensus',
    year: '2021–2023',
    scope: 'Scope 1, 2 & 3',
    factorSample: 'GWP100: CO₂ = 1, CH₄ = 29.8 (fossil) / 27.2 (biogenic), N₂O = 273',
    uncertainty: '±3% (atmospheric radiative forcing spectroscopy)',
    description: 'Establishes official Global Warming Potentials (GWP100) used across all GreenSwap stoichiometric calculations to convert non-CO₂ greenhouse gases to CO₂e equivalents.',
    url: 'https://www.ipcc.ch/assessment-report/ar6/',
  },
  {
    id: 'bee-india',
    category: 'Energy & Grid',
    title: 'Standards & Labeling Program Specific Energy Consumption',
    organization: 'Bureau of Energy Efficiency (BEE), Ministry of Power, Govt. of India',
    jurisdiction: 'India',
    year: '2024',
    scope: 'Scope 2',
    factorSample: '5-Star Inverter AC vs 1-Star AC (32% annual kWh reduction)',
    uncertainty: '±5% (ISEER test room validation standards)',
    description: 'Technical baseline consumption metrics for domestic refrigerators, split room air conditioners, ceiling fans, and induction cooktops.',
    url: 'https://beeindia.gov.in',
  },
];

export function DataSourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Energy & Grid', 'Mobility & Transit', 'Food & Agriculture', 'Materials & Waste'];

  const filteredSources = DATA_SOURCES.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.factorSample.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(DATA_SOURCES, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `greenswap-conversion-factors-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1c2e24]">
      {/* Top Header */}
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
              to="/methodology"
              className="text-xs font-mono text-[#5b7566] hover:text-[#162a20] underline transition-colors"
            >
              View Calculation Methodology →
            </Link>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-[#7a8f82] uppercase">
              RESOURCES // DATA SOURCES
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-12 space-y-12">
        {/* Hero Section */}
        <div className="border-b border-[#e2dacb] pb-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider bg-[#dbe8dc] text-[#162a20] border border-[#bcd3be]">
              <Database className="h-3.5 w-3.5 text-[#2c5e3f]" />
              PRIMARY EMISSION DATABASES & PEER REVIEWS
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#162a20]">
            Open Climate Data Sources & Conversion Factors
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4a5f51] max-w-3xl leading-relaxed">
            GreenSwap strictly avoids estimated black-box claims and greenwashing. Every swap, calculation,
            and confidence interval displayed in your routine is directly indexed to official public utility
            disclosures, government energy registries, and peer-reviewed life-cycle assessments.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#162a20] text-white text-xs font-mono font-semibold hover:bg-[#254233] transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Download Full Factor Catalog (.JSON)
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#c8beaa] bg-white/70 text-[#162a20] text-xs font-mono font-semibold hover:bg-white transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#2c5e3f]" /> Audit Trail & Citations
            </a>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-[#162a20] text-white font-semibold shadow-sm'
                    : 'bg-white/60 text-[#4a5f51] hover:bg-white border border-[#ded5c5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7a8f82]" />
            <input
              type="text"
              placeholder="Search source or factor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#c8beaa] bg-white/80 text-xs font-sans text-[#162a20] placeholder-[#8a9e92] focus:outline-none focus:ring-1 focus:ring-[#162a20]"
            />
          </div>
        </div>

        {/* Data Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="rounded-2xl border border-[#ded5c5] bg-white/90 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7a8f82]">
                    {source.category}
                  </span>
                  <Badge variant="subtle" size="sm">
                    {source.scope}
                  </Badge>
                </div>

                <h2 className="font-serif text-lg font-bold text-[#162a20] leading-snug">
                  {source.title}
                </h2>

                <p className="text-xs font-mono text-[#52705e]">
                  {source.organization}
                </p>

                <p className="text-xs font-sans text-[#4a5f51] leading-relaxed">
                  {source.description}
                </p>

                {/* Factor Highlight Pill */}
                <div className="rounded-xl border border-[#cfe0d1] bg-[#f2f7f3] p-3 space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#4a5f51]">
                    <span>Sample Coefficient</span>
                    <span className="text-[#845e2a] font-semibold">{source.uncertainty}</span>
                  </div>
                  <div className="font-bold text-[#123826]">
                    {source.factorSample}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#ede5d8] flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#7a8f82]">
                  {source.jurisdiction} • {source.year}
                </span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono font-semibold text-[#2c5e3f] hover:text-[#162a20] hover:underline"
                >
                  Source Registry <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredSources.length === 0 && (
          <div className="text-center py-12 rounded-xl border border-dashed border-[#c8beaa] bg-white/40">
            <Database className="h-8 w-8 text-[#7a8f82] mx-auto mb-2 opacity-50" />
            <p className="font-serif text-base text-[#162a20] font-semibold">No matching data sources found</p>
            <p className="font-sans text-xs text-[#7a8f82] mt-1">Try clearing your search term or selecting another category.</p>
          </div>
        )}

        {/* Methodology cross-reference banner */}
        <section className="rounded-2xl border border-[#cfe0d1] bg-[#eef5ef] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#2c5e3f]">
              <Layers className="h-4 w-4" />
              LOOKING FOR ALGORITHM & UNCERTAINTY FORMULAS?
            </div>
            <h2 className="font-serif text-xl font-bold text-[#162a20]">
              Discover Our Mathematical Scoring & Calibration Engine
            </h2>
            <p className="text-xs font-sans text-[#4a5f51] leading-relaxed">
              Learn how GreenSwap weights carbon reductions against upfront capital expense, feasibility,
              and rebound effects (Jevons Paradox) using Multi-Criteria Decision Analysis.
            </p>
          </div>
          <Link
            to="/methodology"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162a20] text-white text-xs font-mono font-semibold hover:bg-[#254233] transition-colors shadow-sm shrink-0"
          >
            <BookOpen className="h-3.5 w-3.5" /> Read Calculation Methodology
          </Link>
        </section>
      </main>
    </div>
  );
}
