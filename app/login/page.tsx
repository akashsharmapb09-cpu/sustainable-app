import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { startDemo } from "@/app/actions";

type SearchParams = Promise<{ next?: string | string[] }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = Array.isArray(params.next) ? params.next[0] : params.next;
  const safeNext = next && (next === "/dashboard" || next.startsWith("/dashboard/")) ? next : "/dashboard/explore";

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-soft sm:p-10">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white"><Sprout size={18} aria-hidden="true" /></span>
          GreenSwap
        </Link>
        <p className="eyebrow mt-9">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em]">Your greener life, in progress.</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">Enter the demo dashboard to explore swaps, activity, and Green Points. This is a mock session, not production authentication.</p>
        <form action={startDemo} className="mt-7">
          <input type="hidden" name="next" value={safeNext} />
          <button type="submit" className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-forest">
            Continue with demo <ArrowRight size={16} aria-hidden="true" />
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-gray-400">By continuing, you agree to the <Link href="/terms" className="underline underline-offset-2 hover:text-ink">demo terms</Link>.</p>
      </div>
    </main>
  );
}
