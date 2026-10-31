'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { ACCENT_PRESETS, AccentColorKey } from '../../themeConfig';
import { Check } from 'lucide-react';
import { authService } from '../../../services/authService';
import LanguageSelector from '../../components/LanguageSelector';

export default function SettingsPage() {
  const { accent, setAccentColor, mode, setThemeMode } = useTheme();
  const { t } = useLanguage();

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userMobile, setUserMobile] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Backend se aaya hua dynamic profile read karein
    const profileStr = localStorage.getItem('user_profile');
    const storedUser = localStorage.getItem('kognos_user');
    const storedRole = localStorage.getItem('user_role');

    let detectedName = '';
    let detectedRole = '';
    let detectedMobile = '+91 98765 43210';

    if (profileStr) {
      try {
        const parsed = JSON.parse(profileStr);
        detectedName = parsed.name || parsed.full_name || '';
        detectedRole = parsed.role || '';
        if (parsed.mobile) detectedMobile = parsed.mobile.startsWith('+') ? parsed.mobile : `+91 ${parsed.mobile}`;
      } catch {}
    }

    if (!detectedName && storedUser) detectedName = storedUser;
    if (!detectedRole && storedRole) detectedRole = storedRole;

    setUserName(detectedName || 'Mill Owner');
    setUserRole(detectedRole ? detectedRole.replace(/_/g, ' ') : 'Owner');
    setUserMobile(detectedMobile);
  }, []);

  const accentKeys: AccentColorKey[] = ['lavender', 'blue', 'teal', 'ochre', 'graphite', 'green'];

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* ========================================================
          CARD 1: APPEARANCE (EXACT ALIGNMENT FROM IMAGE 2)
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-7 space-y-6 transition-colors">
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('language')}</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t('language_description')}
            </p>
          </div>
          <LanguageSelector />
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* Card Title */}
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('appearance')}</h2>

        {/* 1. Accent colour Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Accent colour</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Buttons, links and the selected menu item. Changes only your view.
            </p>
          </div>

          {/* 3-Column Grid Matching Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {accentKeys.map((key) => {
              const item = ACCENT_PRESETS[key];
              const isSelected = accent.key === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAccentColor(key)}
                  className={`h-11 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white shadow-2xs"
                    style={{ backgroundColor: item.dotColor }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* 2. Theme Segmented Control */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{t('theme')}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Dark is easier on the eyes at night.
            </p>
          </div>

          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'light'
                  ? 'bg-white dark:bg-slate-700 shadow-2xs font-bold text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('light')}
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'dark'
                  ? 'bg-white dark:bg-slate-700 shadow-2xs font-bold text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('dark')}
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('system')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'system'
                  ? 'bg-white dark:bg-slate-700 shadow-2xs font-bold text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('system_theme')}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* 3. Preview Box */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Preview</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              What your choice looks like.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-white text-xs font-bold shadow-xs transition-colors"
              style={{ backgroundColor: accent.primary }}
            >
              Save weighment
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-bold transition-colors"
              style={{ backgroundColor: accent.lightBg, color: accent.text }}
            >
              Paddy stock
            </button>

            <span
              className="text-xs font-semibold underline underline-offset-2 cursor-pointer transition-colors"
              style={{ color: accent.primary }}
            >
              View lot L-0849
            </span>

            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: accent.lightBg, color: accent.text }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent.primary }} />
              Unloading
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          CARD 2: YOUR ACCOUNT (EXACT ALIGNMENT FROM IMAGE 2)
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-7 space-y-5 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Your account</h2>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-4 sm:grid-cols-6 py-0.5">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Name</span>
            <span className="font-semibold text-slate-900 dark:text-white col-span-3 sm:col-span-5 capitalize">
              {userName}
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 py-0.5">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Role</span>
            <span className="font-semibold text-slate-900 dark:text-white col-span-3 sm:col-span-5 capitalize">
              {userRole}
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 py-0.5">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Mobile</span>
            <span className="font-semibold text-slate-900 dark:text-white col-span-3 sm:col-span-5 font-mono">
              {userMobile}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              authService.logout();
              window.location.href = '/login';
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            Sign out of all devices
          </button>
        </div>
      </div>
    </div>
  );
}