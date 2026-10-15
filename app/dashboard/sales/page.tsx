'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Send, Plus, Search, Truck, Printer, FileText, CheckCircle2 } from 'lucide-react';

export default function SalesDispatchPage() {
  const { currentTheme } = useTheme();

  const orders = [
    { orderId: '#SO-1089', party: 'Shree Krishna Traders (Delhi)', product: 'Basmati 1121 (50kg)', qty: '32.0 MT', truck: 'HR 55 C 2019', lrNo: 'LR-8921', status: 'Dispatched & Stamped' },
    { orderId: '#SO-1090', party: 'Aggarwal Foods (Kanpur Mandi)', product: 'PR-126 Grade A', qty: '28.0 MT', truck: 'UP 78 BT 4101', lrNo: 'LR-8922', status: 'Loading at Godown B' },
    { orderId: '#SO-1091', party: 'Jai Bharat Rice Overseas', product: '1121 Steam Basmati', qty: '35.0 MT', truck: 'PB 10 X 7712', lrNo: 'LR-8923', status: 'Weighment Check' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: currentTheme.buttonBg }}>
            PDF Checkpoint #6
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Sale & Dispatch (LR / Bilty Desk)</h1>
          <p className="text-xs text-slate-500">Pick from finished stock, generate loading slip, weighment for dispatch, and issue LR/Bilty</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs" style={{ backgroundColor: currentTheme.buttonBg }}>
          <Plus className="w-4 h-4" />
          <span>+ Create New Sales Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Today Sales Dispatches</span>
          <div className="text-2xl font-black text-slate-900">₹42.8 Lakh</div>
          <div className="text-[11px] text-emerald-600 font-semibold">12 Trucks Cleared</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Loading Slips Issued</span>
          <div className="text-2xl font-black text-blue-600">3 Trucks</div>
          <div className="text-[11px] text-slate-400">Loading in progress</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Lorry Receipts (LR) Today</span>
          <div className="text-2xl font-black text-slate-900">12 Slips</div>
          <div className="text-[11px] text-slate-400">Transporter mapped</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Transport & Commission</span>
          <div className="text-2xl font-black text-amber-600">₹84,200</div>
          <div className="text-[11px] text-slate-400">Auto-linked to Accounts</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Active Sales Orders & LR Bilty Register</h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input type="text" placeholder="Search party, LR no..." className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none w-52" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Buyer / Party Name</th>
                <th className="pb-3">Product Ordered</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Vehicle Number</th>
                <th className="pb-3">LR / Bilty No</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.map((o) => (
                <tr key={o.orderId} className="hover:bg-slate-50/70">
                  <td className="py-3.5 font-bold text-slate-900">{o.orderId}</td>
                  <td className="py-3.5 font-semibold text-slate-800">{o.party}</td>
                  <td className="py-3.5 text-slate-600">{o.product}</td>
                  <td className="py-3.5 font-mono font-bold text-emerald-700">{o.qty}</td>
                  <td className="py-3.5 font-mono">{o.truck}</td>
                  <td className="py-3.5 font-mono font-bold text-blue-700">{o.lrNo}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="px-2 py-1 rounded border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 ml-auto">
                      <Printer className="w-3 h-3" />
                      <span>Print LR</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}