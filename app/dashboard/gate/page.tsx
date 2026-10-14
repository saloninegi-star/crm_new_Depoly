'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  User,
  Phone,
  Scale,
  Wheat,
  X,
  Filter,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface GateEntry {
  token: string;
  time: string;
  vehicle: string;
  farmer: string;
  phone: string;
  mandi: string;
  variety: string;
  bags: number;
  driver: string;
  status: 'Waiting Weighbridge' | 'At Weighbridge' | 'Unloading in Godown' | 'Exit Cleared';
}

const INITIAL_ENTRIES: GateEntry[] = [
  { token: '#TK-4825', time: '14:22 PM', vehicle: 'HR 45 B 9811', farmer: 'Surinder Pal', phone: '98765-43210', mandi: 'Karnal Mandi', variety: 'PR-126 Paddy', bags: 560, driver: 'Raju Kumar', status: 'Waiting Weighbridge' },
  { token: '#TK-4824', time: '14:05 PM', vehicle: 'DL 01 AB 7741', farmer: 'Gurmeet Singh', phone: '98123-55678', mandi: 'Direct Farm Lot', variety: '1509 Basmati', bags: 490, driver: 'Jaswinder', status: 'Waiting Weighbridge' },
  { token: '#TK-4823', time: '13:40 PM', vehicle: 'UP 14 TT 1029', farmer: 'Rameshwar Lal', phone: '97112-90812', mandi: 'Hapur Mandi', variety: 'Sharbati Paddy', bags: 620, driver: 'Mohan Lal', status: 'At Weighbridge' },
  { token: '#TK-4822', time: '13:15 PM', vehicle: 'PB 11 BC 8312', farmer: 'Govt Procurement', phone: '0172-224411', mandi: 'Govt Mandi Agency', variety: 'PR-114 Paddy', bags: 710, driver: 'Kuldeep Singh', status: 'Unloading in Godown' },
  { token: '#TK-4821', time: '12:30 PM', vehicle: 'HR 38 AA 4921', farmer: 'Baldev Singh', phone: '99912-34567', mandi: 'Taraori Mandi', variety: '1121 Basmati', bags: 540, driver: 'Satish', status: 'Exit Cleared' },
];

export default function GateInwardPage() {
  const { currentTheme } = useTheme();
  const [role, setRole] = useState<'admin' | 'gate_guard'>('admin');
  const [entries, setEntries] = useState<GateEntry[]>(INITIAL_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<GateEntry | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    vehicle: '',
    farmer: '',
    phone: '',
    mandi: '',
    variety: 'PR-126 Paddy',
    bags: '',
    driver: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const directRole = localStorage.getItem('user_role');
    const kognosRoleStr = localStorage.getItem('kognos_role');

    if (directRole === 'gate_guard') {
      setRole('gate_guard');
      return;
    }

    if (kognosRoleStr) {
      try {
        const parsed = JSON.parse(kognosRoleStr);
        if (parsed.id === 'gate_guard') {
          setRole('gate_guard');
          return;
        }
      } catch {
        // ignore
      }
    }

    setRole('admin');
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextTokenNum = 4826 + entries.length - 5;
    const newEntry: GateEntry = {
      token: `#TK-${nextTokenNum}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicle: formData.vehicle.toUpperCase(),
      farmer: formData.farmer,
      phone: formData.phone || 'N/A',
      mandi: formData.mandi || 'Local Mandi',
      variety: formData.variety,
      bags: Number(formData.bags) || 0,
      driver: formData.driver || 'Driver',
      status: 'Waiting Weighbridge',
    };

    setEntries([newEntry, ...entries]);
    setIsModalOpen(false);
    setSelectedSlip(newEntry); // Auto open printed token slip
    setFormData({
      vehicle: '',
      farmer: '',
      phone: '',
      mandi: '',
      variety: 'PR-126 Paddy',
      bags: '',
      driver: '',
    });
  };

  const filteredEntries = entries.filter(
    (item) =>
      item.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mandi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* TOP HEADER & ACTION BAR */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: currentTheme.buttonBg }}
            >
              PDF Checkpoint #1
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {role === 'gate_guard' ? 'Gate Security & Inward Desk' : 'Gate Inward & Traceability Control'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {role === 'gate_guard'
              ? 'Vehicle No aur Farmer details capture karke Gate Token issue karein'
              : 'Complete paddy arrivals ledger, mandi sources aur lot traceability logs'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
          style={{ backgroundColor: currentTheme.buttonBg }}
        >
          <Plus className="w-4 h-4" />
          <span>+ New Vehicle Entry & Token</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* ADMIN VIEW ONLY: OVERVIEW CARDS (PDF Page 1 & 2) */}
      {/* ========================================================= */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="text-xs font-semibold text-slate-400">Total Trucks Inward Today</div>
            <div className="text-2xl font-black text-slate-900">{entries.length} Vehicles</div>
            <div className="text-[11px] text-emerald-600 font-semibold">100% Traceability Started</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="text-xs font-semibold text-slate-400">In Weighbridge Queue</div>
            <div className="text-2xl font-black text-amber-600">
              {entries.filter((e) => e.status === 'Waiting Weighbridge').length} Trucks
            </div>
            <div className="text-[11px] text-slate-400">Next for Gross Weighment</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="text-xs font-semibold text-slate-400">Paddy Varieties Arriving</div>
            <div className="text-2xl font-black text-slate-900">4 Types</div>
            <div className="text-[11px] text-slate-400">1121 Basmati, PR-126, Sharbati</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="text-xs font-semibold text-slate-400">Direct vs Mandi Procured</div>
            <div className="text-2xl font-black text-slate-900">70% Mandi</div>
            <div className="text-[11px] text-blue-600 font-semibold">30% Direct Farmer Lots</div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GATE GUARD VIEW ONLY: QUICK STATUS BANNER */}
      {/* ========================================================= */}
      {role === 'gate_guard' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-900">Weighbridge Queue</div>
              <div className="text-xl font-black text-amber-800">
                {entries.filter((e) => e.status === 'Waiting Weighbridge').length} Vehicles
              </div>
            </div>
            <Scale className="w-8 h-8 text-amber-500 opacity-80" />
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-900">Inside Mill Premises</div>
              <div className="text-xl font-black text-blue-800">
                {entries.filter((e) => e.status !== 'Exit Cleared').length} Vehicles
              </div>
            </div>
            <Clock className="w-8 h-8 text-blue-500 opacity-80" />
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-900">Tare & Exit Completed</div>
              <div className="text-xl font-black text-emerald-800">
                {entries.filter((e) => e.status === 'Exit Cleared').length} Trucks
              </div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-80" />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GATE INWARD REGISTER TABLE */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {role === 'gate_guard' ? 'Live Checkpoint Inward Queue' : 'Master Gate Inward Register'}
            </h2>
            <p className="text-xs text-slate-400">
              Traceability started: Token &rarr; Gross Wt &rarr; Godown Lot Mapping
            </p>
          </div>

          <div className="flex items-center gap-2">
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3">Gate Token</th>
                <th className="pb-3">In-Time</th>
                <th className="pb-3">Vehicle Number</th>
                <th className="pb-3">Farmer / Mandi Source</th>
                <th className="pb-3">Variety</th>
                <th className="pb-3">Approx Bags</th>
                <th className="pb-3">Driver</th>
                <th className="pb-3">Checkpoint Status</th>
                <th className="pb-3 text-right">Gate Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredEntries.map((row) => (
                <tr key={row.token} className="hover:bg-slate-50/70">
                  <td className="py-3.5 font-bold text-slate-900">{row.token}</td>
                  <td className="py-3.5 text-slate-500 font-mono">{row.time}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-800">{row.vehicle}</td>
                  <td className="py-3.5">
                    <div className="font-semibold text-slate-800">{row.farmer}</div>
                    <div className="text-[10px] text-slate-400">{row.mandi}</div>
                  </td>
                  <td className="py-3.5 text-slate-600">{row.variety}</td>
                  <td className="py-3.5 font-mono">{row.bags} Bags</td>
                  <td className="py-3.5 text-slate-500">{row.driver}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        row.status === 'Waiting Weighbridge'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : row.status === 'At Weighbridge'
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
                    <button
                      onClick={() => setSelectedSlip(row)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Pass</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: NEW VEHICLE ENTRY & TOKEN GENERATION */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  New Gate Inward Entry (Checkpoint #1)
                </h3>
                <p className="text-[11px] text-slate-400">Capture details to generate gate token</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Vehicle Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HR 45 B 9811"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-mono outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Farmer / Supplier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baldev Singh"
                    value={formData.farmer}
                    onChange={(e) => setFormData({ ...formData, farmer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Farmer Mobile</label>
                  <input
                    type="tel"
                    placeholder="98765-XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Mandi / Source Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Karnal Mandi / Direct Farm"
                    value={formData.mandi}
                    onChange={(e) => setFormData({ ...formData, mandi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Paddy Variety</label>
                  <select
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="PR-126 Paddy">PR-126 Paddy</option>
                    <option value="1121 Basmati">1121 Basmati</option>
                    <option value="1509 Basmati">1509 Basmati</option>
                    <option value="Sharbati Paddy">Sharbati Paddy</option>
                    <option value="PR-114 Paddy">PR-114 Paddy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Approx Bags</label>
                  <input
                    type="number"
                    placeholder="e.g. 550"
                    value={formData.bags}
                    onChange={(e) => setFormData({ ...formData, bags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Driver Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Satish"
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer"
                  style={{ backgroundColor: currentTheme.buttonBg }}
                >
                  Issue Token & Print Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PRINTABLE GATE PASS SLIP (PDF Traceability Pass) */}
      {/* ========================================================= */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="text-center border-b border-dashed border-slate-200 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Wheat className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-sm tracking-tight text-slate-900">
                  KOGNOS RICE MILL
                </h4>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Gate Inward Token Pass • Checkpoint #1
              </p>
            </div>

            <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Token Number</div>
              <div className="text-2xl font-black text-slate-900">{selectedSlip.token}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Time: {selectedSlip.time}</div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Vehicle No:</span>
                <span className="font-mono font-bold text-slate-900">{selectedSlip.vehicle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Farmer:</span>
                <span className="font-semibold text-slate-900">{selectedSlip.farmer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Mandi / Source:</span>
                <span className="text-slate-800">{selectedSlip.mandi}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Paddy Variety:</span>
                <span className="font-semibold text-slate-900">{selectedSlip.variety}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Est. Bags:</span>
                <span className="font-mono font-bold text-slate-900">{selectedSlip.bags} Bags</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Step:</span>
                <span className="font-bold text-amber-600">Weighbridge (Gross Wt)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedSlip(null)}
                className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-1/2 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                style={{ backgroundColor: currentTheme.buttonBg }}
              >
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