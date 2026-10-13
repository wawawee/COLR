export interface ThemeTokens {
  // Brand colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  
  // Surfaces & Base
  background: string;
  surface: string;
  surfaceForeground: string;
  surfaceBorder: string;
  
  // Typography
  text: string;
  textMuted: string;
  
  // Effects & Feedback
  ring: string;
  glow: string;
  
  // Geometric tokens
  radius: number; // in pixels, e.g. 8, 12, 16
  borderWidth: number; // in pixels, e.g. 1, 2
  shadowMode: 'subtle' | 'elevated' | 'glow' | 'brutalist' | 'none';
}

export type ThemeStyle = 'minimalistisk' | 'djärv' | 'retro' | 'mjuk' | 'professionell' | 'mellanläge' | 'annan';

export interface ThemePreset {
  id: string;
  name: string;
  mood: string;
  styleCategory: ThemeStyle;
  category: 'dark' | 'light' | 'vibrant' | 'minimal' | 'tech' | 'editorial' | 'cyberpunk';
  description: string;
  tokens: ThemeTokens;
  isCustom?: boolean;
  createdAt?: string;
}

export type PreviewTab = 'gadgets' | 'components' | 'landing' | 'dashboard' | 'contrast' | 'shades';

export interface ContrastScore {
  label: string;
  fgColor: string;
  bgColor: string;
  fgName: string;
  bgName: string;
  ratio: number;
  aaSmall: boolean;
  aaLarge: boolean;
  aaaSmall: boolean;
}
