'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Printer,
  X,
  Truck,
  Scale,
  Clock,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QueueItem {
  token: string;
  vehicle: string;
  source: string;
  variety: string;
  bags: number;
  grossWeight?: number;
  grossTime?: string;
  status: 'tare_next' | 'gross_waiting' | 'gross_next';
  waitTime?: string;
}

interface CompletedRecord {
  token: string;
  truck: string;
  source: string;
  variety: string;
  godown: string;
  gross: number;
  tare: number;
  moisture: number;
  cut: number;
  toGodown: number;
}

// 🟢 DETERMINISTIC FORMATTER (Hydration Mismatch Error ko 100% rokta hai)
function formatKg(num: number): string {
  if (!num && num !== 0) return '0';
  const str = Math.round(num).toString();
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
}

const INITIAL_QUEUE: QueueItem[] = [
  {
    token: 'TK-4824',
    vehicle: 'DL 01 AB 7741',
    source: 'Gurmeet Farm, Panipat',
    variety: '1509 Basmati',
    bags: 716,
    grossWeight: 35800,
    grossTime: '08:31',
    status: 'tare_next',
  },
  {
    token: 'TK-4825',
    vehicle: 'HR 45 B 9811',
    source: 'Surinder Pal, Karnal Mandi',
    variety: 'PR-126',
    bags: 690,
    status: 'gross_waiting',
    waitTime: '1 h 45 min',
  },
  {
    token: 'TK-4826',
    vehicle: 'UP 32 AB 9999',
    source: 'Suresh Chandra Patel, Bara Banki Mandi',
    variety: 'PR-126',
    bags: 550,
    status: 'gross_next',
  },
];

const INITIAL_COMPLETED: CompletedRecord[] = [
  {
    token: 'TK-4823',
    truck: 'UP 14 TT 1029',
    source: 'Rameshwar Lal, Hapur',
    variety: 'Sharbati',
    godown: '3 · stack A',
    gross: 42100,
    tare: 13700,
    moisture: 13.1,
    cut: 0,
    toGodown: 28400,
  },
  {
    token: 'TK-4822',
    truck: 'PB 11 BC 8312',
    source: 'Govt procurement centre, Rajpura',
    variety: 'PR-114',
    godown: '2 · stack D',
    gross: 44200,
    tare: 13000,
    moisture: 13.4,
    cut: 0,
    toGodown: 31200,
  },
  {
    token: 'TK-4821',
    truck: 'HR 38 AA 4921',
    source: 'Baldev Singh, Taraori',
    variety: '1121 Basmati',
    godown: '1 · stack C',
    gross: 38450,
    tare: 13150,
    moisture: 16.0,
    cut: 506,
    toGodown: 24794,
  },
];

export default function WeighbridgePage() {
  const { t } = useLanguage();
  const { accent } = useTheme();

  // Hydration safety flag
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [completed, setCompleted] = useState<CompletedRecord[]>(INITIAL_COMPLETED);

  // Active vehicle in the right form
  const [selectedTruck, setSelectedTruck] = useState<QueueItem>(INITIAL_QUEUE[0]);

  // Form Fields
  const [tareInput, setTareInput] = useState<string>('');
  const [moistureInput, setMoistureInput] = useState<string>('');
  const [godownInput, setGodownInput] = useState<string>('Godown 1 · Basmati · stack C');

  // Print Slip Modal state
  const [printSlip, setPrintSlip] = useState<CompletedRecord | null>(null);

  // Dynamic Calculations
  const grossVal = selectedTruck.grossWeight || 35800;
  const tareVal = Number(tareInput) || 0;
  const rawNet = Math.max(0, grossVal - tareVal);
  const moistureVal = Number(moistureInput) || 0;
  const excessMoisture = Math.max(0, moistureVal - 14.0);
  const moistureCut = moistureVal > 14 ? Math.round(rawNet * (excessMoisture * 0.015)) : 0;
  const paddyToGodown = Math.max(0, rawNet - moistureCut);

  const handleSaveAndPrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tareVal) return;

    const newRecord: CompletedRecord = {
      token: selectedTruck.token,
      truck: selectedTruck.vehicle,
      source: selectedTruck.source,
      variety: selectedTruck.variety,
      godown: godownInput,
      gross: grossVal,
      tare: tareVal,
      moisture: moistureVal || 13.5,
      cut: moistureCut,
      toGodown: paddyToGodown,
    };

    setCompleted([newRecord, ...completed]);
    setQueue(queue.filter((q) => q.token !== selectedTruck.token));
    setPrintSlip(newRecord);
    setTareInput('');
    setMoistureInput('');
  };

  // Safe totals calculations
  const totalGross = completed.reduce((acc, c) => acc + c.gross, 0);
  const totalTare = completed.reduce((acc, c) => acc + c.tare, 0);
  const totalCut = completed.reduce((acc, c) => acc + c.cut, 0);
  const totalGodown = completed.reduce((acc, c) => acc + c.toGodown, 0);

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* ========================================================
          1. TOP 4-CARD METRIC STRIP (WITH COLORFUL ACCENT ACCENTS)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Waiting Gross (Warm Amber) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-800 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{t('ui_48eb140d1d93')}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">2</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('ui_5736894ffc48')}</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">{t('ui_f5b18a75d1cd')}</p>
        </div>

        {/* Card 2: Waiting Tare (Cool Blue) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs relative overflow-hidden group hover:border-sky-300 dark:hover:border-sky-800 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{t('ui_d78e815c1c80')}</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">1</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('ui_7a4d63b1ba71')}</span>
          </div>
          <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">{t('ui_2c438a00c049')}</p>
        </div>

        {/* Card 3: Weighed Today (Violet/Purple) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-800 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{t('ui_7e22e37d44d8')}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">3</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('ui_5736894ffc48')}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t('ui_f7fb13acc23d')}</p>
        </div>

        {/* Card 4: Paddy to Godown (Emerald Green) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-800 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{t('ui_aebac535669d')}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">84.4</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('ui_8efd86fb78a5')}</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">{t('ui_0daed11d5201')}</p>
        </div>
      </div>

      {/* ========================================================
          2. MIDDLE SECTION (QUEUE & RECORD TARE WEIGHT)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Queue Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('ui_d325fcd91938')}</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {queue.length} {' '}{t('ui_60261ed2752b')}</span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t('ui_aadc65074c65')}</span>
          </div>

          <div className="space-y-3">
            {queue.map((item) => {
              const isSelected = selectedTruck.token === item.token;

              return (
                <div
                  key={item.token}
                  onClick={() => {
                    setSelectedTruck(item);
                    setTareInput('');
                    setMoistureInput('');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-2xs ring-1 ring-teal-500'
                      : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {item.vehicle}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.token}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.source} · <span className="font-medium text-slate-700 dark:text-slate-300">{item.variety}</span> · {item.bags} {' '}{t('ui_ba366690aa50')}</p>
                    </div>

                    {/* Status Badge & Action */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === 'tare_next' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                          {t('ui_a96f96e5da90')}</span>
                      )}

                      {item.status === 'gross_waiting' && (
                        <>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {t('ui_eb96ce98ca00')}{' '}{item.waitTime}
                          </span>
                          <button
                            type="button"
                            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                          >
                            {t('ui_ad10964b3607')}</button>
                        </>
                      )}

                      {item.status === 'gross_next' && (
                        <>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            {t('ui_77c590fa87cb')}</span>
                          <button
                            type="button"
                            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                          >
                            {t('ui_ad10964b3607')}</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Record Tare Weight Form */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('ui_2435e0ebf903')}</h2>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
              {selectedTruck.vehicle}
            </span>
          </div>

          {/* Truck Metadata */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
            <div className="grid grid-cols-4 py-0.5">
              <span className="text-slate-400 dark:text-slate-500 font-medium">{t('ui_a1141eb96836')}</span>
              <span className="font-semibold text-slate-900 dark:text-white col-span-3 font-mono">
                {selectedTruck.token}
              </span>
            </div>
            <div className="grid grid-cols-4 py-0.5">
              <span className="text-slate-400 dark:text-slate-500 font-medium">{t('ui_6da13addb000')}</span>
              <span className="font-semibold text-slate-900 dark:text-white col-span-3">
                {selectedTruck.source}
              </span>
            </div>
            <div className="grid grid-cols-4 py-0.5">
              <span className="text-slate-400 dark:text-slate-500 font-medium">{t('ui_ddcb77ff769e')}</span>
              <span className="font-semibold text-slate-900 dark:text-white col-span-3">
                {selectedTruck.variety} · {selectedTruck.bags} {' '}{t('ui_ba366690aa50')}</span>
            </div>
            <div className="grid grid-cols-4 py-0.5">
              <span className="text-slate-400 dark:text-slate-500 font-medium">{t('ui_1b9810c36469')}</span>
              <span className="font-semibold text-slate-900 dark:text-white col-span-3 font-mono">
                {formatKg(grossVal)} {' '}{t('ui_1389845b02c0')}{' '}
                <span className="text-slate-400 font-normal">
                  {t('ui_27e90dfa57c3')}{' '}{selectedTruck.grossTime || '08:31'}
                </span>
              </span>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSaveAndPrint} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('ui_0df9a8892774')}</label>
                <input
                  type="number"
                  required
                  placeholder={t('ui_8dfe04d223b4')}
                  value={tareInput}
                  onChange={(e) => setTareInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('ui_9c26878ca4c1')}</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={t('ui_c4d9650a50c6')}
                  value={moistureInput}
                  onChange={(e) => setMoistureInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-2xs"
                />
                <p className="text-[11px] text-slate-400 pt-0.5">
                  {t('ui_3a1f3badb5dc')}</p>
              </div>
            </div>

            {/* Godown and Stack Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('ui_ccc28dd6bc2c')}</label>
              <select
                value={godownInput}
                onChange={(e) => setGodownInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-2xs"
              >
                <option value="Godown 1 · Basmati · stack C">{t('ui_f35e5c6b962c')}</option>
                <option value="Godown 2 · PR Paddy · stack D">{t('ui_13a41dc259e6')}</option>
                <option value="Godown 3 · Buffer · stack A">{t('ui_9de5736b0589')}</option>
              </select>
            </div>

            {/* Calculations Box */}
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium bg-slate-50/50 dark:bg-slate-850">
              <div className="px-4 py-2.5 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">{t('ui_ebc3510f2455')}</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">
                  {tareVal > 0 ? `${formatKg(rawNet)} kg` : '—'}
                </span>
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center">
                <span className="text-rose-600 dark:text-rose-400">{t('ui_4e7aeeb1ce95')}</span>
                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
                  {moistureCut > 0 ? `-${formatKg(moistureCut)} kg` : '—'}
                </span>
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center bg-emerald-50/40 dark:bg-emerald-950/20 rounded-b-xl">
                <span className="text-emerald-900 dark:text-emerald-300 font-bold">{t('ui_aebac535669d')}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  {tareVal > 0 ? `${formatKg(paddyToGodown)} kg` : '—'}
                </span>
              </div>
            </div>

            {/* Save & Print Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!tareVal}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-50 active:scale-95 hover:opacity-95"
                style={{ backgroundColor: accent?.primary || '#0d9488' }}
              >
                <Printer className="w-4 h-4" />
                <span>{t('ui_6ccbe1fcb44b')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================
          3. BOTTOM TABLE: WEIGHED TODAY (HYDRATION-PROOF EN-IN NUMBERS)
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('ui_7e22e37d44d8')}</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800">
              {completed.length} {' '}{t('ui_a5654a379120')}</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">{t('ui_359d7020752c')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">{t('ui_a1141eb96836')}</th>
                <th className="pb-3">{t('ui_5bfebf2e9996')}</th>
                <th className="pb-3">{t('ui_6da13addb000')}</th>
                <th className="pb-3">{t('ui_53d77a34224e')}</th>
                <th className="pb-3 text-right sm:text-left">{t('ui_cdb78902f6c6')}</th>
                <th className="pb-3 text-right sm:text-left">{t('ui_da5b688e005c')}</th>
                <th className="pb-3 text-center">{t('ui_dbab2db9c507')}</th>
                <th className="pb-3 text-right sm:text-left">{t('ui_d5fe01364843')}</th>
                <th className="pb-3 text-right sm:text-left">{t('ui_a6f1f978f35e')}</th>
                <th className="pb-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {completed.map((row) => (
                <tr key={row.token} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-mono text-slate-900 dark:text-white font-bold">{row.token}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {row.truck}
                  </td>
                  <td className="py-3.5">
                    <div className="text-slate-900 dark:text-white font-medium">{row.source}</div>
                    <div className="text-[11px] text-slate-400">{row.variety}</div>
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-400 font-medium">{row.godown}</td>
                  <td className="py-3.5 font-mono text-right sm:text-left">
                    {formatKg(row.gross)}
                  </td>
                  <td className="py-3.5 font-mono text-right sm:text-left">
                    {formatKg(row.tare)}
                  </td>
                  <td className="py-3.5 text-center font-mono">
                    {row.moisture >= 15 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {row.moisture.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-300">{row.moisture.toFixed(1)}%</span>
                    )}
                  </td>
                  <td className="py-3.5 font-mono text-right sm:text-left font-bold text-rose-600 dark:text-rose-400">
                    {row.cut > 0 ? formatKg(row.cut) : '0'}
                  </td>
                  <td className="py-3.5 font-mono text-right sm:text-left font-bold text-emerald-700 dark:text-emerald-400">
                    {formatKg(row.toGodown)}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setPrintSlip(row)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={t('ui_02b4fc309aa1')}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* 🟢 TOTAL SUMMARY ROW (Fixed Hydration Output) */}
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                <td colSpan={4} className="py-4 font-bold text-xs">
                  {t('ui_0964d0ea8853')}{' '}{completed.length} {' '}{t('ui_5736894ffc48')}</td>
                <td className="py-4 font-mono text-right sm:text-left">
                  {formatKg(totalGross)}
                </td>
                <td className="py-4 font-mono text-right sm:text-left">
                  {formatKg(totalTare)}
                </td>
                <td className="py-4"></td>
                <td className="py-4 font-mono text-right sm:text-left text-rose-600 dark:text-rose-400">
                  {formatKg(totalCut)}
                </td>
                <td className="py-4 font-mono text-right sm:text-left text-emerald-700 dark:text-emerald-400 text-sm">
                  {formatKg(totalGodown)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          4. COMPUTERIZED WEIGHMENT SLIP PRINT MODAL
         ======================================================== */}
      {printSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  {t('ui_1f42972d319d')}</h4>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {t('ui_ba37fa1267e5')}</p>
              </div>
              <button
                type="button"
                onClick={() => setPrintSlip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_e83712561b2b')}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{printSlip.token}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_623603110168')}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{printSlip.truck}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_922acd282cc0')}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{printSlip.source}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_a913b01674df')}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{printSlip.godown}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_41d895d10f6a')}</span>
                <span className="font-mono font-bold">{formatKg(printSlip.gross)} {' '}{t('ui_1389845b02c0')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_0221b2da5e48')}</span>
                <span className="font-mono font-bold">{formatKg(printSlip.tare)} {' '}{t('ui_1389845b02c0')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1 text-rose-600">
                <span>{t('ui_0db348959082')}</span>
                <span className="font-mono font-bold">-{formatKg(printSlip.cut)} {' '}{t('ui_1389845b02c0')}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm text-teal-700 dark:text-teal-400">
                <span>{t('ui_9f05c51cebab')}</span>
                <span className="font-mono">{formatKg(printSlip.toGodown)} {' '}{t('ui_1389845b02c0')}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPrintSlip(null)}
                className="w-1/2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('ui_bbfa773e5a63')}</button>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-1/2 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
                style={{ backgroundColor: accent?.primary || '#0d9488' }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('ui_68a24eb1f4f9')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}