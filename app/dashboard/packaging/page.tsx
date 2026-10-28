'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Package,
  Search,
  Plus,
  ShoppingBag,
  Store,
  CheckCircle2,
  X,
  Layers,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Sparkles,
  Users,
  Wheat,
  Clock,
  Warehouse,
  PlusCircle,
} from 'lucide-react';

interface StockItem {
  code: string;
  product: string;
  pack: string;
  location: string;
  bags: number;
  tonnes: number;
  heldTonnes?: number;
  heldSo?: string;
  freeTonnes: number;
  isAllHeld?: boolean;
  ratePerQtl: number;
}

interface RecentBaggingItem {
  when: string;
  batch: string;
  product: string;
  pack: string;
  bags: number;
  tonnes: number;
  packedBy: string;
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

const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    code: 'FG-1121-50',
    product: '1121 Basmati, steam',
    pack: '50 kg',
    location: 'Finished godown A',
    bags: 1600,
    tonnes: 80.0,
    heldTonnes: 50.0,
    heldSo: 'SO-2214',
    freeTonnes: 30.0,
    ratePerQtl: 6800,
  },
  {
    code: 'FG-1509-50',
    product: '1509 Basmati, sella',
    pack: '50 kg',
    location: 'Finished godown A',
    bags: 1200,
    tonnes: 60.0,
    heldTonnes: 60.0,
    heldSo: 'SO-2212',
    freeTonnes: 0,
    isAllHeld: true,
    ratePerQtl: 6200,
  },
  {
    code: 'FG-PR126-50',
    product: 'PR-126, raw',
    pack: '50 kg',
    location: 'Finished godown B',
    bags: 1060,
    tonnes: 53.0,
    heldTonnes: 30.0,
    heldSo: 'SO-2211',
    freeTonnes: 23.0,
    ratePerQtl: 3450,
  },
  {
    code: 'FG-BRK-50',
    product: 'Broken rice, 25%',
    pack: '50 kg',
    location: 'Finished godown B',
    bags: 300,
    tonnes: 15.0,
    freeTonnes: 15.0,
    ratePerQtl: 2400,
  },
  {
    code: 'FG-1121-20',
    product: '1121 Basmati, steam',
    pack: '20 kg',
    location: 'Retail rack',
    bags: 950,
    tonnes: 19.0,
    freeTonnes: 19.0,
    ratePerQtl: 7200,
  },
];

const INITIAL_RECENT_BAGGING: RecentBaggingItem[] = [
  {
    when: '24 Oct, 09:40',
    batch: 'B-101',
    product: '1509 Basmati, sella',
    pack: '50 kg',
    bags: 560,
    tonnes: 28.0,
    packedBy: 'Gang C · Mukesh Pal',
  },
  {
    when: '24 Oct, 08:15',
    batch: 'B-099',
    product: '1121 Basmati, steam',
    pack: '20 kg',
    bags: 300,
    tonnes: 6.0,
    packedBy: 'Gang C · Mukesh Pal',
  },
  {
    when: '23 Oct, 17:30',
    batch: 'B-100',
    product: 'PR-126, raw',
    pack: '50 kg',
    bags: 446,
    tonnes: 22.3,
    packedBy: 'Gang C · Mukesh Pal',
  },
];

export default function PackagingFinishedStockPage() {
  const { accent } = useTheme();

  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [recentBagging, setRecentBagging] = useState<RecentBaggingItem[]>(INITIAL_RECENT_BAGGING);
  const [searchQuery, setSearchQuery] = useState('');

  // 🟢 Modal 1: "+ Record bagging" state
  const [isBaggingModalOpen, setIsBaggingModalOpen] = useState(false);
  const [baggingBatch, setBaggingBatch] = useState('B-102 (Line 1 · 1121 Basmati)');
  const [baggingProduct, setBaggingProduct] = useState('1121 Basmati, steam');
  const [baggingPack, setBaggingPack] = useState<'50 kg' | '20 kg'>('50 kg');
  const [baggingCount, setBaggingCount] = useState('400');
  const [baggingLocation, setBaggingLocation] = useState('Finished godown A');
  const [baggingGang, setBaggingGang] = useState('Gang C · Mukesh Pal');

  // Modal 2: "Add to order" state
  const [orderModalItem, setOrderModalItem] = useState<StockItem | null>(null);
  const [orderQty, setOrderQty] = useState<string>('10');
  const [buyerName, setBuyerName] = useState<string>('Shree Krishna Traders, Delhi');

  // Total summary calculations
  const totalBags = stock.reduce((sum, item) => sum + item.bags, 0);
  const totalTonnes = stock.reduce((sum, item) => sum + item.tonnes, 0);
  const totalHeldTonnes = stock.reduce((sum, item) => sum + (item.heldTonnes || 0), 0);
  const totalFreeTonnes = stock.reduce((sum, item) => sum + (item.isAllHeld ? 0 : item.freeTonnes), 0);

  const filteredStock = stock.filter(
    (item) =>
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submit New Bagging Entry
  const handleSaveBaggingEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(baggingCount) || 0;
    const packKg = baggingPack === '50 kg' ? 50 : 20;
    const tonnesCreated = +(count * (packKg / 1000)).toFixed(1);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const whenString = `Today, ${timeStr}`;

    // Add to Recent Bagging
    const newBagging: RecentBaggingItem = {
      when: whenString,
      batch: baggingBatch.split(' ')[0],
      product: baggingProduct,
      pack: baggingPack,
      bags: count,
      tonnes: tonnesCreated,
      packedBy: baggingGang,
    };
    setRecentBagging([newBagging, ...recentBagging]);

    // Update or Add to Stock Table
    setStock((prev) =>
      prev.map((item) => {
        if (item.product === baggingProduct && item.pack === baggingPack) {
          return {
            ...item,
            bags: item.bags + count,
            tonnes: +(item.tonnes + tonnesCreated).toFixed(1),
            freeTonnes: +(item.freeTonnes + tonnesCreated).toFixed(1),
            isAllHeld: false,
          };
        }
        return item;
      })
    );

    setIsBaggingModalOpen(false);
  };

  // Submit Order Allocation
  const handleConfirmOrderAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalItem) return;

    const qty = Number(orderQty) || 0;

    setStock(
      stock.map((item) => {
        if (item.code === orderModalItem.code) {
          const newFree = Math.max(0, item.freeTonnes - qty);
          const newHeld = (item.heldTonnes || 0) + qty;
          return {
            ...item,
            freeTonnes: newFree,
            heldTonnes: newHeld,
            heldSo: 'SO-2218',
            isAllHeld: newFree === 0,
          };
        }
        return item;
      })
    );

    setOrderModalItem(null);
  };

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* ========================================================
          0. TOP ACTION STRIP (WITH RECORD BAGGING BUTTON CIRCLED IN RED)
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Packed rice ready for sale · Live Warehouse Inventory
          </span>
        </div>

        {/* 🟢 "+ Record bagging" Button Matching Screenshot */}
        <button
          type="button"
          onClick={() => setIsBaggingModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-transform active:scale-95 hover:opacity-95"
          style={{ backgroundColor: accent?.primary || '#0d9488' }}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record bagging</span>
        </button>
      </div>

      {/* ========================================================
          1. TOP 4-CARD METRIC STRIP (WITH COLORFUL ICON ACCENTS)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 - Finished Stock (Teal) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs hover:border-teal-300 dark:hover:border-teal-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Finished stock</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <PackageCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalTonnes.toFixed(1)}
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">t</span>
          </div>
          <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
            {formatNumber(totalBags)} bags in godowns
          </p>
        </div>

        {/* Metric 2 - 50 kg Bags (Blue) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs hover:border-blue-300 dark:hover:border-blue-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">50 kg bags</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              4,160
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
            208.0 t · mandi and export
          </p>
        </div>

        {/* Metric 3 - 20 kg Bags (Amber) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs hover:border-amber-300 dark:hover:border-amber-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">20 kg bags</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Store className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              950
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            19.0 t · counter sale
          </p>
        </div>

        {/* Metric 4 - Free to Sell (Purple) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs hover:border-purple-300 dark:hover:border-purple-800 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Free to sell</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalFreeTonnes.toFixed(1)}
            </span>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">t</span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">
            {totalHeldTonnes.toFixed(1)} t held for orders
          </p>
        </div>
      </div>

      {/* ========================================================
          2. TABLE 1: STOCK BY PRODUCT (ATTRACTIVE COLORFUL DESIGN)
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Stock by product
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredStock.length} SKUs
            </span>
          </div>

          {/* Search Box matching screenshot */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Product or code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Master Stock Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3.5 pl-2">Code</th>
                <th className="pb-3.5">Product</th>
                <th className="pb-3.5">Pack</th>
                <th className="pb-3.5">Location</th>
                <th className="pb-3.5 text-right sm:text-left">Bags</th>
                <th className="pb-3.5 text-right sm:text-left">Tonnes</th>
                <th className="pb-3.5 text-center sm:text-left">Held for orders</th>
                <th className="pb-3.5 text-right sm:text-left">Free</th>
                <th className="pb-3.5 text-right sm:text-left">Rate per quintal</th>
                <th className="pb-3.5 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {filteredStock.map((row) => (
                <tr
                  key={row.code}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Code */}
                  <td className="py-4 pl-2 font-mono text-slate-600 dark:text-slate-400 font-medium">
                    {row.code}
                  </td>

                  {/* Product with colored grain dot */}
                  <td className="py-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span>{row.product}</span>
                    </div>
                  </td>

                  {/* Pack */}
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                      {row.pack}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Warehouse className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{row.location}</span>
                    </span>
                  </td>

                  {/* Bags */}
                  <td className="py-4 font-mono text-right sm:text-left">
                    {formatNumber(row.bags)}
                  </td>

                  {/* Tonnes */}
                  <td className="py-4 font-mono text-right sm:text-left">
                    {row.tonnes.toFixed(1)}
                  </td>

                  {/* Held for orders with Sub-SO number */}
                  <td className="py-4 text-center sm:text-left">
                    {row.isAllHeld ? (
                      <div>
                        <div className="font-mono text-slate-900 dark:text-white font-semibold">
                          {row.heldTonnes?.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono font-medium">
                          {row.heldSo}
                        </div>
                      </div>
                    ) : row.heldTonnes ? (
                      <div>
                        <div className="font-mono text-slate-900 dark:text-white font-semibold">
                          {row.heldTonnes.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono font-medium">
                          {row.heldSo}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono">—</span>
                    )}
                  </td>

                  {/* Free Tonnes (with • All held amber badge) */}
                  <td className="py-4 font-mono text-right sm:text-left">
                    {row.isAllHeld ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        All held
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {row.freeTonnes.toFixed(1)}
                      </span>
                    )}
                  </td>

                  {/* Rate per quintal with Green Currency Accent */}
                  <td className="py-4 font-mono text-emerald-700 dark:text-emerald-400 font-bold text-right sm:text-left">
                    ₹{formatNumber(row.ratePerQtl)}
                  </td>

                  {/* Add to order action button */}
                  <td className="py-4 text-right pr-2">
                    <button
                      type="button"
                      disabled={row.isAllHeld}
                      onClick={() => setOrderModalItem(row)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer active:scale-95"
                    >
                      Add to order
                    </button>
                  </td>
                </tr>
              ))}

              {/* Exact Matching Total Row */}
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                <td className="py-4 pl-2 font-bold text-xs" colSpan={4}>
                  Total
                </td>
                <td className="py-4 font-mono text-right sm:text-left">{formatNumber(totalBags)}</td>
                <td className="py-4 font-mono text-right sm:text-left">{totalTonnes.toFixed(1)}</td>
                <td className="py-4 font-mono text-center sm:text-left">{totalHeldTonnes.toFixed(1)}</td>
                <td className="py-4 font-mono text-right sm:text-left text-emerald-700 dark:text-emerald-400 text-sm">
                  {totalFreeTonnes.toFixed(1)}
                </td>
                <td className="py-4" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          3. TABLE 2: RECENT BAGGING (FROM MILLING BATCHES)
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent bagging
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              Live Shifts
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">From milling batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3.5 pl-2">When</th>
                <th className="pb-3.5">Batch</th>
                <th className="pb-3.5">Product</th>
                <th className="pb-3.5">Pack</th>
                <th className="pb-3.5 text-right sm:text-left">Bags</th>
                <th className="pb-3.5 text-right sm:text-left">Tonnes</th>
                <th className="pb-3.5 pr-2">Packed by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {recentBagging.map((row) => (
                <tr
                  key={row.when + row.batch}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 pl-2 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{row.when}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 font-mono font-bold text-[11px] border border-purple-200/70 dark:border-purple-800">
                      {row.batch}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                    {row.product}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                      {row.pack}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-right sm:text-left">{row.bags}</td>
                  <td className="py-3.5 font-mono font-bold text-teal-700 dark:text-teal-400 text-right sm:text-left">
                    {row.tonnes.toFixed(1)} t
                  </td>
                  <td className="py-3.5 pr-2 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{row.packedBy}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          4. MODAL: RECORD BAGGING ENTRY (CIRCLED IN RED SCREENSHOT)
         ======================================================== */}
      {isBaggingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Record Daily Bagging Entry
                </h3>
                <p className="text-[11px] text-slate-400">
                  Transfer milled rice output to finished goods bagging
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBaggingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBaggingEntry} className="space-y-4 text-xs">
              {/* Batch Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Active Milling Batch
                </label>
                <select
                  value={baggingBatch}
                  onChange={(e) => setBaggingBatch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  <option value="B-102 (Line 1 · 1121 Basmati)">
                    B-102 (Line 1 · 1121 Basmati)
                  </option>
                  <option value="B-103 (Line 2 · PR-114)">
                    B-103 (Line 2 · PR-114)
                  </option>
                  <option value="B-101 (Line 1 · 1509 Basmati)">
                    B-101 (Line 1 · 1509 Basmati)
                  </option>
                </select>
              </div>

              {/* Product Variety */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Finished Product / Variety
                </label>
                <select
                  value={baggingProduct}
                  onChange={(e) => setBaggingProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  <option value="1121 Basmati, steam">1121 Basmati, steam</option>
                  <option value="1509 Basmati, sella">1509 Basmati, sella</option>
                  <option value="PR-126, raw">PR-126, raw</option>
                  <option value="Broken rice, 25%">Broken rice, 25%</option>
                </select>
              </div>

              {/* Pack Size & Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Bag Specification
                  </label>
                  <select
                    value={baggingPack}
                    onChange={(e) => setBaggingPack(e.target.value as '50 kg' | '20 kg')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                  >
                    <option value="50 kg">50 kg HDPE Bag</option>
                    <option value="20 kg">20 kg Retail Pack</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Bags Count *
                  </label>
                  <input
                    type="number"
                    required
                    value={baggingCount}
                    onChange={(e) => setBaggingCount(e.target.value)}
                    placeholder="e.g. 400"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Target Location & Labour Gang */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Godown Location
                  </label>
                  <select
                    value={baggingLocation}
                    onChange={(e) => setBaggingLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                  >
                    <option value="Finished godown A">Finished godown A</option>
                    <option value="Finished godown B">Finished godown B</option>
                    <option value="Retail rack">Retail rack</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Packing Gang
                  </label>
                  <select
                    value={baggingGang}
                    onChange={(e) => setBaggingGang(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                  >
                    <option value="Gang C · Mukesh Pal">Gang C · Mukesh Pal</option>
                    <option value="Gang A · Radhey Shyam">Gang A · Radhey Shyam</option>
                    <option value="Gang B · Kallu Ram">Gang B · Kallu Ram</option>
                  </select>
                </div>
              </div>

              {/* Auto Metric Calculation Box */}
              <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800 flex justify-between items-center text-xs">
                <span className="text-teal-900 dark:text-teal-300 font-medium">
                  Total Tonnes to Add:
                </span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-sm">
                  {(
                    (Number(baggingCount) || 0) *
                    (baggingPack === '50 kg' ? 0.05 : 0.02)
                  ).toFixed(1)}{' '}
                  MT
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBaggingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  Save & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: ADD TO ORDER ALLOCATION
         ======================================================== */}
      {orderModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Add to Sales Order
                </h3>
                <p className="text-[11px] text-slate-400">
                  {orderModalItem.code} · {orderModalItem.product}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrderModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmOrderAllocation} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Free available stock:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                    {orderModalItem.freeTonnes.toFixed(1)} MT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rate per quintal:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    ₹{formatNumber(orderModalItem.ratePerQtl)}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Quantity to Allocate (Tonnes) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  max={orderModalItem.freeTonnes}
                  required
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Select Sales Order / Buyer
                </label>
                <select
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  <option value="Shree Krishna Traders, Delhi">
                    SO-2218 · Shree Krishna Traders, Delhi
                  </option>
                  <option value="Aggarwal Foods, Kanpur">
                    SO-2219 · Aggarwal Foods, Kanpur
                  </option>
                  <option value="Jai Bharat Rice Overseas">
                    SO-2220 · Jai Bharat Rice Overseas
                  </option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOrderModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}