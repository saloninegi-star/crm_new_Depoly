'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACCENT_PRESETS, AccentColorKey, AccentPreset, ThemeMode } from '../themeConfig';

interface ThemeContextType {
  accent: AccentPreset;
  setAccentColor: (key: AccentColorKey) => void;
  mode: ThemeMode;
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

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [accentKey, setAccentKey] = useState<AccentColorKey>('teal');
  const [mode, setMode] = useState<ThemeMode>('light');

  // 🟢 Root <html> tag par dark class lagane ka helper
  const applyThemeMode = (m: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (m === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAccent = localStorage.getItem('kognos_accent') as AccentColorKey;
      const savedMode = localStorage.getItem('kognos_mode') as ThemeMode;

      if (savedAccent && ACCENT_PRESETS[savedAccent]) {
        setAccentKey(savedAccent);
      }
      if (savedMode) {
        setMode(savedMode);
        applyThemeMode(savedMode);
      }
    }
  }, []);

  const handleSetAccent = (key: AccentColorKey) => {
    setAccentKey(key);
    localStorage.setItem('kognos_accent', key);
  };

  const handleSetMode = (m: ThemeMode) => {
    setMode(m);
    localStorage.setItem('kognos_mode', m);
    applyThemeMode(m);
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