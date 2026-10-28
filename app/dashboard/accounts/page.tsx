'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Wallet,
  Building,
  CreditCard,
  FileSpreadsheet,
  Plus,
  Check,
  Clock,
  X,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

// Hydration-safe deterministic Indian number formatting [1, 2]
function formatNumber(num: number): string {
  if (!num && num !== 0) return '0';
  const str = Math.round(num).toString();
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
}

export default function AccountsPage() {
  const { accent } = useTheme();

  const [activeTab, setActiveTab] = useState<'overview' | 'payables' | 'receivables' | 'cash_bank' | 'expenses'>('overview');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isHeld, setIsHeld] = useState(false);

  // New Voucher State
  const [voucherType, setVoucherType] = useState('Payment (Bank RTGS)');
  const [voucherParty, setVoucherParty] = useState('');
  const [voucherAmount, setVoucherAmount] = useState('');

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVoucherModalOpen(false);
    setVoucherParty('');
    setVoucherAmount('');
  };

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* 0. Top Action Bar with "+ New voucher" button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Cash, bank, payments and dues · Live Financial Ledger
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsVoucherModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-transform active:scale-95 hover:opacity-95"
          style={{ backgroundColor: accent?.primary || '#0d9488' }}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New voucher</span>
        </button>
      </div>

      {/* 1. TOP 4-CARD METRIC STRIP (WITH COLORFUL ICONS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash in hand (Emerald) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Cash in hand</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Wallet className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹3,45,200
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            Cash book closed for 23 Oct
          </p>
        </div>

        {/* In bank (Sky Blue) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">In bank</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Building className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹48,92,400
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
            2 accounts
          </p>
        </div>

        {/* To receive (Amber) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">To receive</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹18,40,000
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            3 buyers · 1 overdue
          </p>
        </div>

        {/* To pay (Purple/Rose) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">To pay</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <FileSpreadsheet className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹16,81,000
            </span>
          </div>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            2 farmers · ₹8,43,200 due today
          </p>
        </div>
      </div>

      {/* 2. NAVIGATION TABS (MATCHING SCREENSHOT) */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'payables', label: 'Farmer payables' },
          { id: 'receivables', label: 'Buyer receivables' },
          { id: 'cash_bank', label: 'Cash book and bank' },
          { id: 'expenses', label: 'Expenses' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`cursor-pointer transition-all pb-1 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-slate-900 dark:text-white font-bold border-b-2'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            style={{
              borderColor: activeTab === tab.id ? (accent?.primary || '#0d9488') : 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. SECTION: WAITING FOR YOUR APPROVAL */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Waiting for your approval
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-900">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            1 payment
          </span>
        </div>

        {/* Approval Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              RTGS to Baldev Singh
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Lot L-0848 · 24.8 t at ₹3,400 per quintal · from HDFC to SBI account ending 4471
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">
              ₹8,43,200
            </span>

            {isApproved ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Approved
              </span>
            ) : isHeld ? (
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
                Payment Held
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsHeld(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  Hold
                </button>
                <button
                  type="button"
                  onClick={() => setIsApproved(true)}
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  Approve payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. TWO COLUMNS ("To pay" & "To receive") */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: To pay Card */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">To pay</h2>
            <button
              type="button"
              className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              All payables
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
            {/* Row 1 */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Baldev Singh, Taraori</div>
                <div className="text-[11px] text-slate-400">Lot L-0848 · due today</div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                ₹8,43,200
              </span>
            </div>

            {/* Row 2 */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Rameshwar Lal, Hapur</div>
                <div className="text-[11px] text-slate-400">Lot L-0850 · due 27 Oct</div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                ₹8,37,800
              </span>
            </div>

            {/* Total Row */}
            <div className="pt-3.5 flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span className="font-bold text-xs">Total</span>
              <span className="font-mono text-sm font-black">₹16,81,000</span>
            </div>
          </div>
        </div>

        {/* Right: To receive Card */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">To receive</h2>
            <button
              type="button"
              className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              All receivables
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
            {/* Row 1 - Overdue (Amber alert text from screenshot) */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Shree Krishna Traders, Delhi
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  Overdue by 12 days · INV-401
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                ₹7,50,000
              </span>
            </div>

            {/* Row 2 */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Aggarwal Foods, Kanpur</div>
                <div className="text-[11px] text-slate-400">Due 29 Oct · INV-405</div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                ₹6,20,000
              </span>
            </div>

            {/* Row 3 */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Balaji Export House, Mundra
                </div>
                <div className="text-[11px] text-slate-400">Due 6 Nov · INV-409</div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                ₹4,70,000
              </span>
            </div>

            {/* Total Row */}
            <div className="pt-3.5 flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span className="font-bold text-xs">Total</span>
              <span className="font-mono text-sm font-black">₹18,40,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL: NEW VOUCHER */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111726] rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Record Accounting Voucher
                </h3>
                <p className="text-[11px] text-slate-400">
                  Post direct debit/credit to Cash Book or Bank ledger
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVoucherSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Voucher Type
                </label>
                <select
                  value={voucherType}
                  onChange={(e) => setVoucherType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  <option value="Payment (Bank RTGS)">Bank RTGS Payment (Farmer/Vendor)</option>
                  <option value="Receipt (Sales NEFT)">Sales Receipt Inward (Buyer)</option>
                  <option value="Cash Voucher (Petty Cash)">Cash Voucher (Daily Cash Book)</option>
                  <option value="Expense Voucher">Mill Operational Expense</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Party / Account Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baldev Singh / Electricity Discom"
                  value={voucherParty}
                  onChange={(e) => setVoucherParty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Voucher Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 843200"
                  value={voucherAmount}
                  onChange={(e) => setVoucherAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}