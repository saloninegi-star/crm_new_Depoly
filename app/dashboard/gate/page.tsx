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
  Edit2,
  Trash2,
  Download,
  Eye,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const [role, setRole] = useState('gate_guard');
  const [isMounted, setIsMounted] = useState(false);
  const [entries, setEntries] = useState<GateInwardResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [editingTokenName, setEditingTokenName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // View Details Modal State
  const [selectedEntryForDetails, setSelectedEntryForDetails] = useState<GateInwardResponse | null>(null);

  // Delete State
  const [entryToDelete, setEntryToDelete] = useState<GateInwardResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Driver Barcode Pass Modal State
  const [selectedPass, setSelectedPass] = useState<GatePassDetails | null>(null);

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
    remarks: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const directRole = localStorage.getItem('user_role');
      if (directRole) {
        setRole(directRole.toLowerCase().trim());
      }
    }
    fetchInwardEntries();
  }, []);

  const isOwner = role === 'superadmin' || role === 'owner' || role === 'admin';

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

  const handleFetchGatePass = async (gate_token: string) => {
    try {
      const passData = await gateService.getGatePass(gate_token);
      setSelectedPass(passData);
    } catch (err: unknown) {
      alert(extractErrorMessage(err));
    }
  };

  const handleOpenEditModal = (row: GateInwardResponse) => {
    setEditingEntryId(row.id);
    setEditingTokenName(row.gate_token);
    setErrorMsg(null);
    setFormData({
      vehicle_number: row.vehicle_number || '',
      driver_name: row.driver_name || '',
      driver_mobile: row.driver_mobile || '',
      transporter_name: row.transporter_name || '',
      material_type: row.material_type || 'Paddy',
      source_type: row.source_type || 'Government Procurement Centre',
      source_name: row.source_name || '',
      source_location: row.source_location || '',
      reference_number: row.reference_number || '',
      challan_number: row.challan_number || '',
      expected_quantity: row.expected_quantity ? String(row.expected_quantity) : '',
      expected_quantity_unit: row.expected_quantity_unit || 'Quintals',
      expected_bags: row.expected_bags ? String(row.expected_bags) : '',
      remarks: row.remarks || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenNewModal = () => {
    setEditingEntryId(null);
    setEditingTokenName('');
    setErrorMsg(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

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

      if (editingEntryId !== null) {
        const updatedRes = await gateService.updateInwardEntry(editingEntryId, payload);
        setEntries(entries.map((item) => (item.id === editingEntryId ? updatedRes : item)));
        setIsModalOpen(false);
        setEditingEntryId(null);
      } else {
        const newRes = await gateService.createInwardEntry(payload);
        setEntries([newRes, ...entries]);
        setIsModalOpen(false);
        setFormData(initialFormState);
        await handleFetchGatePass(newRes.gate_token);
      }
    } catch (err: unknown) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    setIsDeleting(true);

    try {
      await gateService.deleteInwardEntry(entryToDelete.id);
      setEntries(entries.filter((item) => item.id !== entryToDelete.id));
      setEntryToDelete(null);
    } catch (err: unknown) {
      alert(extractErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================================================
  // DOWNLOAD GATE PASS AS IMAGE FILE
  // =========================================================
  const handleDownloadSlip = () => {
    if (!selectedPass) return;

    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 610, 880);

    // Header
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(selectedPass.mill_name || 'KOGNOS RICE MILL', 325, 65);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('OFFICIAL COMPUTERIZED DRIVER GATE PASS • CHECKPOINT #1', 325, 90);

    // Barcode rendering
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 100, 115, 450, 85);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Arrival Time: ${new Date(selectedPass.arrival_date_time).toLocaleString()}`, 325, 225);

      ctx.textAlign = 'left';

      const drawRow = (label: string, value: string, y: number, isBold = false, valueColor = '#0f172a') => {
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText(label, 50, y);

        ctx.fillStyle = valueColor;
        ctx.font = isBold ? 'bold 13px sans-serif' : '13px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(value, 600, y);
        ctx.textAlign = 'left';

        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, y + 8);
        ctx.lineTo(600, y + 8);
        ctx.stroke();
      };

      drawRow('Token Number:', selectedPass.gate_token, 260, true);
      drawRow('Vehicle Number:', selectedPass.vehicle_number, 295, true);
      drawRow('Driver Info:', `${selectedPass.driver_name} (${selectedPass.driver_mobile})`, 330, true);
      drawRow('Transporter:', selectedPass.transporter_name, 365);
      drawRow('Source Mandi:', `${selectedPass.source_name} (${selectedPass.source_location})`, 400);
      drawRow('Challan / Ref No:', selectedPass.challan_number || selectedPass.reference_number || 'N/A', 435);
      drawRow('Material & Weight:', `${selectedPass.expected_quantity} ${selectedPass.expected_quantity_unit} (${selectedPass.expected_bags} Bags)`, 470, true, '#047857');
      drawRow('Gate Operator:', selectedPass.operator_name, 505, true);
      drawRow('Next Destination:', selectedPass.next_step, 540, true, '#d97706');

      // Instructions Box
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(50, 565, 550, 160);
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(50, 565, 550, 160);

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('DRIVER INSTRUCTIONS:', 65, 595);

      ctx.fillStyle = '#92400e';
      ctx.font = '12px sans-serif';
      const instructions = selectedPass.instructions || [
        '1. Proceed directly to the Weighbridge for Gross Weight recording.',
        '2. Hand over this gate pass slip to the Weighbridge operator.',
        '3. Keep this token number safe for all subsequent check-points.',
      ];
      instructions.forEach((inst, idx) => {
        ctx.fillText(inst, 65, 625 + idx * 25);
      });

      // Signature Area
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Authorized Signature / Gate Security Stamp', 325, 850);
      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(180, 830);
      ctx.lineTo(470, 830);
      ctx.stroke();

      // Trigger automatic file download
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `GatePass_${selectedPass.gate_token}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = selectedPass.barcode_image;
  };

  // =========================================================
  // PRINT CLEAN GATE PASS SLIP (ONLY SLIP, NO DASHBOARD)
  // =========================================================
  const handlePrintSlip = () => {
    if (!selectedPass) return;

    const printWindow = window.open('', '_blank', 'width=700,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Gate Pass - ${selectedPass.gate_token}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; margin: 0; color: #0f172a; }
            .pass-container { max-width: 480px; margin: 0 auto; border: 2px dashed #94a3b8; padding: 25px; border-radius: 16px; }
            .header { text-align: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 15px; }
            .header h2 { margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase; color: #064e3b; }
            .header p { margin: 4px 0 0; font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; }
            .barcode-box { text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 15px; }
            .barcode-box img { max-height: 60px; margin: 0 auto; display: block; }
            .time { font-size: 11px; color: #64748b; font-family: monospace; margin-top: 6px; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
            .label { color: #64748b; font-weight: 500; }
            .value { font-weight: 700; color: #0f172a; font-family: monospace; }
            .highlight { color: #047857; font-weight: 800; }
            .dest { color: #d97706; font-weight: 800; }
            .instructions { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px; margin-top: 15px; font-size: 11px; color: #92400e; }
            .instructions h4 { margin: 0 0 6px; font-size: 11px; font-weight: 800; }
            .instructions ol { margin: 0; padding-left: 18px; }
            .instructions li { margin-bottom: 4px; }
            .footer-stamp { margin-top: 35px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 20px; font-size: 11px; color: #64748b; }
            @media print {
              body { padding: 0; }
              .pass-container { border: 1px solid #000; box-shadow: none; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="pass-container">
            <div class="header">
              <h2>${selectedPass.mill_name || 'KOGNOS RICE MILL'}</h2>
              <p>OFFICIAL COMPUTERIZED DRIVER GATE PASS • CHECKPOINT #1</p>
            </div>
            <div class="barcode-box">
              <img src="${selectedPass.barcode_image}" alt="Barcode" />
              <div class="time">Arrival Time: ${new Date(selectedPass.arrival_date_time).toLocaleString()}</div>
            </div>
            <div class="row"><span class="label">Token Number:</span><span class="value">${selectedPass.gate_token}</span></div>
            <div class="row"><span class="label">Vehicle Number:</span><span class="value">${selectedPass.vehicle_number}</span></div>
            <div class="row"><span class="label">Driver Name:</span><span class="value">${selectedPass.driver_name} (${selectedPass.driver_mobile})</span></div>
            <div class="row"><span class="label">Transporter:</span><span class="value">${selectedPass.transporter_name}</span></div>
            <div class="row"><span class="label">Source Mandi:</span><span class="value">${selectedPass.source_name} (${selectedPass.source_location})</span></div>
            <div class="row"><span class="label">Challan / Ref No:</span><span class="value">${selectedPass.challan_number || selectedPass.reference_number || 'N/A'}</span></div>
            <div class="row"><span class="label">Material & Load:</span><span class="value highlight">${selectedPass.expected_quantity} ${selectedPass.expected_quantity_unit} (${selectedPass.expected_bags} Bags)</span></div>
            <div class="row"><span class="label">Gate Operator:</span><span class="value">${selectedPass.operator_name}</span></div>
            <div class="row"><span class="label">Next Destination:</span><span class="value dest">${selectedPass.next_step}</span></div>
            <div class="instructions">
              <h4>DRIVER INSTRUCTIONS:</h4>
              <ol>
                ${(selectedPass.instructions || []).map((ins) => `<li>${ins}</li>`).join('')}
              </ol>
            </div>
            <div class="footer-stamp">
              Authorized Gate Security Stamp & Signature
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const totalExpectedBags = entries.reduce((acc, curr) => acc + (Number(curr.expected_bags) || 0), 0);
  const totalExpectedTonnageMT = (
    entries.reduce((acc, curr) => {
      const qty = Number(curr.expected_quantity) || 0;
      return acc + (curr.expected_quantity_unit === 'Quintals' ? qty / 10 : qty);
    }, 0)
  ).toFixed(2);

  const filteredEntries = entries.filter(
    (item) =>
      item.gate_token?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicle_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.driver_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="gate-entry-page space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: currentTheme.buttonBg }}
            >
              {isOwner ? 'Executive Audit & Control' : 'Checkpoint #1 • Gate Inward'}
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {isOwner ? 'Gate Inward Audit & Procurement Log' : 'Vehicle Inward & Token Issuance'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isOwner
              ? 'Complete oversight of mandi procurement arrivals, operator audit trail, and lot traceability'
              : 'Capture arriving truck details, generate barcode tokens, and print official driver gate passes'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => alert('Exporting Gate Inward Audit Report to Excel...')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-slate-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('ui_8de49d04cb02')}</span>
            </button>
          )}

          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
            style={{ backgroundColor: currentTheme.buttonBg }}
          >
            <Plus className="w-4 h-4" />
            <span>{t('ui_c55c63c61433')}</span>
          </button>
        </div>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-400">{t('ui_0c47c4905d57')}</div>
          <div className="text-2xl font-black text-slate-900">{entries.length} {' '}{t('ui_60261ed2752b')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{t('ui_93d479486534')}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-400">{t('ui_8e72c417fc02')}</div>
          <div className="text-2xl font-black text-amber-600">
            {entries.filter((e) => e.status === 'REGISTERED').length} {' '}{t('ui_4ea366be4896')}</div>
          <div className="text-[11px] text-slate-400">{t('ui_ed2ea427d519')}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-400">{t('ui_f16069c65390')}</div>
          <div className="text-2xl font-black text-blue-700">
            {totalExpectedBags.toLocaleString()} {' '}{t('ui_81cf1fc845ed')}</div>
          <div className="text-[11px] text-slate-400">{t('ui_b8711615a258')}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-400">{t('ui_14fe74aa863d')}</div>
          <div className="text-2xl font-black text-emerald-700">
            {totalExpectedTonnageMT} {' '}{t('ui_c3c2fa56598a')}</div>
          <div className="text-[11px] text-slate-400">
            {isOwner ? 'Mandi + Farmer Procured' : 'Awaiting Weighbridge Gross Wt'}
          </div>
        </div>
      </div>

      {/* Register Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isOwner ? 'Gate Inward Master Ledger & Audit Trail' : 'Live Inward Token Register'}
            </h2>
            <p className="text-xs text-slate-400">
              {t('ui_d63416b1a504')}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInwardEntries}
              disabled={isLoadingList}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              title={t('ui_776799637f6e')}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t('ui_7568e639f3df')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3 min-w-[120px]">{t('ui_821571a6fa0a')}</th>
                <th className="pb-3 min-w-[80px]">{t('ui_83147a9f9d64')}</th>
                <th className="pb-3 min-w-[120px]">{t('ui_8dc1033116ec')}</th>
                <th className="pb-3 min-w-[120px]">{t('ui_e40d079553fa')}</th>
                <th className="pb-3 min-w-[150px]">{t('ui_b8191a52ed11')}</th>
                <th className="pb-3 min-w-[110px]">{t('ui_847a634f72b1')}</th>
                <th className="pb-3 min-w-[100px]">{t('ui_64e72a283e5d')}</th>
                <th className="pb-3 min-w-[100px]">{t('ui_bae7d5be7082')}</th>
                {isOwner && <th className="pb-3 min-w-[90px]">{t('ui_d0e687b079fb')}</th>}
                <th className="pb-3 text-right min-w-[210px]">{t('ui_c3cd636a585b')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={isOwner ? 10 : 9} className="py-8 text-center text-slate-400">
                    {t('ui_184719e6188a')}{' '}<strong>{t('ui_c55c63c61433')}</strong> {' '}{t('ui_d8e4eb7d7d59')}</td>
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
                      <div className="text-[10px] font-mono font-bold text-blue-700">{row.expected_bags} {' '}{t('ui_81cf1fc845ed')}</div>
                    </td>
                    <td className="py-3.5 font-mono font-semibold text-slate-900">
                      {row.expected_quantity} {row.expected_quantity_unit}
                    </td>

                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t(row.status)}
                      </span>
                    </td>

                    {isOwner && (
                      <td className="py-3.5 font-mono text-slate-700 capitalize font-semibold">
                        {row.created_by_name || 'suraj'}
                      </td>
                    )}

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEntryForDetails(row)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1"
                          title={t('ui_b37ce5242175')}
                        >
                          <Eye className="w-3 h-3 text-slate-600" />
                          <span>{t('ui_69bd4ef9fbd0')}</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(row)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1"
                          title={t('ui_f72e1fe4d9ef')}
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                          <span>{t('ui_5301648dcf6b')}</span>
                        </button>
                        
                        <button
                          onClick={() => handleFetchGatePass(row.gate_token)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1"
                          title={t('ui_e74c19eea8f1')}
                        >
                          <Printer className="w-3 h-3 text-emerald-600" />
                          <span>{t('ui_5b221e9c2a45')}</span>
                        </button>

                        <button
                          onClick={() => setEntryToDelete(row)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer inline-flex items-center gap-1"
                          title={t('ui_bdf92d71686b')}
                        >
                          <Trash2 className="w-3 h-3 text-rose-600" />
                          <span>{t('ui_f6fdbe48dc54')}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: VIEW FULL ENTRY DETAILS POPUP */}
      {selectedEntryForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {t('ui_c22451ecee40')}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {t(selectedEntryForDetails.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {t('ui_717e44080c0f')}{' '}{selectedEntryForDetails.gate_token} {' '}{t('ui_ebbe727c544f')}{selectedEntryForDetails.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEntryForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('ui_0c39d00be3e0')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_8dc1033116ec')}</span>
                    <strong className="font-mono text-slate-900 text-sm">{selectedEntryForDetails.vehicle_number}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_0f9da9fa2f13')}</span>
                    <strong className="text-slate-800">{selectedEntryForDetails.transporter_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_297221998e73')}</span>
                    <strong className="text-slate-800">{selectedEntryForDetails.driver_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_9482a67a5571')}</span>
                    <strong className="font-mono text-slate-800">{selectedEntryForDetails.driver_mobile}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('ui_f669ba784ae0')}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_839de310ff88')}</span>
                    <strong className="text-slate-900">{selectedEntryForDetails.material_type}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_2bca29a307ee')}</span>
                    <strong className="font-mono text-emerald-700 text-sm">
                      {selectedEntryForDetails.expected_quantity} {selectedEntryForDetails.expected_quantity_unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_111f32541e4f')}</span>
                    <strong className="font-mono text-blue-700 text-sm">
                      {selectedEntryForDetails.expected_bags} {' '}{t('ui_81cf1fc845ed')}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('ui_48138b2c315f')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_f50cde6fbce1')}</span>
                    <strong className="text-slate-800">{selectedEntryForDetails.source_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_319ca91ffd92')}</span>
                    <strong className="text-slate-800">{selectedEntryForDetails.source_location} ({selectedEntryForDetails.source_type})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_bbcec6a90780')}</span>
                    <strong className="font-mono text-slate-800">{selectedEntryForDetails.challan_number || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_6416d7da0752')}</span>
                    <strong className="font-mono text-slate-800">{selectedEntryForDetails.reference_number || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t('ui_bb6dbb9d31bd')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_b2ce2db26ac4')}</span>
                    <span className="font-mono text-slate-700">{new Date(selectedEntryForDetails.arrival_date_time).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('ui_50c84914efc1')}</span>
                    <span className="font-bold text-slate-800 capitalize">{selectedEntryForDetails.created_by_name || 'suraj'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">{t('ui_03910fb8597b')}</span>
                    <span className="text-slate-700 italic">{selectedEntryForDetails.remarks || 'None'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50">
              <button
                onClick={() => setSelectedEntryForDetails(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {t('ui_bbfa773e5a63')}</button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const row = selectedEntryForDetails;
                    setSelectedEntryForDetails(null);
                    handleOpenEditModal(row);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('ui_0e6ccc8f0ed3')}</span>
                </button>

                <button
                  onClick={() => {
                    const token = selectedEntryForDetails.gate_token;
                    setSelectedEntryForDetails(null);
                    handleFetchGatePass(token);
                  }}
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  style={{ backgroundColor: currentTheme.buttonBg }}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('ui_e74c19eea8f1')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create OR Update Inward Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingEntryId !== null ? `Update Inward Entry (${editingTokenName})` : 'New Gate Inward Entry (Checkpoint #1)'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {editingEntryId !== null
                    ? `Update record for ID #${editingEntryId}`
                    : 'Post vehicle entry to generate official gate pass with barcode'}
                </p>
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
                  <div className="font-bold">{t('ui_152196d7bc04')}</div>
                  <div className="leading-relaxed">{errorMsg}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_bd0888c6dd89')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('ui_27e840345198')}
                    value={formData.vehicle_number}
                    onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono font-bold focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_d0e9a6acba32')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('ui_4a06873d1dc8')}
                    value={formData.transporter_name}
                    onChange={(e) => setFormData({ ...formData, transporter_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_201a0989a1ac')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('ui_580fcc545198')}
                    value={formData.driver_name}
                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_db1c39663353')}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t('ui_c8e1e253ac5f')}
                    value={formData.driver_mobile}
                    onChange={(e) => setFormData({ ...formData, driver_mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_52675bc28dc1')}</label>
                  <select
                    value={formData.material_type}
                    onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-emerald-500 bg-white"
                  >
                    <option value="Paddy">{t('ui_39ff90b098aa')}</option>
                    <option value="Wheat">{t('ui_ea3580dfefc8')}</option>
                    <option value="Mustard Seed">{t('ui_2a329b08ab44')}</option>
                    <option value="Other">{t('ui_6e6a6f2086bb')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_35d702985c05')}</label>
                  <select
                    value={formData.source_type}
                    onChange={(e) => setFormData({ ...formData, source_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 bg-white"
                  >
                    <option value="Farmer">{t('ui_e5c4e470299e')}</option>
                    <option value="Government Procurement Centre">{t('ui_de6631f86e40')}</option>
                    <option value="Supplier">{t('ui_55edd462872a')}</option>
                    <option value="Other Mill">{t('ui_9e946842f7e7')}</option>
                    <option value="Internal Transfer">{t('ui_e06d014aa7a8')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_8572ec2c1b12')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('ui_4d0a3e1e60f5')}
                    value={formData.source_name}
                    onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_53fc5bfbb317')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('ui_1d0d4905e5d8')}
                    value={formData.source_location}
                    onChange={(e) => setFormData({ ...formData, source_location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_74195db59dc9')}</label>
                  <input
                    type="text"
                    placeholder={t('ui_090989ea8035')}
                    value={formData.reference_number}
                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_bbcec6a90780')}</label>
                  <input
                    type="text"
                    placeholder={t('ui_2d48d6e76bfa')}
                    value={formData.challan_number}
                    onChange={(e) => setFormData({ ...formData, challan_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_b0f55a1ca42d')}</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder={t('ui_60af2e968724')}
                    value={formData.expected_quantity}
                    onChange={(e) => setFormData({ ...formData, expected_quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_f6b935ab3371')}</label>
                  <select
                    value={formData.expected_quantity_unit}
                    onChange={(e) => setFormData({ ...formData, expected_quantity_unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 bg-white"
                  >
                    <option value="Quintals">{t('ui_1b72732d5b53')}</option>
                    <option value="Metric Tonnes">{t('ui_0be78421f9d3')}</option>
                    <option value="Kilograms">{t('ui_afeb2e60ff68')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('ui_3f417f586307')}</label>
                  <input
                    type="number"
                    required
                    placeholder={t('ui_a2990b748d30')}
                    value={formData.expected_bags}
                    onChange={(e) => setFormData({ ...formData, expected_bags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">{t('ui_dc16c1a65f8f')}</label>
                <input
                  type="text"
                  placeholder={t('ui_6143e40d8227')}
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
                  {t('ui_77dfd2135f4d')}</button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: currentTheme.buttonBg }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{editingEntryId !== null ? 'Updating Record...' : 'Generating Pass...'}</span>
                    </>
                  ) : (
                    <span>{editingEntryId !== null ? 'Update Inward Entry' : 'Register Vehicle & Issue Pass'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION MODAL */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <button
                onClick={() => setEntryToDelete(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{t('ui_f4188221c360')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('ui_1c19db292584')}{' '}<strong className="text-slate-800 font-mono">{entryToDelete.gate_token}</strong> ({entryToDelete.vehicle_number}{t('ui_9dea1abcb3eb')}</p>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setEntryToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t('ui_77dfd2135f4d')}</button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-sm shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: DRIVER GATE PASS SLIP (WITH PRINT & DOWNLOAD)   */}
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
                {t('ui_10be91076840')}</p>
            </div>

            {/* Barcode Image */}
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
                {t('ui_b5acca0c9b0b')}{' '}{new Date(selectedPass.arrival_date_time).toLocaleString()}
              </div>
            </div>

            {/* Slip Meta */}
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">{t('ui_71d6b7067c56')}</span>
                <span className="font-mono font-black text-slate-900">{selectedPass.vehicle_number}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">{t('ui_b5b7f6b7f66a')}</span>
                <span className="font-semibold text-slate-900">
                  {selectedPass.driver_name} ({selectedPass.driver_mobile})
                </span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">{t('ui_84adc74e7d98')}</span>
                <span className="text-slate-800 font-medium">{selectedPass.transporter_name}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">{t('ui_832f1a74465c')}</span>
                <span className="text-slate-800">{selectedPass.source_name} ({selectedPass.source_location})</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">{t('ui_704e90a79b8f')}</span>
                <span className="font-mono text-slate-700">{selectedPass.challan_number || selectedPass.reference_number}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">{t('ui_6f1f12737208')}</span>
                <span className="font-mono font-bold text-emerald-700">
                  {selectedPass.expected_quantity} {selectedPass.expected_quantity_unit} ({selectedPass.expected_bags} {' '}{t('ui_227bfb83e10f')}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">{t('ui_23524fe6bff7')}</span>
                <span className="font-bold text-slate-700 capitalize">{selectedPass.operator_name}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-400">{t('ui_815b087c9fcb')}</span>
                <span className="font-bold text-amber-600">{selectedPass.next_step}</span>
              </div>
            </div>

            {/* Driver Instructions */}
            {selectedPass.instructions && selectedPass.instructions.length > 0 && (
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 space-y-1">
                <div className="text-[10px] font-bold text-amber-900 uppercase">{t('ui_3c65b2cb4d54')}</div>
                <ul className="text-[10px] text-amber-800 space-y-0.5 list-none">
                  {selectedPass.instructions.map((inst, idx) => (
                    <li key={idx} className="leading-tight">{inst}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* THREE BUTTONS: Close, Download Slip, and Print Slip */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPass(null)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t('ui_bbfa773e5a63')}</button>

              {/* DOWNLOAD BUTTON: Downloads Gate Pass directly to computer */}
              <button
                onClick={handleDownloadSlip}
                className="py-2.5 px-3.5 rounded-xl border border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                title={t('ui_269ba8b39cf5')}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('ui_7b7d677d62a2')}</span>
              </button>

              {/* PRINT BUTTON: Opens clean thermal/printer view */}
              <button
                onClick={handlePrintSlip}
                className="py-2.5 px-3.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
                style={{ backgroundColor: currentTheme.buttonBg }}
                title={t('ui_6878d9869241')}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('ui_68a24eb1f4f9')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}