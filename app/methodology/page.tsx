'use client';

import Link from 'next/link';
import { Card } from '@/shared/ui';
import { ArrowLeft, Database, HelpCircle, Scale, ShieldAlert, Cpu } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1c2e24]">
      {/* Header */}
      <header className="border-b border-[#e2dacb] bg-[#ede5d8]/80 backdrop-blur-sm px-6 py-4 md:px-12 sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#4a6b57] hover:text-[#162a20] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to GreenSwap
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/data-sources"
              className="text-xs font-mono text-[#5b7566] hover:text-[#162a20] underline transition-colors"
            >
              View Primary Data Sources Catalog →
            </Link>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-[#7a8f82] uppercase">
              METHODOLOGY // ALGORITHM SPECIFICATION
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12 space-y-12">
        {/* Hero Title */}
        <div className="border-b border-[#e2dacb] pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider bg-[#dbe8dc] text-[#162a20] border border-[#bcd3be]">
              <Cpu className="h-3.5 w-3.5 text-[#2c5e3f]" />
              SCIENTIFIC CALCULATION SPECIFICATION
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#162a20]">
            How GreenSwap Computes Footprints &amp; Swap Utility
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4a5f51] leading-relaxed">
            We reject marketing greenwashing, speculative point estimates, and opaque black-box algorithms.
            Every calculation in GreenSwap is governed by deterministic formulas, statistical confidence intervals,
            and Multi-Criteria Decision Analysis (MCDA).
          </p>
        </div>

        {/* Section 1: Multi-Criteria Utility Function */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#2c5e3f]">
            <Scale className="h-5 w-5" />
            <h2 className="font-serif text-2xl font-bold text-[#162a20]">1. Multi-Criteria Scoring Function</h2>
          </div>
          <p className="font-sans text-sm text-[#4a5f51] leading-relaxed">
            Every alternative suggested to users is evaluated on a composite utility score ranging from 0 to 100.
            This ensures recommendations consider not just emissions, but also personal financial constraints,
            behavioral feasibility, and geographic applicability.
          </p>
          <div className="bg-[#ede5d8] border border-[#dfd7ca] rounded-xl p-4 font-mono text-xs overflow-x-auto text-[#162a20]">
            Score(s) = (w_co2 · N_co2(s)) + (w_cost · N_cost(s)) + (w_effort · N_effort(s)) + (w_conf · C(s))
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-[#4a5f51]">
            <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#e2dacb]">
              <strong className="text-[#162a20] block mb-1">N_co2(s) — Carbon Delta:</strong>
              Normalized monthly kg CO₂e saved compared against the user&apos;s baseline activity.
            </div>
            <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#e2dacb]">
              <strong className="text-[#162a20] block mb-1">N_cost(s) — Economic Utility:</strong>
              Expected monthly net savings or expenditures, weighted by user budget profile.
            </div>
            <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#e2dacb]">
              <strong className="text-[#162a20] block mb-1">N_effort(s) — Friction Penalty:</strong>
              Inverse friction index based on habit formation difficulty (low, medium, high).
            </div>
            <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#e2dacb]">
              <strong className="text-[#162a20] block mb-1">C(s) — Confidence Score:</strong>
              Degree of scientific consensus and empirical validation from peer-reviewed databases.
            </div>
          </div>
        </section>

        {/* Section 2: Regional Grid Emission Factors */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#2c5e3f]">
            <Database className="h-5 w-5" />
            <h2 className="font-serif text-2xl font-bold text-[#162a20]">2. Regional Electricity Grid Calibration</h2>
          </div>
          <p className="font-sans text-sm text-[#4a5f51] leading-relaxed">
            Electricity consumption emission factors depend critically on the primary grid mix of the user&apos;s region.
            We source deterministic baseline factors from authorized energy regulators:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#dfd7ca] rounded-lg overflow-hidden bg-[#FAF8F4]">
              <thead className="bg-[#ede5d8] text-[#162a20] uppercase font-mono text-[11px]">
                <tr>
                  <th className="p-3">Region</th>
                  <th className="p-3">Grid Intensity Factor</th>
                  <th className="p-3">Primary Authority Source</th>
                  <th className="p-3">Vintage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2dacb] font-mono text-[#3a4e40]">
                <tr>
                  <td className="p-3 font-sans font-medium text-[#162a20]">India National Grid</td>
                  <td className="p-3">0.716 kg CO₂e / kWh</td>
                  <td className="p-3">Central Electricity Authority (CEA v19)</td>
                  <td className="p-3">2023-2024</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-[#162a20]">United Kingdom</td>
                  <td className="p-3">0.207 kg CO₂e / kWh</td>
                  <td className="p-3">UK DEFRA / DESNZ Greenhouse Gas Factors</td>
                  <td className="p-3">2024</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-[#162a20]">United States (Avg)</td>
                  <td className="p-3">0.386 kg CO₂e / kWh</td>
                  <td className="p-3">US EPA eGRID National Baseline</td>
                  <td className="p-3">2024</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-[#162a20]">Global Weighted Baseline</td>
                  <td className="p-3">0.475 kg CO₂e / kWh</td>
                  <td className="p-3">IEA Emission Factors Report</td>
                  <td className="p-3">2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Data Integrity & Boundary Rules */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#2c5e3f]">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="font-serif text-2xl font-bold text-[#162a20]">3. System Boundary &amp; Scientific Limitations</h2>
          </div>
          <Card className="p-6 bg-[#FAF8F4] border border-[#dfd7ca] rounded-xl space-y-3">
            <h3 className="font-serif font-bold text-base text-[#162a20]">Scopes and Allocation Rules</h3>
            <ul className="list-disc pl-5 text-xs text-[#4a5f51] space-y-1.5 leading-relaxed font-sans">
              <li>
                <strong>Cradle-to-Grave Life Cycle Assessments (LCA):</strong> Wherever possible, embodied emissions
                from raw material extraction, processing, and transportation are incorporated into swap values.
              </li>
              <li>
                <strong>Rebound Effects:</strong> Financial savings can theoretically induce secondary consumption.
                GreenSwap reports gross primary emission mitigations; secondary rebound effects are flagged where applicable.
              </li>
              <li>
                <strong>Conservative Estimation Bias:</strong> In cases of conflicting literature estimates, we choose the
                lower bound of emission savings to protect against inflated environmental claims.
              </li>
            </ul>
          </Card>
        </section>

        {/* Section 4: Public Feedback & Verification */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#2c5e3f]">
            <HelpCircle className="h-5 w-5" />
            <h2 className="font-serif text-2xl font-bold text-[#162a20]">4. Peer Review &amp; Academic Inquiries</h2>
          </div>
          <p className="font-sans text-sm text-[#4a5f51] leading-relaxed">
            All calculation models are maintained in open documentation. Researchers and sustainability scientists
            are invited to review factor assumptions, report anomalies, or suggest newer dataset integrations.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/data-sources"
              className="inline-flex items-center justify-center rounded-full bg-[#162a20] px-5 py-2.5 text-xs font-semibold text-[#F5F0E8] hover:bg-[#234333] transition-colors"
            >
              Browse Data Sources
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#162a20] px-5 py-2.5 text-xs font-semibold text-[#162a20] hover:bg-[#162a20]/10 transition-colors"
            >
              Submit Calculation Feedback
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
