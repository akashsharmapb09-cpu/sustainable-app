export type SwapCategory = "All" | "Food" | "Home" | "Fashion" | "Transport" | "Electronics";

export type Swap = {
  id: string;
  title: string;
  category: Exclude<SwapCategory, "All">;
  impact: "High impact" | "Good start" | "Everyday win";
  impactValue: string;
  points: number;
  difficulty: "Easy" | "Moderate";
  description: string;
  accent: string;
  icon: string;
};

export const swaps: Swap[] = [
  { id: "repair-first", title: "Repair before replacing", category: "Electronics", impact: "High impact", impactValue: "High", points: 40, difficulty: "Moderate", description: "Give a device a second life with a battery, screen or small-part repair.", accent: "bg-violet-50 text-violet-700", icon: "Wrench" },
  { id: "carry-cup", title: "Bring a reusable cup", category: "Home", impact: "Everyday win", impactValue: "Steady", points: 15, difficulty: "Easy", description: "Keep a cup by your keys and skip single-use takeaway cups when practical.", accent: "bg-amber-50 text-amber-700", icon: "Coffee" },
  { id: "plant-forward", title: "Try a plant-forward meal", category: "Food", impact: "High impact", impactValue: "High", points: 35, difficulty: "Easy", description: "Swap one meat-heavy meal for dal, beans, lentils or seasonal vegetables.", accent: "bg-emerald-50 text-emerald-700", icon: "Salad" },
  { id: "preloved", title: "Choose pre-loved first", category: "Fashion", impact: "High impact", impactValue: "High", points: 30, difficulty: "Easy", description: "Check resale, swaps or local repair before buying new clothing.", accent: "bg-pink-50 text-pink-700", icon: "Shirt" },
  { id: "walk-short", title: "Walk a short journey", category: "Transport", impact: "Good start", impactValue: "Steady", points: 20, difficulty: "Easy", description: "For a safe, practical short trip, leave the car at home.", accent: "bg-sky-50 text-sky-700", icon: "Footprints" },
  { id: "food-plan", title: "Plan around what you have", category: "Food", impact: "Everyday win", impactValue: "Steady", points: 20, difficulty: "Easy", description: "Check your fridge before shopping and give leftovers a clear plan.", accent: "bg-lime-50 text-lime-700", icon: "CookingPot" },
  { id: "air-dry", title: "Air-dry a load", category: "Home", impact: "Good start", impactValue: "Steady", points: 15, difficulty: "Easy", description: "Use a rack or line when weather and space make it feasible.", accent: "bg-blue-50 text-blue-700", icon: "Wind" },
  { id: "share-ride", title: "Share a ride", category: "Transport", impact: "Good start", impactValue: "Steady", points: 25, difficulty: "Moderate", description: "Combine errands or share a suitable trip instead of driving alone.", accent: "bg-orange-50 text-orange-700", icon: "CarFront" },
];

export const categories: SwapCategory[] = ["All", "Food", "Home", "Fashion", "Transport", "Electronics"];
