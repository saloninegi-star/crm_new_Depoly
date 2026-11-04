'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { normalizeUserRole } from '../../services/authService';
import {
  Truck,
  Scale,
  Warehouse,
  Cog,
  Package,
  Send,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  Wallet,
  Building,
  CreditCard,
  FileSpreadsheet,
  Gauge,
  Droplets,
  Thermometer,
  Layers,
  ArrowRight,
  Flame,
  FileCheck,
  DollarSign,
  AlertTriangle,
  Users,
  HardHat,
  CalendarCheck,
  Banknote,
  ChevronRight,
} from 'lucide-react';

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
}

function getStoredRole() {
  if (typeof window === 'undefined') return '';
  const directRole = localStorage.getItem('user_role');
  const kognosRole = localStorage.getItem('kognos_role');
  return normalizeUserRole(directRole || kognosRole) || 'owner';
}

export default function DashboardPage() {
  const { accent, currentTheme } = useTheme();
  const { t } = useLanguage();
  const role = useSyncExternalStore(subscribeToStorage, getStoredRole, () => '');

  if (!role) {
    return <div className="p-6 text-sm text-slate-500">{t('loading')}</div>;
  }

  // 14-Day Paddy received chart data (from screenshot)
  const chartData = [
    { day: '11', value: 96 },
    { day: '12', value: 112 },
    { day: '13', value: 88 },
    { day: '14', value: 122 },
    { day: '15', value: 128 },
    { day: '16', value: 82 },
    { day: '17', value: 104 },
    { day: '18', value: 140.2, isPeak: true },
    { day: '19', value: 72 },
    { day: '20', value: 95 },
    { day: '21', value: 114 },
    { day: '22', value: 126 },
    { day: '23', value: 68 },
    { day: '24', value: 84.4, isToday: true },
  ];

  const maxVal = 160;

  // =========================================================================
  // 1. ACCOUNTS OFFICER DASHBOARD (PDF Page 5 & 6: Cash, Bank, Receivables, Payables)
  // =========================================================================
  if (role === 'accounts') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">{t('cash_hand')}</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">₹3,45,200</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('cash_book_closed')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">{t('bank_balance')}</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-600">₹48,92,400</div>
            <div className="text-[11px] text-slate-400">{t('ui_459e7cdc1841')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">{t('buyer_receivables')}</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">₹18,40,000</div>
            <div className="text-[11px] text-amber-700 font-bold">{t('ui_e1e4e45e2de5')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">{t('farmer_payables')}</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600">₹12,75,000</div>
            <div className="text-[11px] text-slate-400">{t('ui_58a24b0e7d3d')}</div>
          </div>
        </div>

        {/* Payments Settlement Pipeline & Quick Actions */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('operations_pipeline')}</h2>
              <p className="text-xs text-slate-400">{t('ui_4154991cffdd')}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t('ledger_synced')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{t('ui_f2d7bcd7b8f9')}</span>
                <span className="font-bold text-rose-600">{t('due_today')}</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₹8,40,000</div>
              <div className="text-[11px] text-slate-400">{t('ui_6b50dbbe2ebe')}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{t('ui_d0a0365a8b01')}</span>
                <span className="font-bold text-blue-600">{t('ui_adc3a8f8c301')}</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₹1,18,000</div>
              <div className="text-[11px] text-slate-400">{t('ui_bade261cbf6a')}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{t('ui_2da9ef71be38')}</span>
                <span className="font-bold text-amber-600">{t('ui_176f2c6db9a5')}</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₹45,200</div>
              <div className="text-[11px] text-slate-400">{t('ui_a408316a78fb')}</div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-600">{t('ui_06a32f0b2fdf')}</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-xl text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: currentTheme.buttonBg }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('ui_5498df61fb92')}</span>
              </button>
              <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
                {t('ui_0c0e6adbc970')}</button>
              <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
                {t('ui_68967c35ac24')}</button>
            </div>
          </div>
        </div>

        {/* Receivables & Mill Running Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900">{t('ui_8889514ef329')}</h3>
              <span className="text-xs font-bold text-amber-700">{t('ui_4b879c2b8d73')}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-amber-950">Shree Krishna Traders (Delhi)</div>
                  <div className="text-[10px] text-amber-800">Invoice #INV-401 • Overdue by 12 Days</div>
                </div>
                <span className="font-mono font-bold text-amber-950">₹7,50,000</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Aggarwal Foods (Kanpur)</div>
                  <div className="text-[10px] text-slate-400">Invoice #INV-403 • Due in 5 days</div>
                </div>
                <span className="font-mono font-bold text-slate-900">₹6,20,000</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900">{t('ui_e35e336176ed')}{' '}</h3>
              <span className="text-xs font-bold text-rose-600">{t('ui_576d436d61ff')}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Electricity & Power (Discom)</div>
                  <div className="text-[10px] text-slate-400">{t('ui_c74742b595b9')}</div>
                </div>
                <span className="font-mono font-bold text-slate-900">₹1,85,000</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">{t('ui_d88867be3f28')}</div>
                  <div className="text-[10px] text-slate-400">{t('ui_2b5d4a34972e')}</div>
                </div>
                <span className="font-mono font-bold text-slate-900">₹64,200</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">{t('ui_315db35fb2da')}</div>
                  <div className="text-[10px] text-slate-400">{t('ui_6cc2a7044e5a')}</div>
                </div>
                <span className="font-mono font-bold text-slate-900">₹22,400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. PADDY GODOWN IN-CHARGE (PDF Page 2 & 3: FIFO Queue & Stock)
  // =========================================================================
  if (role === 'godown_incharge' || role === 'paddy_stock') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">{t('ui_6c4a1ec99507')}</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Warehouse className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{t('ui_39bb57f05d0c')}</div>
            <div className="text-[11px] text-blue-600 font-semibold">{t('ui_7ac6eba41d5f')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">{t('ui_754cc49cdc2d')}</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">{t('ui_42e6d1e45f8e')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_52090863b69e')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">{t('ui_7040c3e921ce')}</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-700">{t('ui_9544864429c7')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_168ac84ce48a')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">{t('ui_44dbc1d95a1e')}</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Cog className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">{t('ui_5691c3ab946e')}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('ui_ce53fd4cdbfd')}</div>
          </div>
        </div>

        {/* Visual Godown Capacity Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { name: 'Godown #01 (Basmati)', stock: 820, capacity: 1000, moisture: '13.8%', temp: '24°C', color: 'bg-emerald-500' },
            { name: 'Godown #02 (PR Paddy)', stock: 1140, capacity: 1500, moisture: '14.1%', temp: '25°C', color: 'bg-blue-500' },
            { name: 'Godown #03 (Buffer / Sharbati)', stock: 450, capacity: 800, moisture: '14.4%', temp: '26°C', color: 'bg-amber-500' },
          ].map((g) => {
            const percent = Math.round((g.stock / g.capacity) * 100);
            return (
              <div key={g.name} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{g.name}</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{percent}{t('ui_5418230f2fc5')}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${g.color}`} style={{ width: `${percent}%` }} />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">{t('ui_208914f4658a')}{' '}<strong className="text-slate-800">{g.stock} {' '}{t('ui_c3c2fa56598a')}</strong></span>
                  <span className="text-slate-400">{t('ui_218347e0b411')}{' '}{g.capacity} {' '}{t('ui_c3c2fa56598a')}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-500" /> {' '}{t('ui_7e9a5383ca43')}{' '}{g.moisture}</span>
                  <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-rose-500" /> {' '}{t('ui_fa0c1752542d')}{' '}{g.temp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live FIFO Milling Queue Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('ui_072a10a87928')}</h2>
              <p className="text-xs text-slate-400">{t('ui_1facbfe6b854')}{' '}</p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input type="text" placeholder={t('ui_862114e07da0')} className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none w-52" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3">{t('ui_02b7571d4322')}</th>
                  <th className="pb-3">{t('ui_f5a61d589fd1')}</th>
                  <th className="pb-3">{t('ui_3af160965068')}</th>
                  <th className="pb-3">{t('ui_641235432197')}</th>
                  <th className="pb-3">{t('ui_4769e056cfcf')}</th>
                  <th className="pb-3">{t('ui_7af8933ade08')}</th>
                  <th className="pb-3">{t('ui_61a6163ed333')}</th>
                  <th className="pb-3">{t('ui_bae7d5be7082')}</th>
                  <th className="pb-3 text-right">{t('ui_97c89a4d6630')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { priority: '#1 (Next)', lot: 'LOT-849', godown: 'Godown #02 (Chamber 3)', variety: 'PR-126 Paddy', date: '2026-10-12', inward: '480 MT', balance: '320 MT', status: 'Ready for Issue' },
                  { priority: 'In Process', lot: 'LOT-848', godown: 'Godown #01 (Chamber 1)', variety: '1121 Basmati', date: '2026-10-11', inward: '550 MT', balance: '110 MT', status: 'Milling Active' },
                  { priority: '#2 in Queue', lot: 'LOT-850', godown: 'Godown #02 (Chamber 1)', variety: 'PR-114 Paddy', date: '2026-10-13', inward: '620 MT', balance: '620 MT', status: 'Curing Stock' },
                  { priority: '#3 in Queue', lot: 'LOT-851', godown: 'Godown #03 (Chamber 2)', variety: 'Sharbati Paddy', date: '2026-10-14', inward: '360 MT', balance: '360 MT', status: 'Moisture Tested' },
                ].map((row) => (
                  <tr key={row.lot} className="hover:bg-slate-50/70">
                    <td className="py-3.5 font-bold text-blue-700">{row.priority}</td>
                    <td className="py-3.5 font-bold text-slate-900">{row.lot}</td>
                    <td className="py-3.5 text-slate-700">{row.godown}</td>
                    <td className="py-3.5">{row.variety}</td>
                    <td className="py-3.5 font-mono text-slate-500">{row.date}</td>
                    <td className="py-3.5 font-mono">{row.inward}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-700">{row.balance}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {t(row.status)}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                        <span>{t('ui_b187f08ddc96')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
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

  // =========================================================================
  // 3. HR & LABOUR MANAGEMENT DASHBOARD (PDF Page 6: Labour Charges & Shifts)
  // =========================================================================
  if (role === 'hr') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_9e77d20471e8')}</span>
            <div className="text-2xl font-black text-slate-900">{t('ui_73e09f16d77b')}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('ui_477d4dea5464')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_5ec1d2c9e102')}</span>
            <div className="text-2xl font-black text-blue-600">{t('ui_d5e2b858b276')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_4fdac1b1ae06')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_7587eb546c19')}</span>
            <div className="text-2xl font-black text-amber-600">{t('ui_10d923fd9a59')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_7c4a71fa6e59')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_0b5e426939f3')}</span>
            <div className="text-2xl font-black text-emerald-700">₹64,200</div>
            <div className="text-[11px] text-slate-400">{t('ui_aaa016ef7ba5')}{' '}</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('ui_1fb15a2c208e')}</h2>
              <p className="text-xs text-slate-400">{t('ui_7ef95f1ce12b')}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {t('ui_859de79a522d')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3">{t('ui_3223a5f828d2')}</th>
                  <th className="pb-3">{t('ui_c08b8993770d')}</th>
                  <th className="pb-3">{t('ui_e5998732a87b')}</th>
                  <th className="pb-3">{t('ui_b2386426a37d')}</th>
                  <th className="pb-3">{t('ui_54eefccf79d9')}</th>
                  <th className="pb-3">{t('ui_6c4d0deb1e56')}</th>
                  <th className="pb-3">{t('ui_ce51b597733d')}</th>
                  <th className="pb-3 text-right">{t('ui_bae7d5be7082')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { gang: 'Radhey Shyam Gang', location: 'Godown #02 (PR Paddy)', workers: 8, task: 'Truck Inward Unloading & Stacking', bags: 1420, rate: '₹4.50 / Bag', total: '₹6,390', status: 'Working' },
                  { gang: 'Kallu Ram Gang', location: 'Godown #01 (Basmati)', workers: 8, task: 'Truck Inward Unloading', bags: 1200, rate: '₹4.50 / Bag', total: '₹5,400', status: 'Working' },
                  { gang: 'Jagdish Kumar Gang', location: 'Finished Stock Bay', workers: 8, task: 'Dispatch Truck Loading (50kg)', bags: 1020, rate: '₹5.00 / Bag', total: '₹5,100', status: 'Loading Completed' },
                ].map((row) => (
                  <tr key={row.gang} className="hover:bg-slate-50/70">
                    <td className="py-3.5 font-bold text-slate-900">{row.gang}</td>
                    <td className="py-3.5 text-slate-800">{row.location}</td>
                    <td className="py-3.5 font-mono">{row.workers} {' '}{t('ui_f3cf96e91976')}</td>
                    <td className="py-3.5">{row.task}</td>
                    <td className="py-3.5 font-mono font-bold text-blue-700">{row.bags} {' '}{t('ui_81cf1fc845ed')}</td>
                    <td className="py-3.5">{row.rate}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-700">{row.total}</td>
                    <td className="py-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {t(row.status)}
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

  // =========================================================================
  // 4. GATE GUARD DASHBOARD (PDF Page 1 & 2: Checkpoint #1)
  // =========================================================================
  if (role === 'gate_guard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_f859d28debfd')}</span>
            <div className="text-2xl font-black text-slate-900">{t('ui_f59c719f7fca')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_5a0b55ea1d4a')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_25b03cbaea1c')}</span>
            <div className="text-2xl font-black text-amber-600">{t('ui_ce1b3c30ade3')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_e56cdda85d44')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_f5c98663f3eb')}</span>
            <div className="text-2xl font-black text-blue-600">{t('ui_054fd135b99a')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_a0f6833d23d1')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_65c0b8522ded')}</span>
            <div className="text-2xl font-black text-emerald-600">{t('ui_3857ab037d70')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_0193f198c13f')}</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">{t('ui_5f0c40da58b3')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3">{t('ui_a1141eb96836')}</th>
                  <th className="pb-3">{t('ui_6c82e6dd8680')}</th>
                  <th className="pb-3">{t('ui_9bb28c0dd307')}</th>
                  <th className="pb-3">{t('ui_93f2d33c62c1')}</th>
                  <th className="pb-3">{t('ui_85e646fbb9f6')}</th>
                  <th className="pb-3">{t('ui_bae7d5be7082')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { token: '#TK-4825', time: '14:22 PM', vehicle: 'HR 45 B 9811', farmer: 'Surinder Pal', variety: 'PR-126 Paddy', status: 'Token Issued' },
                  { token: '#TK-4824', time: '14:05 PM', vehicle: 'DL 01 AB 7741', farmer: 'Gurmeet Farm', variety: '1509 Basmati', status: 'Weighbridge Line' },
                  { token: '#TK-4823', time: '13:40 PM', vehicle: 'UP 14 TT 1029', farmer: 'Rameshwar Lal', variety: 'Sharbati Paddy', status: 'Gross Weight Done' },
                ].map((row) => (
                  <tr key={row.token} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{row.token}</td>
                    <td className="py-3 font-mono">{row.time}</td>
                    <td className="py-3 font-mono font-bold">{row.vehicle}</td>
                    <td className="py-3">{row.farmer}</td>
                    <td className="py-3">{row.variety}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        {t(row.status)}
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

  // =========================================================================
  // 5. WEIGHBRIDGE OPERATOR DASHBOARD (PDF Page 2: Weighment & Moisture Cut)
  // =========================================================================
  if (role === 'weighbridge') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 text-white shadow-md flex flex-col justify-between border border-slate-800">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-mono">
              <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4 animate-pulse" /> {' '}{t('ui_1da6f6e2d7d4')}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">{t('ui_7718e4daa0f1')}</span>
            </div>
            <div className="text-center py-6">
              <div className="font-mono text-5xl font-black text-white">38,420 <span className="text-xl text-slate-400 font-bold">{t('ui_e3187e6dd6ab')}</span></div>
              <div className="text-xs text-slate-400 font-mono mt-1">{t('ui_b750cafa153f')}</div>
            </div>
            <div className="text-xs text-slate-400 flex justify-between border-t border-slate-800 pt-3">
              <span>{t('ui_d963c6fcf941')}</span>
              <span className="text-emerald-400 font-semibold">{t('ui_aca4af5f43ce')}</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-400">{t('ui_7a7d8410d824')}</span>
              <div className="text-2xl font-black text-amber-600">{t('ui_ce1b3c30ade3')}</div>
              <div className="text-[11px] text-slate-400">{t('ui_a8fe2de8df21')}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-400">{t('ui_db97805dc9ae')}</span>
              <div className="text-2xl font-black text-blue-600">{t('ui_2bd1bf83019b')}</div>
              <div className="text-[11px] text-slate-400">{t('ui_039eb3f6563c')}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-400">{t('ui_f524d1b4e576')}</span>
              <div className="text-2xl font-black text-slate-900">{t('ui_2c25bebfb262')}</div>
              <div className="text-[11px] text-emerald-600 font-semibold">{t('ui_9ef21c6260f7')}</div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">{t('ui_593977bcdfc5')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3">{t('ui_a1141eb96836')}</th>
                  <th className="pb-3">{t('ui_9bb28c0dd307')}</th>
                  <th className="pb-3">{t('ui_b39f1f0247f7')}</th>
                  <th className="pb-3">{t('ui_50f542c6825c')}</th>
                  <th className="pb-3">{t('ui_56260a614874')}</th>
                  <th className="pb-3">{t('ui_91238e5e582e')}</th>
                  <th className="pb-3">{t('ui_53d77a34224e')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { token: '#TK-4821', vehicle: 'HR 38 AA 4921', gross: 38450, tare: 13650, net: 24800, moisture: 14.2, godown: 'Godown #01' },
                  { token: '#TK-4822', vehicle: 'PB 11 BC 8312', gross: 44200, tare: 13000, net: 31200, moisture: 13.8, godown: 'Godown #02' },
                  { token: '#TK-4823', vehicle: 'UP 14 TT 1029', gross: 42100, tare: 13700, net: 28400, moisture: 15.2, godown: 'Godown #03' },
                ].map((row) => (
                  <tr key={row.token} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{row.token}</td>
                    <td className="py-3 font-mono">{row.vehicle}</td>
                    <td className="py-3 font-mono">{row.gross.toLocaleString()} {' '}{t('ui_e3187e6dd6ab')}</td>
                    <td className="py-3 font-mono">{row.tare.toLocaleString()} {' '}{t('ui_e3187e6dd6ab')}</td>
                    <td className="py-3 font-mono font-bold text-emerald-700">{row.net.toLocaleString()} {' '}{t('ui_e3187e6dd6ab')}</td>
                    <td className="py-3">{row.moisture}%</td>
                    <td className="py-3">{row.godown}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. MILLING SUPERVISOR DASHBOARD (PDF Page 3 & 4: Milling Yield & Shift)
  // =========================================================================
  if (role === 'milling') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_13fde940f29f')}</span>
            <div className="text-2xl font-black text-slate-900">64.8%</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('ui_18016a0a60ed')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_cb511ff87a9e')}</span>
            <div className="text-2xl font-black text-amber-600">{t('ui_aac3dd89a5b3')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_c2b755da4bd2')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_09b4b3c6faa6')}</span>
            <div className="text-2xl font-black text-slate-900">{t('ui_5691c3ab946e')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_aca3a3e17cbe')}</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">{t('ui_b27cbc31e429')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs text-emerald-800 font-bold">{t('ui_1a3f22b567a2')}</div>
              <div className="text-xl font-black text-emerald-900">61.2%</div>
              <div className="text-[10px] text-emerald-700">{t('ui_82433a487dfc')}</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-xs text-amber-800 font-bold">{t('ui_58a95f7a05ec')}</div>
              <div className="text-xl font-black text-amber-900">11.4%</div>
              <div className="text-[10px] text-amber-700">{t('ui_e0d133f8de48')}</div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
              <div className="text-xs text-teal-800 font-bold">{t('ui_3d8a31d7b813')}</div>
              <div className="text-xl font-black text-teal-900">8.6%</div>
              <div className="text-[10px] text-teal-700">{t('ui_770a7fa8a344')}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
              <div className="text-xs text-slate-700 font-bold">{t('ui_3e7966b66ba1')}</div>
              <div className="text-xl font-black text-slate-900">18.8%</div>
              <div className="text-[10px] text-slate-500">{t('ui_6eb0f926c7e4')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. PACKAGING & FINISHED INVENTORY DASHBOARD (PDF Page 4: Bagging 20/50kg)
  // =========================================================================
  if (role === 'finished_stock') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_a7614390d2c2')}</span>
            <div className="text-2xl font-black text-slate-900">{t('ui_3b88833551a1')}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('ui_8d57be32d54a')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_397cd47ea027')}</span>
            <div className="text-2xl font-black text-blue-600">{t('ui_a06c73f47a84')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_92ba22453099')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_7ddf600be72f')}</span>
            <div className="text-2xl font-black text-amber-600">{t('ui_4c710909df09')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_ac9d8bf5ba44')}</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">{t('ui_6077b6439d47')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3">{t('ui_f0dee4c99a62')}</th>
                  <th className="pb-3">{t('ui_c022afaf4373')}</th>
                  <th className="pb-3">{t('ui_bb9a21d76105')}</th>
                  <th className="pb-3">{t('ui_bd1bd95ccb3d')}</th>
                  <th className="pb-3">{t('ui_0bc25c5549a9')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { batch: '#B-101', grade: 'Grade A Head Rice (Basmati 1121)', pack: '50 KG HDPE', bags: 940, mt: '47.0 MT' },
                  { batch: '#B-102', grade: 'Grade A Head Rice (PR-126)', pack: '20 KG Non-Woven', bags: 520, mt: '10.4 MT' },
                  { batch: '#B-098', grade: 'Broken Rice (Secondary)', pack: '50 KG Bag', bags: 380, mt: '19.0 MT' },
                ].map((row) => (
                  <tr key={row.batch} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{row.batch}</td>
                    <td className="py-3 font-semibold">{row.grade}</td>
                    <td className="py-3">{row.pack}</td>
                    <td className="py-3 font-mono font-bold">{row.bags} {' '}{t('ui_81cf1fc845ed')}</td>
                    <td className="py-3 font-mono text-emerald-700">{row.mt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. SALES & DISPATCH IN-CHARGE DASHBOARD (PDF Page 4: Sales Orders & LR)
  // =========================================================================
  if (role === 'sales_dispatch' || role === 'sales & dispatch') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_bb1a032ce597')}</span>
            <div className="text-2xl font-black text-slate-900">{t('ui_97ab094e7b33')}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('ui_45badfff9b91')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_a6c2fb12603d')}</span>
            <div className="text-2xl font-black text-blue-600">{t('ui_848cb5216493')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_2dcdbea312d7')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_aea3146a407f')}</span>
            <div className="text-2xl font-black text-amber-600">{t('ui_30afa6686929')}</div>
            <div className="text-[11px] text-slate-400">{t('ui_477441bb7fc1')}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t('ui_b38662332776')}</span>
            <div className="text-2xl font-black text-slate-900">{t('ui_0733fd51ec2c')}</div>
            <div className="text-[11px] text-emerald-600">{t('ui_eeace37531b5')}</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">{t('ui_23b27aaef0d4')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3">{t('ui_814153426d43')}</th>
                  <th className="pb-3">{t('ui_eccd6cf3ee59')}</th>
                  <th className="pb-3">{t('ui_271749571c2e')}</th>
                  <th className="pb-3">{t('ui_6b14a840f1c5')}</th>
                  <th className="pb-3">{t('ui_0a7168b0c0ba')}</th>
                  <th className="pb-3">{t('ui_bae7d5be7082')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { order: '#SO-1089', party: 'Shree Krishna Traders (Delhi)', truck: 'HR 55 C 2019', lr: 'LR-8921', qty: '32.0 MT', status: 'Dispatched & Billed' },
                  { order: '#SO-1090', party: 'Aggarwal Foods (Kanpur)', truck: 'UP 78 BT 4101', lr: 'LR-8922', qty: '28.0 MT', status: 'Loading in Progress' },
                  { order: '#SO-1091', party: 'Jai Bharat Rice Overseas', truck: 'PB 10 X 7712', lr: 'LR-8923', qty: '35.0 MT', status: 'Weighment Check' },
                ].map((row) => (
                  <tr key={row.order} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{row.order}</td>
                    <td className="py-3 font-semibold">{row.party}</td>
                    <td className="py-3 font-mono">{row.truck}</td>
                    <td className="py-3 font-mono text-blue-700 font-bold">{row.lr}</td>
                    <td className="py-3 font-mono">{row.qty}</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">{t(row.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 9. SUPERADMIN / OWNER MASTER DASHBOARD (EXACT SCREENSHOT LAYOUT & NAVIGATION)
  // =========================================================================
  return (
    <div className="space-y-6 max-w-7xl">
      {/* 1. TOP METRICS STRIP (4-Column Unified Card) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 transition-colors">
        {/* Metric 1 */}
        <div className="px-5 py-2 sm:py-0 first:pl-0 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('ui_bc352c8c1414')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">84.4</span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('ui_8efd86fb78a5')}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t('ui_7ac3fd240bef')}</p>
        </div>

        {/* Metric 2 */}
        <div className="px-5 py-2 sm:py-0 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('ui_f540da207bfd')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">61.2</span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">%</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t('ui_8e9fdaab0d3f')}</p>
        </div>

        {/* Metric 3 */}
        <div className="px-5 py-2 sm:py-0 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('ui_67c9c2abb5da')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">227.0</span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('ui_8efd86fb78a5')}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t('ui_9849a7c47ae7')}</p>
        </div>

        {/* Metric 4 */}
        <div className="px-5 py-2 sm:py-0 last:pr-0 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('ui_06cefc499f6e')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">₹15.76</span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('ui_0bea9ff246cd')}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t('ui_0c9bc39be0d8')}</p>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: Needs your attention + Money */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Needs your attention (5 items with respective navigation buttons) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-3 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('ui_e51f42663447')}</h2>
            <span className="text-xs text-slate-400">{t('ui_6b3e582773e9')}</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Item 1 */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {t('ui_21e5ec941dcb')}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    Baldev Singh · lot L-0848 · due today
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">₹8,43,200</span>
                <Link
                  href="/dashboard/accounts"
                  className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold shadow-xs cursor-pointer transition-transform active:scale-95 inline-block"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  {t('ui_e29a79fe0c34')}</Link>
              </div>
            </div>

            {/* Item 2 */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {t('ui_edc16301e05f')}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    Shree Krishna Traders, Delhi · invoice INV-401
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">₹7,50,000</span>
                <Link
                  href="/dashboard/accounts"
                  className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer inline-block"
                >
                  {t('ui_cf9b77061f7b')}</Link>
              </div>
            </div>

            {/* Item 3 */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {t('ui_94591ee43af4')}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {t('ui_7e93b3f5b158')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/dashboard/weighment"
                  className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer inline-block"
                >
                  {t('ui_cf9b77061f7b')}</Link>
              </div>
            </div>

            {/* Item 4 */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {t('ui_0727a8fa8510')}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {t('ui_2cc35361d25f')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/dashboard/godown"
                  className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer inline-block"
                >
                  {t('ui_cf9b77061f7b')}</Link>
              </div>
            </div>

            {/* Item 5 */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {t('ui_a4ffb45fca30')}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {t('ui_fae53bb08f5b')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/dashboard/hr"
                  className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer inline-block"
                >
                  {t('ui_cf9b77061f7b')}</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Money Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('ui_1dc043bb8eb5')}</h2>
              <Link
                href="/dashboard/accounts"
                className="text-xs font-semibold hover:underline"
                style={{ color: accent?.primary || '#0d9488' }}
              >
                {t('ui_36bae31694f8')}</Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
              <div className="py-3.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">{t('ui_e860e75a9a16')}</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">₹3,45,200</span>
              </div>
              <div className="py-3.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">{t('ui_3e0b8c4a3d38')}</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">₹48,92,400</span>
              </div>
              <div className="py-3.5 flex justify-between items-baseline">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">{t('ui_3184f08082c9')}</div>
                  <div className="text-[10px] text-slate-400">{t('ui_892ba865cdfa')}</div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">₹18,40,000</span>
              </div>
              <div className="py-3.5 flex justify-between items-baseline">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">{t('ui_58d1265ef47e')}</div>
                  <div className="text-[10px] text-slate-400">{t('ui_6e9ce6b1846d')}</div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">₹16,81,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: 14-Day Paddy Received Chart + Today's Flow (With Exact Navigation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 14-Day Paddy Received Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('ui_c13d757af049')}</h2>
            <span className="text-xs text-slate-400 font-medium">{t('ui_f7e0a4b800d0')}</span>
          </div>

          <div className="pt-8 pb-2">
            <div className="relative h-44 flex items-end justify-between gap-1 sm:gap-2 px-2 border-b border-slate-200 dark:border-slate-800">
              {/* Y-Axis Gridlines */}
              <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-400 -mt-2.5">
                <span>150</span>
              </div>
              <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-400 -mt-2.5">
                <span>100</span>
              </div>
              <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-400 -mt-2.5">
                <span>50</span>
              </div>

              {/* Chart Bars */}
              {chartData.map((bar) => {
                const heightPercent = Math.round((bar.value / maxVal) * 100);

                return (
                  <div
                    key={bar.day}
                    className="flex-1 flex flex-col items-center justify-end h-full relative group"
                  >
                    {/* Peak Marker (140.2 on 18) */}
                    {bar.isPeak && (
                      <span className="absolute -top-5 text-[11px] font-bold text-slate-900 dark:text-white">
                        {bar.value}
                      </span>
                    )}
                    {/* Today Marker (84.4 so far on 24) */}
                    {bar.isToday && (
                      <span className="absolute -top-5 text-[10px] font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {bar.value} {' '}{t('ui_fa03c6b80d18')}</span>
                    )}

                    {/* Bar Element */}
                    <div
                      className="w-full max-w-[22px] rounded-t-sm transition-all"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: bar.isToday ? (accent?.lightBg || '#f0fdfa') : (accent?.primary || '#0d9488'),
                        border: bar.isToday ? `1.5px solid ${accent?.primary || '#0d9488'}` : 'none',
                      }}
                    />

                    {/* X-axis Day Label */}
                    <span className="text-[10px] text-slate-400 mt-2 font-mono">{bar.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Today's Flow (🟢 "Moves to that page" Navigation Links) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-3 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('ui_cae97ac7c85d')}</h2>
            <span className="text-xs text-slate-400">{t('ui_ab11e5292634')}</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {/* Step 1: Moves to Gate Entry Page */}
            <Link
              href="/dashboard/gate"
              className="py-2.5 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg px-1 transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{t('ui_51ef35029097')}</div>
                <div className="text-[11px] text-slate-400">{t('ui_48eb140d1d93')}</div>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <span>{t('ui_44ef7a92859b')}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Step 2: Moves to Weighbridge Page */}
            <Link
              href="/dashboard/weighment"
              className="py-2.5 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg px-1 transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{t('ui_14309cd8b133')}</div>
                <div className="text-[11px] text-slate-400">{t('ui_7cc253448224')}</div>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <span>{t('ui_97dc573dd164')}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Step 3: Moves to Paddy Stock Page */}
            <Link
              href="/dashboard/godown"
              className="py-2.5 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg px-1 transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{t('ui_a53b571bd339')}</div>
                <div className="text-[11px] text-slate-400">{t('ui_a1cc97fa295e')}</div>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <span>{t('ui_455af16f1f4a')}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Step 4: Moves to Milling Page */}
            <Link
              href="/dashboard/milling"
              className="py-2.5 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg px-1 transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{t('ui_5cdfae8d7dd2')}</div>
                <div className="text-[11px] text-slate-400">{t('ui_dc5ae11793aa')}</div>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <span>{t('ui_b460b492c375')}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Step 5: Moves to Finished Stock Page */}
            <Link
              href="/dashboard/packaging"
              className="py-2.5 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg px-1 transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{t('ui_67c9c2abb5da')}</div>
                <div className="text-[11px] text-slate-400">{t('ui_c9cb9bac76d5')}</div>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <span>{t('ui_4c0f16c38e97')}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Step 6: Moves to Sales & Dispatch Page */}
            <Link
              href="/dashboard/sales"
              className="py-2.5 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg px-1 transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{t('ui_840e1b364a32')}</div>
                <div className="text-[11px] text-slate-400">{t('ui_5f2dad46d3ff')}</div>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <span>{t('ui_263b1dc64047')}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}