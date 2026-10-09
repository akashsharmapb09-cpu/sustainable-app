import { supabase } from "@/lib/supabaseClient"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function OnboardingPage() {
  const navigate = useNavigate()
  const [commute, setCommute] = useState("Petrol car")
  const [budget, setBudget] = useState("medium")
  const [effort, setEffort] = useState("moderate")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (!user) {
        alert("Not logged in - please signup again in Incognito")
        navigate("/signup")
        return
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        primary_commute: commute,
        budget_sensitivity: budget,
        effort_tolerance: effort,
      })

      if (error) throw error
      navigate("/dashboard")

    } catch (err: any) {
      alert(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1>Onboarding</h1>
      <button onClick={submit} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
        {loading ? "Saving..." : "Save calibration"}
      </button>
    </div>
  )
}
