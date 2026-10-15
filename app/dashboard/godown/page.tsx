'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Warehouse,
  Plus,
  Search,
  ArrowRight,
  Clock,
  Layers,
  X,
  CheckCircle2,
  AlertTriangle,
  Cog,
  FileText,
} from 'lucide-react';

interface PaddyLot {
  lotNo: string;
  godown: string;
  chamber: string;
  variety: string;
  arrivalDate: string;
  totalBags: number;
  initialMt: number;
  balanceMt: number;
  moisture: number;
  fifoPriority: number;
  status: 'Ready for Mill' | 'Milling Active' | 'Curing Stock';
}

const INITIAL_LOTS: PaddyLot[] = [
  { lotNo: 'LOT-849', godown: 'Godown #02', chamber: 'Chamber 3', variety: 'PR-126 Paddy', arrivalDate: '2026-10-12', totalBags: 6400, initialMt: 480, balanceMt: 320, moisture: 14.1, fifoPriority: 1, status: 'Ready for Mill' },
  { lotNo: 'LOT-848', godown: 'Godown #01', chamber: 'Chamber 1', variety: '1121 Basmati', arrivalDate: '2026-10-11', totalBags: 7300, initialMt: 550, balanceMt: 110, moisture: 13.8, fifoPriority: 2, status: 'Milling Active' },
  { lotNo: 'LOT-850', godown: 'Godown #02', chamber: 'Chamber 1', variety: 'PR-114 Paddy', arrivalDate: '2026-10-13', totalBags: 8200, initialMt: 620, balanceMt: 620, moisture: 14.0, fifoPriority: 3, status: 'Curing Stock' },
  { lotNo: 'LOT-851', godown: 'Godown #03', chamber: 'Chamber 2', variety: 'Sharbati Paddy', arrivalDate: '2026-10-14', totalBags: 4800, initialMt: 360, balanceMt: 360, moisture: 14.3, fifoPriority: 4, status: 'Curing Stock' },
];

export default function PaddyStockFifoPage() {
  const { currentTheme } = useTheme();
  const [lots, setLots] = useState<PaddyLot[]>(INITIAL_LOTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedLotForIssue, setSelectedLotForIssue] = useState<PaddyLot | null>(null);

  // Form: Create Lot Mapping
  const [newLot, setNewLot] = useState({
    lotNo: 'LOT-852',
    godown: 'Godown #01',
    chamber: 'Chamber 2',
    variety: '1509 Basmati',
    totalBags: '5000',
    initialMt: '250',
    moisture: '14.0',
  });

  // Form: Issue to Mill
  const [issueQty, setIssueQty] = useState('50');
  const [machineLine, setMachineLine] = useState('Machine Line #1 (60MT/day)');

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PaddyLot = {
      lotNo: newLot.lotNo,
      godown: newLot.godown,
      chamber: newLot.chamber,
      variety: newLot.variety,
      arrivalDate: new Date().toISOString().split('T')[0],
      totalBags: Number(newLot.totalBags) || 0,
      initialMt: Number(newLot.initialMt) || 0,
      balanceMt: Number(newLot.initialMt) || 0,
      moisture: Number(newLot.moisture) || 14.0,
      fifoPriority: lots.length + 1,
      status: 'Ready for Mill',
    };
    setLots([...lots, created]);
    setIsCreateModalOpen(false);
  };

  const handleIssueToMill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotForIssue) return;
    const qty = Number(issueQty) || 0;

    setLots(
      lots.map((l) => {
        if (l.lotNo === selectedLotForIssue.lotNo) {
          const remaining = Math.max(0, l.balanceMt - qty);
          return {
            ...l,
            balanceMt: remaining,
            status: remaining > 0 ? 'Milling Active' : 'Curing Stock',
          };
        }
        return l;
      })
    );

    setIsIssueModalOpen(false);
    setSelectedLotForIssue(null);
  };

  const filteredLots = lots.filter(
    (l) =>
      l.lotNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.godown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: currentTheme.buttonBg }}>
            PDF Checkpoint #3
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Paddy Stock & FIFO Lot Management</h1>
          <p className="text-xs text-slate-500">Lot Creation, Godown chamber mapping, and 1st-In 1st-Out issue to milling line</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          style={{ backgroundColor: currentTheme.buttonBg }}
        >
          <Plus className="w-4 h-4" />
          <span>+ Map New Inward Lot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Live Paddy Balance</span>
          <div className="text-2xl font-black text-slate-900">
            {lots.reduce((acc, l) => acc + l.balanceMt, 0)} MT
          </div>
          <div className="text-[11px] text-blue-600 font-semibold">{lots.length} Active Stacks Mapped</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Godown #01 (Basmati)</span>
          <div className="text-2xl font-black text-slate-900">
            {lots.filter((l) => l.godown.includes('01')).reduce((acc, l) => acc + l.balanceMt, 0)} MT
          </div>
          <div className="text-[11px] text-slate-400">1121 & 1509 Varieties</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Godown #02 (PR Paddy)</span>
          <div className="text-2xl font-black text-slate-900">
            {lots.filter((l) => l.godown.includes('02')).reduce((acc, l) => acc + l.balanceMt, 0)} MT
          </div>
          <div className="text-[11px] text-slate-400">PR-126 & PR-114 Varieties</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Godown #03 (Buffer)</span>
          <div className="text-2xl font-black text-slate-900">
            {lots.filter((l) => l.godown.includes('03')).reduce((acc, l) => acc + l.balanceMt, 0)} MT
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">Ready for Milling</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Paddy Lot Ledger & FIFO Tracking (PDF Page 2)</h2>
            <p className="text-xs text-slate-400">1st-In 1st-Out priority ensures stock age is managed and moisture loss is avoided</p>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search lot, variety, godown..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3">FIFO Rank</th>
                <th className="pb-3">Lot Number</th>
                <th className="pb-3">Godown Chamber</th>
                <th className="pb-3">Paddy Variety</th>
                <th className="pb-3">Moisture</th>
                <th className="pb-3">Total Bags</th>
                <th className="pb-3">Initial Inward</th>
                <th className="pb-3">Live Balance</th>
                <th className="pb-3">Lot Status</th>
                <th className="pb-3 text-right">Milling Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLots.map((row) => (
                <tr key={row.lotNo} className="hover:bg-slate-50/70">
                  <td className="py-3.5 font-bold text-blue-700">Priority #{row.fifoPriority}</td>
                  <td className="py-3.5 font-bold text-slate-900">{row.lotNo}</td>
                  <td className="py-3.5 text-slate-800 font-medium">{row.godown} • {row.chamber}</td>
                  <td className="py-3.5">{row.variety}</td>
                  <td className="py-3.5">{row.moisture}%</td>
                  <td className="py-3.5 font-mono">{row.totalBags.toLocaleString()}</td>
                  <td className="py-3.5 font-mono">{row.initialMt} MT</td>
                  <td className="py-3.5 font-mono font-bold text-emerald-700 text-sm">{row.balanceMt} MT</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedLotForIssue(row);
                        setIsIssueModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-white text-[11px] font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      style={{ backgroundColor: currentTheme.buttonBg }}
                    >
                      <Cog className="w-3 h-3" />
                      <span>Issue to Mill</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: CREATE NEW LOT MAPPING */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Map New Paddy Lot to Godown</h3>
                <p className="text-[11px] text-slate-400">Allocate chamber & stack for incoming paddy lot</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Lot Number</label>
                  <input
                    type="text"
                    required
                    value={newLot.lotNo}
                    onChange={(e) => setNewLot({ ...newLot, lotNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Paddy Variety</label>
                  <input
                    type="text"
                    required
                    value={newLot.variety}
                    onChange={(e) => setNewLot({ ...newLot, variety: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target Godown</label>
                  <select
                    value={newLot.godown}
                    onChange={(e) => setNewLot({ ...newLot, godown: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Godown #01">Godown #01 (Basmati)</option>
                    <option value="Godown #02">Godown #02 (PR Paddy)</option>
                    <option value="Godown #03">Godown #03 (Buffer)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Chamber / Stack</label>
                  <input
                    type="text"
                    required
                    value={newLot.chamber}
                    onChange={(e) => setNewLot({ ...newLot, chamber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Weight (MT)</label>
                  <input
                    type="number"
                    required
                    value={newLot.initialMt}
                    onChange={(e) => setNewLot({ ...newLot, initialMt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Moisture %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLot.moisture}
                    onChange={(e) => setNewLot({ ...newLot, moisture: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white font-bold" style={{ backgroundColor: currentTheme.buttonBg }}>
                  Confirm Lot Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ISSUE LOT TO MILLING QUEUE (PDF Page 3) */}
      {isIssueModalOpen && selectedLotForIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Issue Lot to Milling Line</h3>
                <p className="text-[11px] text-slate-400">PDF Flow: Issue Paddy Lot &rarr; Start Shift Batch</p>
              </div>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueToMill} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{selectedLotForIssue.lotNo}</span>
                  <span className="text-emerald-700">Available: {selectedLotForIssue.balanceMt} MT</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {selectedLotForIssue.variety} • {selectedLotForIssue.godown} ({selectedLotForIssue.chamber})
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Quantity to Issue (MT) *</label>
                <input
                  type="number"
                  max={selectedLotForIssue.balanceMt}
                  required
                  value={issueQty}
                  onChange={(e) => setIssueQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Milling Line / Shift Machine</label>
                <select
                  value={machineLine}
                  onChange={(e) => setMachineLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                >
                  <option value="Machine Line #1 (60MT/day)">Machine Line #1 (Basmati Polish)</option>
                  <option value="Machine Line #2 (80MT/day)">Machine Line #2 (PR Paddy High-Speed)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsIssueModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white font-bold" style={{ backgroundColor: currentTheme.buttonBg }}>
                  Confirm & Transfer to Mill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}