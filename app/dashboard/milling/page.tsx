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
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
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
            {t('ui_f540da207bfd')}</span>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              61.2
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">%</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium pt-0.5">
            {t('ui_160825a23fac')}</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('ui_8791d25cc4f3')}</span>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              62.4
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">{t('ui_8efd86fb78a5')}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
            {t('ui_62aed7abf6d4')}</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('ui_ec9d9437763c')}</span>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              38.2
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">{t('ui_8efd86fb78a5')}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
            {t('ui_defc8ef51cb4')}</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('ui_bf954bff45e9')}</span>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              7.1
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">{t('ui_8efd86fb78a5')}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
            {t('ui_3898178da77a')}</p>
        </div>
      </div>

      {/* ========================================================
          2. MIDDLE SECTION: RUNNING NOW + WHERE PADDY WENT
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Running now (2 lines busy) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('ui_33cfd5d598aa')}</h2>
            <span className="text-xs text-slate-400 font-medium">{t('ui_ca30552c2f19')}</span>
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
                      {batch.lot} {' '}{t('ui_4e96d9fa8b59')}{' '}{batch.startTime}
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
                    <span className="text-slate-400 dark:text-slate-500 block">{t('ui_2a1a5b6b0041')}</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      {batch.paddyIn.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">{t('ui_ec9d9437763c')}</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      {batch.headRice.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">{t('ui_3ad465ce2b95')}</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      {batch.broken.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">{t('ui_ea924f72d31e')}</span>
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
                    {t('ui_89d8c35046eb')}</button>
                  <button
                    type="button"
                    onClick={() => setBatchToClose(batch)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    {t('ui_8aeef7bfa74f')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Where today's paddy went */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('ui_8185287a7dda')}</h2>
            <span className="text-xs text-slate-400 font-medium">{t('ui_ca4b9c614bb4')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3">{t('ui_4bed336194a9')}</th>
                  <th className="pb-3 text-center sm:text-left">{t('ui_09ca55ca52d2')}</th>
                  <th className="pb-3 text-right">{t('ui_6dadfb4d1463')}</th>
                  <th className="pb-3 pl-4">{t('ui_05f1051584ce')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {/* Row 1: Head Rice */}
                <tr>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{t('ui_ec9d9437763c')}</td>
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
                  <td className="py-3 pl-4 text-slate-600 dark:text-slate-400">{t('ui_67c9c2abb5da')}</td>
                </tr>

                {/* Row 2: Broken Rice */}
                <tr>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{t('ui_bf954bff45e9')}</td>
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
                    {t('ui_d2e27a36e695')}</td>
                </tr>

                {/* Row 3: Husk */}
                <tr>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{t('ui_fe0cb320d1ee')}</td>
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
                  <td className="py-3 pl-4 text-slate-600 dark:text-slate-400">{t('ui_743b5a172c33')}</td>
                </tr>

                {/* Row 4: Rice Bran */}
                <tr>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{t('ui_a6d5ccf30a3a')}</td>
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
                    {t('ui_5f1e5ee8e11b')}</td>
                </tr>

                {/* Total Summary Row */}
                <tr className="border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  <td className="py-3.5">{t('ui_b25928c69902')}</td>
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
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('ui_3dc3a93ed7cf')}</h2>
          <span className="text-xs text-slate-400 font-medium">
            {t('ui_a556768b20ed')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3.5 pl-2">{t('ui_8bf1ef5668b1')}</th>
                <th className="pb-3.5">{t('ui_eb9a4bc1c0c1')}</th>
                <th className="pb-3.5 text-center sm:text-left">{t('ui_ea9676003762')}</th>
                <th className="pb-3.5">{t('ui_4a211932145b')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_2a1a5b6b0041')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_ec9d9437763c')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_3ad465ce2b95')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_ea924f72d31e')}</th>
                <th className="pb-3.5 pr-2">{t('ui_5faa59d4bc37')}</th>
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
                  <td className="py-3.5 font-mono text-right sm:text-left">{row.paddyIn.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</td>
                  <td className="py-3.5 font-mono text-right sm:text-left">{row.headRice.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</td>
                  <td className="py-3.5 font-mono text-right sm:text-left">{row.broken.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white text-right sm:text-left">
                    {row.recovery.toFixed(1)}%
                  </td>
                  <td className="py-3.5 pr-2">
                    {row.result === 'in_range' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t('ui_07e10b5bd625')}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {t('ui_c8394d8f08a6')}</span>
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
                  {t('ui_d790fd605f6f')}</h3>
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
                  {t('ui_145199433dbb')}</label>
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
                  {t('ui_cd99a571d9bd')}</label>
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
                  {t('ui_77dfd2135f4d')}</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  {t('ui_b060824f8d59')}</button>
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
                  {t('ui_214b9bcfa44b')}</h3>
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
                <span className="text-slate-500">{t('ui_8875b47c3080')}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {batchToClose.paddyIn.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('ui_653313174a97')}</span>
                <span className="font-mono font-bold text-emerald-600">
                  {batchToClose.headRice.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('ui_b66059b2f394')}</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  {batchToClose.recovery.toFixed(1)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {t('ui_d3bcac262949')}</p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setBatchToClose(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {t('ui_77dfd2135f4d')}</button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer"
                style={{ backgroundColor: accent?.primary || '#0d9488' }}
              >
                {t('ui_e77323a4fdeb')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}