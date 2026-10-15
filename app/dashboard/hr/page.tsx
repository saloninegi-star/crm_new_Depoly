'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import {
  Users,
  CalendarCheck,
  HardHat,
  Banknote,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function HrCentralHubPage() {
  const { currentTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span
            className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: currentTheme.buttonBg }}
          >
            PDF Note 6 • Workforce & Labour
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">HR & Labour Management Hub</h1>
          <p className="text-xs text-slate-500">
            Real-time control center for Mill Staff Attendance, Palledar Hamali Gangs, and Worker Advances
          </p>
        </div>
      </div>

      {/* 3 Main Action Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Portal 1: Attendance */}
        <Link
          href="/dashboard/hr/attendance"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Staff Attendance & Shifts
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Track daily biometric check-ins, Shift #1 & Shift #2 allocations for Boiler, Milling and Gate teams.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Today On Duty:</span>
            <strong className="text-slate-900">42 / 48 Workers</strong>
          </div>
        </Link>

        {/* Portal 2: Palledar Labour */}
        <Link
          href="/dashboard/hr/labour"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HardHat className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Palledar & Hamali Charges
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Per-bag piece rate tracking for inward paddy unloading, godown stacking, and truck dispatch loading.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Today Hamali Cost:</span>
            <strong className="text-emerald-700">₹64,200 (3,640 Bags)</strong>
          </div>
        </Link>

        {/* Portal 3: Payroll & Advances */}
        <Link
          href="/dashboard/hr/payroll"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Banknote className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              Wages & Advances (Kharcha)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Weekly labour kharcha advances, monthly staff payroll deductions, and automated sync with Accounts.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Weekly Advances Due:</span>
            <strong className="text-rose-600">₹18,500</strong>
          </div>
        </Link>
      </div>

      {/* Summary Table: Quick Overview */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Workforce & Labour Expense Overview (Today)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Total Workforce Active</span>
            <div className="text-xl font-bold text-slate-900">42 Staff + 24 Labourers</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Active Palledar Gangs</span>
            <div className="text-xl font-bold text-blue-700">3 Gangs Working</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Bags Handled Today</span>
            <div className="text-xl font-bold text-amber-700">3,640 Bags</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Total Direct Labour Expense</span>
            <div className="text-xl font-bold text-emerald-700">₹64,200</div>
          </div>
        </div>
      </div>
    </div>
  );
}