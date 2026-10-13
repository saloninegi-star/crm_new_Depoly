'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Truck,
  Scale,
  Warehouse,
  Cog,
  Package,
  Send,
  Calculator,
  FileBarChart2,
  Menu,
  X,
  Palette,
  Bell,
  LogOut,
  Wheat,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Gate Inward', href: '/dashboard/gate', icon: Truck },
  { name: 'Weighbridge', href: '/dashboard/weighment', icon: Scale },
  { name: 'Paddy Godown', href: '/dashboard/godown', icon: Warehouse },
  { name: 'Milling & Yield', href: '/dashboard/milling', icon: Cog },
  { name: 'Finished Stock', href: '/dashboard/packaging', icon: Package },
  { name: 'Sales & Dispatch', href: '/dashboard/sales', icon: Send },
  { name: 'Accounts & Finance', href: '/dashboard/accounts', icon: Calculator },
  { name: 'Reports & P&L', href: '/dashboard/reports', icon: FileBarChart2 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentTheme, cycleTheme } = useTheme();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex font-sans text-slate-800">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20"
                style={{ backgroundColor: currentTheme.buttonBg }}
              >
                <Wheat className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-slate-900 block leading-tight">
                  KOGNOS
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                  Rice Mill ERP
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">
              Mill Operations
            </div>

            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.buttonBg : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">Owner Console</div>
                  <div className="text-[10px] text-slate-400">SuperAdmin</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Operations Overview
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Season 2026-27 • Shift #1 Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={cycleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-all"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.buttonBg }} />
              <span className="hidden sm:inline text-[11px]">{currentTheme.name}</span>
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: currentTheme.dotColor }}
              />
            </button>

            <button className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}