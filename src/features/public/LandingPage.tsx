import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.0015;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export function LandingPage() {
  const [dist, setDist] = useState(15);
  const [activePanel, setActivePanel] = useState<'routine' | 'food' | 'low-cost'>('routine');
  const freq = 5;
  const km = dist * freq * 4.33;
  const carCO2 = km * 0.1705;
  const metroCO2 = km * 0.015;
  const save = carCO2 - metroCO2;

  return (
    <div className="min-h-screen bg-[#020a13] text-white overflow-hidden relative">
      {/* Glow Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, scale: 0.86, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          className="absolute -left-24 top-1/3 h-72 w-72 rounded-full border border-emerald-300/15"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-20 grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* LEFT */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className="inline-block px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs md:text-sm">
            🌍 GreenSwap · everyday sustainable choices
          </div>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Choose a sustainable lifestyle focus">
            {([
              ['routine', 'Daily routine'],
              ['food', 'Food waste'],
              ['low-cost', 'Low-cost habits'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivePanel(key)}
                aria-pressed={activePanel === key}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${activePanel === key ? 'border-emerald-300 bg-emerald-300/20 text-emerald-100' : 'border-white/15 bg-white/5 text-white/65 hover:bg-white/10'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)', scale: 0.97 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)', scale: 1.02 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="mt-4 text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
                {activePanel === 'routine' ? <>SUSTAINABLE<br />EVERYDAY</> : activePanel === 'food' ? <>USE MORE.<br /><span className="text-emerald-300">WASTE LESS.</span></> : <>SMALL HABITS.<br /><span className="text-emerald-300">REAL CHANGE.</span></>}
              </h1>
              <p className="mt-5 text-white/70 text-sm md:text-base max-w-md leading-relaxed">
                {activePanel === 'routine'
                  ? 'Explore practical alternatives for travel, energy, food and waste that fit your routine.'
                  : activePanel === 'food'
                    ? 'Start with ingredients you already own, plan leftovers, and shop with a simple list.'
                    : 'Try walking when practical, switching off idle devices, and repairing before replacing.'}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur">
            <label className="text-sm text-white/70">Distance (km): {dist} km</label>
            <input type="range" min="1" max="50" value={dist} onChange={(e) => setDist(Number(e.target.value))} className="w-full mt-3 accent-green-500" />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <motion.div whileHover={{ rotateY: 15, rotateX: 10, scale: 1.05 }} className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl">
              <p className="text-[10px] opacity-60">CAR CO2</p>
              <p className="text-xl font-bold mt-1">{carCO2.toFixed(1)} kg/mo</p>
            </motion.div>
            <motion.div whileHover={{ rotateY: 15, rotateX: 10, scale: 1.05 }} className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl">
              <p className="text-[10px] opacity-60">METRO CO2</p>
              <p className="text-xl font-bold mt-1">{metroCO2.toFixed(1)} kg/mo</p>
            </motion.div>
            <motion.div whileHover={{ rotateY: 15, scale: 1.05 }} className="p-4 rounded-2xl bg-green-500/20 border border-green-500/30 backdrop-blur-xl">
              <p className="text-[10px] text-green-300">YOU SAVE</p>
              <p className="text-xl font-bold mt-1 text-green-400">{save.toFixed(1)} kg/mo</p>
            </motion.div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link to="/dashboard" className="px-8 py-3 bg-white text-black rounded-full font-bold">Start Swapping</Link>
            <Link to="/dashboard" className="px-8 py-3 border border-white/20 rounded-full">Join Now</Link>
          </div>
        </motion.div>

        {/* RIGHT - EARTH */}
        <div className="h-[500px] md:h-[600px] w-full relative">
          <Canvas camera={{ position: [0, 0, 5.5] }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 3, 5]} intensity={1.5} />
            <Earth />
            <Stars />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
