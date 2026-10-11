export default function DashboardLoading() {
  return <div className="animate-pulse space-y-6" aria-label="Loading dashboard" role="status"><div className="h-8 w-52 rounded-lg bg-gray-100" /><div className="h-4 w-80 max-w-full rounded bg-gray-100" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><div className="h-56 rounded-3xl bg-gray-100" /><div className="h-56 rounded-3xl bg-gray-100" /><div className="h-56 rounded-3xl bg-gray-100" /></div><div className="h-72 rounded-3xl bg-gray-100" /><span className="sr-only">Preparing your dashboard…</span></div>;
}
