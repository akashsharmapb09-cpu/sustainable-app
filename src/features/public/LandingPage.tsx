import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../../shared/ui';
import { ArrowRight } from 'lucide-react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import './LandingPage.css';

function Earth(){
  const mesh = useRef<any>(null);
  const tex = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
  useFrame(()=>{ if(mesh.current) mesh.current.rotation.y += 0.002 });
  return <mesh ref={mesh}><sphereGeometry args={[2, 64, 64]} /><meshStandardMaterial map={tex} /></mesh>
}

export function LandingPage(){
  const [dist, setDist] = useState(15);
  const freq = 5;
  const km = dist * 2 * freq * 4.33;
  const save = km * 0.1705 - km * 0.015;

  return (
    <div className="min-h-screen bg-[#020a13] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{x:-50, opacity:0}} animate={{x:0, opacity:1}}>
          <Badge className="bg-green-500/20 text-green-300">🌍 GreenSwap 3D</Badge>
          <h1 className="text-6xl font-black mt-6 leading-[0.9]">LIVE<br/><span className="text-green-400">SUSTAINABLY</span></h1>
          <p className="text-white/60 mt-4">Petrol vs Metro - {save.toFixed(1)} kg CO2 bachao har month</p>

          <div className="flex items-center gap-4 mt-6">
            <input type="range" min="1" max="50" value={dist} onChange={e=>setDist(Number(e.target.value))} className="w-40 accent-green-500" />
            <span>{dist} km</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <motion.div whileHover={{rotateY:15, rotateX:10}} className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur">
              <p className="text-2xl font-bold text-green-400">{save.toFixed(1)} kg</p><p className="text-xs opacity-60">CO2 Saved</p>
            </motion.div>
            <motion.div whileHover={{rotateY:-15, rotateX:10}} className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur">
              <p className="text-2xl font-bold">₹{(km*8).toFixed(0)}</p><p className="text-xs opacity-60">Money Saved</p>
            </motion.div>
          </div>

          <Link to="/app" className="inline-block mt-8"><Button className="bg-green-500 rounded-full px-8 py-6">Start Journey <ArrowRight className="ml-2"/></Button></Link>
        </motion.div>

        <div className="h-[550px] w-full"><Canvas camera={{position:[0,0,5]}}><ambientLight intensity={0.8}/><directionalLight position={[5,3,5]} intensity={1.5}/><Stars count={3000} depth={50}/><Earth/><OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8}/></Canvas></div>
      </div>
    </div>
  )
}
