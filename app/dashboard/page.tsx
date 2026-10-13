'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Truck,
  Scale,
  Warehouse,
  Cog,
  Package,
  Send,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentTheme } = useTheme();

  return (
    <div className="space-y-6">
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
            <span className="text-xs font-semibold text-slate-500">Target 65%</span>
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
            <span className="text-xs font-semibold">Today Dispatches</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Mill Workflow Status</h2>
              <p className="text-xs text-slate-400">Paddy lifecycle from Gate to Accounts ledger</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              6 Pipelines Operational
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { title: 'Gate Inward', status: '4 Queued', icon: Truck, active: true },
              { title: 'Weighbridge', status: 'Scale #1 Calibrated', icon: Scale, active: true },
              { title: 'Paddy Stock', status: 'FIFO Lot #849', icon: Warehouse, active: true },
              { title: 'Milling Shift', status: 'Batch #B-102 Running', icon: Cog, active: true },
              { title: 'Packing (50kg)', status: '820 Bags Packed', icon: Package, active: true },
              { title: 'Dispatch & LR', status: '3 Trucks Loading', icon: Send, active: true },
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
            <span className="text-xs font-semibold text-slate-600">Quick Mill Operations</span>
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
                Start Milling Batch
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Yield Breakdown</h2>
            <p className="text-xs text-slate-400">Current batch output ratios</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Head Rice (Grade A)', percent: 61.2, color: 'bg-emerald-500' },
              { label: 'Broken Rice', percent: 11.4, color: 'bg-amber-500' },
              { label: 'Rice Bran (Oil extraction)', percent: 8.6, color: 'bg-teal-500' },
              { label: 'Husk (Boiler fuel)', percent: 18.8, color: 'bg-slate-400' },
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
            <strong>Recovery Optimal:</strong> Machine recovery 64.8% chal rahi hai, jo standard 65% target ke anuroop hai.
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Weighbridge & Gate Queue</h2>
            <p className="text-xs text-slate-400">Real-time truck inwards and deductions</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Live Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3">Gate Token</th>
                <th className="pb-3">Vehicle No</th>
                <th className="pb-3">Farmer / Source</th>
                <th className="pb-3">Net Weight</th>
                <th className="pb-3">Moisture</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {[
                { token: '#TK-4821', vehicle: 'HR 38 AA 4921', farmer: 'Baldev Singh (Karnal)', weight: '24.8 MT', moisture: '14.2%', status: 'Weighed & Approved' },
                { token: '#TK-4822', vehicle: 'PB 11 BC 8312', farmer: 'Govt. Procurement (Mandi)', weight: '31.2 MT', moisture: '13.8%', status: 'Milling Queue' },
                { token: '#TK-4823', vehicle: 'UP 14 TT 1029', farmer: 'Rameshwar Lal', weight: '28.4 MT', moisture: '15.1%', status: 'Quality Deduction' },
                { token: '#TK-4824', vehicle: 'DL 01 AB 7741', farmer: 'Gurmeet Farm Lot', weight: '22.0 MT', moisture: '14.0%', status: 'Waiting Weighbridge' },
              ].map((row) => (
                <tr key={row.token} className="hover:bg-slate-50/70">
                  <td className="py-3 font-bold text-slate-900">{row.token}</td>
                  <td className="py-3 font-mono">{row.vehicle}</td>
                  <td className="py-3">{row.farmer}</td>
                  <td className="py-3 font-semibold">{row.weight}</td>
                  <td className="py-3">{row.moisture}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {row.status}
                    </span>
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