'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FileBarChart2, Printer, Download, TrendingUp, Calendar, FileText } from 'lucide-react';

export default function ReportsProfitLossPage() {
  const { currentTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: currentTheme.buttonBg }}>
            PDF Note 6
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Reports & P&L (Profit and Loss Statement)</h1>
          <p className="text-xs text-slate-500">Day book, Stock Summary, Milling margin analysis, GST ledger & Trial balance</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button className="px-3.5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-xs" style={{ backgroundColor: currentTheme.buttonBg }}>
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel / PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Net Revenue (Sales)</span>
          <div className="text-2xl font-black text-slate-900">₹1.84 Cr</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Head Rice + Byproducts</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Paddy Procurement Cost</span>
          <div className="text-2xl font-black text-rose-600">₹1.38 Cr</div>
          <div className="text-[11px] text-slate-400">Mandi + Farmer purchases</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Mill Operational Expenses</span>
          <div className="text-2xl font-black text-slate-900">₹14.2 Lakh</div>
          <div className="text-[11px] text-slate-400">Power, Labour & Maintenance</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Estimated Net Profit (P&L)</span>
          <div className="text-2xl font-black text-emerald-700">₹31.8 Lakh</div>
          <div className="text-[11px] text-emerald-600 font-bold">17.2% Net Margin</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Financial Reports & Statements Catalog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
            <div className="font-bold text-sm text-slate-900">Daily Cash Book & Day Summary</div>
            <p className="text-xs text-slate-500">Denomination-wise closing, petty cash and counter cash inflows.</p>
            <button className="text-xs font-bold text-emerald-700 hover:underline">View Statement &rarr;</button>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
            <div className="font-bold text-sm text-slate-900">Paddy & Finished Stock Summary</div>
            <p className="text-xs text-slate-500">Godown-wise balance, milling recovery losses and lot yields.</p>
            <button className="text-xs font-bold text-emerald-700 hover:underline">View Statement &rarr;</button>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
            <div className="font-bold text-sm text-slate-900">GST Output / Input Tax Ledger</div>
            <p className="text-xs text-slate-500">GSTR-1 sales invoices and GSTR-3B tax payment summary.</p>
            <button className="text-xs font-bold text-emerald-700 hover:underline">View Statement &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}