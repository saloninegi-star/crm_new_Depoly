'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Printer,
  Download,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  ShoppingBag,
  Eye,
  FileText,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

export default function ReportsProfitLossPage() {
  const { accent } = useTheme();

  // Period Selector State
  const [period, setPeriod] = useState<'month' | 'september' | 'year'>('month');

  const statementsList = [
    {
      title: 'Daily cash book',
      desc: 'Opening, cash in and out, closing, by day',
    },
    {
      title: 'Paddy and finished stock',
      desc: 'Godown balances, milling losses, lot yields',
    },
    {
      title: 'GST: GSTR-1',
      desc: 'Sales invoices for filing',
    },
    {
      title: 'GST: GSTR-3B summary',
      desc: 'Output tax, input credit, tax payable',
    },
    {
      title: 'Farmer purchase register',
      desc: 'Every lot bought, weight, rate and payment',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* 0. Top Action Bar with Filters, Print & Download PDF */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Segmented Switcher */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                period === 'month'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              This month
            </button>
            <button
              type="button"
              onClick={() => setPeriod('september')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                period === 'september'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              September
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                period === 'year'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              This year
            </button>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={() => alert('Downloading official PDF report...')}
            className="px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-transform active:scale-95 hover:opacity-95"
            style={{ backgroundColor: accent?.primary || '#0d9488' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* 1. TOP 4-CARD FINANCIAL STRIP (MATCHING SCREENSHOT 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales (Emerald) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹1.84
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">crore</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            Rice, broken rice and bran
          </p>
        </div>

        {/* Cost of paddy (Rose) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Cost of paddy</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹1.38
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">crore</span>
          </div>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            Farmers and procurement centres
          </p>
        </div>

        {/* Running expenses (Amber) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Running expenses</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Zap className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹14.20
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">lakh</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            Power, labour, repairs, freight
          </p>
        </div>

        {/* Net profit (Vibrant Green) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Net profit</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹31.80
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">lakh</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            17.3% of sales
          </p>
        </div>
      </div>

      {/* 2. TWO COLUMNS: PROFIT & LOSS (LEFT) + STATEMENTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Profit and Loss Statement */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Profit and loss
            </h2>
            <span className="text-xs text-slate-400 font-medium">% of sales</span>
          </div>

          <div className="space-y-4 text-xs font-medium">
            {/* Sales Section */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Sales</div>
              <div className="space-y-1.5 pl-3">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Rice</span>
                  <div className="space-x-8 font-mono">
                    <span className="text-slate-900 dark:text-white font-medium">₹1,65,80,000</span>
                    <span className="w-12 inline-block text-right">90.1%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Broken rice</span>
                  <div className="space-x-8 font-mono">
                    <span className="text-slate-900 dark:text-white font-medium">₹11,80,000</span>
                    <span className="w-12 inline-block text-right">6.4%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Rice bran</span>
                  <div className="space-x-8 font-mono">
                    <span className="text-slate-900 dark:text-white font-medium">₹6,40,000</span>
                    <span className="w-12 inline-block text-right">3.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total sales */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-bold text-slate-900 dark:text-white">
              <span>Total sales</span>
              <div className="space-x-8 font-mono">
                <span>₹1,84,00,000</span>
                <span className="w-12 inline-block text-right">100.0%</span>
              </div>
            </div>

            {/* Less cost of paddy */}
            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-medium">
              <span>Less cost of paddy</span>
              <div className="space-x-8 font-mono">
                <span className="text-slate-900 dark:text-white font-bold">₹1,38,00,000</span>
                <span className="w-12 inline-block text-right text-slate-400">75.0%</span>
              </div>
            </div>

            {/* Gross margin */}
            <div className="py-2 border-y border-slate-100 dark:border-slate-800 flex justify-between items-center font-bold text-slate-900 dark:text-white">
              <span>Gross margin</span>
              <div className="space-x-8 font-mono text-teal-700 dark:text-teal-400">
                <span>₹46,00,000</span>
                <span className="w-12 inline-block text-right">25.0%</span>
              </div>
            </div>

            {/* Less running expenses */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Less running expenses</div>
              <div className="space-y-1.5 pl-3">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Electricity</span>
                  <div className="space-x-8 font-mono">
                    <span className="text-slate-900 dark:text-white font-medium">₹6,10,000</span>
                    <span className="w-12 inline-block text-right">3.3%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Labour</span>
                  <div className="space-x-8 font-mono">
                    <span className="text-slate-900 dark:text-white font-medium">₹4,80,000</span>
                    <span className="w-12 inline-block text-right">2.6%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Maintenance</span>
                  <div className="space-x-8 font-mono">
                    <span className="text-slate-900 dark:text-white font-medium">₹1,90,000</span>
                    <span className="w-12 inline-block text-right">1.0%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Transport</span>
                  <div className="space-x-8 font-mono">
                    <span className="text-slate-900 dark:text-white font-medium">₹1,40,000</span>
                    <span className="w-12 inline-block text-right">0.8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total running expenses */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-bold text-slate-900 dark:text-white">
              <span>Total running expenses</span>
              <div className="space-x-8 font-mono">
                <span>₹14,20,000</span>
                <span className="w-12 inline-block text-right text-slate-400">7.7%</span>
              </div>
            </div>

            {/* Final Net profit Highlight */}
            <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-700 flex justify-between items-center font-extrabold text-slate-900 dark:text-white text-sm">
              <span className="text-emerald-700 dark:text-emerald-400 font-black">Net profit</span>
              <div className="space-x-8 font-mono text-emerald-700 dark:text-emerald-400 font-black">
                <span>₹31,80,000</span>
                <span className="w-12 inline-block text-right">17.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Statements Catalog */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Statements</h2>
            <span className="text-xs text-slate-400 font-medium">For the same period</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {statementsList.map((st) => (
              <div key={st.title} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white leading-tight truncate">
                    {st.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{st.desc}</div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => alert(`Opening ${st.title} statement...`)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading ${st.title} Excel/PDF...`)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
                    title="Download Statement"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}