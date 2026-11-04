'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Send,
  Search,
  Plus,
  Truck,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  X,
  Building,
  TrendingUp,
  MapPin,
  Layers,
} from 'lucide-react';

interface SalesOrder {
  order: string;
  party: string;
  city: string;
  product: string;
  pack: string;
  quantityMt: number;
  bags: number;
  truck: string;
  lrNo: string;
  value: number;
  status: 'waiting_truck' | 'loading' | 'dispatched';
  statusText: string;
  loadingProgress?: string;
  dispatchTime?: string;
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

const INITIAL_ORDERS: SalesOrder[] = [
  {
    order: 'SO-2214',
    party: 'Mehta Rice Traders',
    city: 'Jaipur',
    product: '1121 Basmati, steam',
    pack: '50 kg bags',
    quantityMt: 50.0,
    bags: 1000,
    truck: 'Not assigned',
    lrNo: '—',
    value: 3400000,
    status: 'waiting_truck',
    statusText: 'Waiting for truck',
  },
  {
    order: 'SO-2212',
    party: 'Balaji Export House',
    city: 'Mundra port',
    product: '1509 Basmati, sella',
    pack: '50 kg bags',
    quantityMt: 60.0,
    bags: 1200,
    truck: 'Not assigned',
    lrNo: '—',
    value: 3720000,
    status: 'waiting_truck',
    statusText: 'Waiting for truck',
  },
  {
    order: 'SO-2211',
    party: 'Aggarwal Foods',
    city: 'Kanpur',
    product: 'PR-126, raw',
    pack: '50 kg bags',
    quantityMt: 30.0,
    bags: 600,
    truck: 'UP  78  FT  4410',
    lrNo: 'After loading',
    value: 1035000,
    status: 'loading',
    statusText: 'Loading · 420 of 600 bags',
    loadingProgress: '420 of 600 bags',
  },
  {
    order: 'SO-2213',
    party: 'Gupta Kirana Store',
    city: 'Karnal',
    product: '1121 Basmati, steam',
    pack: '20 kg bags',
    quantityMt: 3.0,
    bags: 150,
    truck: 'HR  05  AC  1188',
    lrNo: '88414',
    value: 216000,
    status: 'dispatched',
    statusText: 'Dispatched 10:05',
    dispatchTime: '10:05',
  },
  {
    order: 'SO-2210',
    party: 'Shree Krishna Traders',
    city: 'Delhi',
    product: '1121 Basmati, steam',
    pack: '50 kg bags',
    quantityMt: 20.0,
    bags: 400,
    truck: 'HR  55  K  2231',
    lrNo: '88412',
    value: 1360000,
    status: 'dispatched',
    statusText: 'Dispatched 08:50',
    dispatchTime: '08:50',
  },
];

export default function SalesDispatchPage() {
  const { accent } = useTheme();
  const { t } = useLanguage();

  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderParty, setNewOrderParty] = useState('');
  const [newOrderCity, setNewOrderCity] = useState('');
  const [newOrderProduct, setNewOrderProduct] = useState('1121 Basmati, steam');
  const [newOrderPack, setNewOrderPack] = useState('50 kg bags');
  const [newOrderQty, setNewOrderQty] = useState('25');
  const [newOrderRate, setNewOrderRate] = useState('6800');

  const [assignTruckOrder, setAssignTruckOrder] = useState<SalesOrder | null>(null);
  const [truckNumberInput, setTruckNumberInput] = useState('');
  const [transporterName, setTransporterName] = useState('Jaipur Golden Transport');

  const [printLrOrder, setPrintLrOrder] = useState<SalesOrder | null>(null);

  // Search filter
  const filteredOrders = orders.filter(
    (item) =>
      item.order.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.truck.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lrNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle New Order Submit
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderParty) return;

    const qty = Number(newOrderQty) || 10;
    const rate = Number(newOrderRate) || 5000;
    const bagsCount = Math.round((qty * 1000) / (newOrderPack.includes('50') ? 50 : 20));
    const totalVal = Math.round(qty * 10 * rate);

    const newOrderObj: SalesOrder = {
      order: `SO-${2215 + orders.length}`,
      party: newOrderParty,
      city: newOrderCity || 'Mandi Point',
      product: newOrderProduct,
      pack: newOrderPack,
      quantityMt: qty,
      bags: bagsCount,
      truck: 'Not assigned',
      lrNo: '—',
      value: totalVal,
      status: 'waiting_truck',
      statusText: 'Waiting for truck',
    };

    setOrders([newOrderObj, ...orders]);
    setIsNewOrderModalOpen(false);
    setNewOrderParty('');
    setNewOrderCity('');
  };

  // Handle Truck Assignment
  const handleAssignTruck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTruckOrder || !truckNumberInput) return;

    setOrders(
      orders.map((o) => {
        if (o.order === assignTruckOrder.order) {
          return {
            ...o,
            truck: truckNumberInput.toUpperCase(),
            lrNo: 'After loading',
            status: 'loading',
            statusText: `Loading · 0 of ${o.bags} bags`,
            loadingProgress: `0 of ${o.bags} bags`,
          };
        }
        return o;
      })
    );

    setAssignTruckOrder(null);
    setTruckNumberInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* ========================================================
          0. TOP ACTION STRIP (MATCHING SCREENSHOT + NEW SALES ORDER)
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t('ui_c3c2251b0337')}</span>
        </div>

        {/* 🟢 "+ New sales order" Button (Circled in Screenshot) */}
        <button
          type="button"
          onClick={() => setIsNewOrderModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-transform active:scale-95 hover:opacity-95"
          style={{ backgroundColor: accent?.primary || '#0d9488' }}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('ui_82a4750c1958')}</span>
        </button>
      </div>

      {/* ========================================================
          1. TOP 4-CARD METRIC STRIP (WITH COLORFUL ACCENTS)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 - Dispatched today (Emerald) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{t('ui_06cefc499f6e')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹15.76
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">{t('ui_0bea9ff246cd')}</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            {t('ui_f504424e6aec')}</p>
        </div>

        {/* Metric 2 - Loading now (Sky Blue) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-sky-300 dark:hover:border-sky-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{t('ui_06285b1e2c56')}</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Truck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              1
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">{t('ui_7a4d63b1ba71')}</span>
          </div>
          <p className="text-xs text-sky-700 dark:text-sky-400 font-medium truncate">
            SO-2211 · Aggarwal Foods
          </p>
        </div>

        {/* Metric 3 - Waiting for a truck (Amber) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{t('ui_3747b443a5fd')}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              2
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">{t('ui_965840381640')}</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            {t('ui_6e50ddcca706')}</p>
        </div>

        {/* Metric 4 - Lorry receipts today (Purple) */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{t('ui_0ef2f5d1672c')}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <FileText className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              2
            </span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">
            {t('ui_c462dab4e91d')}</p>
        </div>
      </div>

      {/* ========================================================
          2. MASTER TABLE: OPEN AND TODAY'S ORDERS
         ======================================================== */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('ui_029c6ffa3a0b')}</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 dark:bg-slate-800 text-violet-700 dark:text-slate-300">
              {filteredOrders.length} {' '}{t('ui_cded093321dd')}</span>
          </div>

          {/* Search Box matching screenshot */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder={t('ui_b06e03cc6a07')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3.5 pl-2">{t('ui_1d75774c0f96')}</th>
                <th className="pb-3.5">{t('ui_60b18fc8a85f')}</th>
                <th className="pb-3.5">{t('ui_dd3b86d1ef21')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_44f6af694554')}</th>
                <th className="pb-3.5">{t('ui_5bfebf2e9996')}</th>
                <th className="pb-3.5">{t('ui_4a9f0c0a0d3a')}</th>
                <th className="pb-3.5 text-right sm:text-left">{t('ui_8dce170de238')}</th>
                <th className="pb-3.5">{t('ui_bae7d5be7082')}</th>
                <th className="pb-3.5 text-right pr-2">{t('ui_97c89a4d6630')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {filteredOrders.map((row) => (
                <tr
                  key={row.order}
                  className="hover:bg-violet-50/30 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Order ID */}
                  <td className="py-4 pl-2 font-mono text-slate-600 dark:text-slate-400 font-medium">
                    {row.order}
                  </td>

                  {/* Party & City */}
                  <td className="py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{row.party}</div>
                    <div className="text-[11px] text-slate-400">{row.city}</div>
                  </td>

                  {/* Product & Pack */}
                  <td className="py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{row.product}</div>
                    <div className="text-[11px] text-slate-400">{row.pack}</div>
                  </td>

                  {/* Quantity (Tonnes & Bags) */}
                  <td className="py-4 text-right sm:text-left">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {row.quantityMt.toFixed(1)} {' '}{t('ui_8efd86fb78a5')}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {formatNumber(row.bags)} {' '}{t('ui_ba366690aa50')}</div>
                  </td>

                  {/* Truck Number */}
                  <td className="py-4">
                    {row.truck === 'Not assigned' ? (
                      <span className="text-slate-400 font-medium">{row.truck}</span>
                    ) : (
                      <span className="font-mono font-bold text-slate-900 dark:text-white tracking-wider">
                        {row.truck}
                      </span>
                    )}
                  </td>

                  {/* LR no. */}
                  <td className="py-4 font-mono text-slate-600 dark:text-slate-400">
                    {row.lrNo}
                  </td>

                  {/* Value */}
                  <td className="py-4 font-mono font-bold text-slate-900 dark:text-white text-right sm:text-left">
                    ₹{formatNumber(row.value)}
                  </td>

                  {/* Status Badges */}
                  <td className="py-4">
                    {row.status === 'waiting_truck' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {row.statusText}
                      </span>
                    )}

                    {row.status === 'loading' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        {row.statusText}
                      </span>
                    )}

                    {row.status === 'dispatched' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {row.statusText}
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 text-right pr-2">
                    {row.status === 'waiting_truck' && (
                      <button
                        type="button"
                        onClick={() => setAssignTruckOrder(row)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
                      >
                        {t('ui_7d6497cfd56a')}</button>
                    )}

                    {row.status === 'loading' && (
                      <button
                        type="button"
                        onClick={() => setPrintLrOrder(row)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
                      >
                        {t('ui_da8e606cef0b')}</button>
                    )}

                    {row.status === 'dispatched' && (
                      <button
                        type="button"
                        onClick={() => setPrintLrOrder(row)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95 flex items-center gap-1.5 ml-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t('ui_facfb534faa7')}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          3. MODAL 1: NEW SALES ORDER (CIRCLED IN RED IN IMAGE)
         ======================================================== */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111726] rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('ui_9d8d9fdc8e4d')}</h3>
                <p className="text-[11px] text-slate-400">
                  {t('ui_5e5ddd4241a1')}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('ui_518dc1096aff')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jain Agro Traders"
                    value={newOrderParty}
                    onChange={(e) => setNewOrderParty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('ui_e758c896bbc5')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('ui_c4d0342617aa')}
                    value={newOrderCity}
                    onChange={(e) => setNewOrderCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('ui_e44d4c1624d8')}</label>
                  <select
                    value={newOrderProduct}
                    onChange={(e) => setNewOrderProduct(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                  >
                    <option value="1121 Basmati, steam">{t('ui_6f39b288ce64')}</option>
                    <option value="1509 Basmati, sella">{t('ui_3038d5ced739')}</option>
                    <option value="PR-126, raw">{t('ui_4c676fa0b1e7')}</option>
                    <option value="Broken rice, 25%">{t('ui_b9912ba163ea')}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('ui_b1dc64ed10b1')}</label>
                  <select
                    value={newOrderPack}
                    onChange={(e) => setNewOrderPack(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                  >
                    <option value="50 kg bags">{t('ui_6356971b2d4a')}</option>
                    <option value="20 kg bags">{t('ui_bf67aa0ecb09')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('ui_2df93551ac2e')}</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newOrderQty}
                    onChange={(e) => setNewOrderQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('ui_48849a8014d2')}</label>
                  <input
                    type="number"
                    required
                    value={newOrderRate}
                    onChange={(e) => setNewOrderRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Order Estimation Box */}
              <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-teal-900 dark:text-teal-300">{t('ui_3f4341eecd32')}</span>
                  <span className="font-mono font-bold text-teal-800 dark:text-teal-200">
                    {Math.round(
                      (Number(newOrderQty) * 1000) / (newOrderPack.includes('50') ? 50 : 20)
                    )}{' '}
                    {t('ui_81cf1fc845ed')}</span>
                </div>
                <div className="flex justify-between border-t border-teal-200/60 dark:border-teal-800/60 pt-1 font-bold">
                  <span className="text-teal-950 dark:text-white">{t('ui_437195eb3f20')}</span>
                  <span className="font-mono text-teal-700 dark:text-teal-400 text-sm">
                    ₹{formatNumber(Math.round(Number(newOrderQty) * 10 * Number(newOrderRate)))}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {t('ui_77dfd2135f4d')}</button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  {t('ui_37f3d46f8fe2')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          4. MODAL 2: ASSIGN TRUCK
         ======================================================== */}
      {assignTruckOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111726] rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('ui_a2ad4a1e724c')}</h3>
                <p className="text-[11px] text-slate-400">
                  {assignTruckOrder.order} · {assignTruckOrder.party}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignTruckOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignTruck} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ui_f82b65a27a06')}</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {assignTruckOrder.quantityMt} {' '}{t('ui_7ca204c3e247')}{assignTruckOrder.bags} {' '}{t('ui_c354804a5c09')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ui_b61bb0422229')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {assignTruckOrder.city}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('ui_bd0888c6dd89')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('ui_1424cf5cd91d')}
                  value={truckNumberInput}
                  onChange={(e) => setTruckNumberInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 uppercase tracking-widest"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('ui_94d51ec6a8cb')}</label>
                <input
                  type="text"
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignTruckOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t('ui_77dfd2135f4d')}</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  {t('ui_1e3edb1ca2b6')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL 3: PRINT LORRY RECEIPT (LR / BILTY SLIP)
         ======================================================== */}
      {printLrOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111726] rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  {t('ui_6161b3516718')}</h4>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {t('ui_206333850284')}{printLrOrder.lrNo !== '—' ? printLrOrder.lrNo : '88415'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrintLrOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_0b64e22c6fe0')}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {printLrOrder.order}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_6171d6efb100')}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {printLrOrder.party} ({printLrOrder.city})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_0b85b2c5d0e7')}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {printLrOrder.product}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_99c62d55203f')}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {printLrOrder.quantityMt} {' '}{t('ui_7ca204c3e247')}{formatNumber(printLrOrder.bags)} {' '}{t('ui_c354804a5c09')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">{t('ui_97287304e5b0')}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {printLrOrder.truck}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm text-teal-700 dark:text-teal-400">
                <span>{t('ui_21c626ff5d90')}</span>
                <span className="font-mono">₹{formatNumber(printLrOrder.value)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPrintLrOrder(null)}
                className="w-1/2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {t('ui_bbfa773e5a63')}</button>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-1/2 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
                style={{ backgroundColor: accent?.primary || '#0d9488' }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('ui_586b23e0d8d6')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}