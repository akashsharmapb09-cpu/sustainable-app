export interface ExploreItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'transport' | 'food' | 'energy' | 'shopping' | 'waste' | 'home';
  categoryLabel: string;
  co2Saving: string;
  costSaving: string;
  image: string;
  topics: string[];
  difficulty: 'Easy' | 'Moderate' | 'High Impact';
  timeToImplement: string;
  verifiedBy: string;
  description: string;
  whyItMatters: string;
  actionSteps: string[];
  keyStats: {
    label: string;
    value: string;
  }[];
}

export const EXPLORE_ITEMS: ExploreItem[] = [
  {
    id: 'transit',
    title: 'Swap to public transport',
    subtitle: 'Cut commuting emissions and fuel expenses by taking metro or bus networks.',
    category: 'transport',
    categoryLabel: 'Transport',
    co2Saving: 'Save up to 0.2t CO2e / month',
    costSaving: 'Save ~₹3,200/mo on fuel & parking',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    topics: ['lifestyle', 'all'],
    difficulty: 'Easy',
    timeToImplement: 'Immediate',
    verifiedBy: 'Central Electricity Authority & MoRTH (2024)',
    description: 'Switching daily solo commute trips to electrified metro or bus networks is one of the highest leverage personal actions to slash urban air pollution and household transport expenses.',
    whyItMatters: 'A private ICE passenger car emits approximately 140-190g CO2 per passenger-km, whereas an urban electric metro averages under 28g CO2/passenger-km. Over a year of commuting, this single swap eliminates over 2.4 tonnes of direct carbon emissions.',
    actionSteps: [
      'Locate the nearest metro station or direct electric bus corridor on your daily commute.',
      'Get a contactless metro transit card or monthly mobility pass to skip ticket queues.',
      'Combine with first/last-mile walking or shared micro-mobility for complete ease.',
      'Start with 3 days per week to establish your new travel rhythm comfortably.'
    ],
    keyStats: [
      { label: 'Annual CO2 cut', value: '2.4 tonnes' },
      { label: 'Annual savings', value: '₹38,400' },
      { label: 'Air pollution cut', value: '85% fewer particulates' },
      { label: 'Health benefit', value: '+3,500 daily steps' }
    ]
  },
  {
    id: 'plant',
    title: 'Eat more plant-based meals',
    subtitle: 'Nutritious, diverse plant-forward dishes that lighten your climate footprint.',
    category: 'food',
    categoryLabel: 'Food',
    co2Saving: 'Save up to 0.3t CO2e / month',
    costSaving: 'Save ~₹1,800/mo on groceries',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    topics: ['works-for-you', 'food', 'all'],
    difficulty: 'Easy',
    timeToImplement: '1 day',
    verifiedBy: 'Our World in Data & Oxford Food Life Cycle Analysis (Poore & Nemecek)',
    description: 'Adopting plant-rich meals centered on indigenous lentils, millets, fresh vegetables, and whole grains significantly curbs methane emissions and land-use intensity.',
    whyItMatters: 'Food systems generate one-third of all global greenhouse gas emissions, with animal agriculture accounting for the majority. Plant-based proteins require up to 90% less freshwater and land compared to commercial ruminant livestock.',
    actionSteps: [
      'Designate Meatless Mondays or 4 plant-first days every week.',
      'Explore protein-packed legumes such as chickpeas, edamame, lentils, and organic tofu.',
      'Batch-cook flavourful grain bowls with local spices, seeds, and seasonal greens.',
      'Replace dairy cooking fats with cold-pressed mustard, peanut, or sesame oils.'
    ],
    keyStats: [
      { label: 'Annual CO2 cut', value: '3.6 tonnes' },
      { label: 'Freshwater saved', value: '45,000 litres/year' },
      { label: 'Grocery savings', value: '₹21,600/year' },
      { label: 'Dietary fiber', value: '+14g per day' }
    ]
  },
  {
    id: 'appliances',
    title: 'Use energy efficient appliances',
    subtitle: 'BEE 5-star inverter appliances that slash your power bill around the clock.',
    category: 'energy',
    categoryLabel: 'Energy',
    co2Saving: 'Save up to 0.1t CO2e / month',
    costSaving: 'Save ~₹1,500/mo electricity',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    topics: ['care-about', 'energy', 'home', 'all'],
    difficulty: 'Moderate',
    timeToImplement: '1 week',
    verifiedBy: 'Bureau of Energy Efficiency (BEE India Standards 2024)',
    description: 'Upgrading primary household electronics—refrigerators, air conditioners, and washing machines—to BEE 5-star inverter rating cuts continuous base-load grid draw.',
    whyItMatters: 'In developing grids with thermal dominance, each kilowatt-hour consumed produces ~0.71 kg CO2e. Modern inverter compressors consume up to 45% less power compared to legacy 1-star or non-rated models.',
    actionSteps: [
      'Audit your highest power-drawing equipment: ACs, geysers, and refrigerators.',
      'Prioritize inverter tech when replacing appliances older than 7 years.',
      'Set air conditioners to the recommended 24°C eco-setting with fan circulation.',
      'Clean air filters monthly to maintain thermal heat exchange efficiency.'
    ],
    keyStats: [
      { label: 'Annual power saved', value: '1,400 kWh' },
      { label: 'Annual CO2 cut', value: '1.2 tonnes' },
      { label: 'Payback window', value: '14-18 months' },
      { label: 'Lifespan boost', value: '+4 to 6 years' }
    ]
  },
  {
    id: 'food-waste',
    title: 'Avoid food waste',
    subtitle: 'Meal planning, proper storage, and scrap reuse for zero landfill waste.',
    category: 'food',
    categoryLabel: 'Food',
    co2Saving: 'Save up to 0.15t CO2e / month',
    costSaving: 'Save ~₹2,000/mo food savings',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
    topics: ['works-for-you', 'food', 'lifestyle', 'all'],
    difficulty: 'Easy',
    timeToImplement: 'Immediate',
    verifiedBy: 'UN Environment Programme (UNEP Food Waste Index)',
    description: 'Preventing household food spoilage stops organic matter from rotting anaerobically in city landfills, where it releases potent methane gas into the atmosphere.',
    whyItMatters: 'Methane has 28x the global warming potential of carbon dioxide over a 100-year timescale. Approximately 30% of all purchased food is discarded, wasting both financial resources and embedded agricultural energy.',
    actionSteps: [
      'Take 5 minutes on Sunday to outline weekly meals before visiting the market.',
      'Adopt the "First In, First Out" (FIFO) principle in your refrigerator crisper.',
      'Freeze excess bread, cooked gravies, and fruit peels for broths and smoothies.',
      'Store greens with dry cloth towels inside sealed containers to extend freshness by 10 days.'
    ],
    keyStats: [
      { label: 'Annual CO2 cut', value: '1.8 tonnes' },
      { label: 'Food preserved', value: '85 kg/year' },
      { label: 'Monthly savings', value: '₹2,000/mo' },
      { label: 'Zero methane', value: '100% divertible' }
    ]
  },
  {
    id: 'secondhand',
    title: 'Buy second-hand & vintage',
    subtitle: 'Embrace circular fashion, refurbished electronics, and pre-loved home goods.',
    category: 'shopping',
    categoryLabel: 'Shopping',
    co2Saving: 'Save up to 0.05t CO2e / month',
    costSaving: 'Save 40-70% on retail prices',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    topics: ['choices', 'shopping', 'all'],
    difficulty: 'Easy',
    timeToImplement: 'Ongoing',
    verifiedBy: 'WRAP Circular Economy Metrics & Ellen MacArthur Foundation',
    description: 'Extending the active operational life of existing products by buying pre-owned prevents new virgin resource extraction, manufacturing emissions, and overseas logistics overhead.',
    whyItMatters: 'A single new cotton shirt requires over 2,700 litres of water and generates ~15 kg CO2 in production and dyeing. Buying pre-loved extends product lifecycle and curbs textile waste in landfills.',
    actionSteps: [
      'Explore certified refurbished electronics with warranties before buying brand new.',
      'Browse curated thrift stores and peer-to-peer wardrobe exchange platforms.',
      'Choose timeless, high-build-quality furniture pieces that can be easily refinished.',
      'Sell or donate your own outgrown items rather than storing or discarding them.'
    ],
    keyStats: [
      { label: 'Embodied carbon saved', value: '600 kg/year' },
      { label: 'Water saved', value: '18,000 litres' },
      { label: 'Cost discount', value: 'Up to 65%' },
      { label: 'Waste diverted', value: '22 items/year' }
    ]
  },
  {
    id: 'reusable',
    title: 'Choose reusable items',
    subtitle: 'Replace single-use disposables with durable glass, stainless steel, and canvas.',
    category: 'shopping',
    categoryLabel: 'Shopping',
    co2Saving: 'Save up to 0.05t CO2e / month',
    costSaving: 'Save ~₹800/mo disposable costs',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    topics: ['choices', 'shopping', 'lifestyle', 'all'],
    difficulty: 'Easy',
    timeToImplement: 'Immediate',
    verifiedBy: 'Break Free From Plastic & Plastic Pollution Coalition (2024)',
    description: 'Carrying a daily reusable kit—stainless steel water flask, compact cotton tote, and cutlery—eliminates hundreds of lightweight throwaway plastics each year.',
    whyItMatters: 'Over 91% of single-use plastics are never recycled. Disposables leach microplastics into water systems and require petroleum refining, creating permanent pollution.',
    actionSteps: [
      'Keep a foldable canvas tote in every bag, backpack, or car glovebox.',
      'Carry a vacuum-insulated stainless steel water bottle wherever you travel.',
      'Refuse plastic cutlery, sauce sachets, and extra poly bags when ordering takeout.',
      'Opt for loose bulk grains, spices, and produce rather than pre-wrapped plastic trays.'
    ],
    keyStats: [
      { label: 'Single-use plastic eliminated', value: '350+ items/year' },
      { label: 'Annual CO2 cut', value: '0.6 tonnes' },
      { label: 'Bottled water savings', value: '₹9,600/year' },
      { label: 'Microplastics averted', value: '100% on drinking water' }
    ]
  },
  {
    id: 'bldc-fan',
    title: 'BLDC Ceiling Fans',
    subtitle: 'Brushless DC motor ceiling fans that deliver whisper-quiet airflow on 28W.',
    category: 'energy',
    categoryLabel: 'Energy',
    co2Saving: 'Save up to 0.08t CO2e / month',
    costSaving: 'Save ~₹900/mo on fan electricity',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    topics: ['care-about', 'energy', 'home', 'all'],
    difficulty: 'Moderate',
    timeToImplement: '2-3 days',
    verifiedBy: 'Energy Efficiency Services Limited (EESL India)',
    description: 'Replacing conventional 75W induction ceiling fans with ultra-efficient 28W BLDC fans slashes fan electricity consumption by more than 60% without dropping air delivery.',
    whyItMatters: 'Ceiling fans operate continuously for 12 to 18 hours per day in tropical climates. A household with 4 ceiling fans running on BLDC motors saves more than 600 kWh of grid electricity annually.',
    actionSteps: [
      'Count your household ceiling fans and note which ones run longest daily.',
      'Select BEE 5-star rated BLDC fans featuring copper-wound brushless motors.',
      'Enjoy remote control timers and fine-grained sleep speed settings.',
      'Keep blades dusted to minimize motor drag and ensure optimal air velocity.'
    ],
    keyStats: [
      { label: 'Power reduction', value: '75W → 28W (62% drop)' },
      { label: 'Annual power saved', value: '620 kWh' },
      { label: 'CO2 cut', value: '0.96 tonnes/year' },
      { label: 'Payback period', value: '12 months' }
    ]
  },
  {
    id: 'composting',
    title: 'Aerobic Khamba Composting',
    subtitle: 'Turn wet kitchen peels and coffee grounds into nutrient-rich garden compost.',
    category: 'waste',
    categoryLabel: 'Waste',
    co2Saving: 'Save up to 0.06t CO2e / month',
    costSaving: 'Free organic soil amendment',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    topics: ['choices', 'waste', 'home', 'all'],
    difficulty: 'Easy',
    timeToImplement: '1 weekend',
    verifiedBy: 'Solid Waste Management Rules 2016 & CPCB Guidelines',
    description: 'An aerobic terracotta Khamba or 3-tier composter turns everyday wet kitchen peels, coffee grounds, and tea leaves into odor-free black gold for indoor plants and gardens.',
    whyItMatters: 'Organic kitchen waste makes up over 50% of urban household waste by weight. When buried in landfills without oxygen, it creates leachate water contamination and methane gas emissions.',
    actionSteps: [
      'Set up a 3-tier terracotta Khamba or ventilated bin in your balcony or utility area.',
      'Balance "greens" (wet kitchen scraps) with "browns" (dry leaves, cocopeat, or shredded cardboard) in a 1:1 ratio.',
      'Sprinkle a handful of microbial accelerator or sour curd water once a week.',
      'Harvest rich, earthy organic compost every 6-8 weeks for houseplants and herbs.'
    ],
    keyStats: [
      { label: 'Wet waste diverted', value: '180 kg/year' },
      { label: 'CO2e methane cut', value: '0.72 tonnes/year' },
      { label: 'Organic compost generated', value: '35 kg/year' },
      { label: 'Trash bag volume drop', value: '50% reduction' }
    ]
  }
];

// Helper to look up an item by ID, with support for numerical fallbacks
export function getExploreItemById(id: string): ExploreItem | undefined {
  if (!id) return undefined;
  const normalizedId = id.toString().toLowerCase().trim();

  // Direct match
  const found = EXPLORE_ITEMS.find(
    (item) => item.id.toLowerCase() === normalizedId
  );
  if (found) return found;

  // Numerical mapping fallback (e.g. "1" -> transit, "2" -> plant, etc.)
  const num = parseInt(normalizedId, 10);
  if (!isNaN(num) && num >= 1 && num <= EXPLORE_ITEMS.length) {
    return EXPLORE_ITEMS[num - 1];
  }

  // Prefix match fallback
  return EXPLORE_ITEMS.find(
    (item) => item.id.toLowerCase().includes(normalizedId) || item.title.toLowerCase().includes(normalizedId)
  );
}
