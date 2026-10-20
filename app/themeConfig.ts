export type ThemeKey = 'emerald' | 'amber' | 'sapphire' | 'graphite';

// Added missing ThemeColors Interface
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
  // Dark Green Theme (Default)
  emerald: {
    name: 'Deep Forest Green',
    dotColor: '#065f46',
    wavePrimary: '#064e3b',
    waveSecondary: '#10b981',
    headingColor: '#022c22',
    subHeadingColor: '#475569',
    buttonBg: '#064e3b',
    buttonHover: '#022c22',
    buttonShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.45)',
    inputBg: '#f0fdf4',
  },

  // Dark Purple Theme
  amber: {
    name: 'Royal Dark Purple',
    dotColor: '#6b21a8',
    wavePrimary: '#581c87',
    waveSecondary: '#a855f7',
    headingColor: '#2e1065',
    subHeadingColor: '#64748b',
    buttonBg: '#581c87',
    buttonHover: '#3b0764',
    buttonShadow: '0 10px 25px -5px rgba(88, 28, 135, 0.45)',
    inputBg: '#faf5ff',
  },

  // Dark Blue Theme
  sapphire: {
    name: 'Midnight Dark Blue',
    dotColor: '#1e3a8a',
    wavePrimary: '#172554',
    waveSecondary: '#3b82f6',
    headingColor: '#091833',
    subHeadingColor: '#475569',
    buttonBg: '#172554',
    buttonHover: '#0b1329',
    buttonShadow: '0 10px 25px -5px rgba(23, 37, 84, 0.45)',
    inputBg: '#f0f4f9',
  },

  // Graphite Theme
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