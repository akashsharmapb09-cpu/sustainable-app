import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalProfile } from "../../shared/lib/localStore";
import type { FormEvent } from "react";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [commute, setCommute] = useState("bike");
  const [budget, setBudget] = useState("medium");
  const [effort, setEffort] = useState("medium");
  const [loading, setLoading] = useState(false);

   const submit = async () => {
    setLoading(true);
    try {
      const profile = getLocalProfile() || { id: "demo-user", email: "demo@greenswap.app" };
      const updated = {
        ...profile,
        primary_commute: commute,
        budget_sensitivity: budget,
        effort_tolerance: effort,
      };
      localStorage.setItem("sustainable_profile", JSON.stringify(updated));
      localStorage.setItem("profile", JSON.stringify(updated));
      const plausible = (window as Window & { plausible?: (event: string) => void }).plausible;
      if (import.meta.env.VITE_PLAUSIBLE_DOMAIN && navigator.doNotTrack !== "1") plausible?.("onboarding_complete");
      navigate("/dashboard");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calibration</h1>
      
      <label className="block mb-2">Primary Commute</label>
      <select value={commute} onChange={(e) => setCommute(e.target.value)} className="w-full p-2 border mb-4">
        <option value="bike">Bike</option>
        <option value="walk">Walk</option>
        <option value="car">Car</option>
        <option value="public">Public Transport</option>
      </select>

      <label className="block mb-2">Budget Sensitivity</label>
      <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full p-2 border mb-4">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label className="block mb-2">Effort Tolerance</label>
      <select value={effort} onChange={(e) => setEffort(e.target.value)} className="w-full p-2 border mb-4">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button onClick={submit} disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </div>
  );
}
export default OnboardingPage;
