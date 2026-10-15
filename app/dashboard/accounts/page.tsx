'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Calculator, Wallet, Building, CreditCard, FileSpreadsheet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export default function AccountsLedgersPage() {
  const { currentTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: currentTheme.buttonBg }}>
            PDF Notes 4 & 5
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Full Accounts Layer (Real-time Operations)</h1>
          <p className="text-xs text-slate-500">Underneath all operations: Cash book, Bank RTGS, Party-wise Receivables & Farmer Payables</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs" style={{ backgroundColor: currentTheme.buttonBg }}>
          <Plus className="w-4 h-4" />
          <span>+ Record Voucher Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Cash in Hand (Petty Cash)</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹3,45,200</div>
          <div className="text-[11px] text-slate-400">Daily Cash Book & Counter Sales</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Bank Balance (RTGS/NEFT)</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">₹48,92,400</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Farmer RTGS Reconciled</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Buyer Receivables</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">₹18,40,000</div>
          <div className="text-[11px] text-amber-600 font-medium">Party-wise outstanding alerts</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Farmer Payables & Dues</span>
            <FileSpreadsheet className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">₹12,75,000</div>
          <div className="text-[11px] text-slate-400">Paddy purchase settlement</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Mill Running Expenses (PDF Note 5)</h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center">
              <div><span className="font-bold">Electricity & Boiler Fuel</span><div className="text-[10px] text-slate-400">Monthly Discom & Husk burning</div></div>
              <span className="font-mono font-bold text-slate-900">₹1,85,000</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center">
              <div><span className="font-bold">Labour & Unloading Charges</span><div className="text-[10px] text-slate-400">Trolley & Godown stacking</div></div>
              <span className="font-mono font-bold text-slate-900">₹64,200</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center">
              <div><span className="font-bold">Machine Maintenance</span><div className="text-[10px] text-slate-400">Rubber rolls & oil spares</div></div>
              <span className="font-mono font-bold text-slate-900">₹22,400</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Party-wise Outstanding Receivables</h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex justify-between items-center">
              <div><span className="font-bold text-amber-900">Shree Krishna Traders</span><div className="text-[10px] text-amber-700">Due 12 Days (Overdue Alert)</div></div>
              <span className="font-mono font-bold text-amber-900">₹7,50,000</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center">
              <div><span className="font-bold">Aggarwal Foods (Kanpur)</span><div className="text-[10px] text-slate-400">Due in 5 days</div></div>
              <span className="font-mono font-bold text-slate-900">₹6,20,000</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center">
              <div><span className="font-bold">Jai Bharat Overseas</span><div className="text-[10px] text-slate-400">Partially paid</div></div>
              <span className="font-mono font-bold text-slate-900">₹4,70,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}