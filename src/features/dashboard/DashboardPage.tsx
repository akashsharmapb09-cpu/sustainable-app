export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a1a1a]">
      {/* HEADER SAME AS HOMEPAGE */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-black/10">
        <div className="flex items-center gap-3">
          <span className="text-[9px] tracking-widest border border-black/20 px-2 py-1 rounded-full">EDITION 2026 / VOL. 01</span>
          <span className="font-serif font-black text-xl">GreenSwap.</span>
        </div>
        <div className="hidden md:flex gap-6 text-[11px] tracking-widest">
          <span>Explore Catalog</span><span>Methodology & Citations</span><span>About</span>
        </div>
        <div className="bg-[#2d4a22] text-white text-xs px-4 py-2 rounded-full">Get started →</div>
      </header>

      <div className="max-w-[1280px] mx-auto px-8 py-10 grid grid-cols-12 gap-8">
        {/* LEFT - YOUR BASELINE */}
        <div className="col-span-12 lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-[9px] tracking-widest border border-black/10 px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span> EVIDENCE-LED • INDIA-CALIBRATED • BUILT FOR REAL LIFE
          </div>

          <h1 className="font-serif text-[56px] font-black leading-[0.9] tracking-tight">
            Your baseline.<br/>
            <span className="text-[#2d4a22] font-light italic">Keep the good life.</span>
          </h1>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="bg-white border border-black/10 p-6 rounded-xl">
              <p className="text-[10px] tracking-widest">MONTHLY FOOTPRINT</p>
              <p className="font-serif text-4xl font-bold mt-2">124 kg <span className="text-sm font-sans font-normal">CO2e / mo</span></p>
              <div className="mt-4 h-1.5 bg-black/10 rounded-full"><div className="h-full w-[62%] bg-black rounded-full"></div></div>
              <p className="text-[10px] mt-2 opacity-60">Goal: 100kg • 62% of monthly goal</p>
            </div>
            <div className="bg-[#111] text-[#fdfcf8] p-6 rounded-xl">
              <p className="text-[10px] tracking-widest opacity-60">TOTAL SAVED</p>
              <p className="font-serif text-4xl font-bold mt-2">200 kg</p>
              <p className="text-sm mt-2 opacity-80">Equal to planting 12 trees.</p>
              <p className="text-[10px] mt-3 opacity-60">This month: +42kg ↑ 12%</p>
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold mt-12 mb-4">Recommended for you</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              {cut:'91% CUT', title:'Switch Commute to Metro Transit'},
              {cut:'59% CUT', title:'Adopt an Electric Two-Wheeler'},
              {cut:'60% CUT', title:'Shared E-Rickshaw'},
            ].map((c,i)=>(
              <div key={i} className="bg-white border border-black/10 p-4 rounded-xl">
                <div className="flex justify-between"><span className="text-[8px] border px-2 py-0.5 rounded-full">TRANSPORT</span><span className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full">{c.cut}</span></div>
                <p className="font-serif font-bold text-sm mt-3 leading-tight">{c.title}</p>
                <p className="text-[11px] mt-2">-₹3,200/mo</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - GLOBE + INTERACTIVE LIKE HOMEPAGE */}
        <div className="col-span-12 lg:col-span-5">
          <div className="sticky top-8">
            <div className="relative bg-[#f4f1eb] border border-black/10 rounded-[24px] p-6 overflow-hidden">
              <div className="flex justify-between text-[9px] tracking-widest mb-4">
                <span>.FIELD NOTE<br/>01 / 04</span>
                <span className="w-24 h-24 bg-gradient-to-br from-[#a8c69f] to-[#2d4a22] rounded-full blur-[0.5px] relative -top-6 shadow-xl"></span>
              </div>

              <div className="bg-white border border-black/10 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] tracking-widest">INTERACTIVE SPECIMEN // CALIBRATION PREVIEW</p>
                  <span className="text-[8px] border px-2 py-1">LIVE PREVIEW</span>
                </div>
                <h4 className="font-serif font-bold mt-4">Trade the car for the metro</h4>
                <p className="text-[11px] opacity-60 mt-1">Adjust your commute to preview a practical monthly difference</p>

                <div className="mt-6">
                  <div className="flex justify-between text-[10px]"><span>One-Way Distance:</span><span className="font-bold">15 km</span></div>
                  <div className="h-1 bg-black/10 mt-2 rounded-full"><div className="h-full w-[60%] bg-[#c45a2c] rounded-full"></div></div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-[10px]"><span>Weekly Frequency:</span><span className="font-bold">5 days / week</span></div>
                  <div className="h-1 bg-black/10 mt-2 rounded-full"><div className="h-full w-[70%] bg-[#c45a2c] rounded-full"></div></div>
                </div>

                <div className="mt-6 bg-[#fdfcf8] border border-black/5 p-3 rounded-lg">
                  <p className="text-[9px] tracking-widest">PROJECTED MONTHLY MITIGATION</p>
                  <p className="text-[10px] mt-2">Carbon Reduction Range:</p>
                  <p className="font-bold">90.9 - 111.1 kg CO2e/mo</p>
                  <p className="text-[10px] mt-2">Net Expenditure Delta: <span className="float-right">-₹3,248/mo</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
