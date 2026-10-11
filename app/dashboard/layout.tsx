import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { getDemoProgress } from "@/lib/demo-session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  if (!cookieStore.has("greenswap_demo")) {
    redirect("/login?next=/dashboard/explore");
  }

  const progress = await getDemoProgress();

  return (
    <div className="min-h-screen bg-white lg:flex">
      <Sidebar points={progress.points} />
      <main className="min-w-0 flex-1 bg-white px-5 py-7 sm:px-8 lg:rounded-l-[24px] lg:px-10 lg:py-9">
        {children}
      </main>
    </div>
  );
}
