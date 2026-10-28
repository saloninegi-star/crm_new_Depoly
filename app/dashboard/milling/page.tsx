'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Cog,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  Play,
  TrendingUp,
  Layers,
  Flame,
  Droplets,
  PackageCheck,
} from 'lucide-react';

interface ActiveBatch {
  id: string;
  line: string;
  variety: string;
  lot: string;
  startTime: string;
  paddyIn: number;
  headRice: number;
  broken: number;
  recovery: number;
  statusText: string;
}

interface FinishedBatchLog {
  batch: string;
  date: string;
  line: number;
  lot: string;
  variety: string;
  paddyIn: number;
  headRice: number;
  broken: number;
  recovery: number;
  result: 'in_range' | 'below_target';
}

const INITIAL_RUNNING_BATCHES: ActiveBatch[] = [
  {
    id: 'B-102',
    line: 'Line 1 · 1121 Basmati',
    variety: '1121 Basmati',
    lot: 'lot L-0842',
    startTime: '06:10',
    paddyIn: 40.0,
    headRice: 24.6,
    broken: 4.4,
    recovery: 61.5,
    statusText: '61.5% · in range',
  },
  {
    id: 'B-103',
    line: 'Line 2 · PR-114',
    variety: 'PR-114',
    lot: 'lot L-0839',
    startTime: '07:30',
    paddyIn: 22.4,
    headRice: 13.6,
    broken: 2.7,
    recovery: 60.7,
    statusText: '60.7% · in range',
  },
];

const INITIAL_RECENT_BATCHES: FinishedBatchLog[] = [
  {
    batch: 'B-101',
    date: '23 Oct',
    line: 1,
    lot: 'L-0836',
    variety: '1509 Basmati',
    paddyIn: 45.0,
    headRice: 28.6,
    broken: 5.0,
    recovery: 63.6,
    result: 'in_range',
  },
  {
    batch: 'B-100',
    date: '23 Oct',
    line: 2,
    lot: 'L-0833',
    variety: 'PR-126',
    paddyIn: 38.0,
    headRice: 22.3,
    broken: 4.9,
    recovery: 58.7,
    result: 'below_target',
  },
  {
    batch: 'B-099',
    date: '22 Oct',
    line: 1,
    lot: 'L-0831',
    variety: '1121 Basmati',
    paddyIn: 41.5,
    headRice: 26.4,
    broken: 4.5,
    recovery: 63.6,
    result: 'in_range',
  },
  {
    batch: 'B-098',
    date: '22 Oct',
    line: 2,
    lot: 'L-0829',
    variety: 'PR-114',
    paddyIn: 36.0,
    headRice: 22.0,
    broken: 4.2,
    recovery: 61.1,
    result: 'in_range',
  },
];

export default function MillingRecoveryPage() {
  const { accent } = useTheme();

  const [runningBatches, setRunningBatches] = useState<ActiveBatch[]>(INITIAL_RUNNING_BATCHES);
  const [recentBatches, setRecentBatches] = useState<FinishedBatchLog[]>(INITIAL_RECENT_BATCHES);

  // Modals state
  const [selectedBatchForOutput, setSelectedBatchForOutput] = useState<ActiveBatch | null>(null);
  const [addHeadRice, setAddHeadRice] = useState<string>('2.5');
  const [addBroken, setAddBroken] = useState<string>('0.4');

  const [batchToClose, setBatchToClose] = useState<ActiveBatch | null>(null);

  // Handle Add Output submit
  const handleSaveOutput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForOutput) return;

    const addedHead = Number(addHeadRice) || 0;
    const addedBrk = Number(addBroken) || 0;

    setRunningBatches(
      runningBatches.map((b) => {
        if (b.id === selectedBatchForOutput.id) {
          const newHead = +(b.headRice + addedHead).toFixed(1);
          const newBrk = +(b.broken + addedBrk).toFixed(1);
          const newRec = +((newHead / b.paddyIn) * 100).toFixed(1);

          return {
            ...b,
            headRice: newHead,
            broken: newBrk,
            recovery: newRec,
            statusText: `${newRec}% · ${newRec >= 60.0 ? 'in range' : 'below target'}`,
          };
        }
        return b;
      })
    );

    setSelectedBatchForOutput(null);
  };

  // Handle Close Batch submit
  const handleConfirmClose = () => {
    if (!batchToClose) return;

    const newLog: FinishedBatchLog = {
      batch: batchToClose.id,
      date: 'Today',
      line: batchToClose.line.includes('1') ? 1 : 2,
      lot: batchToClose.lot.replace('lot ', ''),
      variety: batchToClose.variety,
      paddyIn: batchToClose.paddyIn,
      headRice: batchToClose.headRice,
      broken: batchToClose.broken,
      recovery: batchToClose.recovery,
      result: batchToClose.recovery >= 60.0 ? 'in_range' : 'below_target',
    };

    setRecentBatches([newLog, ...recentBatches]);
    setRunningBatches(runningBatches.filter((b) => b.id !== batchToClose.id));
    setBatchToClose(null);
  };

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* ========================================================
          1. TOP 4-CARD METRIC STRIP (EXACT SCREENSHOT LAYOUT)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Head rice recovery
          </span>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              61.2
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">%</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium pt-0.5">
            Target 60–65% · in range
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Paddy milled today
          </span>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              62.4
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">t</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
            2 batches on 2 lines
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Head rice
          </span>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              38.2
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">t</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
            To finished stock
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Broken rice
          </span>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              7.1
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">t</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
            11.4% of paddy
          </p>
        </div>
      </div>

      {/* ========================================================
          2. MIDDLE SECTION: RUNNING NOW + WHERE PADDY WENT
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Running now (2 lines busy) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Running now</h2>
            <span className="text-xs text-slate-400 font-medium">2 lines busy</span>
          </div>

          <div className="space-y-6">
            {runningBatches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850 space-y-4 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                {/* Batch Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                      {batch.id}
                    </span>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                      {batch.line}
                    </span>
                    <span className="text-xs text-slate-400">
                      {batch.lot} · since {batch.startTime}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {batch.statusText}
                  </span>
                </div>

                {/* Batch Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Paddy in</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      {batch.paddyIn.toFixed(1)} t
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Head rice</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      {batch.headRice.toFixed(1)} t
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Broken</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      {batch.broken.toFixed(1)} t
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Recovery</span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      {batch.recovery.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchForOutput(batch);
                      setAddHeadRice('2.0');
                      setAddBroken('0.3');
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    Add output
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchToClose(batch)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    Close batch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Where today's paddy went */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Where today’s paddy went
            </h2>
            <span className="text-xs text-slate-400 font-medium">62.4 t milled</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3">Output</th>
                  <th className="pb-3 text-center sm:text-left">Share</th>
                  <th className="pb-3 text-right">Tonnes</th>
                  <th className="pb-3 pl-4">Goes to</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {/* Row 1: Head Rice */}
                <tr>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">Head rice</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: '61.2%',
                            backgroundColor: accent?.primary || '#0d9488',
                          }}
                        />
                      </div>
                      <span className="font-mono text-slate-800 dark:text-slate-200">61.2%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    38.2
                  </td>
                  <td className="py-3 pl-4 text-slate-600 dark:text-slate-400">Finished stock</td>
                </tr>

                {/* Row 2: Broken Rice */}
                <tr>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">Broken rice</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: '11.4%',
                            backgroundColor: accent?.primary || '#0d9488',
                          }}
                        />
                      </div>
                      <span className="font-mono text-slate-800 dark:text-slate-200">11.4%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    7.1
                  </td>
                  <td className="py-3 pl-4 text-slate-600 dark:text-slate-400">
                    Finished stock, broken grade
                  </td>
                </tr>

                {/* Row 3: Husk */}
                <tr>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">Husk</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: '18.8%',
                            backgroundColor: accent?.primary || '#0d9488',
                          }}
                        />
                      </div>
                      <span className="font-mono text-slate-800 dark:text-slate-200">18.8%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    11.7
                  </td>
                  <td className="py-3 pl-4 text-slate-600 dark:text-slate-400">Boiler fuel</td>
                </tr>

                {/* Row 4: Rice Bran */}
                <tr>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">Rice bran</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: '8.7%',
                            backgroundColor: accent?.primary || '#0d9488',
                          }}
                        />
                      </div>
                      <span className="font-mono text-slate-800 dark:text-slate-200">8.7%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    5.4
                  </td>
                  <td className="py-3 pl-4 text-slate-600 dark:text-slate-400">
                    Sold for oil extraction
                  </td>
                </tr>

                {/* Total Summary Row */}
                <tr className="border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  <td className="py-3.5">Total</td>
                  <td className="py-3.5 font-mono">100%</td>
                  <td className="py-3.5 text-right font-mono text-sm">62.4</td>
                  <td className="py-3.5 pl-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BOTTOM SECTION: RECENT BATCHES TABLE (EXACT SCREENSHOT)
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent batches</h2>
          <span className="text-xs text-slate-400 font-medium">
            Recovery = head rice ÷ paddy in · target 60–65%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3.5 pl-2">Batch</th>
                <th className="pb-3.5">Date</th>
                <th className="pb-3.5 text-center sm:text-left">Line</th>
                <th className="pb-3.5">Lot</th>
                <th className="pb-3.5 text-right sm:text-left">Paddy in</th>
                <th className="pb-3.5 text-right sm:text-left">Head rice</th>
                <th className="pb-3.5 text-right sm:text-left">Broken</th>
                <th className="pb-3.5 text-right sm:text-left">Recovery</th>
                <th className="pb-3.5 pr-2">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {recentBatches.map((row) => (
                <tr
                  key={row.batch}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 pl-2 font-mono font-bold text-slate-900 dark:text-white">
                    {row.batch}
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-400">{row.date}</td>
                  <td className="py-3.5 text-center sm:text-left font-mono">{row.line}</td>
                  <td className="py-3.5">
                    <div className="font-mono text-slate-900 dark:text-white">{row.lot}</div>
                    <div className="text-[11px] text-slate-400">{row.variety}</div>
                  </td>
                  <td className="py-3.5 font-mono text-right sm:text-left">{row.paddyIn.toFixed(1)} t</td>
                  <td className="py-3.5 font-mono text-right sm:text-left">{row.headRice.toFixed(1)} t</td>
                  <td className="py-3.5 font-mono text-right sm:text-left">{row.broken.toFixed(1)} t</td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white text-right sm:text-left">
                    {row.recovery.toFixed(1)}%
                  </td>
                  <td className="py-3.5 pr-2">
                    {row.result === 'in_range' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        In range
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Below target
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          4. MODAL: ADD OUTPUT
         ======================================================== */}
      {selectedBatchForOutput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Add Milling Output
                </h3>
                <p className="text-[11px] text-slate-400">
                  {selectedBatchForOutput.id} · {selectedBatchForOutput.line}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatchForOutput(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOutput} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Add Head Rice (Tonnes)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={addHeadRice}
                  onChange={(e) => setAddHeadRice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Add Broken Rice (Tonnes)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={addBroken}
                  onChange={(e) => setAddBroken(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedBatchForOutput(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  Update Output
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: CLOSE BATCH CONFIRMATION
         ======================================================== */}
      {batchToClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Close Milling Batch
                </h3>
                <p className="text-[11px] text-slate-400">
                  {batchToClose.id} ({batchToClose.line})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBatchToClose(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paddy In:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {batchToClose.paddyIn.toFixed(1)} t
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Head Rice Produced:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {batchToClose.headRice.toFixed(1)} t
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Final Recovery:</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  {batchToClose.recovery.toFixed(1)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to close this batch? The output will be transferred to finished
              stock and archived in recent batches.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setBatchToClose(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer"
                style={{ backgroundColor: accent?.primary || '#0d9488' }}
              >
                Confirm & Close Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}