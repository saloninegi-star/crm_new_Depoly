'use client';

import React, { useState, useEffect } from 'react';
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
  UserCheck,
} from 'lucide-react';

// Sabhi menu items
const ALL_NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [
      'superadmin',
      'admin',
      'gate_guard',
      'weighbridge',
      'paddy_stock',
      'milling',
      'finished_stock',
      'sales_dispatch',
      'accounts',
    ],
  },
  {
    name: 'Gate Inward',
    href: '/dashboard/gate',
    icon: Truck,
    roles: ['superadmin', 'admin', 'gate_guard'],
  },
  {
    name: 'Weighbridge Queue',
    href: '/dashboard/weighment',
    icon: Scale,
    roles: ['superadmin', 'admin', 'gate_guard', 'weighbridge'],
  },
  {
    name: 'Paddy Stock (FIFO)',
    href: '/dashboard/godown',
    icon: Warehouse,
    roles: ['superadmin', 'admin', 'paddy_stock'],
  },
  {
    name: 'Milling & Recovery',
    href: '/dashboard/milling',
    icon: Cog,
    roles: ['superadmin', 'admin', 'milling'],
  },
  {
    name: 'Finished Stock (Bagging)',
    href: '/dashboard/packaging',
    icon: Package,
    roles: ['superadmin', 'admin', 'finished_stock'],
  },
  {
    name: 'Sales & Dispatch (LR)',
    href: '/dashboard/sales',
    icon: Send,
    roles: ['superadmin', 'admin', 'sales_dispatch'],
  },
  {
    name: 'Accounts & Ledgers',
    href: '/dashboard/accounts',
    icon: Calculator,
    roles: ['superadmin', 'admin', 'accounts'],
  },
  {
    name: 'Reports & P&L',
    href: '/dashboard/reports',
    icon: FileBarChart2,
    roles: ['superadmin', 'admin', 'accounts'],
  },
];

// Role details for bottom badge & header
const ROLE_DETAILS: Record<string, { label: string; desc: string }> = {
  superadmin: { label: 'Owner / SuperAdmin', desc: 'Full Mill Control & P&L' },
  admin: { label: 'Owner / SuperAdmin', desc: 'Full Mill Control & P&L' },
  gate_guard: { label: 'Gate Security Guard', desc: 'Checkpoint #1 Entry' },
  weighbridge: { label: 'Weighbridge Operator', desc: 'Gross & Tare Weighment' },
  paddy_stock: { label: 'Paddy Godown In-charge', desc: 'FIFO Stock & Lot Ledgers' },
  milling: { label: 'Milling Supervisor', desc: 'Shift & Recovery Yield %' },
  finished_stock: { label: 'Finished Stock Supervisor', desc: 'Bagging & Central Godown' },
  sales_dispatch: { label: 'Sales & Dispatch Head', desc: 'Sales Order & LR / Bilty' },
  accounts: { label: 'Accounts Officer', desc: 'Cash, Bank, Ledger & Tax' },
};

// Safe role normalizer
const getNormalizedRole = (rawRole: string | null): string => {
  if (!rawRole) return 'superadmin';
  try {
    const parsed = JSON.parse(rawRole);
    if (parsed && typeof parsed === 'object' && parsed.id) {
      return getNormalizedRole(parsed.id);
    }
  } catch {
    // raw string
  }
  const clean = rawRole.toLowerCase().trim();
  if (clean === 'admin' || clean === 'owner' || clean === 'superadmin') {
    return 'superadmin';
  }
  return clean;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentTheme, cycleTheme } = useTheme();

  const [userRole, setUserRole] = useState('superadmin');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const directRole = localStorage.getItem('user_role');
    const kognosRoleStr = localStorage.getItem('kognos_role');
    const email = localStorage.getItem('kognos_user') || '';
    setUserEmail(email);

    const detectedRole = getNormalizedRole(directRole || kognosRoleStr);
    setUserRole(detectedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('kognos_role');
    localStorage.removeItem('kognos_user');
    router.push('/');
  };

  // Safe navigation filtering:
  // Agar user Owner/Superadmin hai toh SARE items dikhenge!
  // Agar specific staff role hai toh sirf uske allowed items dikhenge.
  const isOwner = userRole === 'superadmin' || userRole === 'admin';
  const visibleNavItems = isOwner
    ? ALL_NAV_ITEMS
    : ALL_NAV_ITEMS.filter((item) => item.roles?.includes(userRole));

  const currentRoleMeta = ROLE_DETAILS[userRole] || ROLE_DETAILS.superadmin;

  return (
    <div className="min-h-screen bg-[#f8faf9] flex font-sans text-slate-800">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
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

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">
              {currentRoleMeta.label} Menu
            </div>

            {visibleNavItems.map((item) => {
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

          {/* User Profile Card */}
          <div className="p-4 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isOwner
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isOwner ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate">
                    {currentRoleMeta.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {userEmail || currentRoleMeta.desc}
                  </div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
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
                {currentRoleMeta.label} Desk
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {currentRoleMeta.desc} • Shift #1 Active
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