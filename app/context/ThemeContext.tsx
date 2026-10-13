'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_PRESETS, ThemeKey, ThemeColors } from '../themeConfig';

interface ThemeContextType {
  currentThemeKey: ThemeKey;
  currentTheme: ThemeColors;
  setTheme: (key: ThemeKey) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>('emerald');

  const cycleTheme = () => {
    const keys = Object.keys(THEME_PRESETS) as ThemeKey[];
    const nextIndex = (keys.indexOf(currentThemeKey) + 1) % keys.length;
    setCurrentThemeKey(keys[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentThemeKey,
        currentTheme: THEME_PRESETS[currentThemeKey],
        setTheme: setCurrentThemeKey,
        cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}