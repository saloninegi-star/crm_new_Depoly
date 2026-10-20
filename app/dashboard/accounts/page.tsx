'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Calculator,
  Wallet,
  Building,
  CreditCard,
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  FileText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Coins,
  ShieldCheck,
  Check,
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

export default function AccountsLedgersPage() {
  const { currentTheme } = useTheme();
  const [role, setRole] = useState('superadmin');
  const [activeTab, setActiveTab] = useState<'overview' | 'receivables' | 'payables' | 'cash_bank' | 'expenses'>('overview');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const directRole = localStorage.getItem('user_role');
    const kognosRole = localStorage.getItem('kognos_role');
    setRole(getNormalizedRole(directRole || kognosRole));
  }, []);

  const isOwner = role === 'superadmin';

  // Voucher Form State
  const [voucherForm, setVoucherForm] = useState({
    voucherType: 'Payment (Bank RTGS)',
    partyName: '',
    amount: '',
    narration: '',
  });

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Voucher ${voucherForm.voucherType} for ₹${voucherForm.amount} posted successfully!`);
    setIsVoucherModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header based on Role */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span
            className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: currentTheme.buttonBg }}
          >
            {isOwner ? 'Owner Financial Governance' : 'Accounts Ledger & Bookkeeping Desk'}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {isOwner ? 'Mill Financial Governance & Ledgers' : 'Accounts, Ledgers & Voucher Desk'}
          </h1>
          <p className="text-xs text-slate-500">
            {isOwner
              ? 'Executive oversight of cash flow, supplier payables audit, and high-value RTGS approvals'
              : 'Post daily vouchers, balance cash book denominations, and reconcile farmer RTGS transfers'}
          </p>
        </div>

        {/* Action Button: Owner gets "Approve Payouts", Accountant gets "+ Record Voucher" */}
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => alert('All pending farmer RTGS vouchers approved for bank dispatch!')}
              className="px-3.5 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 bg-emerald-50 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve Pending RTGS (₹8.4L)</span>
            </button>
          )}

          <button
            onClick={() => setIsVoucherModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            style={{ backgroundColor: currentTheme.buttonBg }}
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Voucher Entry</span>
          </button>
        </div>
      </div>

      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span className="font-semibold">Cash in Hand (Petty Cash)</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹3,45,200</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Daily Cash Book Closed</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span className="font-semibold">Bank Balance (RTGS/NEFT)</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">₹48,92,400</div>
          <div className="text-[11px] text-slate-400">HDFC & PNB Operating Account</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span className="font-semibold">Buyer Receivables (Sales)</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">₹18,40,000</div>
          <div className="text-[11px] text-amber-700 font-bold">2 Parties Overdue Alert</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span className="font-semibold">Farmer & Mandi Payables</span>
            <FileSpreadsheet className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">₹12,75,000</div>
          <div className="text-[11px] text-slate-400">Paddy purchase settlements</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'Financial Overview' },
          { id: 'payables', label: 'Farmer & Supplier Payables' },
          { id: 'receivables', label: 'Buyer Receivables' },
          { id: 'cash_bank', label: 'Cash Book & Bank Reconcile' },
          { id: 'expenses', label: 'Mill Running Expenses' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? currentTheme.buttonBg : undefined,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & PAYMENTS PIPELINE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Operations Payment Pipeline </h2>
                <p className="text-xs text-slate-400">Auto-linked from Paddy Purchase & Rice Sales to Cash/Bank ledger</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ledger Synchronized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1. Farmer Payments (Paddy)</span>
                  <span className="font-bold text-rose-600">Due Today</span>
                </div>
                <div className="text-xl font-bold text-slate-900">₹8,40,000</div>
                <div className="text-[11px] text-slate-400">Direct Bank RTGS transfer</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>2. Transport & Freight</span>
                  <span className="font-bold text-blue-600">12 Trucks</span>
                </div>
                <div className="text-xl font-bold text-slate-900">₹1,18,000</div>
                <div className="text-[11px] text-slate-400">Bilty & LR auto-cleared</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>3. Mandi Commission (Arhat)</span>
                  <span className="font-bold text-amber-600">Rate 1.5%</span>
                </div>
                <div className="text-xl font-bold text-slate-900">₹45,200</div>
                <div className="text-[11px] text-slate-400">Agent brokerage credit</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Outstanding Buyer Receivables</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-amber-950">Shree Krishna Traders (Delhi)</div>
                    <div className="text-[10px] text-amber-800">Invoice #INV-401 • Overdue by 12 Days</div>
                  </div>
                  <span className="font-mono font-bold text-amber-950">₹7,50,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">Aggarwal Foods (Kanpur)</div>
                    <div className="text-[10px] text-slate-400">Due in 5 days</div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹6,20,000</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Pending Farmer Purchase Dues</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">Baldev Singh (Taraori Lot #848)</div>
                    <div className="text-[10px] text-slate-400">Net Paddy: 24.8 MT • Rate: ₹3,400/Qtl</div>
                  </div>
                  <span className="font-mono font-bold text-rose-600">₹8,43,200</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">Rameshwar Lal (Hapur Lot #851)</div>
                    <div className="text-[10px] text-slate-400">Net of Moisture Cut</div>
                  </div>
                  <span className="font-mono font-bold text-rose-600">₹4,31,800</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYABLES */}
      {activeTab === 'payables' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Farmer & Vendor Payables Ledger (Paddy Purchase)</h2>
            <span className="text-xs font-bold text-rose-600">Total Outstanding: ₹12,75,000</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3">Lot Code</th>
                  <th className="pb-3">Farmer / Vendor Name</th>
                  <th className="pb-3">Mandi Source</th>
                  <th className="pb-3">Net Paddy (MT)</th>
                  <th className="pb-3">Purchase Rate</th>
                  <th className="pb-3">Total Payable</th>
                  <th className="pb-3">Payment Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { lot: 'LOT-848', farmer: 'Baldev Singh (Taraori)', mandi: 'Direct Farm', weight: '24.8 MT', rate: '₹3,400 / Qtl', total: '₹8,43,200', status: 'Payment Due' },
                  { lot: 'LOT-851', farmer: 'Rameshwar Lal', mandi: 'Hapur Mandi', weight: '28.0 MT', rate: '₹3,100 / Qtl', total: '₹4,31,800', status: 'Partially Paid' },
                  { lot: 'LOT-845', farmer: 'Surinder Pal', mandi: 'Karnal Mandi', weight: '31.2 MT', rate: '₹3,250 / Qtl', total: '₹10,14,000', status: 'RTGS Cleared' },
                ].map((row) => (
                  <tr key={row.lot} className="hover:bg-slate-50/70">
                    <td className="py-3.5 font-bold font-mono text-slate-900">{row.lot}</td>
                    <td className="py-3.5 font-semibold text-slate-900">{row.farmer}</td>
                    <td className="py-3.5 text-slate-600">{row.mandi}</td>
                    <td className="py-3.5 font-mono">{row.weight}</td>
                    <td className="py-3.5">{row.rate}</td>
                    <td className="py-3.5 font-mono font-bold text-rose-600">{row.total}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        row.status === 'RTGS Cleared' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-[11px] font-bold text-blue-700 hover:underline">
                        {isOwner ? 'Approve & Release' : 'Initiate RTGS &rarr;'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RECEIVABLES */}
      {activeTab === 'receivables' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Buyer Outstanding Receivables (Sales)</h2>
            <span className="text-xs font-bold text-amber-700">Total Receivables: ₹18,40,000</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">Buyer / Company</th>
                  <th className="pb-3">Product Supplied</th>
                  <th className="pb-3">Total Billed</th>
                  <th className="pb-3">Balance Due</th>
                  <th className="pb-3">Aging</th>
                  <th className="pb-3">Alert Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { inv: 'INV-401', party: 'Shree Krishna Traders (Delhi)', product: 'Basmati 1121 (32 MT)', total: '₹15,50,000', due: '₹7,50,000', days: 'Overdue +12d', status: 'Urgent Overdue' },
                  { inv: 'INV-403', party: 'Aggarwal Foods (Kanpur)', product: 'PR-126 Grade A (28 MT)', total: '₹8,96,000', due: '₹6,20,000', days: 'Due in 5d', status: 'Payment Normal' },
                ].map((row) => (
                  <tr key={row.inv} className="hover:bg-slate-50/70">
                    <td className="py-3.5 font-bold font-mono text-slate-900">{row.inv}</td>
                    <td className="py-3.5 font-semibold text-slate-900">{row.party}</td>
                    <td className="py-3.5 text-slate-600">{row.product}</td>
                    <td className="py-3.5 font-mono">{row.total}</td>
                    <td className="py-3.5 font-mono font-bold text-amber-700">{row.due}</td>
                    <td className="py-3.5 font-mono text-slate-600">{row.days}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-[11px] font-bold text-emerald-700 hover:underline">
                        Send Notice &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CASH BOOK & BANK */}
      {activeTab === 'cash_bank' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Daily Cash Book & Denomination Closing</h3>
                <p className="text-[11px] text-slate-400">Denomination-wise closing for cash counter & petty cash</p>
              </div>
              <span className="text-xs font-bold text-emerald-700">₹3,45,200</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { note: '₹500 Notes', count: 640, total: '₹3,20,000' },
                { note: '₹200 Notes', count: 95, total: '₹19,000' },
                { note: '₹100 Notes', count: 58, total: '₹5,800' },
                { note: '₹50 Notes', count: 8, total: '₹400' },
              ].map((d) => (
                <div key={d.note} className="p-2.5 rounded-xl bg-slate-50 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{d.note}</span>
                  <span className="text-slate-500 font-mono">{d.count} pcs</span>
                  <span className="font-mono font-bold text-slate-900">{d.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Bank Statement & RTGS Reconcile</h3>
                <p className="text-[11px] text-slate-400">Direct farmer RTGS transfers & sales receipts</p>
              </div>
              <span className="text-xs font-bold text-blue-700">HDFC: ₹48,92,400</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { ref: 'UTR-9012', desc: 'Farmer Payment (Baldev Singh)', amount: '-₹8,43,200', status: 'Cleared' },
                { ref: 'NEFT-8812', desc: 'Rice Sale Inward (Aggarwal Foods)', amount: '+₹4,50,000', status: 'Reconciled' },
                { ref: 'NEFT-7711', desc: 'Electricity Bill Payment', amount: '-₹1,85,000', status: 'Cleared' },
              ].map((b) => (
                <div key={b.ref} className="p-2.5 rounded-xl bg-slate-50 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">{b.desc}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.ref}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">{b.amount}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{b.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Mill Running Expenses (PDF Note 5)</h2>
            <span className="text-xs font-bold text-rose-600">Total: ₹2,71,600</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-800">1. Electricity & Power</span>
              <div className="text-2xl font-black text-slate-900">₹1,85,000</div>
              <p className="text-[11px] text-slate-400">Monthly Discom power bill</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-800">2. Palledar Labour</span>
              <div className="text-2xl font-black text-slate-900">₹64,200</div>
              <p className="text-[11px] text-slate-400">Bag unloading & godown stacking</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-800">3. Machine Maintenance</span>
              <div className="text-2xl font-black text-slate-900">₹22,400</div>
              <p className="text-[11px] text-slate-400">Rubber rollers & spare parts</p>
            </div>
          </div>
        </div>
      )}

      {/* VOUCHER MODAL */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Record Accounting Voucher</h3>
                <p className="text-[11px] text-slate-400">Post directly to Cash, Bank, or Expenses</p>
              </div>
              <button onClick={() => setIsVoucherModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVoucherSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Voucher Type</label>
                <select
                  value={voucherForm.voucherType}
                  onChange={(e) => setVoucherForm({ ...voucherForm, voucherType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                >
                  <option value="Payment (Bank RTGS)">Payment Voucher (Bank RTGS)</option>
                  <option value="Receipt (Sales NEFT)">Receipt Voucher (Sales Inflow)</option>
                  <option value="Cash Voucher (Petty Cash)">Cash Voucher (Petty Cash)</option>
                  <option value="Expense Voucher">Mill Expense Voucher</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Party / Account Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baldev Singh / Electricity"
                    value={voucherForm.partyName}
                    onChange={(e) => setVoucherForm({ ...voucherForm, partyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={voucherForm.amount}
                    onChange={(e) => setVoucherForm({ ...voucherForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsVoucherModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white font-bold" style={{ backgroundColor: currentTheme.buttonBg }}>
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