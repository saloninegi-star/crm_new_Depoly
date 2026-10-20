'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  FileBarChart2,
  Printer,
  Download,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  PieChart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const getNormalizedRole = (rawRole: string | null): string => {
  if (!rawRole) return 'superadmin';
  try {
    const parsed = JSON.parse(rawRole);
    if (parsed && typeof parsed === 'object' && parsed.id) {
      return getNormalizedRole(parsed.id);
    }
  } catch {}
  const clean = rawRole.toLowerCase().trim();
  if (clean === 'admin' || clean === 'owner' || clean === 'superadmin') {
    return 'superadmin';
  }
  return clean;
};

export default function ReportsProfitLossPage() {
  const { currentTheme } = useTheme();
  const [role, setRole] = useState('superadmin');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const directRole = localStorage.getItem('user_role');
    const kognosRole = localStorage.getItem('kognos_role');
    setRole(getNormalizedRole(directRole || kognosRole));
  }, []);

  const isOwner = role === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span
            className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: currentTheme.buttonBg }}
          >
            {isOwner ? 'Executive Audit & Profitability (PDF Note 6)' : 'Accounting & Tax Compliance Reports'}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {isOwner ? 'Executive Profit & Loss (P&L) & Margins' : 'Financial Reports, GST & Day Book'}
          </h1>
          <p className="text-xs text-slate-500">
            {isOwner
              ? 'Real-time Net Milling Margins, Head Rice vs Byproduct contribution, and audited profit statements'
              : 'Daily cash book summary, stock ledger reconciliation, GSTR-1 & GSTR-3B audit filing reports'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => alert('Financial ledger report exported to Excel!')}
            className="px-3.5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            style={{ backgroundColor: currentTheme.buttonBg }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isOwner ? 'Export Balance Sheet' : 'Export CA Report'}</span>
          </button>
        </div>
      </div>

      {/* Top Cards: Owner sees Net Profit Margins, Accountant sees Revenue & Cost balances */}
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
          <span className="text-xs font-semibold text-slate-400">
            {isOwner ? 'Estimated Net Profit (P&L)' : 'Net Operating Balance'}
          </span>
          <div className="text-2xl font-black text-emerald-700">₹31.8 Lakh</div>
          <div className="text-[11px] text-emerald-600 font-bold">17.2% Net Margin</div>
        </div>
      </div>

      {/* OWNER EXCLUSIVE: Byproduct Margin Contribution Audit (PDF Page 4 & 6) */}
      {isOwner && (
        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Byproduct Contribution to Profit Margin (PDF Page 4)</h2>
              <p className="text-xs text-slate-400">Husk boiler fuel savings and Bran oil extraction sales contribute directly to net margin</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              High Margin Driver
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <span className="text-slate-400">Rice Bran Sold (Oil Extraction)</span>
              <div className="text-xl font-bold text-emerald-400">₹6,80,000</div>
              <p className="text-[10px] text-slate-400">8.6% recovery sold directly to solvent plants</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <span className="text-slate-400">Husk Steam Energy Savings</span>
              <div className="text-xl font-bold text-blue-400">₹3,40,000</div>
              <p className="text-[10px] text-slate-400">Zero outside coal/fuel bought for boiler</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <span className="text-slate-400">Broken Rice Secondary Revenue</span>
              <div className="text-xl font-bold text-amber-400">₹7,20,000</div>
              <p className="text-[10px] text-slate-400">11.4% small & big broken sales</p>
            </div>
          </div>
        </div>
      )}

      {/* Statement Catalog */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          {isOwner ? 'Executive Audit & Compliance Catalog' : 'Accountant Statements & CA Audit Catalog'}
        </h2>
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