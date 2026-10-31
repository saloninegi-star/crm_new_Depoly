'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { ACCENT_PRESETS, AccentColorKey, AccentPreset, ThemeMode } from '../themeConfig';

interface ThemeContextType {
  accent: AccentPreset;
  setAccentColor: (key: AccentColorKey) => void;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  currentTheme: {
    buttonBg: string;
    name: string;
    dotColor: string;
    buttonShadow: string;
    headingColor: string;
    inputBg: string;
    wavePrimary: string;
    waveSecondary: string;
    primary: string;
    lightBg: string;
    text: string;
    ring: string;
  };
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeListeners = new Set<() => void>();

function subscribeToTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    themeListeners.delete(onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function getStoredAccent(): AccentColorKey {
  const savedAccent = localStorage.getItem('kognos_accent');
  return savedAccent && Object.prototype.hasOwnProperty.call(ACCENT_PRESETS, savedAccent)
    ? (savedAccent as AccentColorKey)
    : 'teal';
}

function getStoredMode(): ThemeMode {
  const savedMode = localStorage.getItem('kognos_mode');
  return savedMode === 'light' || savedMode === 'dark' || savedMode === 'system'
    ? savedMode
    : 'light';
}

function subscribeToSystemTheme(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function notifyThemeListeners() {
  themeListeners.forEach((listener) => listener());
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const accentKey = useSyncExternalStore<AccentColorKey>(
    subscribeToTheme,
    getStoredAccent,
    () => 'teal'
  );
  const mode = useSyncExternalStore<ThemeMode>(subscribeToTheme, getStoredMode, () => 'light');
  const systemPrefersDark = useSyncExternalStore<boolean>(
    subscribeToSystemTheme,
    getSystemPrefersDark,
    () => false
  );
  const resolvedMode = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedMode === 'dark');
    root.style.colorScheme = resolvedMode;
  }, [resolvedMode]);

  const handleSetAccent = (key: AccentColorKey) => {
    localStorage.setItem('kognos_accent', key);
    notifyThemeListeners();
  };

  const handleSetMode = (m: ThemeMode) => {
    localStorage.setItem('kognos_mode', m);
    notifyThemeListeners();
  };

  const activeAccent = ACCENT_PRESETS[accentKey] || ACCENT_PRESETS.teal;

  const cycleTheme = () => {
    const keys: AccentColorKey[] = ['lavender', 'blue', 'teal', 'ochre', 'graphite', 'green'];
    const nextIndex = (keys.indexOf(accentKey) + 1) % keys.length;
    handleSetAccent(keys[nextIndex]);
  };

  const currentTheme = {
    buttonBg: activeAccent.primary,
    name: activeAccent.label,
    dotColor: activeAccent.dotColor,
    buttonShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    headingColor: '#0f172a',
    inputBg: '#ffffff',
    wavePrimary: activeAccent.primary,
    waveSecondary: activeAccent.lightBg,
    primary: activeAccent.primary,
    lightBg: activeAccent.lightBg,
    text: activeAccent.text,
    ring: activeAccent.ring,
  };

  return (
    <ThemeContext.Provider
      value={{
        accent: activeAccent,
        setAccentColor: handleSetAccent,
        mode,
        resolvedMode,
        setThemeMode: handleSetMode,
        currentTheme,
        cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};