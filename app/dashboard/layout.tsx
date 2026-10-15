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
  CalendarCheck,
  HardHat,
  Banknote,
  Users,
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

// Sabhi menu items (Owner has access to EVERYTHING, including all HR modules)
const ALL_NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [
      'superadmin',
      'admin',
      'owner',
      'gate_guard',
      'weighbridge',
      'paddy_stock',
      'godown_incharge',
      'milling',
      'finished_stock',
      'sales_dispatch',
      'accounts',
      'hr',
    ],
  },
  // HR & Labour Modules (Visible to Owner & HR)
  {
    name: 'HR & Labour Hub',
    href: '/dashboard/hr',
    icon: Users,
    roles: ['superadmin', 'admin', 'owner', 'hr'],
  },
  {
    name: 'Staff Attendance & Shifts',
    href: '/dashboard/hr/attendance',
    icon: CalendarCheck,
    roles: ['superadmin', 'admin', 'owner', 'hr'],
  },
  {
    name: 'Palledar & Hamali Labour',
    href: '/dashboard/hr/labour',
    icon: HardHat,
    roles: ['superadmin', 'admin', 'owner', 'hr'],
  },
  {
    name: 'Wages & Advances (Kharcha)',
    href: '/dashboard/hr/payroll',
    icon: Banknote,
    roles: ['superadmin', 'admin', 'owner', 'hr'],
  },
  // Mill Operational Modules
  {
    name: 'Gate Inward',
    href: '/dashboard/gate',
    icon: Truck,
    roles: ['superadmin', 'admin', 'owner', 'gate_guard'],
  },
  {
    name: 'Weighbridge Queue',
    href: '/dashboard/weighment',
    icon: Scale,
    roles: ['superadmin', 'admin', 'owner', 'gate_guard', 'weighbridge', 'godown_incharge'],
  },
  {
    name: 'Paddy Stock (FIFO)',
    href: '/dashboard/godown',
    icon: Warehouse,
    roles: ['superadmin', 'admin', 'owner', 'paddy_stock', 'godown_incharge'],
  },
  {
    name: 'Milling & Recovery',
    href: '/dashboard/milling',
    icon: Cog,
    roles: ['superadmin', 'admin', 'owner', 'milling'],
  },
  {
    name: 'Finished Stock (Bagging)',
    href: '/dashboard/packaging',
    icon: Package,
    roles: ['superadmin', 'admin', 'owner', 'finished_stock'],
  },
  {
    name: 'Sales & Dispatch (LR)',
    href: '/dashboard/sales',
    icon: Send,
    roles: ['superadmin', 'admin', 'owner', 'sales_dispatch'],
  },
  {
    name: 'Accounts & Ledgers',
    href: '/dashboard/accounts',
    icon: Calculator,
    roles: ['superadmin', 'admin', 'owner', 'accounts'],
  },
  {
    name: 'Reports & P&L',
    href: '/dashboard/reports',
    icon: FileBarChart2,
    roles: ['superadmin', 'admin', 'owner', 'accounts'],
  },
];

const ROLE_DETAILS: Record<string, { label: string; defaultName: string }> = {
  superadmin: { label: 'Owner / SuperAdmin', defaultName: 'Mill Owner' },
  admin: { label: 'Owner / SuperAdmin', defaultName: 'Mill Owner' },
  owner: { label: 'Owner / SuperAdmin', defaultName: 'Mill Owner' },
  gate_guard: { label: 'Gate Security Guard', defaultName: 'Suraj' },
  weighbridge: { label: 'Weighbridge Operator', defaultName: 'Scale Operator' },
  godown_incharge: { label: 'Paddy Godown In-charge', defaultName: 'Suresh Gupta' },
  paddy_stock: { label: 'Paddy Godown In-charge', defaultName: 'Suresh Gupta' },
  hr: { label: 'HR & Labour Manager', defaultName: 'Saloni Negi' },
  milling: { label: 'Milling Supervisor', defaultName: 'Milling Head' },
  finished_stock: { label: 'Packaging Supervisor', defaultName: 'Packaging Head' },
  sales_dispatch: { label: 'Sales & Dispatch Head', defaultName: 'Dispatch Manager' },
  accounts: { label: 'Accounts Officer', defaultName: 'Cashier / Accountant' },
};

const getNormalizedRole = (rawRole: string | null): string => {
  if (!rawRole) return 'superadmin';
  try {
    const parsed = JSON.parse(rawRole);
    if (parsed && typeof parsed === 'object' && parsed.id) {
      return getNormalizedRole(parsed.id);
    }
  } catch {}
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentTheme, cycleTheme } = useTheme();

  const [userRole, setUserRole] = useState('superadmin');
  const [personName, setPersonName] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const directRole = localStorage.getItem('user_role');
    const kognosRoleStr = localStorage.getItem('kognos_role');
    const storedUserName = localStorage.getItem('kognos_user') || '';
    const profileStr = localStorage.getItem('user_profile');

    const detectedRole = getNormalizedRole(directRole || kognosRoleStr);
    setUserRole(detectedRole);

    let realName = '';

    if (profileStr) {
      try {
        const parsedProfile = JSON.parse(profileStr);
        if (parsedProfile?.name) {
          realName = parsedProfile.name;
        }
      } catch {}
    }

    if (!realName && storedUserName) {
      realName = storedUserName.replace(/\s*\(.*?\)\s*/g, '').replace(/Mobile:\s*\d+/gi, '').trim();
    }

    const meta = ROLE_DETAILS[detectedRole];
    if (detectedRole === 'hr') {
      if (!realName || realName.toLowerCase().includes('owner') || realName.toLowerCase().includes('authorized')) {
        realName = 'Saloni Negi';
      }
    } else if (detectedRole === 'godown_incharge' || detectedRole === 'paddy_stock') {
      if (!realName || realName.toLowerCase().includes('owner') || realName.toLowerCase().includes('authorized')) {
        realName = 'Suresh Gupta';
      }
    } else if (detectedRole === 'gate_guard') {
      if (!realName || realName.toLowerCase().includes('owner') || realName.toLowerCase().includes('authorized')) {
        realName = 'Suraj';
      }
    } else if (!realName || realName.toLowerCase().includes('authorized')) {
      realName = meta?.defaultName || 'Mill Owner';
    }

    const formatted = realName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    setPersonName(formatted);
  }, []);

  const handleConfirmLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');
    localStorage.removeItem('kognos_role');
    localStorage.removeItem('kognos_user');
    localStorage.removeItem('user_profile');
    setShowLogoutModal(false);
    router.push('/');
  };

  const isOwner = userRole === 'superadmin' || userRole === 'admin' || userRole === 'owner';
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

          {/* Menu Items (Scrollable) */}
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
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
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
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
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
                  <div className="text-[11px] font-semibold text-emerald-700 truncate">
                    {personName}
                  </div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
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
                Shift #1 Active • Operations Live
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

      {/* Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Sign Out Confirmation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to sign out of your session? You will need to verify your credentials to log in again.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-sm shadow-rose-600/20"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}