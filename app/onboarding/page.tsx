'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div className="relative min-h-screen bg-[#F5F0E8] text-[#1c2e24] p-6 flex flex-col justify-between">
      <button
        onClick={() => router.push('/dashboard')}
        className="absolute top-4 right-6 px-4 py-2 text-sm font-semibold text-[#162a20] bg-[#e5ded0] hover:bg-[#d8cfbe] rounded-full transition-colors z-50 shadow-sm"
      >
        Skip to Dashboard →
      </button>

      <div className="max-w-2xl mx-auto w-full pt-16 pb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#162a20]">Welcome to GreenSwap.</h1>
            <p className="text-sm text-[#4a5f51] mt-1">Calibrate your routine for high-impact sustainable habits.</p>
          </div>
          <div className="text-xs font-mono font-semibold px-3 py-1 bg-[#dbe8dc] text-[#162a20] rounded-full">
            STEP {step} OF 2
          </div>
        </div>

        <div className="bg-[#FAF8F4] border border-[#dfd7ca] rounded-2xl p-6 shadow-sm space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#162a20]">Daily Footprint Habits</h2>
              <p className="text-sm text-[#4a5f51]">Select your typical primary commute and lifestyle focus.</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {['Public Transit', 'Walking & Cycling', 'Electric Vehicle', 'Carpooling'].map((mode) => (
                  <div key={mode} className="p-3 border border-[#dfd7ca] rounded-xl bg-white text-sm font-medium hover:border-[#162a20] cursor-pointer">
                    {mode}
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-[#162a20] text-[#F5F0E8] rounded-full text-xs font-semibold hover:bg-[#234333]"
                >
                  Continue →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#162a20]">Priority Focus Areas</h2>
              <p className="text-sm text-[#4a5f51]">Choose which swaps matter most to your household.</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {['Clean Energy', 'Zero Waste', 'Plant Diet', 'E-Mobility'].map((area) => (
                  <div key={area} className="p-3 border border-[#dfd7ca] rounded-xl bg-white text-sm font-medium hover:border-[#162a20] cursor-pointer">
                    {area}
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 border border-[#dfd7ca] text-[#162a20] rounded-full text-xs font-semibold hover:bg-[#f0e8dc]"
                >
                  ← Back
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2.5 bg-[#162a20] text-[#F5F0E8] rounded-full text-xs font-semibold hover:bg-[#234333]"
                >
                  Complete Setup →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
