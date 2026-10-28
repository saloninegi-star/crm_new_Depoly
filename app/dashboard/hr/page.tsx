'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Users,
  HardHat,
  Package,
  Banknote,
  CheckCircle2,
  Clock,
  Plus,
  CalendarCheck,
  X,
  Truck,
  Scale,
  Warehouse,
  Cog,
  Building,
  AlertCircle,
  Coins,
} from 'lucide-react';

interface AttendanceSection {
  section: string;
  present: number;
  total: number;
  absentNames: string;
}

interface HamaliGang {
  name: string;
  leader: string;
  work: string;
  workers: number;
  bags: number;
  rate: number;
  amount: number;
}

interface AdvanceRecord {
  name: string;
  role: string;
  dateGiven: string;
  amount: number;
}

// 🟢 Deterministic Number Formatter (Hydration-safe)
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

const INITIAL_ATTENDANCE: AttendanceSection[] = [
  { section: 'Gate', present: 4, total: 4, absentNames: 'None' },
  { section: 'Weighbridge', present: 3, total: 3, absentNames: 'None' },
  { section: 'Godown', present: 9, total: 10, absentNames: 'Ravi Kumar' },
  { section: 'Milling', present: 14, total: 16, absentNames: 'Sonu, Deepak Saini' },
  { section: 'Packaging', present: 8, total: 10, absentNames: 'Ajay, Monu' },
  { section: 'Office', present: 4, total: 5, absentNames: 'Neha Arora (leave)' },
];

const INITIAL_GANGS: HamaliGang[] = [
  {
    name: 'Gang A',
    leader: 'Ramesh Yadav',
    work: 'Unloading paddy',
    workers: 9,
    bags: 1420,
    rate: 4.5,
    amount: 6390,
  },
  {
    name: 'Gang B',
    leader: 'Sunil Kumar',
    work: 'Godown stacking',
    workers: 8,
    bags: 1180,
    rate: 5.0,
    amount: 5900,
  },
  {
    name: 'Gang C',
    leader: 'Mukesh Pal',
    work: 'Bagging and loading',
    workers: 7,
    bags: 1040,
    rate: 6.0,
    amount: 6240,
  },
];

const INITIAL_ADVANCES: AdvanceRecord[] = [
  {
    name: 'Ramesh Yadav',
    role: 'Gang A leader · given 21 Oct',
    dateGiven: '21 Oct',
    amount: 5000,
  },
  {
    name: 'Sunil Kumar',
    role: 'Gang B leader · given 22 Oct',
    dateGiven: '22 Oct',
    amount: 3500,
  },
  {
    name: 'Pawan Kumar',
    role: 'Driver · given 23 Oct',
    dateGiven: '23 Oct',
    amount: 2000,
  },
];

export default function HrLabourPage() {
  const { accent } = useTheme();

  const [attendance, setAttendance] = useState<AttendanceSection[]>(INITIAL_ATTENDANCE);
  const [gangs] = useState<HamaliGang[]>(INITIAL_GANGS);
  const [advances, setAdvances] = useState<AdvanceRecord[]>(INITIAL_ADVANCES);

  // Modals
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Milling');
  const [presentInput, setPresentInput] = useState('14');

  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [advanceWorkerName, setAdvanceWorkerName] = useState('');
  const [advanceWorkerRole, setAdvanceWorkerRole] = useState('Labour Gang Leader');
  const [advanceAmountInput, setAdvanceAmountInput] = useState('2000');

  // Totals calculations matching exact numbers
  const totalPresent = attendance.reduce((sum, item) => sum + item.present, 0);
  const totalStaff = attendance.reduce((sum, item) => sum + item.total, 0);
  const totalAbsent = totalStaff - totalPresent;

  const totalWorkers = gangs.reduce((sum, g) => sum + g.workers, 0);
  const totalBags = gangs.reduce((sum, g) => sum + g.bags, 0);
  const totalHamaliCost = gangs.reduce((sum, g) => sum + g.amount, 0);

  const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);

  // Handle Attendance Update
  const handleUpdateAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const pVal = Number(presentInput) || 0;

    setAttendance(
      attendance.map((sec) => {
        if (sec.section === selectedSection) {
          const clamped = Math.min(sec.total, Math.max(0, pVal));
          return {
            ...sec,
            present: clamped,
            absentNames: clamped === sec.total ? 'None' : `${sec.total - clamped} staff marked absent`,
          };
        }
        return sec;
      })
    );

    setIsAttendanceModalOpen(false);
  };

  // Handle Record Advance
  const handleAddAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceWorkerName) return;

    const newAdv: AdvanceRecord = {
      name: advanceWorkerName,
      role: `${advanceWorkerRole} · given Today`,
      dateGiven: 'Today',
      amount: Number(advanceAmountInput) || 0,
    };

    setAdvances([newAdv, ...advances]);
    setIsAdvanceModalOpen(false);
    setAdvanceWorkerName('');
  };

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* ========================================================
          0. TOP ACTION STRIP (MATCHING SCREENSHOT BUTTONS)
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Staff attendance, hamali gangs and advances · Workforce Operations
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Record Advance Button */}
          <button
            type="button"
            onClick={() => setIsAdvanceModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            Record advance
          </button>

          {/* Mark Attendance Button (Teal / Accent Solid) */}
          <button
            type="button"
            onClick={() => setIsAttendanceModalOpen(true)}
            className="px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-transform active:scale-95 hover:opacity-95"
            style={{ backgroundColor: accent?.primary || '#0d9488' }}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark attendance</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          1. TOP 4-CARD METRIC STRIP (WITH COLORFUL ACCENTS)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 - Staff on duty (Blue) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Staff on duty</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalPresent}
            </span>
            <span className="text-base font-semibold text-slate-500 dark:text-slate-400">
              of {totalStaff}
            </span>
          </div>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {totalAbsent} absent
          </p>
        </div>

        {/* Metric 2 - Hamali gangs working (Amber) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Hamali gangs working</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <HardHat className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              3
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            {totalWorkers} workers
          </p>
        </div>

        {/* Metric 3 - Bags handled today (Purple) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Bags handled today</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Package className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatNumber(totalBags)}
            </span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">
            Unloading, stacking, bagging
          </p>
        </div>

        {/* Metric 4 - Hamali cost today (Emerald) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Hamali cost today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Banknote className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹{formatNumber(totalHamaliCost)}
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            Paid on Saturday
          </p>
        </div>
      </div>

      {/* ========================================================
          2. TWO COLUMNS: ATTENDANCE (LEFT) + HAMALI GANGS (RIGHT)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Attendance by section */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Attendance by section
            </h2>
            <span className="text-xs text-slate-400 font-medium">Marked at 08:00</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-1">Section</th>
                  <th className="pb-3 text-center sm:text-left">Present</th>
                  <th className="pb-3 pr-1">Absent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {attendance.map((row) => (
                  <tr
                    key={row.section}
                    className="hover:bg-violet-50/30 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 pl-1 font-semibold text-slate-900 dark:text-white">
                      {row.section}
                    </td>
                    <td className="py-3 font-mono text-center sm:text-left">
                      <span
                        className={
                          row.present === row.total
                            ? 'text-slate-900 dark:text-white font-bold'
                            : 'text-amber-700 dark:text-amber-400 font-bold'
                        }
                      >
                        {row.present} of {row.total}
                      </span>
                    </td>
                    <td className="py-3 pr-1">
                      {row.absentNames === 'None' ? (
                        <span className="text-slate-400 font-normal">None</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-medium">
                          {row.absentNames}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Total Attendance Row */}
                <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  <td className="py-3.5 pl-1 font-bold">Total</td>
                  <td className="py-3.5 font-mono text-center sm:text-left">
                    {totalPresent} of {totalStaff}
                  </td>
                  <td className="py-3.5 pr-1 font-bold text-rose-600 dark:text-rose-400">
                    {totalAbsent} absent
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Hamali gangs today */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Hamali gangs today
            </h2>
            <span className="text-xs text-slate-400 font-medium">Paid per bag</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-1">Gang</th>
                  <th className="pb-3">Work</th>
                  <th className="pb-3 text-center sm:text-left">Workers</th>
                  <th className="pb-3 text-right sm:text-left">Bags</th>
                  <th className="pb-3 text-right sm:text-left">Rate</th>
                  <th className="pb-3 text-right pr-1">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {gangs.map((row) => (
                  <tr
                    key={row.name}
                    className="hover:bg-violet-50/30 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Gang Name & Leader */}
                    <td className="py-3 pl-1">
                      <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
                      <div className="text-[11px] text-slate-400">{row.leader}</div>
                    </td>

                    {/* Work Type */}
                    <td className="py-3 text-slate-700 dark:text-slate-300">{row.work}</td>

                    {/* Workers Count */}
                    <td className="py-3 font-mono text-center sm:text-left font-semibold text-slate-900 dark:text-white">
                      {row.workers}
                    </td>

                    {/* Bags Handled */}
                    <td className="py-3 font-mono text-right sm:text-left text-slate-900 dark:text-white">
                      {formatNumber(row.bags)}
                    </td>

                    {/* Rate Per Bag */}
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-400 text-right sm:text-left">
                      ₹{row.rate.toFixed(2)}
                    </td>

                    {/* Total Earned Amount */}
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white text-right pr-1">
                      ₹{formatNumber(row.amount)}
                    </td>
                  </tr>
                ))}

                {/* Total Hamali Row */}
                <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  <td className="py-3.5 pl-1 font-bold" colSpan={2}>
                    Total
                  </td>
                  <td className="py-3.5 font-mono text-center sm:text-left">{totalWorkers}</td>
                  <td className="py-3.5 font-mono text-right sm:text-left">{formatNumber(totalBags)}</td>
                  <td className="py-3.5 text-right sm:text-left"></td>
                  <td className="py-3.5 font-mono text-right pr-1 text-sm font-black">
                    ₹{formatNumber(totalHamaliCost)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BOTTOM SECTION: ADVANCES TO RECOVER THIS WEEK
         ======================================================== */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Advances to recover this week
          </h2>
          <span className="text-xs text-slate-400 font-medium">Cut from Saturday wages</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
          {advances.map((row) => (
            <div
              key={row.name + row.dateGiven}
              className="py-3 flex items-center justify-between hover:bg-violet-50/20 dark:hover:bg-slate-800/30 px-1 rounded-lg transition-colors"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
                <div className="text-[11px] text-slate-400">{row.role}</div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                ₹{formatNumber(row.amount)}
              </span>
            </div>
          ))}

          {/* Total Advance Row */}
          <div className="pt-3.5 flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span className="font-bold text-xs">Total</span>
            <span className="font-mono text-sm font-black">₹{formatNumber(totalAdvances)}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. MODAL: MARK ATTENDANCE
         ======================================================== */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111726] rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Mark Section Attendance
                </h3>
                <p className="text-[11px] text-slate-400">Shift #1 Biometric & Daily Roll</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateAttendance} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Select Mill Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    const found = attendance.find((s) => s.section === e.target.value);
                    if (found) setPresentInput(String(found.present));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  {attendance.map((sec) => (
                    <option key={sec.section} value={sec.section}>
                      {sec.section} (Total: {sec.total} Staff)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Present Staff Count
                </label>
                <input
                  type="number"
                  min="0"
                  max={attendance.find((s) => s.section === selectedSection)?.total || 20}
                  required
                  value={presentInput}
                  onChange={(e) => setPresentInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: RECORD ADVANCE (KHARCHA)
         ======================================================== */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111726] rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Record Worker Advance
                </h3>
                <p className="text-[11px] text-slate-400">Weekly Kharcha Advance Payout</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdvanceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAdvance} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Worker / Gang Leader Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mukesh Pal"
                  value={advanceWorkerName}
                  onChange={(e) => setAdvanceWorkerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Designation / Role
                </label>
                <select
                  value={advanceWorkerRole}
                  onChange={(e) => setAdvanceWorkerRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  <option value="Gang C leader">Gang C leader</option>
                  <option value="Gang A leader">Gang A leader</option>
                  <option value="Gang B leader">Gang B leader</option>
                  <option value="Boiler Operator">Boiler Operator</option>
                  <option value="Truck Driver">Truck Driver</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Advance Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2000"
                  value={advanceAmountInput}
                  onChange={(e) => setAdvanceAmountInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="text-[10px] text-slate-400">
                  Will be auto-deducted from Saturday payroll wages.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdvanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  Disburse Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}