export type AccentColorKey = 'lavender' | 'blue' | 'teal' | 'ochre' | 'graphite' | 'green';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface AccentPreset {
  key: AccentColorKey;
  label: string;
  dotColor: string;
  primary: string;         // Main button & active menu background
  hover: string;
  lightBg: string;         // Soft badge/preview background
  text: string;            // Text color for light badges
  ring: string;
}

export const ACCENT_PRESETS: Record<AccentColorKey, AccentPreset> = {
  lavender: {
    key: 'lavender',
    label: 'Lavender',
    dotColor: '#6851ff',
    primary: '#6851ff',
    hover: '#573ef2',
    lightBg: '#f0edff',
    text: '#573ef2',
    ring: '#c4b5fd',
  },
  blue: {
    key: 'blue',
    label: 'Blue',
    dotColor: '#2563eb',
    primary: '#2563eb',
    hover: '#1d4ed8',
    lightBg: '#eff6ff',
    text: '#1d4ed8',
    ring: '#93c5fd',
  },
  teal: {
    key: 'teal',
    label: 'Teal',
    dotColor: '#0d9488',
    primary: '#0d9488',
    hover: '#0f766e',
    lightBg: '#f0fdfa',
    text: '#0f766e',
    ring: '#99f6e4',
  },
  ochre: {
    key: 'ochre',
    label: 'Ochre',
    dotColor: '#b45309',
    primary: '#b45309',
    hover: '#92400e',
    lightBg: '#fef3c7',
    text: '#92400e',
    ring: '#fde68a',
  },
  graphite: {
    key: 'graphite',
    label: 'Graphite',
    dotColor: '#334155',
    primary: '#334155',
    hover: '#1e293b',
    lightBg: '#f1f5f9',
    text: '#1e293b',
    ring: '#cbd5e1',
  },
  green: {
    key: 'green',
    label: 'Green',
    dotColor: '#16a34a',
    primary: '#16a34a',
    hover: '#15803d',
    lightBg: '#f0fdf4',
    text: '#15803d',
    ring: '#bbf7d0',
  },
};