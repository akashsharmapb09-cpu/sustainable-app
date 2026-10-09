import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, TrendingUp, Clock, MapPin, Award } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="border-b border-zinc-900 sticky top-0 bg-[#080808]/80 backdrop-blur-xl z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center font-black">G</div>
            <span className="text-xl font-black tracking-tight">GreenSwap</span>
            <span className="text-[10px] bg-green-500 text-black px-2 py-1 rounded-full font-bold ml-2">LIVE</span>
          </div>
          <Link to="/" className="text-sm text-zinc-400 hover:text-white">← Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Stats - teri purani wali design */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-12 md:col-span-5 bg-[#16a34a] rounded-[24px] p-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <p className="text-sm opacity-80 flex items-center gap-2"><Leaf size={14}/> Total CO2 Saved</p>
            <h1 className="text-6xl font-black mt-3 tracking-tighter">200<span className="text-2xl ml-2">kg</span></h1>
            <p className="text-sm mt-4 opacity-80">Equal to planting 12 trees 🌱</p>
            <div className="mt-6 flex gap-2">
              <span className="bg-black/20 px-3 py-1 rounded-full text-xs">This month: 42kg</span>
              <span className="bg-black/20 px-3 py-1 rounded-full text-xs">↑ 12%</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6">
              <p className="text-zinc-500 text-sm flex items-center gap-2"><TrendingUp size={14}/> Monthly Footprint</p>
              <p className="text-3xl font-bold mt-2">124 kg</p>
              <div className="mt-4 h-1.5 bg-zinc-800 rounded-full"><div className="h-full w-[65%] bg-white rounded-full"></div></div>
              <p className="text-xs text-zinc-500 mt-2">Goal: 100kg — 76% there</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6">
              <p className="text-zinc-500 text-sm flex items-center gap-2"><Award size={14}/> Streak</p>
              <p className="text-3xl font-bold mt-2">7 days</p>
              <p className="text-xs text-zinc-500 mt-2">Keep going! 🔥</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 col-span-2 flex justify-between items-center">
              <div>
                <p className="text-zinc-500 text-sm">Activity Logs</p>
                <p className="text-2xl font-bold mt-1">24 logged</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-sm flex items-center gap-1 justify-end"><Clock size={12}/> Last</p>
                <p className="text-sm mt-1">Car commute • 10km</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recommended for you</h2>
          <button className="text-sm text-zinc-500 flex items-center gap-1">View all <ArrowRight size={14}/></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { title: 'Switch Commute to Metro Transit', cat: 'TRANSPORT', save: '42 kg/mo', effort: 'Low' },
            { title: 'Bicycle Commute for Sub-4km Trips', cat: 'TRANSPORT', save: '18 kg/mo', effort: 'Medium' },
            { title: 'Ride-Share / Two-Person Carpool', cat: 'TRANSPORT', save: '15 kg/mo', effort: 'Low' },
          ].map((item, i) => (
            <div key={i} className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-[20px] p-5 transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] tracking-widest bg-zinc-800 px-2 py-1 rounded-full text-zinc-400">{item.cat}</span>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full">{item.effort} effort</span>
              </div>
              <h3 className="font-bold leading-tight">{item.title}</h3>
              <div className="flex items-center gap-2 mt-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><MapPin size={12}/> {item.save}</span>
              </div>
              <button className="w-full mt-4 bg-white text-black py-2.5 rounded-full font-bold text-sm group-hover:bg-zinc-100">Swap Now</button>
            </div>
          ))}
        </div>

        {/* Timeline - purane wale ka main part */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 bg-zinc-900 border border-zinc-800 rounded-[24px] p-6">
            <h3 className="font-bold mb-4">Monthly Impact</h3>
            <div className="flex items-end gap-2 h-32">
              {[40,65,45,80,60,90,70].map((h,i) => (
                <div key={i} className="flex-1 bg-zinc-800 rounded-t-lg relative" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-0 w-full bg-green-500 rounded-t-lg" style={{ height: i===5? '100%':'60%' }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-zinc-600 mt-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 bg-zinc-900 border border-zinc-800 rounded-[24px] p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/log" className="flex justify-between items-center p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700">
                <span className="text-sm">Log Activity</span><ArrowRight size={14}/>
              </Link>
              <Link to="/alternatives" className="flex justify-between items-center p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700">
                <span className="text-sm">Browse Swaps</span><ArrowRight size={14}/>
              </Link>
              <Link to="/profile" className="flex justify-between items-center p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700">
                <span className="text-sm">Edit Profile</span><ArrowRight size={14}/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
