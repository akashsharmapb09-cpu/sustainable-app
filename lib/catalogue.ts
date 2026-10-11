export type SwapCategory = 'Food' | 'Transport' | 'Home' | 'Shopping' | 'Waste';
export type Swap = {
  id: string;
  title: string;
  category: SwapCategory;
  summary: string;
  action: string;
  impact: string;
  points: number;
  effort: 'Easy' | 'Moderate';
  image: string;
  imageAlt: string;
  evidence: string;
};

export const SWAPS: Swap[] = [
  { id: 'repair-first', title: 'Repair before replacing', category: 'Shopping', summary: 'Give a worn shirt, bag or everyday object another useful chapter.', action: 'Pick one repair you can finish this week.', impact: 'Less new material', points: 15, effort: 'Easy', image: '/swaps/repair.svg', imageAlt: 'Green shirt with a small stitched repair', evidence: 'Product life and material use vary by item; treat the benefit as directional.' },
  { id: 'refill-water', title: 'Carry a refill bottle', category: 'Waste', summary: 'Keep a reusable bottle close and refill where safe drinking water is available.', action: 'Pack a bottle before your next outing.', impact: 'Less single-use packaging', points: 10, effort: 'Easy', image: '/swaps/refill.svg', imageAlt: 'Reusable bottle illustration', evidence: 'Reuse is most useful when the item replaces repeated single-use purchases.' },
  { id: 'short-trip-cycle', title: 'Cycle a short trip', category: 'Transport', summary: 'Try a safe cycle route for a nearby errand instead of taking the car.', action: 'Choose one practical short trip and plan a safe route.', impact: 'Lower tailpipe emissions', points: 12, effort: 'Moderate', image: '/swaps/cycle.svg', imageAlt: 'Bicycle with botanical details', evidence: 'Transport impact depends on distance, vehicle, occupancy and electricity mix.' },
  { id: 'compost-scraps', title: 'Give food scraps a next life', category: 'Waste', summary: 'Separate suitable fruit and vegetable scraps for a local composting option.', action: 'Check what your local compost system accepts.', impact: 'Less organic waste in landfill', points: 12, effort: 'Easy', image: '/swaps/compost.svg', imageAlt: 'Compost pot and leaves', evidence: 'Composting methods and local collection rules differ; follow local guidance.' },
  { id: 'plan-lunch', title: 'Plan one plant-forward meal', category: 'Food', summary: 'Build a meal around beans, lentils, seasonal vegetables or what is already at home.', action: 'Plan one meal around ingredients you already have.', impact: 'Potentially lower food footprint', points: 10, effort: 'Easy', image: '/swaps/meal.svg', imageAlt: 'Bowl with greens and lentils', evidence: 'Food impact varies by ingredient, portion, sourcing and food waste.' },
  { id: 'led-and-switch-off', title: 'Switch off idle energy use', category: 'Home', summary: 'Turn off lights and devices when they are not needed, without interrupting essential equipment.', action: 'Choose one room for a simple end-of-day check.', impact: 'Lower avoidable electricity use', points: 8, effort: 'Easy', image: '/swaps/energy.svg', imageAlt: 'Light bulb beside green leaves', evidence: 'Savings depend on device power, time switched off and the local grid factor.' },
  { id: 'second-hand-first', title: 'Try second-hand first', category: 'Shopping', summary: 'Check repair, borrowing or pre-loved options before buying something new.', action: 'Look for one item second-hand before purchasing new.', impact: 'Avoided new production', points: 18, effort: 'Moderate', image: '/swaps/thrift.svg', imageAlt: 'Reusable tote bag with leaves', evidence: 'The net benefit depends on replacing a new purchase, transport and item lifespan.' },
  { id: 'use-leftovers', title: 'Give leftovers a plan', category: 'Food', summary: 'Store food safely and plan how leftovers will become the next meal.', action: 'Move one leftover into tomorrow’s meal plan.', impact: 'Less avoidable food waste', points: 8, effort: 'Easy', image: '/swaps/meal.svg', imageAlt: 'Fresh meal bowl', evidence: 'Food saved depends on what would otherwise have been discarded.' },
];

export const CATEGORIES = ['All', 'Food', 'Transport', 'Home', 'Shopping', 'Waste'] as const;
export function findSwap(id: string) { return SWAPS.find((swap) => swap.id === id); }
