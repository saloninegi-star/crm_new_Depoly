'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Package, Plus, Search, Tag, Layers, ArrowUpRight } from 'lucide-react';

export default function PackagingFinishedStockPage() {
  const { currentTheme } = useTheme();

  const stockItems = [
    { code: 'SKU-1121-50', item: 'Basmati 1121 Grade A', packType: '50 KG HDPE Woven', godown: 'Finished Godown A', bags: 1420, totalMt: '71.0 MT', price: '₹4,850 / Qtl' },
    { code: 'SKU-PR126-50', item: 'PR-126 Grade A Premium', packType: '50 KG Bag', godown: 'Finished Godown B', bags: 2100, totalMt: '105.0 MT', price: '₹3,200 / Qtl' },
    { code: 'SKU-PR126-20', item: 'PR-126 Retail Pack', packType: '20 KG Poly Bag', godown: 'Finished Godown B', bags: 950, totalMt: '19.0 MT', price: '₹1,320 / Bag' },
    { code: 'SKU-BRK-50', item: 'Broken Rice (Secondary)', packType: '50 KG Bag', godown: 'Byproduct Shed', bags: 640, totalMt: '32.0 MT', price: '₹2,200 / Qtl' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: currentTheme.buttonBg }}>
            PDF Checkpoint #5
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Finished Stock & Bagging Godown</h1>
          <p className="text-xs text-slate-500">Grade-wise stock, 20/50 kgs Bagging records, and live stock for sales order allocation</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs" style={{ backgroundColor: currentTheme.buttonBg }}>
          <Plus className="w-4 h-4" />
          <span>+ Record Daily Bagging Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Finished Stock</span>
          <div className="text-2xl font-black text-slate-900">227.0 MT</div>
          <div className="text-[11px] text-emerald-600 font-semibold">5,110 Total Bags</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">50kg Master Bags</span>
          <div className="text-2xl font-black text-blue-600">4,160 Bags</div>
          <div className="text-[11px] text-slate-400">Bulk Mandi & Export</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">20kg Retail Bags</span>
          <div className="text-2xl font-black text-amber-600">950 Bags</div>
          <div className="text-[11px] text-slate-400">Counter Sale Ready</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Ready for Dispatch</span>
          <div className="text-2xl font-black text-emerald-700">140 MT</div>
          <div className="text-[11px] text-slate-400">Locked for 3 Sales Orders</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Central Finished Godown Register</h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input type="text" placeholder="Search SKU, grade..." className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none w-52" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3">SKU Code</th>
                <th className="pb-3">Rice Grade / Variety</th>
                <th className="pb-3">Packing Specification</th>
                <th className="pb-3">Godown Location</th>
                <th className="pb-3">Bags Count</th>
                <th className="pb-3">Net Metric Tonnes</th>
                <th className="pb-3">Base Sale Rate</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {stockItems.map((s) => (
                <tr key={s.code} className="hover:bg-slate-50/70">
                  <td className="py-3.5 font-bold font-mono text-slate-900">{s.code}</td>
                  <td className="py-3.5 font-semibold text-slate-800">{s.item}</td>
                  <td className="py-3.5">{s.packType}</td>
                  <td className="py-3.5">{s.godown}</td>
                  <td className="py-3.5 font-mono font-bold text-blue-700">{s.bags.toLocaleString()}</td>
                  <td className="py-3.5 font-mono font-bold text-emerald-700">{s.totalMt}</td>
                  <td className="py-3.5">{s.price}</td>
                  <td className="py-3.5 text-right">
                    <button className="text-[11px] font-bold text-emerald-700 hover:underline">Pick for Sale &rarr;</button>
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