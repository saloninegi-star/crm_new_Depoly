'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { gateService, GateInwardResponse, GatePassDetails } from '../../../services/gateService';
import api from '../../../lib/axios';
import axios from 'axios';
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
  AlertCircle,
  RefreshCw,
  QrCode,
  ArrowRight,
} from 'lucide-react';

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((item: any) => {
          if (typeof item === 'string') return item;
          const field = Array.isArray(item.loc) ? item.loc.slice(1).join('.') : '';
          return field ? `${field}: ${item.msg}` : item.msg || JSON.stringify(item);
        })
        .join(' | ');
    }
    if (detail && typeof detail === 'object') {
      return JSON.stringify(detail);
    }
    return err.response?.data?.message || err.message || 'Server request failed';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unexpected error occurred';
}

function formatTimeSafely(dateStr: string) {
  if (!dateStr) return '--:--';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

export default function GateInwardPage() {
  const { currentTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [entries, setEntries] = useState<GateInwardResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Slips
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Second API Gate Pass State
  const [selectedPass, setSelectedPass] = useState<GatePassDetails | null>(null);
  const [isLoadingPass, setIsLoadingPass] = useState(false);

  const initialFormState = {
    vehicle_number: '',
    driver_name: '',
    driver_mobile: '',
    transporter_name: '',
    material_type: 'Paddy',
    source_type: 'Government Procurement Centre',
    source_name: '',
    source_location: '',
    reference_number: '',
    challan_number: '',
    expected_quantity: '',
    expected_quantity_unit: 'Quintals',
    expected_bags: '',
    remarks: 'Gate check verified and stamped',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    setIsMounted(true);
    fetchInwardEntries();
  }, []);

  const fetchInwardEntries = async () => {
    setIsLoadingList(true);
    try {
      const res = await api.get('/staff/gate_guard/inward');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setEntries(res.data);
      } else if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
        setEntries(res.data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingList(false);
    }
  };

  // Helper to fetch the driver gate pass with barcode via the Second API
  const handleFetchGatePass = async (gate_token: string) => {
    setIsLoadingPass(true);
    try {
      const passData = await gateService.getGatePass(gate_token);
      setSelectedPass(passData);
    } catch (err: unknown) {
      alert(extractErrorMessage(err));
    } finally {
      setIsLoadingPass(false);
    }
  };

  const handlePrefillNewTruck = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      vehicle_number: `HR 26 DQ ${randomDigits}`,
      driver_name: 'Dinesh Sharma',
      driver_mobile: '9755512345',
      transporter_name: 'MP State Civil Supplies Transport',
      material_type: 'Paddy',
      source_type: 'Government Procurement Centre',
      source_name: 'MP Mandi Board Centre #4',
      source_location: 'Hoshangabad, MP',
      reference_number: `GOVT-ALLOC-${randomDigits}`,
      challan_number: `CHL-${randomDigits}`,
      expected_quantity: '420.75',
      expected_quantity_unit: 'Quintals',
      expected_bags: '840',
      remarks: 'Govt dispatch challan verified and stamped',
    });
    setErrorMsg(null);
  };

  // Handle Form Submission -> Auto triggers Second API
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        vehicle_number: formData.vehicle_number.toUpperCase().trim(),
        driver_name: formData.driver_name.trim(),
        driver_mobile: formData.driver_mobile.trim(),
        transporter_name: formData.transporter_name.trim(),
        material_type: formData.material_type,
        source_type: formData.source_type,
        source_name: formData.source_name.trim(),
        source_location: formData.source_location.trim(),
        reference_number: formData.reference_number.trim(),
        challan_number: formData.challan_number.trim(),
        expected_quantity: parseFloat(formData.expected_quantity) || 0,
        expected_quantity_unit: formData.expected_quantity_unit,
        expected_bags: parseInt(formData.expected_bags, 10) || 0,
        remarks: formData.remarks.trim(),
      };

      // 1. First API Call
      const res = await gateService.createInwardEntry(payload);
      setEntries([res, ...entries]);
      setIsModalOpen(false);
      setFormData(initialFormState);

      // 2. Second API Call: Auto-fetch driver barcode pass
      await handleFetchGatePass(res.gate_token);
    } catch (err: unknown) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEntries = entries.filter(
    (item) =>
      item.gate_token?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicle_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.driver_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: currentTheme.buttonBg }}
            >
              Checkpoint #1 • Gate Inward
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Vehicle Inward & Token Issuance
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture arriving truck details, generate barcode tokens, and print official driver gate passes
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            handlePrefillNewTruck();
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
          style={{ backgroundColor: currentTheme.buttonBg }}
        >
          <Plus className="w-4 h-4" />
          <span>+ New Vehicle Inward Entry</span>
        </button>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-400">Total Entries In Gate</div>
          <div className="text-2xl font-black text-slate-900">{entries.length} Vehicles</div>
          <div className="text-[11px] text-emerald-600 font-semibold">100% Traceability Started</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-400">Active / Registered Status</div>
          <div className="text-2xl font-black text-amber-600">
            {entries.filter((e) => e.status === 'REGISTERED').length} Trucks
          </div>
          <div className="text-[11px] text-slate-400">Next for Gross Weighment</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-400">Total Expected Bags</div>
          <div className="text-2xl font-black text-blue-700">
            {entries.reduce((acc, curr) => acc + (Number(curr.expected_bags) || 0), 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Challan verified count</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-400">Barcode Generation</div>
          <div className="text-xs font-mono font-bold text-emerald-700 truncate mt-1">
            Official SVG Barcodes
          </div>
          <div className="text-[11px] text-slate-400">Scan at Weighbridge</div>
        </div>
      </div>

      {/* Register Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Inward Token Register</h2>
            <p className="text-xs text-slate-400">Click &apos;Print Pass&apos; to load the official barcode slip from the backend</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInwardEntries}
              disabled={isLoadingList}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              title="Refresh List"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search token, vehicle, driver..."
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
                <th className="pb-3">Arrival Time</th>
                <th className="pb-3">Vehicle Number</th>
                <th className="pb-3">Driver Info</th>
                <th className="pb-3">Source Name</th>
                <th className="pb-3">Material & Bags</th>
                <th className="pb-3">Expected Qty</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Gate Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No active vehicles in register. Click <strong>+ New Vehicle Inward Entry</strong> to register a new truck!
                  </td>
                </tr>
              ) : (
                filteredEntries.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 font-bold font-mono text-slate-900">{row.gate_token}</td>
                    <td className="py-3.5 text-slate-500 font-mono" suppressHydrationWarning>
                      {formatTimeSafely(row.arrival_date_time)}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-slate-800">{row.vehicle_number}</td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-800">{row.driver_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{row.driver_mobile}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-800">{row.source_name}</div>
                      <div className="text-[10px] text-slate-400">{row.source_location} ({row.source_type})</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900">{row.material_type}</div>
                      <div className="text-[10px] font-mono font-bold text-blue-700">{row.expected_bags} Bags</div>
                    </td>
                    <td className="py-3.5 font-mono font-semibold text-slate-900">
                      {row.expected_quantity} {row.expected_quantity_unit}
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleFetchGatePass(row.gate_token)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3 h-3 text-emerald-600" />
                        <span>Print Pass</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Vehicle Inward Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  New Gate Inward Entry (Checkpoint #1)
                </h3>
                <p className="text-[11px] text-slate-400">Post vehicle entry to generate official gate pass with barcode</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Backend Error:</div>
                  <div className="leading-relaxed">{errorMsg}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Vehicle Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HR 26 DQ 5521"
                    value={formData.vehicle_number}
                    onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono font-bold focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Transporter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MP State Civil Supplies Transport"
                    value={formData.transporter_name}
                    onChange={(e) => setFormData({ ...formData, transporter_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Driver Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dinesh Sharma"
                    value={formData.driver_name}
                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Driver Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9755512345"
                    value={formData.driver_mobile}
                    onChange={(e) => setFormData({ ...formData, driver_mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Material Type *</label>
                  <select
                    value={formData.material_type}
                    onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-emerald-500 bg-white"
                  >
                    <option value="Paddy">Paddy</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Mustard Seed">Mustard Seed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Source Type *</label>
                  <select
                    value={formData.source_type}
                    onChange={(e) => setFormData({ ...formData, source_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 bg-white"
                  >
                    <option value="Government Procurement Centre">Government Procurement Centre</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Other Mill">Other Mill</option>
                    <option value="Internal Transfer">Internal Transfer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Source Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MP Mandi Board Centre #4"
                    value={formData.source_name}
                    onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Source Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hoshangabad, MP"
                    value={formData.source_location}
                    onChange={(e) => setFormData({ ...formData, source_location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Reference Number</label>
                  <input
                    type="text"
                    placeholder="e.g. GOVT-ALLOC-2026-908"
                    value={formData.reference_number}
                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Challan Number</label>
                  <input
                    type="text"
                    placeholder="e.g. GOVT-DSP-4410"
                    value={formData.challan_number}
                    onChange={(e) => setFormData({ ...formData, challan_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expected Quantity *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 420.75"
                    value={formData.expected_quantity}
                    onChange={(e) => setFormData({ ...formData, expected_quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Unit</label>
                  <select
                    value={formData.expected_quantity_unit}
                    onChange={(e) => setFormData({ ...formData, expected_quantity_unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 bg-white"
                  >
                    <option value="Quintals">Quintals</option>
                    <option value="Metric Tonnes">Metric Tonnes (MT)</option>
                    <option value="Kilograms">Kilograms (KG)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expected Bags *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 840"
                    value={formData.expected_bags}
                    onChange={(e) => setFormData({ ...formData, expected_bags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">Remarks / Inspection Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Govt dispatch challan verified and stamped"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                />
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: currentTheme.buttonBg }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Pass...</span>
                    </>
                  ) : (
                    <span>Register Vehicle & Issue Pass</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECOND API: OFFICIAL DRIVER GATE PASS WITH BARCODE MODAL */}
      {/* ========================================================= */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Wheat className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-base tracking-tight text-slate-900 uppercase">
                  {selectedPass.mill_name || 'Kongos Rice Mill'}
                </h4>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Official Computerized Driver Gate Pass • Checkpoint #1
              </p>
            </div>

            {/* Official Barcode Image from Backend */}
            <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex justify-center items-center py-1 overflow-hidden">
                {selectedPass.barcode_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPass.barcode_image}
                    alt={`Barcode for ${selectedPass.gate_token}`}
                    className="max-h-16 mx-auto object-contain"
                  />
                ) : (
                  <div className="font-mono text-xl font-black text-slate-900">{selectedPass.gate_token}</div>
                )}
              </div>
              <div className="text-[10px] text-slate-500 font-mono" suppressHydrationWarning>
                Arrival Time: {new Date(selectedPass.arrival_date_time).toLocaleString()}
              </div>
            </div>

            {/* Pass Metadata */}
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Vehicle Number:</span>
                <span className="font-mono font-black text-slate-900">{selectedPass.vehicle_number}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">Driver:</span>
                <span className="font-semibold text-slate-900">
                  {selectedPass.driver_name} ({selectedPass.driver_mobile})
                </span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">Transporter:</span>
                <span className="text-slate-800 font-medium">{selectedPass.transporter_name}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">Source Mandi:</span>
                <span className="text-slate-800">{selectedPass.source_name} ({selectedPass.source_location})</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">Challan / Ref No:</span>
                <span className="font-mono text-slate-700">{selectedPass.challan_number || selectedPass.reference_number}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">Material & Weight:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {selectedPass.expected_quantity} {selectedPass.expected_quantity_unit} ({selectedPass.expected_bags} Bags)
                </span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">Gate Operator:</span>
                <span className="font-bold text-slate-700 capitalize">{selectedPass.operator_name}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">Next Destination:</span>
                <span className="font-bold text-amber-600">{selectedPass.next_step}</span>
              </div>
            </div>

            {/* Driver Instructions from Backend */}
            {selectedPass.instructions && selectedPass.instructions.length > 0 && (
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 space-y-1">
                <div className="text-[10px] font-bold text-amber-900 uppercase">Driver Instructions:</div>
                <ul className="text-[10px] text-amber-800 space-y-0.5 list-none">
                  {selectedPass.instructions.map((inst, idx) => (
                    <li key={idx} className="leading-tight">{inst}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPass(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="w-1/2 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                style={{ backgroundColor: currentTheme.buttonBg }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Gate Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}