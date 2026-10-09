export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#1a1a1a] font-serif">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex gap-2 text-[10px] tracking-widest uppercase mb-8">
          <span className="border border-black px-2 py-1">FIELD OPERATOR</span>
          <span className="text-zinc-500">demo@greenswap.local</span>
        </div>

        <h1 className="text-5xl font-black tracking-tight leading-none mb-2">Your baseline.</h1>
        <p className="text-zinc-600 mb-10">Evidence-led • India-calibrated • Built for real life</p>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-white border border-black p-6">
            <p className="text-[10px] tracking-widest uppercase">MONTHLY FOOTPRINT</p>
            <p className="text-5xl font-bold mt-2">124 kg <span className="text-lg font-normal text-zinc-500">CO2e / mo</span></p>
            <div className="mt-6 h-2 bg-zinc-100"><div className="h-full w-[62%] bg-[#1a1a1a]"></div></div>
            <p className="text-xs mt-2">Goal 100kg — 62% of 200kg monthly goal</p>
          </div>
          <div className="col-span-4 bg-[#1a1a1a] text-[#fcfbf7] p-6">
            <p className="text-[10px] tracking-widest uppercase opacity-60">TOTAL SAVED</p>
            <p className="text-5xl font-bold mt-2">200 kg</p>
            <p className="text-sm mt-2 opacity-80">Equal to planting 12 trees</p>
            <p className="text-xs mt-4 opacity-60">This month: 42kg ↑ 12%</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-12 mb-4">Recommended for you</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { cut:'91% CUT', title:'Switch Commute to Metro Transit', cost:'-₹3,200/mo' },
            { cut:'59% CUT', title:'Adopt an Electric Two-Wheeler (EV Scooter)', cost:'-₹1,450/mo' },
            { cut:'60% CUT', title:'Shared E-Rickshaw for Last-Mile Transit', cost:'-₹800/mo' },
          ].map((c,i)=>(
            <div key={i} className="bg-white border border-black p-5">
              <div className="flex justify-between text-[9px]"><span>TRANSPORT</span><span className="border border-black px-2">{c.cut}</span></div>
              <h3 className="font-bold mt-3 leading-tight">{c.title}</h3>
              <p className="text-xs mt-3 font-mono">{c.cost}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
