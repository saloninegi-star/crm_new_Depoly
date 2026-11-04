'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  X,
  Droplets,
  Cog,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PaddyLotItem {
  order: number;
  lot: string;
  godown: string;
  variety: string;
  source: string;
  arrived: string;
  moisture: number;
  bags: number;
  cameIn: number;
  left: number;
  status: 'milling_line_2' | 'milling_line_1' | 'drying' | 'ready_next' | 'ready';
  actionType?: 'recheck' | 'issue' | 'none';
}

const INITIAL_LOTS_DATA: PaddyLotItem[] = [
  {
    order: 1,
    lot: 'L-0839',
    godown: '2 · stack B',
    variety: 'PR-114',
    source: 'Govt procurement centre',
    arrived: '9 Oct',
    moisture: 13.2,
    bags: 1820,
    cameIn: 91.0,
    left: 22.4,
    status: 'milling_line_2',
    actionType: 'none',
  },
  {
    order: 2,
    lot: 'L-0842',
    godown: '1 · stack A',
    variety: '1121 Basmati',
    source: 'Kuldeep Singh, Taraori',
    arrived: '12 Oct',
    moisture: 13.8,
    bags: 2400,
    cameIn: 120.0,
    left: 80.0,
    status: 'milling_line_1',
    actionType: 'none',
  },
  {
    order: 3,
    lot: 'L-0846',
    godown: '2 · stack C',
    variety: 'PR-126',
    source: 'Mahinder Singh, Kaithal',
    arrived: '16 Oct',
    moisture: 14.6,
    bags: 1100,
    cameIn: 55.0,
    left: 55.0,
    status: 'drying',
    actionType: 'recheck',
  },
  {
    order: 4,
    lot: 'L-0848',
    godown: '1 · stack C',
    variety: '1121 Basmati',
    source: 'Baldev Singh, Taraori',
    arrived: '24 Oct',
    moisture: 16.0,
    bags: 550,
    cameIn: 24.8,
    left: 24.8,
    status: 'drying',
    actionType: 'recheck',
  },
  {
    order: 5,
    lot: 'L-0849',
    godown: '2 · stack D',
    variety: 'PR-114',
    source: 'Govt procurement centre, Rajpura',
    arrived: '24 Oct',
    moisture: 13.4,
    bags: 624,
    cameIn: 31.2,
    left: 31.2,
    status: 'ready_next',
    actionType: 'issue',
  },
  {
    order: 6,
    lot: 'L-0850',
    godown: '3 · stack A',
    variety: 'Sharbati',
    source: 'Rameshwar Lal, Hapur',
    arrived: '24 Oct',
    moisture: 13.1,
    bags: 568,
    cameIn: 28.4,
    left: 28.4,
    status: 'ready',
    actionType: 'issue',
  },
];

export default function PaddyStockFifoPage() {
  const { t } = useLanguage();
  const { accent } = useTheme();

  const [lots, setLots] = useState<PaddyLotItem[]>(INITIAL_LOTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [recheckLot, setRecheckLot] = useState<PaddyLotItem | null>(null);
  const [newMoisture, setNewMoisture] = useState<string>('13.6');

  const [issueLot, setIssueLot] = useState<PaddyLotItem | null>(null);
  const [issueQty, setIssueQty] = useState<string>('30');
  const [millingLine, setMillingLine] = useState<string>('Line 1 (Basmati)');

  // Handle Re-check moisture update
  const handleUpdateMoisture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recheckLot) return;
    const moistVal = Number(newMoisture) || 13.5;

    setLots(
      lots.map((item) => {
        if (item.lot === recheckLot.lot) {
          const isDryingNow = moistVal > 14.0;
          return {
            ...item,
            moisture: moistVal,
            status: isDryingNow ? 'drying' : 'ready_next',
            actionType: isDryingNow ? 'recheck' : 'issue',
          };
        }
        return item;
      })
    );

    setRecheckLot(null);
  };

  // Handle Issue to Mill
  const handleConfirmIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueLot) return;
    const qty = Number(issueQty) || 0;

    setLots(
      lots.map((item) => {
        if (item.lot === issueLot.lot) {
          const rem = Math.max(0, item.left - qty);
          return {
            ...item,
            left: rem,
            status: 'milling_line_1',
            actionType: 'none',
          };
        }
        return item;
      })
    );

    setIssueLot(null);
  };

  const filteredLots = lots.filter(
    (item) =>
      item.lot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.godown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* ========================================================
          1. TOP GODOWNS OVERVIEW CARD (EXACT SCREENSHOT LAYOUT)
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-6 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('ui_084d5190309d')}</h2>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
            {t('ui_455af16f1f4a')}{' '}<span className="text-slate-400 font-normal">{t('ui_2c5c0c143eea')}</span> {' '}{t('ui_e398d1e43aa7')}</span>
        </div>

        {/* 3 Godowns Grid with Teal Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          {/* Godown 1 */}
          <div className="space-y-3 pb-4 md:pb-0 md:pr-6 first:pl-0">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {t('ui_b9a1a3fa6d1e')}</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {t('ui_d48500eb97e2')}</p>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('ui_bcdb8f1e6f55')}</span>
              <span className="text-xs text-slate-400 font-medium">{t('ui_a8174b080ed9')}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: '69%', backgroundColor: accent?.primary || '#0d9488' }}
              />
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
              {t('ui_190c7d81b527')}</p>
          </div>

          {/* Godown 2 */}
          <div className="space-y-3 py-4 md:py-0 md:px-6">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {t('ui_5d00d05932ac')}</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {t('ui_28f9d905f887')}</p>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('ui_940477f54683')}</span>
              <span className="text-xs text-slate-400 font-medium">{t('ui_b54e6aa59d78')}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: '82%', backgroundColor: accent?.primary || '#0d9488' }}
              />
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
              {t('ui_76c97a1b3bd3')}</p>
          </div>

          {/* Godown 3 */}
          <div className="space-y-3 pt-4 md:pt-0 md:pl-6">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {t('ui_dceb818baf78')}</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {t('ui_e6aba758d3fd')}</p>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('ui_0990c86da482')}</span>
              <span className="text-xs text-slate-400 font-medium">{t('ui_b9a33440e340')}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: '49%', backgroundColor: accent?.primary || '#0d9488' }}
              />
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 pt-0.5">
              {t('ui_1e5061aba1c0')}</p>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. LOTS, OLDEST FIRST TABLE CARD (EXACT SCREENSHOT)
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4 transition-colors">
        {/* Table Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('ui_51c0454f0e0a')}</h2>

          {/* Search Box from Image */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder={t('ui_284cce884060')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Master Lots Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3.5 pl-2">{t('ui_1d75774c0f96')}</th>
                <th className="pb-3.5">{t('ui_4a211932145b')}</th>
                <th className="pb-3.5">{t('ui_53d77a34224e')}</th>
                <th className="pb-3.5">{t('ui_85e646fbb9f6')}</th>
                <th className="pb-3.5">{t('ui_6da13addb000')}</th>
                <th className="pb-3.5">{t('ui_a22d66c8578a')}</th>
                <th className="pb-3.5 text-center">{t('ui_dbab2db9c507')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_81cf1fc845ed')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_7e92864f14e5')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_8ae1c34bd37f')}</th>
                <th className="pb-3.5">{t('ui_bae7d5be7082')}</th>
                <th className="pb-3.5 text-right pr-2">{t('ui_97c89a4d6630')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {filteredLots.map((row) => (
                <tr
                  key={row.lot}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Order Circle Number */}
                  <td className="py-4 pl-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {row.order}
                    </span>
                  </td>

                  {/* Lot No */}
                  <td className="py-4 font-mono font-medium text-slate-900 dark:text-white">
                    {row.lot}
                  </td>

                  {/* Godown & Stack */}
                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    {row.godown}
                  </td>

                  {/* Variety */}
                  <td className="py-4 font-semibold text-slate-900 dark:text-white">
                    {row.variety}
                  </td>

                  {/* Source / Farmer */}
                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    {row.source}
                  </td>

                  {/* Arrival Date */}
                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    {row.arrived}
                  </td>

                  {/* Moisture (With Amber Badge if >= 14%) */}
                  <td className="py-4 text-center font-mono">
                    {row.moisture >= 14.5 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {row.moisture.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400">
                        {row.moisture.toFixed(1)}%
                      </span>
                    )}
                  </td>

                  {/* Bags */}
                  <td className="py-4 font-mono text-right sm:text-left">
                    {row.bags.toLocaleString('en-US')}
                  </td>

                  {/* Came in */}
                  <td className="py-4 font-mono text-right sm:text-left">
                    {row.cameIn.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</td>

                  {/* Left */}
                  <td className="py-4 font-mono font-bold text-slate-900 dark:text-white text-right sm:text-left">
                    {row.left.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</td>

                  {/* Status Pills Matching Screenshot */}
                  <td className="py-4">
                    {row.status === 'milling_line_2' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                        {t('ui_e2e994fc1486')}</span>
                    )}

                    {row.status === 'milling_line_1' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                        {t('ui_05b6850d6b75')}</span>
                    )}

                    {row.status === 'drying' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {t('ui_7ea61a9bd524')}</span>
                    )}

                    {row.status === 'ready_next' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t('ui_eefa85a30a16')}</span>
                    )}

                    {row.status === 'ready' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t('ui_20c7c5522fc2')}</span>
                    )}
                  </td>

                  {/* Action Buttons Matching Screenshot */}
                  <td className="py-4 text-right pr-2">
                    {row.actionType === 'recheck' && (
                      <button
                        type="button"
                        onClick={() => {
                          setRecheckLot(row);
                          setNewMoisture('13.6');
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
                      >
                        {t('ui_14fa93b60a23')}</button>
                    )}

                    {row.actionType === 'issue' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIssueLot(row);
                          setIssueQty(String(Math.min(30, row.left)));
                        }}
                        className="px-4 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer transition-transform active:scale-95"
                        style={{ backgroundColor: accent?.primary || '#0d9488' }}
                      >
                        {t('ui_73781a127ec1')}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer: Pagination & Count from Image */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500">
            {t('ui_163d8174ff4b')}{' '}{filteredLots.length} {' '}{t('ui_c1ef4ab608e8')}</span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
            >
              {t('ui_50f94286ba30')}</button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
            >
              {t('ui_bc981983e7f5')}</button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MODAL: RE-CHECK MOISTURE
         ======================================================== */}
      {recheckLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('ui_19b09f0ed807')}</h3>
                <p className="text-[11px] text-slate-400">{recheckLot.lot} · {recheckLot.variety}</p>
              </div>
              <button
                type="button"
                onClick={() => setRecheckLot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateMoisture} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ui_c5694429d5ec')}</span>
                  <span className="font-bold text-amber-600 font-mono">{recheckLot.moisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ui_d23c3f758c1e')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{recheckLot.godown}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('ui_ea7c8f4ae8bc')}</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newMoisture}
                  onChange={(e) => setNewMoisture(e.target.value)}
                  placeholder={t('ui_6f20eb5f5630')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="text-[10px] text-slate-400">
                  {t('ui_a9b37f7b5308')}{' '}<strong>{t('ui_5b98e6cf8d67')}</strong>.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRecheckLot(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t('ui_77dfd2135f4d')}</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  {t('ui_8529d1a17b5d')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          4. MODAL: ISSUE LOT TO MILLING LINE
         ======================================================== */}
      {issueLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('ui_7c78976ae6eb')}</h3>
                <p className="text-[11px] text-slate-400">{issueLot.lot} · {issueLot.variety}</p>
              </div>
              <button
                type="button"
                onClick={() => setIssueLot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmIssue} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ui_c74e6e229c4d')}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">{issueLot.left.toFixed(1)} {' '}{t('ui_c3c2fa56598a')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ui_605c4180d43d')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{issueLot.moisture}{t('ui_3553e1e9b03b')}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('ui_420ca2b07cde')}</label>
                <input
                  type="number"
                  step="0.1"
                  max={issueLot.left}
                  required
                  value={issueQty}
                  onChange={(e) => setIssueQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('ui_aaf6727e4129')}</label>
                <select
                  value={millingLine}
                  onChange={(e) => setMillingLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  <option value="Line 1 (Basmati)">{t('ui_de973b2a258e')}</option>
                  <option value="Line 2 (PR Paddy)">{t('ui_01a9e2136943')}</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIssueLot(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t('ui_77dfd2135f4d')}</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  {t('ui_83689dbe7073')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}