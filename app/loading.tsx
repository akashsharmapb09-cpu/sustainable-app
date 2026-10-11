export default function Loading() {
  return <div className="min-h-screen animate-pulse bg-paper" role="status" aria-label="Loading GreenSwap">
    <header className="h-[68px] border-b border-line bg-white/70"><div className="container-shell flex h-full items-center justify-between"><div className="h-8 w-36 rounded-lg bg-gray-100" /><div className="hidden gap-3 md:flex"><div className="h-9 w-20 rounded-full bg-gray-100" /><div className="h-9 w-24 rounded-full bg-gray-100" /><div className="h-9 w-24 rounded-full bg-gray-100" /></div><div className="h-10 w-10 rounded-full bg-gray-100" /></div></header>
    <main className="container-shell py-16"><div className="h-3 w-32 rounded bg-gray-100" /><div className="mt-7 h-16 max-w-3xl rounded-2xl bg-gray-100" /><div className="mt-4 h-5 max-w-xl rounded bg-gray-100" /><div className="mt-12 grid gap-5 md:grid-cols-3"><div className="h-64 rounded-3xl bg-gray-100" /><div className="h-64 rounded-3xl bg-gray-100" /><div className="h-64 rounded-3xl bg-gray-100" /></div></main>
    <footer className="mt-16 border-t border-line bg-white py-10"><div className="container-shell grid grid-cols-2 gap-5 md:grid-cols-5">{[1,2,3,4,5].map((item) => <div className="h-24 rounded-xl bg-gray-100" key={item} />)}</div></footer><span className="sr-only">Loading page…</span>
  </div>;
}
