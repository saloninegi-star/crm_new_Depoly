export type ThemeKey = 'emerald' | 'amber' | 'sapphire' | 'graphite';

export interface ThemeColors {
  name: string;
  dotColor: string;
  wavePrimary: string;
  waveSecondary: string;
  headingColor: string;
  subHeadingColor: string;
  buttonBg: string;
  buttonHover: string;
  buttonShadow: string;
  inputBg: string;
}

export const THEME_PRESETS: Record<ThemeKey, ThemeColors> = {
  emerald: {
    name: 'Emerald Paddy',
    dotColor: '#1bb080',
    wavePrimary: '#1bb080',
    waveSecondary: '#79dfbf',
    headingColor: '#0a3622',
    subHeadingColor: '#64748b',
    buttonBg: '#0d9488',
    buttonHover: '#0f766e',
    buttonShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.45)',
    inputBg: '#f2f6f4',
  },
  amber: {
    name: 'Golden Grain',
    dotColor: '#d97706',
    wavePrimary: '#d97706',
    waveSecondary: '#fcd34d',
    headingColor: '#451a03',
    subHeadingColor: '#78716c',
    buttonBg: '#b45309',
    buttonHover: '#92400e',
    buttonShadow: '0 10px 25px -5px rgba(180, 83, 9, 0.45)',
    inputBg: '#fbf8f2',
  },
  sapphire: {
    name: 'Cyber Sapphire',
    dotColor: '#2563eb',
    wavePrimary: '#2563eb',
    waveSecondary: '#93c5fd',
    headingColor: '#0f172a',
    subHeadingColor: '#64748b',
    buttonBg: '#1d4ed8',
    buttonHover: '#1e40af',
    buttonShadow: '0 10px 25px -5px rgba(29, 78, 216, 0.45)',
    inputBg: '#f1f5f9',
  },
  graphite: {
    name: 'Modern Graphite',
    dotColor: '#334155',
    wavePrimary: '#334155',
    waveSecondary: '#94a3b8',
    headingColor: '#0f172a',
    subHeadingColor: '#64748b',
    buttonBg: '#0f172a',
    buttonHover: '#1e293b',
    buttonShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.45)',
    inputBg: '#f3f4f6',
  },
};