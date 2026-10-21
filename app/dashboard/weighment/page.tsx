'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Scale,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Droplets,
  Warehouse,
  ArrowRight,
  X,
  Gauge,
  Sparkles,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface WeighmentRecord {
  token: string;
  vehicle: string;
  farmer: string;
  variety: string;
  grossWeight: number; // in KG
  tareWeight: number;  // in KG
  netWeight: number;   // in KG
  moisture: number;    // %
  deduction: number;   // in KG
  finalPaddyWeight: number;
  godown: string;
  bay?: string;
  status: 'Waiting Gross' | 'Unloading in Godown' | 'Waiting Tare' | 'Completed & Billed';
  time: string;
}

const INITIAL_RECORDS: WeighmentRecord[] = [
  {
    token: '#TK-4821',
    vehicle: 'HR 38 AA 4921',
    farmer: 'Baldev Singh (Taraori)',
    variety: '1121 Basmati',
    grossWeight: 38450,
    tareWeight: 13650,
    netWeight: 24800,
    moisture: 14.2,
    deduction: 0,
    finalPaddyWeight: 24800,
    godown: 'Godown #01',
    bay: 'Bay #1',
    status: 'Completed & Billed',
    time: '12:45 PM',
  },
  {
    token: '#TK-4822',
    vehicle: 'PB 11 BC 8312',
    farmer: 'Govt Procurement',
    variety: 'PR-114 Paddy',
    grossWeight: 44200,
    tareWeight: 13000,
    netWeight: 31200,
    moisture: 13.8,
    deduction: 0,
    finalPaddyWeight: 31200,
    godown: 'Godown #02',
    bay: 'Bay #2',
    status: 'Unloading in Godown',
    time: '13:25 PM',
  },
  {
    token: '#TK-4823',
    vehicle: 'UP 14 TT 1029',
    farmer: 'Rameshwar Lal (Hapur)',
    variety: 'Sharbati Paddy',
    grossWeight: 42100,
    tareWeight: 13700,
    netWeight: 28400,
    moisture: 15.2,
    deduction: 340,
    finalPaddyWeight: 28060,
    godown: 'Godown #03',
    bay: 'Bay #1',
    status: 'Unloading in Godown',
    time: '13:50 PM',
  },
  {
    token: '#TK-4824',
    vehicle: 'DL 01 AB 7741',
    farmer: 'Gurmeet Farm Lot',
    variety: '1509 Basmati',
    grossWeight: 35800,
    tareWeight: 0,
    netWeight: 0,
    moisture: 14.0,
    deduction: 0,
    finalPaddyWeight: 0,
    godown: 'Godown #02',
    bay: 'Bay #3',
    status: 'Unloading in Godown',
    time: '14:05 PM',
  },
  {
    token: '#TK-4825',
    vehicle: 'HR 45 B 9811',
    farmer: 'Surinder Pal (Karnal)',
    variety: 'PR-126 Paddy',
    grossWeight: 0,
    tareWeight: 0,
    netWeight: 0,
    moisture: 14.5,
    deduction: 0,
    finalPaddyWeight: 0,
    godown: 'Godown #01',
    status: 'Waiting Gross',
    time: '14:22 PM',
  },
];

export default function WeighbridgePage() {
  const { currentTheme } = useTheme();
  const [role, setRole] = useState('superadmin');
  const [records, setRecords] = useState<WeighmentRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<WeighmentRecord | null>(null);

  // Digital scale simulation
  const [liveScaleWeight, setLiveScaleWeight] = useState(38420);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScaleWeight((prev) => prev + (Math.floor(Math.random() * 5) - 2) * 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [weighForm, setWeighForm] = useState({
    token: '#TK-4824',
    vehicle: 'DL 01 AB 7741',
    farmer: 'Gurmeet Farm Lot',
    variety: '1509 Basmati',
    grossWeight: '35800',
    tareWeight: '13800',
    moisture: '14.5',
    godown: 'Godown #02',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const directRole = localStorage.getItem('user_role');
    const kognosRole = localStorage.getItem('kognos_role');

    let detected = directRole || '';
    if (!detected && kognosRole) {
      try {
        const parsed = JSON.parse(kognosRole);
        detected = parsed.id || '';
      } catch {}
    }

    if (detected) {
      setRole(detected.toLowerCase().trim());
    }
  }, []);

  const gross = Number(weighForm.grossWeight) || 0;
  const tare = Number(weighForm.tareWeight) || 0;
  const rawNet = Math.max(0, gross - tare);
  const moistureVal = Number(weighForm.moisture) || 14.0;
  const excessMoisture = Math.max(0, moistureVal - 14.0);
  const calculatedDeduction = Math.round(rawNet * (excessMoisture * 0.015));
  const finalPaddy = Math.max(0, rawNet - calculatedDeduction);

  const handleRecordWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = records.map((item) => {
      if (item.token === weighForm.token) {
        return {
          ...item,
          grossWeight: gross,
          tareWeight: tare,
          netWeight: rawNet,
          moisture: moistureVal,
          deduction: calculatedDeduction,
          finalPaddyWeight: finalPaddy,
          godown: weighForm.godown,
          status: tare > 0 ? ('Completed & Billed' as const) : ('Unloading in Godown' as const),
        };
      }
      return item;
    });

    setRecords(updated);
    setIsModalOpen(false);
    const slipItem = updated.find((r) => r.token === weighForm.token);
    if (slipItem) setSelectedSlip(slipItem);
  };

  const handleConfirmUnloadForGodown = (token: string) => {
    setRecords(
      records.map((r) => {
        if (r.token === token) {
          return { ...r, status: 'Waiting Tare' as const };
        }
        return r;
      })
    );
  };

  const isGodownStaff = role === 'godown_incharge' || role === 'paddy_stock';
  const isGateGuard = role === 'gate_guard';
  const isWeighbridgeStaff = role === 'weighbridge' || role === 'superadmin' || role === 'admin' || role === 'owner';

  const filteredRecords = records.filter(
    (item) =>
      item.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: currentTheme.buttonBg }}>
            {isGodownStaff ? 'Godown Unloading Desk' : 'Checkpoint #2'}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {isGodownStaff
              ? 'Truck Inward Unloading & Tare Clearance'
              : isGateGuard
              ? 'Weighbridge Queue & Exit Clearance'
              : 'Weighbridge Integration & Tare/Gross Station'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isGodownStaff
              ? 'Confirm truck unloading at assigned Godown bays so vehicles can proceed to Tare weighment'
              : 'Gross & Tare capture, Auto-calc net weight, Moisture deduction & Godown lot transfer'}
          </p>
        </div>

        {isWeighbridgeStaff && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
            style={{ backgroundColor: currentTheme.buttonBg }}
          >
            <Plus className="w-4 h-4" />
            <span>Record Weighment (Gross / Tare)</span>
          </button>
        )}
      </div>

      {/* GODOWN INCHARGE VIEW: Trucks at Unloading Bays */}
      {isGodownStaff && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Trucks at Unloading Bays</span>
            <div className="text-2xl font-black text-blue-600">
              {records.filter((r) => r.status === 'Unloading in Godown').length} Vehicles
            </div>
            <div className="text-[11px] text-slate-400">Paddy stacking in progress</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Paddy Being Unloaded</span>
            <div className="text-2xl font-black text-slate-900">81.6 MT</div>
            <div className="text-[11px] text-emerald-600 font-semibold">1,820 Total Bags</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">Cleared for Tare Scale</span>
            <div className="text-2xl font-black text-emerald-600">
              {records.filter((r) => r.status === 'Waiting Tare' || r.status === 'Completed & Billed').length} Trucks
            </div>
            <div className="text-[11px] text-slate-400">Unloading verified</div>
          </div>
        </div>
      )}

      {/* DIGITAL SCALE SENSOR (Visible for Weighbridge Staff) */}
      {isWeighbridgeStaff && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 text-white shadow-md flex flex-col justify-between border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-mono tracking-wider uppercase text-emerald-400">
                  Scale #01 Live Sensor
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Calibrated (0.01% Tol.)
              </span>
            </div>

            <div className="py-4 text-center">
              <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {liveScaleWeight.toLocaleString()} <span className="text-xl text-slate-400 font-bold">KG</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                {(liveScaleWeight / 1000).toFixed(2)} Metric Tonnes
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span>Platform: 60MT Pitless</span>
              <span className="text-emerald-400 font-semibold">Auto-Zero: Stable</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="text-xs font-semibold text-slate-400">Waiting for Gross Wt</div>
              <div className="text-2xl font-black text-amber-600">
                {records.filter((r) => r.status === 'Waiting Gross').length} Trucks
              </div>
              <div className="text-[11px] text-slate-400">Paddy loaded at gate</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="text-xs font-semibold text-slate-400">Waiting for Tare Wt</div>
              <div className="text-2xl font-black text-blue-600">
                {records.filter((r) => r.status === 'Waiting Tare').length} Trucks
              </div>
              <div className="text-[11px] text-slate-400">Unloaded &rarr; Ready for exit</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="text-xs font-semibold text-slate-400">Net Paddy Weighed Today</div>
              <div className="text-2xl font-black text-slate-900">84.4 MT</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Auto-moved to Godown</div>
            </div>
          </div>
        </div>
      )}

      {/* WEIGHMENT / UNLOADING REGISTER TABLE */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isGodownStaff ? 'Truck Unloading Register & Tare Handover' : 'Master Weighment Register'}
            </h2>
            <p className="text-xs text-slate-400">
               Gross Weight &rarr; Godown Unload &rarr; Tare Weight &rarr; Final Net Stock
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search token, vehicle, farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3">Token No</th>
                <th className="pb-3">Vehicle Number</th>
                <th className="pb-3">Farmer / Source</th>
                <th className="pb-3">Assigned Godown</th>
                <th className="pb-3">Gross Wt</th>
                <th className="pb-3">Tare Wt</th>
                <th className="pb-3">Net Paddy</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.map((row) => (
                <tr key={row.token} className="hover:bg-slate-50/70">
                  <td className="py-3.5 font-bold text-slate-900">{row.token}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-800">{row.vehicle}</td>
                  <td className="py-3.5">
                    <div className="font-semibold text-slate-800">{row.farmer}</div>
                    <div className="text-[10px] text-slate-400">{row.variety}</div>
                  </td>
                  <td className="py-3.5 font-semibold text-blue-700">
                    {row.godown} {row.bay ? `(${row.bay})` : ''}
                  </td>
                  <td className="py-3.5 font-mono">
                    {row.grossWeight > 0 ? `${row.grossWeight.toLocaleString()} KG` : <span className="text-slate-400">Pending</span>}
                  </td>
                  <td className="py-3.5 font-mono">
                    {row.tareWeight > 0 ? `${row.tareWeight.toLocaleString()} KG` : <span className="text-slate-400">Pending</span>}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-emerald-700">
                    {row.finalPaddyWeight > 0 ? `${row.finalPaddyWeight.toLocaleString()} KG` : <span className="text-slate-400">-</span>}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        row.status === 'Waiting Gross'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : row.status === 'Waiting Tare'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : row.status === 'Unloading in Godown'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {isGodownStaff && row.status === 'Unloading in Godown' ? (
                      <button
                        onClick={() => handleConfirmUnloadForGodown(row.token)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-xs cursor-pointer inline-flex items-center gap-1"
                        style={{ backgroundColor: currentTheme.buttonBg }}
                      >
                        <Check className="w-3 h-3" />
                        <span>Send to Tare</span>
                      </button>
                    ) : row.finalPaddyWeight > 0 ? (
                      <button
                        onClick={() => setSelectedSlip(row)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Slip</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">In Queue</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD WEIGHMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Record Weighment (Gross & Tare Integration)</h3>
                <p className="text-[11px] text-slate-400">Formula: Net Wt = Gross - Tare - Moisture Cut</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordWeight} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Vehicle & Token</label>
                  <select
                    value={weighForm.token}
                    onChange={(e) => {
                      const sel = records.find((r) => r.token === e.target.value);
                      if (sel) {
                        setWeighForm({
                          ...weighForm,
                          token: sel.token,
                          vehicle: sel.vehicle,
                          farmer: sel.farmer,
                          variety: sel.variety,
                          godown: sel.godown,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500 font-mono"
                  >
                    {records.map((r) => (
                      <option key={r.token} value={r.token}>
                        {r.token} - {r.vehicle} ({r.farmer})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Allocated Godown</label>
                  <select
                    value={weighForm.godown}
                    onChange={(e) => setWeighForm({ ...weighForm, godown: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="Godown #01">Godown #01 (Basmati)</option>
                    <option value="Godown #02">Godown #02 (PR Paddy)</option>
                    <option value="Godown #03">Godown #03 (Buffer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Gross Weight (Loaded Truck) KG *</label>
                  <input
                    type="number"
                    required
                    value={weighForm.grossWeight}
                    onChange={(e) => setWeighForm({ ...weighForm, grossWeight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Tare Weight (Empty Truck) KG</label>
                  <input
                    type="number"
                    value={weighForm.tareWeight}
                    onChange={(e) => setWeighForm({ ...weighForm, tareWeight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Moisture Content (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weighForm.moisture}
                  onChange={(e) => setWeighForm({ ...weighForm, moisture: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Net Weight (Gross - Tare):</span>
                  <span className="font-mono font-bold text-slate-900">{rawNet.toLocaleString()} KG</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Moisture Deduction:</span>
                  <span className="font-mono font-bold">-{calculatedDeduction.toLocaleString()} KG</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-emerald-700">
                  <span>Final Paddy to Godown:</span>
                  <span className="font-mono text-sm">{finalPaddy.toLocaleString()} KG ({(finalPaddy / 1000).toFixed(2)} MT)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm" style={{ backgroundColor: currentTheme.buttonBg }}>
                  Save & Move to Godown Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WEIGHMENT SLIP MODAL */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="text-center border-b border-dashed border-slate-200 pb-3">
              <h4 className="font-black text-sm tracking-tight text-slate-900">KOGNOS RICE MILL • DHARAM KANTA</h4>
              <p className="text-[10px] uppercase font-bold text-slate-400">Computerized Weighment Slip (Scale #01)</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Token No:</span>
                <span className="font-mono font-bold text-slate-900">{selectedSlip.token}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Vehicle No:</span>
                <span className="font-mono font-bold text-slate-900">{selectedSlip.vehicle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Farmer:</span>
                <span className="font-semibold text-slate-900">{selectedSlip.farmer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Gross Wt:</span>
                <span className="font-mono font-bold">{selectedSlip.grossWeight.toLocaleString()} KG</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Tare Wt:</span>
                <span className="font-mono font-bold">{selectedSlip.tareWeight.toLocaleString()} KG</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1 text-rose-600">
                <span>Moisture Cut:</span>
                <span className="font-mono font-bold">-{selectedSlip.deduction} KG</span>
              </div>
              <div className="flex justify-between pt-1 text-emerald-700 font-bold text-sm">
                <span>Final Stock Wt:</span>
                <span className="font-mono">{selectedSlip.finalPaddyWeight.toLocaleString()} KG</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button onClick={() => setSelectedSlip(null)} className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                Close
              </button>
              <button onClick={() => window.print()} className="w-1/2 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm" style={{ backgroundColor: currentTheme.buttonBg }}>
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}