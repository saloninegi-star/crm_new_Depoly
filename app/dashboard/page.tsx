'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Truck,
  Scale,
  Warehouse,
  Cog,
  Package,
  Send,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  Wallet,
  Building,
  CreditCard,
  FileSpreadsheet,
  Gauge,
  Droplets,
  Layers,
  Flame,
  FileCheck,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentTheme } = useTheme();
  const [role, setRole] = useState('superadmin');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const directRole = localStorage.getItem('user_role');
    if (directRole) {
      setRole(directRole);
    }
  }, []);

  // =========================================================================
  // 1. GATE GUARD DASHBOARD (PDF Page 1 & 2: Checkpoint #1)
  // =========================================================================
  if (role === 'gate_guard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-400">Today Vehicles Entered</span>
            <div className="text-2xl font-black text-slate-900">18 Trucks</div>
            <div className="text-[11px] text-slate-400">Checkpoint #1: Traceability Started</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-400">In Weighbridge Queue</span>
            <div className="text-2xl font-black text-amber-600">4 Trucks</div>
            <div className="text-[11px] text-slate-400">Gross Wt Pending</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-400">Inside Mill Premises</span>
            <div className="text-2xl font-black text-blue-600">7 Vehicles</div>
            <div className="text-[11px] text-slate-400">Unloading in Godowns</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-400">Tare & Exit Stamped</span>
            <div className="text-2xl font-black text-emerald-600">11 Trucks</div>
            <div className="text-[11px] text-slate-400">Exit Cleared Today</div>
          </div>
        </div>

        {/* Live Token Queue Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Gate Checkpoint Live Queue (Tokens)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3">Token</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Farmer / Source</th>
                  <th className="pb-3">Variety</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { token: '#TK-4825', time: '14:22 PM', vehicle: 'HR 45 B 9811', farmer: 'Surinder Pal', variety: 'PR-126 Paddy', status: 'Token Issued' },
                  { token: '#TK-4824', time: '14:05 PM', vehicle: 'DL 01 AB 7741', farmer: 'Gurmeet Farm', variety: '1509 Basmati', status: 'Weighbridge Line' },
                  { token: '#TK-4823', time: '13:40 PM', vehicle: 'UP 14 TT 1029', farmer: 'Rameshwar Lal', variety: 'Sharbati Paddy', status: 'Gross Weight Done' },
                ].map((row) => (
                  <tr key={row.token} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{row.token}</td>
                    <td className="py-3 font-mono">{row.time}</td>
                    <td className="py-3 font-mono font-bold">{row.vehicle}</td>
                    <td className="py-3">{row.farmer}</td>
                    <td className="py-3">{row.variety}</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. WEIGHBRIDGE OPERATOR DASHBOARD (PDF Page 2: Weighment & Moisture Cut)
  // =========================================================================
  if (role === 'weighbridge') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 text-white shadow-md flex flex-col justify-between border border-slate-800">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-mono">
              <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4 animate-pulse" /> SCALE #01 DIGITAL</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">Stable 60MT</span>
            </div>
            <div className="text-center py-6">
              <div className="font-mono text-5xl font-black text-white">38,420 <span className="text-xl text-slate-400 font-bold">KG</span></div>
              <div className="text-xs text-slate-400 font-mono mt-1">38.42 Metric Tonnes</div>
            </div>
            <div className="text-xs text-slate-400 flex justify-between border-t border-slate-800 pt-3">
              <span>Platform: Pitless Heavy</span>
              <span className="text-emerald-400 font-semibold">Moisture Base: 14.0%</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-400">Waiting Gross Wt</span>
              <div className="text-2xl font-black text-amber-600">4 Trucks</div>
              <div className="text-[11px] text-slate-400">Loaded arrivals</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-400">Waiting Tare Wt</span>
              <div className="text-2xl font-black text-blue-600">2 Trucks</div>
              <div className="text-[11px] text-slate-400">Empty / Unloaded</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-400">Today Net Paddy</span>
              <div className="text-2xl font-black text-slate-900">84.4 MT</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Auto-calculated</div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Weighment Register & Moisture Deductions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3">Token</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Gross (KG)</th>
                  <th className="pb-3">Tare (KG)</th>
                  <th className="pb-3">Net Paddy (KG)</th>
                  <th className="pb-3">Moisture %</th>
                  <th className="pb-3">Godown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { token: '#TK-4821', vehicle: 'HR 38 AA 4921', gross: 38450, tare: 13650, net: 24800, moisture: 14.2, godown: 'Godown #01' },
                  { token: '#TK-4822', vehicle: 'PB 11 BC 8312', gross: 44200, tare: 13000, net: 31200, moisture: 13.8, godown: 'Godown #02' },
                  { token: '#TK-4823', vehicle: 'UP 14 TT 1029', gross: 42100, tare: 13700, net: 28400, moisture: 15.2, godown: 'Godown #03' },
                ].map((row) => (
                  <tr key={row.token} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{row.token}</td>
                    <td className="py-3 font-mono">{row.vehicle}</td>
                    <td className="py-3 font-mono">{row.gross.toLocaleString()} KG</td>
                    <td className="py-3 font-mono">{row.tare.toLocaleString()} KG</td>
                    <td className="py-3 font-mono font-bold text-emerald-700">{row.net.toLocaleString()} KG</td>
                    <td className="py-3">{row.moisture}%</td>
                    <td className="py-3">{row.godown}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. PADDY GODOWN IN-CHARGE (PDF Page 2: Paddy Stock & FIFO Queue)
  // =========================================================================
  if (role === 'paddy_stock') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Paddy in Stock</span>
            <div className="text-2xl font-black text-slate-900">2,410 MT</div>
            <div className="text-[11px] text-blue-600 font-semibold">Across 3 Godowns</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">FIFO Queue for Milling</span>
            <div className="text-2xl font-black text-amber-600">Lot #849 Next</div>
            <div className="text-[11px] text-slate-400">1st In &rarr; 1st Out Tracking</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Today Received Lots</span>
            <div className="text-2xl font-black text-emerald-600">428.5 MT</div>
            <div className="text-[11px] text-slate-400">Godown mapped</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Godown Lot Mapping & Stock Ledgers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between font-bold text-xs"><span>Godown #01 (Basmati)</span><span className="text-emerald-700">820 MT</span></div>
              <div className="text-[11px] text-slate-400">Lots: #845, #847 (1121 & 1509)</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between font-bold text-xs"><span>Godown #02 (PR Paddy)</span><span className="text-emerald-700">1,140 MT</span></div>
              <div className="text-[11px] text-slate-400">Lots: #849, #850 (PR-126 & PR-114)</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between font-bold text-xs"><span>Godown #03 (Buffer)</span><span className="text-emerald-700">450 MT</span></div>
              <div className="text-[11px] text-slate-400">Lots: #851 (Sharbati)</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. MILLING SUPERVISOR (PDF Page 3 & 4: Milling, Yield 60-65% & Byproducts)
  // =========================================================================
  if (role === 'milling') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Current Recovery Rate</span>
            <div className="text-2xl font-black text-slate-900">64.8%</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Standard 60-65% Target OK</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Active Batch Running</span>
            <div className="text-2xl font-black text-amber-600">Batch #B-102</div>
            <div className="text-[11px] text-slate-400">Machine Line #1 & #2 Active</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Shift Paddy Issued</span>
            <div className="text-2xl font-black text-slate-900">120 MT</div>
            <div className="text-[11px] text-slate-400">Shift #1 (Morning)</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Milling Split & Output Yield Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs text-emerald-800 font-bold">Head Rice (Grade A)</div>
              <div className="text-xl font-black text-emerald-900">61.2%</div>
              <div className="text-[10px] text-emerald-700">Auto-moves to Packaging</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-xs text-amber-800 font-bold">Broken Rice</div>
              <div className="text-xl font-black text-amber-900">11.4%</div>
              <div className="text-[10px] text-amber-700">Small / Big Broken split</div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
              <div className="text-xs text-teal-800 font-bold">Rice Bran (Oil)</div>
              <div className="text-xl font-black text-teal-900">8.6%</div>
              <div className="text-[10px] text-teal-700">Solvent extraction sale</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
              <div className="text-xs text-slate-700 font-bold">Husk (Boiler Fuel)</div>
              <div className="text-xl font-black text-slate-900">18.8%</div>
              <div className="text-[10px] text-slate-500">Boiler running stock</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. PACKAGING & FINISHED STOCK (PDF Page 4: Bagging 20/50kg)
  // =========================================================================
  if (role === 'finished_stock') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Bags Packed Today</span>
            <div className="text-2xl font-black text-slate-900">1,840 Bags</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Quality Passed</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">50kg Master Bags</span>
            <div className="text-2xl font-black text-blue-600">1,200 Bags</div>
            <div className="text-[11px] text-slate-400">Central Finished Godown</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">20kg Retail Packs</span>
            <div className="text-2xl font-black text-amber-600">640 Bags</div>
            <div className="text-[11px] text-slate-400">Ready for dispatch</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Grade-wise Finished Stock (Central Godown)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3">Batch Code</th>
                  <th className="pb-3">Grade / Product</th>
                  <th className="pb-3">Packing Type</th>
                  <th className="pb-3">Stock (Bags)</th>
                  <th className="pb-3">Net Metric Tonnes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { batch: '#B-101', grade: 'Grade A Head Rice (Basmati 1121)', pack: '50 KG HDPE', bags: 940, mt: '47.0 MT' },
                  { batch: '#B-102', grade: 'Grade A Head Rice (PR-126)', pack: '20 KG Non-Woven', bags: 520, mt: '10.4 MT' },
                  { batch: '#B-098', grade: 'Broken Rice (Secondary)', pack: '50 KG Bag', bags: 380, mt: '19.0 MT' },
                ].map((row) => (
                  <tr key={row.batch} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{row.batch}</td>
                    <td className="py-3 font-semibold">{row.grade}</td>
                    <td className="py-3">{row.pack}</td>
                    <td className="py-3 font-mono font-bold">{row.bags} Bags</td>
                    <td className="py-3 font-mono text-emerald-700">{row.mt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. SALES & DISPATCH IN-CHARGE (PDF Page 4: Sales Order & LR / Bilty)
  // =========================================================================
  if (role === 'sales_dispatch') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Today Sales Dispatches</span>
            <div className="text-2xl font-black text-slate-900">₹42.8 Lakh</div>
            <div className="text-[11px] text-emerald-600 font-semibold">12 Trucks Cleared</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Loading Slips Issued</span>
            <div className="text-2xl font-black text-blue-600">3 Trucks Loading</div>
            <div className="text-[11px] text-slate-400">At finished godown</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Pending Sales Orders</span>
            <div className="text-2xl font-black text-amber-600">5 Orders</div>
            <div className="text-[11px] text-slate-400">Bilty to generate</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">LR / Bilty Created</span>
            <div className="text-2xl font-black text-slate-900">12 Slips</div>
            <div className="text-[11px] text-emerald-600">Transporter assigned</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Live Sales Orders & LR Dispatch Queue</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Buyer / Party</th>
                  <th className="pb-3">Truck Number</th>
                  <th className="pb-3">LR / Bilty No</th>
                  <th className="pb-3">Qty (MT)</th>
                  <th className="pb-3">Invoice Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { order: '#SO-1089', party: 'Shree Krishna Traders (Delhi)', truck: 'HR 55 C 2019', lr: 'LR-8921', qty: '32.0 MT', status: 'Dispatched & Billed' },
                  { order: '#SO-1090', party: 'Aggarwal Foods (Kanpur)', truck: 'UP 78 BT 4101', lr: 'LR-8922', qty: '28.0 MT', status: 'Loading in Progress' },
                  { order: '#SO-1091', party: 'Jai Bharat Rice Overseas', truck: 'PB 10 X 7712', lr: 'LR-8923', qty: '35.0 MT', status: 'Weighment Check' },
                ].map((row) => (
                  <tr key={row.order} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{row.order}</td>
                    <td className="py-3 font-semibold">{row.party}</td>
                    <td className="py-3 font-mono">{row.truck}</td>
                    <td className="py-3 font-mono text-blue-700 font-bold">{row.lr}</td>
                    <td className="py-3 font-mono">{row.qty}</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. ACCOUNTS OFFICER / CASHIER (PDF Page 5 & 6: Cash, Bank, Ledger & Tax)
  // =========================================================================
  if (role === 'accounts') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Cash in Hand / Counter</span>
            <div className="text-2xl font-black text-slate-900">₹3,45,200</div>
            <div className="text-[11px] text-slate-400">Daily Cash Book closed</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Bank Balance (RTGS/NEFT)</span>
            <div className="text-2xl font-black text-blue-600">₹48,92,400</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Reconciled</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Buyer Receivables</span>
            <div className="text-2xl font-black text-amber-600">₹18,40,000</div>
            <div className="text-[11px] text-amber-600">Overdue alerts active</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Farmer Payables & Due</span>
            <div className="text-2xl font-black text-rose-600">₹12,75,000</div>
            <div className="text-[11px] text-slate-400">Purchase settlement</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Mill Running Expenses (PDF Note 5)</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Electricity & Power (Discom)</span><span className="font-bold">₹1,85,000</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Labour & Unloading Charges</span><span className="font-bold">₹64,200</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Machine Maintenance & Oil</span><span className="font-bold">₹22,400</span></div>
              <div className="flex justify-between pt-1 font-bold text-slate-900"><span>Total Direct Running Expenses</span><span className="text-rose-600">₹2,71,600</span></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">GST, Ledger & Trial Balance (PDF Note 6)</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Output GST on Rice Sales</span><span className="font-bold text-emerald-700">₹2,14,000</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Input Tax Credit (ITC) Available</span><span className="font-bold">₹82,400</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Day Book Status</span><span className="font-bold text-blue-700">Balanced & Closed</span></div>
              <div className="flex justify-between pt-1 font-bold text-slate-900"><span>Net GST Payable</span><span className="text-slate-900">₹1,31,600</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. SUPERADMIN / OWNER DASHBOARD (PDF Pages 1 to 6 Complete Overview)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* PDF Top 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Today Paddy Inward</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">428.5 MT</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14%
            </span>
          </div>
          <div className="text-[11px] text-slate-400">18 Trucks checked in at gate</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Milling Recovery Rate</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Cog className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">64.8%</span>
            <span className="text-xs font-semibold text-slate-500">Target 60-65%</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">Head Rice: 61.2% (Grade A)</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Live Godown Stock</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">2,410 MT</span>
            <span className="text-xs font-bold text-blue-600">FIFO Queue</span>
          </div>
          <div className="text-[11px] text-slate-400">Godown #02 & #03 Active</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Today Dispatches (LR)</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹42.8L</span>
            <span className="text-xs font-bold text-emerald-600">12 Trucks</span>
          </div>
          <div className="text-[11px] text-slate-400">Bilty & LR auto-generated</div>
        </div>
      </div>

      {/* Operational Pipeline Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Mill Operation Flow</h2>
              <p className="text-xs text-slate-400">Paddy Inward &rarr; Production &rarr; Inventory &rarr; Dispatch</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Flowchart Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { title: 'Gate Inward', status: '4 Queued (Tokens #4825)', icon: Truck },
              { title: 'Weighbridge', status: 'Gross / Tare Auto-Calc', icon: Scale },
              { title: 'Paddy Stock', status: 'FIFO Lot #849 Godown 2', icon: Warehouse },
              { title: 'Milling Shift', status: 'Batch #B-102 Running', icon: Cog },
              { title: 'Finished Stock', status: '20/50kg Bagging Ready', icon: Package },
              { title: 'Sale & Dispatch', status: 'Loading Slip & LR Generated', icon: Send },
            ].map((step) => {
              const StepIcon = step.icon;
              return (
                <div key={step.title} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <StepIcon className="w-4 h-4 text-slate-600" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{step.title}</div>
                    <div className="text-[10px] text-slate-400">{step.status}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-600">Quick Mill Actions</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-xl text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: currentTheme.buttonBg }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Gate Entry</span>
              </button>
              <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
                Record Weighment
              </button>
              <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
                Issue Lot to Mill
              </button>
            </div>
          </div>
        </div>

        {/* Milling Yield Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Milling Yield Breakdown</h2>
            <p className="text-xs text-slate-400">Head Rice, Broken & Byproducts Ratio</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Head Rice (Grade A - 60-65%)', percent: 61.2, color: 'bg-emerald-500' },
              { label: 'Broken Rice (10-12%)', percent: 11.4, color: 'bg-amber-500' },
              { label: 'Rice Bran (Oil extraction)', percent: 8.6, color: 'bg-teal-500' },
              { label: 'Husk (Boiler / Fuel)', percent: 18.8, color: 'bg-slate-400' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-900">{item.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
            <strong>PDF Keypoint:</strong> Main product recovery 60-65% target ke andar chal rahi hai. Byproducts direct margin contribute kar rahe hain.
          </div>
        </div>
      </div>

      {/* Bottom Accounts Layer */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PDF Note 4
              </span>
              <h2 className="text-base font-bold text-white">Full Accounts Layer (Real-time Operations)</h2>
            </div>
            <p className="text-xs text-slate-400">Cash, Bank, Party-wise Receivables, Farmer Payables & Expenses</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Ledger Status: Reconciled</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Cash & Petty Cash</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white">₹3,45,200</div>
            <div className="text-[10px] text-slate-400">Daily Cash Book & Counter Sales</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Bank RTGS / NEFT</span>
              <Building className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-black text-white">₹48,92,400</div>
            <div className="text-[10px] text-slate-400">Farmer payments & RTGS cleared</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Buyer Receivables</span>
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white">₹18,40,000</div>
            <div className="text-[10px] text-amber-400 font-medium">Party-wise outstanding alerts</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Farmer Payables & Exp.</span>
              <FileSpreadsheet className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-black text-white">₹12,75,000</div>
            <div className="text-[10px] text-slate-400">Electricity, Labour & Mandi Due</div>
          </div>
        </div>
      </div>
    </div>
  );
}