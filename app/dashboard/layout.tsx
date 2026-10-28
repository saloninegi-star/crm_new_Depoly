'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { authService, normalizeUserRole, type UserProfile } from '../../services/authService';
import {
  Home,
  Truck,
  Scale,
  Warehouse,
  Cog,
  Package,
  Send,
  Calculator,
  FileBarChart2,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Clock,
  CalendarDays,
  UserRound,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  key: string;
  subtitleKey: string;
  iconColor: string;
  iconBg: string;
}

interface NavGroup {
  group: string;
  groupKey?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: '',
    items: [
      {
        name: 'Overview',
        href: '/dashboard',
        icon: Home,
        key: 'overview',
        subtitleKey: 'overview_subtitle',
        iconColor: 'text-teal-600 dark:text-teal-400',
        iconBg: 'bg-teal-50 dark:bg-teal-950/60',
      },
    ],
  },
  {
    group: 'Inward',
    groupKey: 'inward',
    items: [
      {
        name: 'Gate entry',
        href: '/dashboard/gate',
        icon: Truck,
        key: 'gate_entry',
        subtitleKey: 'gate_subtitle',
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      },
      {
        name: 'Weighbridge',
        href: '/dashboard/weighment',
        icon: Scale,
        key: 'weighbridge',
        subtitleKey: 'weighbridge_subtitle',
        iconColor: 'text-sky-600 dark:text-sky-400',
        iconBg: 'bg-sky-50 dark:bg-sky-950/60',
      },
      {
        name: 'Paddy stock',
        href: '/dashboard/godown',
        icon: Warehouse,
        key: 'paddy_stock',
        subtitleKey: 'godown_subtitle',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      },
    ],
  },
  {
    group: 'Production',
    groupKey: 'production',
    items: [
      {
        name: 'Milling',
        href: '/dashboard/milling',
        icon: Cog,
        key: 'milling',
        subtitleKey: 'milling_subtitle',
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-50 dark:bg-purple-950/60',
      },
      {
        name: 'Finished stock',
        href: '/dashboard/packaging',
        icon: Package,
        key: 'finished_stock',
        subtitleKey: 'finished_subtitle',
        iconColor: 'text-violet-600 dark:text-violet-400',
        iconBg: 'bg-violet-50 dark:bg-violet-950/60',
      },
    ],
  },
  // 🟢 OPTION 3: MASTER OPERATIONS SCHEDULE
  {
    group: 'Planning',
    groupKey: 'planning',
    items: [
      {
        name: 'Schedule',
        href: '/dashboard/schedule',
        icon: CalendarDays,
        key: 'schedule',
        subtitleKey: 'schedule_subtitle',
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      },
    ],
  },
  {
    group: 'Outward',
    groupKey: 'outward',
    items: [
      {
        name: 'Sales & dispatch',
        href: '/dashboard/sales',
        icon: Send,
        key: 'sales_dispatch',
        subtitleKey: 'sales_subtitle',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-50 dark:bg-cyan-950/60',
      },
    ],
  },
  {
    group: 'Money',
    groupKey: 'money',
    items: [
      {
        name: 'Accounts',
        href: '/dashboard/accounts',
        icon: Calculator,
        key: 'accounts',
        subtitleKey: 'accounts_subtitle',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      },
      {
        name: 'Reports',
        href: '/dashboard/reports',
        icon: FileBarChart2,
        key: 'reports',
        subtitleKey: 'reports_subtitle',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
      },
    ],
  },
  {
    group: 'People',
    groupKey: 'people',
    items: [
      {
        name: 'HR & labour',
        href: '/dashboard/hr',
        icon: Users,
        key: 'hr_labour',
        subtitleKey: 'hr_subtitle',
        iconColor: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-rose-50 dark:bg-rose-950/60',
      },
    ],
  },
];

const ROLE_NAV_KEYS: Record<string, string[]> = {
  hr: ['overview', 'hr_labour'],
  accounts: ['overview', 'accounts', 'reports'],
  gate_guard: ['overview', 'gate_entry'],
  weighbridge: ['overview', 'weighbridge'],
  godown_incharge: ['overview', 'paddy_stock'],
  milling: ['overview', 'milling', 'schedule'],
  finished_stock: ['overview', 'finished_stock'],
  sales_dispatch: ['overview', 'sales_dispatch'],
};

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  hr: 'HR',
  accounts: 'Accounts',
  gate_guard: 'Gate Guard',
  weighbridge: 'Weighbridge',
  godown_incharge: 'Godown In-charge',
  milling: 'Milling',
  finished_stock: 'Finished Stock',
  sales_dispatch: 'Sales & Dispatch',
};

const NAV_TRANSLATION_KEYS: Record<string, string> = {
  overview: 'nav_overview',
  gate_entry: 'nav_gate_entry',
  weighbridge: 'nav_weighbridge',
  paddy_stock: 'nav_paddy_stock',
  milling: 'nav_milling',
  finished_stock: 'nav_finished_stock',
  schedule: 'nav_schedule',
  sales_dispatch: 'nav_sales_dispatch',
  accounts: 'nav_accounts',
  reports: 'nav_reports',
  hr_labour: 'nav_hr_labour',
};

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
}

function getStoredRole() {
  if (typeof window === 'undefined') return '';

  const storedRole = localStorage.getItem('user_role');
  if (storedRole) return normalizeUserRole(storedRole);

  const profileStr = localStorage.getItem('user_profile');
  if (profileStr) {
    try {
      const profile = JSON.parse(profileStr);
      if (profile.role) return normalizeUserRole(profile.role);
    } catch {}
  }

  return normalizeUserRole(localStorage.getItem('kognos_role')) || 'owner';
}

function getStoredProfileSnapshot() {
  if (typeof window === 'undefined') return '';

  let profile: UserProfile = {};
  const profileStr = localStorage.getItem('user_profile');
  if (profileStr) {
    try {
      profile = JSON.parse(profileStr) as UserProfile;
    } catch {}
  }

  const token = localStorage.getItem('access_token') || '';
  const name =
    profile.name ||
    profile.full_name ||
    localStorage.getItem('kognos_user') ||
    decodeNameFromToken(token) ||
    'User';

  return JSON.stringify({
    ...profile,
    name,
    role: profile.role || getStoredRole(),
    mobile: profile.mobile || localStorage.getItem('user_mobile') || '',
  });
}

function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function decodeNameFromToken(token: string): string {
  try {
    if (!token || !token.includes('.')) return '';
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.name || decoded.full_name || decoded.user_name || decoded.username || '';
  } catch (e) {
    return '';
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { accent, mode, setThemeMode } = useTheme();
  const { t } = useLanguage();
  const normalizedRole = useSyncExternalStore(subscribeToStorage, getStoredRole, () => '');
  const profileSnapshot = useSyncExternalStore(
    subscribeToStorage,
    getStoredProfileSnapshot,
    () => ''
  );
  const userProfile = useMemo<UserProfile>(() => {
    if (!profileSnapshot) return {};
    try {
      return JSON.parse(profileSnapshot) as UserProfile;
    } catch {
      return {};
    }
  }, [profileSnapshot]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const userName = userProfile.name || userProfile.full_name || 'User';

  const [liveDateString, setLiveDateString] = useState('');
  const [liveTimeString, setLiveTimeString] = useState('');
  const [currentShift, setCurrentShift] = useState('Shift 1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateClock = () => {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ];

        const dayName = days[now.getDay()];
        const date = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');

        let shift = 'Shift 1';
        if (hours >= 16 && hours < 24) shift = 'Shift 2';
        else if (hours >= 0 && hours < 8) shift = 'Shift 3';

        setCurrentShift(shift);
        setLiveDateString(`${dayName}, ${date} ${monthName} ${year}`);
        setLiveTimeString(`${hours.toString().padStart(2, '0')}:${minutes}`);
      };

      updateClock();
      const timer = setInterval(updateClock, 10000);
      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleConfirmLogout = () => {
    authService.logout();
    setShowLogoutModal(false);
    window.location.href = '/login';
  };

  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const visibleNavKeys = ROLE_NAV_KEYS[normalizedRole] || ['overview'];
  const visibleNavGroups =
    normalizedRole === 'owner'
      ? NAV_GROUPS
      : NAV_GROUPS.map((group) => ({
          ...group,
          items: group.items.filter((item) => visibleNavKeys.includes(item.key)),
        })).filter((group) => group.items.length > 0);
  const activeItem =
    allItems.find((item) =>
      item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
    ) ||
    (pathname === '/dashboard/settings'
      ? { name: 'Settings', key: 'settings', subtitleKey: 'settings_subtitle' }
      : { name: 'Overview', key: 'overview', subtitleKey: 'overview_subtitle' });

  const activeTranslationKey = NAV_TRANSLATION_KEYS[activeItem.key] || activeItem.key;
  const exactPageTitle =
    t(activeTranslationKey) !== activeTranslationKey ? t(activeTranslationKey) : activeItem.name;
  const userInitials = getInitials(userName);
  const userRole =
    ROLE_LABELS[normalizedRole] ||
    (normalizedRole
      ? normalizedRole.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Owner');

  return (
    <div
      className={`h-screen w-screen flex overflow-hidden font-sans transition-colors duration-200 ${
        mode === 'dark' ? 'dark bg-[#0b0f19] text-slate-100' : 'bg-[#f7f5ff] text-slate-800'
      }`}
    >
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* 1. SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-[#111726] border-r border-violet-100/90 dark:border-slate-800/80 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Logo */}
          <div className="h-16 px-5 border-b border-violet-100/90 dark:border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs"
                style={{ backgroundColor: accent.primary }}
              >
                K
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Kognos</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Rice Mill CRM
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with Planning / Schedule Included */}
          <nav className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {visibleNavGroups.map((grp, idx) => (
              <div key={idx} className="space-y-1">
                {grp.group && (
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-3 py-0.5 uppercase tracking-wider">
                    {grp.groupKey &&
                    t(`group_${grp.groupKey}`) !== `group_${grp.groupKey}`
                      ? t(`group_${grp.groupKey}`)
                      : grp.group}
                  </div>
                )}
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(item.href);

                  const translationKey = NAV_TRANSLATION_KEYS[item.key] || item.key;
                  const displayName =
                    t(translationKey) !== translationKey ? t(translationKey) : item.name;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                        isActive
                          ? 'font-bold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-violet-50/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? mode === 'dark'
                            ? 'rgba(15, 118, 110, 0.25)'
                            : accent.lightBg
                          : undefined,
                        color: isActive ? (mode === 'dark' ? '#2dd4bf' : accent.text) : undefined,
                      }}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${item.iconBg} ${item.iconColor}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{displayName}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Profile & Settings */}
        <div className="p-3 border-t border-violet-100/90 dark:border-slate-800/80 space-y-2 shrink-0 bg-white dark:bg-[#111726]">
          <Link
            href="/dashboard/settings"
            className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
              pathname === '/dashboard/settings'
                ? 'font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-violet-50/60 dark:hover:bg-slate-800'
            }`}
            style={{
              backgroundColor:
                pathname === '/dashboard/settings'
                  ? mode === 'dark'
                    ? 'rgba(15, 118, 110, 0.25)'
                    : accent.lightBg
                  : undefined,
              color:
                pathname === '/dashboard/settings'
                  ? mode === 'dark'
                    ? '#2dd4bf'
                    : accent.text
                  : undefined,
            }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-2xs">
              <Settings className="w-4 h-4" />
            </div>
            <span>{t('settings')}</span>
          </Link>

          <div className="flex items-center justify-between p-2 rounded-xl bg-violet-50/50 dark:bg-slate-800/60 border border-violet-100/90 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 uppercase shadow-xs"
                style={{ backgroundColor: accent.primary }}
              >
                {userInitials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate capitalize">
                  {userName || 'Mill Owner'}
                </div>
                <div className="text-[10px] text-slate-400 capitalize truncate">
                  {userRole || 'Owner'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg cursor-pointer transition-colors"
              title={t('sign_out')}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. STICKY NAVBAR */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-[#111726]/90 border-b border-violet-100/90 dark:border-slate-800/80 px-6 sm:px-8 py-3.5 flex items-center justify-between transition-colors shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
                {exactPageTitle}
              </h1>

              <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                <span>{liveDateString || 'Live'}</span>
                <span>·</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">{currentShift}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3 text-emerald-500 inline" />
                  updated {liveTimeString}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="scale-90 sm:scale-100 origin-right">
              <LanguageSelector />
            </div>

            <button
              type="button"
              onClick={() => setThemeMode(mode === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
              title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {mode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfilePopup((open) => !open)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-slate-800 hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: accent.primary }}
                aria-label="Open profile"
                aria-expanded={showProfilePopup}
              >
                <UserRound className="w-4 h-4" />
              </button>

              {showProfilePopup && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-30 cursor-default"
                    aria-label="Close profile popup"
                    onClick={() => setShowProfilePopup(false)}
                  />
                  <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: accent.primary }}
                      >
                        {userInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {userProfile.name || userProfile.full_name || userName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {userRole}
                        </div>
                      </div>
                    </div>

                    <dl className="space-y-2.5 pt-3 text-xs">
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-500 dark:text-slate-400">Mobile</dt>
                        <dd className="text-slate-800 dark:text-slate-200 font-medium text-right">
                          {userProfile.mobile || '—'}
                        </dd>
                      </div>
                      {userProfile.id && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-500 dark:text-slate-400">User ID</dt>
                          <dd className="text-slate-800 dark:text-slate-200 font-medium text-right">
                            {userProfile.id}
                          </dd>
                        </div>
                      )}
                      {userProfile.email && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                          <dd className="text-slate-800 dark:text-slate-200 font-medium text-right break-all">
                            {userProfile.email}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setShowProfilePopup(false)}
                      className="mt-4 block w-full rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      View account settings
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>

      {/* Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('confirm_logout_title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('confirm_logout_desc')}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-sm shadow-rose-600/20"
              >
                {t('yes_sign_out')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}