'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Cog, Plus, Play, CheckCircle2, TrendingUp, Layers, Flame, ArrowUpRight } from 'lucide-react';

export default function MillingRecoveryPage() {
  const { currentTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: currentTheme.buttonBg }}>
             Checkpoint #4
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Milling Operations & Yield Recovery</h1>
          <p className="text-xs text-slate-500">Track recovery % (60-65% Head Rice), machine-wise production and shift entries</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs" style={{ backgroundColor: currentTheme.buttonBg }}>
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start New Milling Batch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Recovery Rate</span>
          <div className="text-2xl font-black text-slate-900">64.8%</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Standard 60-65% Target OK</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Head Rice (Grade A)</span>
          <div className="text-2xl font-black text-emerald-700">61.2%</div>
          <div className="text-[11px] text-slate-400">Packing Ready Stock</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Broken Rice (10-12%)</span>
          <div className="text-2xl font-black text-amber-600">11.4%</div>
          <div className="text-[11px] text-slate-400">Small & Big Broken Split</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Husk & Bran (Byproducts)</span>
          <div className="text-2xl font-black text-teal-700">27.4%</div>
          <div className="text-[11px] text-slate-400">Boiler Fuel + Oil Extraction</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Active Shift Milling Batches</h2>
          <div className="space-y-3">
            {[
              { batch: 'Batch #B-102', lot: 'LOT-849 (PR-126)', input: '120 MT Paddy', output: '73.4 MT Head Rice', broken: '13.6 MT', status: 'Running on Line #1', progress: 75 },
              { batch: 'Batch #B-101', lot: 'LOT-848 (Basmati 1121)', input: '180 MT Paddy', output: '110.1 MT Head Rice', broken: '20.5 MT', status: 'QC Passed & Closed', progress: 100 },
            ].map((b) => (
              <div key={b.batch} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900">{b.batch} • {b.lot}</span>
                  <span className="text-emerald-700">{b.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div>Input: <strong>{b.input}</strong></div>
                  <div>Head Rice: <strong className="text-emerald-700">{b.output}</strong></div>
                  <div>Broken: <strong className="text-amber-700">{b.broken}</strong></div>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${b.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Byproducts Output Log</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <div><div className="font-bold">Rice Husk</div><div className="text-[10px] text-slate-400">Boiler Fuel / Steam</div></div>
              <span className="font-mono font-bold text-slate-900">22.5 MT</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <div><div className="font-bold">Rice Bran</div><div className="text-[10px] text-slate-400">Sold for Oil Extraction</div></div>
              <span className="font-mono font-bold text-slate-900">10.3 MT</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <div><div className="font-bold">Rice Dust</div><div className="text-[10px] text-slate-400">Cattle Feed Sale</div></div>
              <span className="font-mono font-bold text-slate-900">2.8 MT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}