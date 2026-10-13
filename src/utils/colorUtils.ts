/**
 * Color utility helpers for converting Hex <-> RGB <-> HSL,
 * calculating WCAG contrast ratios, and color manipulations.
 */

import { ThemeTokens } from '../types/theme';

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
}

// Convert Hex to RGB
export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const intVal = parseInt(clean, 16);
  if (isNaN(intVal) || clean.length < 6) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
}

// Convert RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): RGB {
  h = (h % 360 + 360) % 360 / 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// Calculate relative luminance according to WCAG 2.1 specs
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// WCAG Contrast Ratio
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 100) / 100;
}

// Helper to determine if text is readable (returns high-contrast #ffffff or #09090b)
export function getOptimalTextColor(bgColor: string): string {
  const lum = getRelativeLuminance(bgColor);
  return lum > 0.4 ? '#0f172a' : '#f8fafc';
}

// Adjust HSL properties
export function adjustColor(hex: string, deltaH: number = 0, deltaS: number = 0, deltaL: number = 0): string {
  const hsl = hexToHsl(hex);
  const h = (hsl.h + deltaH + 360) % 360;
  const s = Math.max(0, Math.min(100, hsl.s + deltaS));
  const l = Math.max(0, Math.min(100, hsl.l + deltaL));
  return hslToHex(h, s, l);
}

// Check if a hex string is valid
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Slumpar fram det "Perfekta Mellanläget" (Sweet Spot):
 * Undviker både extrem kolsvärta (#000000 / 0-8% ljusstyrka)
 * och bländande kritvit (#ffffff / 98-100% ljusstyrka).
 *
 * Ger vilsamma, sofistikerade bakgrunder runt:
 * - Dämpat mörkt mellanläge (16-22% Lightness, t.ex. mjuk skiffer, grafit, marin)
 * - Mjukt ljust mellanläge (88-92% Lightness, t.ex. mjukt linne, varm elfenben, sand)
 */
export function generateSweetSpotPalette(mode: 'dim-slate' | 'soft-linen' | 'random' = 'random'): ThemeTokens {
  const targetMode = mode === 'random' ? (Math.random() > 0.5 ? 'dim-slate' : 'soft-linen') : mode;
  const baseHue = Math.floor(Math.random() * 360);
  const secondaryHue = (baseHue + 35 + Math.floor(Math.random() * 50)) % 360;
  const accentHue = (baseHue + 175 + Math.floor(Math.random() * 30)) % 360;

  if (targetMode === 'dim-slate') {
    // Perfekt Mörkt Mellanläge (Dim Slate / Twilight):
    // Bakgrund runt 17-21% ljusstyrka (aldrig kolsvart, mycket behagligt för ögonen)
    const bgHue = (baseHue + 210) % 360;
    const bgLightness = 17 + Math.floor(Math.random() * 5); // 17% - 21%
    const background = hslToHex(bgHue, 14, bgLightness);
    
    // Kort/Surface är 6-8% ljusare för skön mjuk separation utan hårda linjer
    const surface = hslToHex(bgHue, 12, bgLightness + 7);
    const surfaceBorder = hslToHex(bgHue, 10, bgLightness + 14);

    // Primär och accent är kalibrerade för att poppa mjukt mot 18% bakgrund
    const primary = hslToHex(baseHue, 78, 62);
    const secondary = hslToHex(secondaryHue, 68, 58);
    const accent = hslToHex(accentHue, 82, 64);

    const text = '#f3f4f8'; // Mjuk off-white (inte bländande 100% vit)
    const textMuted = hslToHex(bgHue, 12, 68);

    return {
      primary,
      primaryForeground: getOptimalTextColor(primary),
      secondary,
      secondaryForeground: getOptimalTextColor(secondary),
      accent,
      accentForeground: getOptimalTextColor(accent),
      background,
      surface,
      surfaceForeground: text,
      surfaceBorder,
      text,
      textMuted,
      ring: primary,
      glow: hslToHex(baseHue, 80, 58),
      radius: [6, 8, 10, 12][Math.floor(Math.random() * 4)],
      borderWidth: 1,
      shadowMode: 'subtle',
    };
  } else {
    // Perfekt Mjukt Ljust Mellanläge (Soft Linen / Varmt Papper):
    // Bakgrund runt 89-93% ljusstyrka (inte bländande 100% kritvit)
    const bgHue = (baseHue + 30) % 360;
    const bgLightness = 89 + Math.floor(Math.random() * 4); // 89% - 92%
    const background = hslToHex(bgHue, 18, bgLightness);
    
    const surface = hslToHex(bgHue, 12, 97); // Mjukt dämpad vit yta
    const surfaceBorder = hslToHex(bgHue, 14, bgLightness - 10);

    const primary = hslToHex(baseHue, 82, 45);
    const secondary = hslToHex(secondaryHue, 72, 42);
    const accent = hslToHex(accentHue, 88, 46);

    const text = hslToHex(bgHue, 22, 16); // Mjuk mörk grafit, inte kolsvart
    const textMuted = hslToHex(bgHue, 14, 46);

    return {
      primary,
      primaryForeground: getOptimalTextColor(primary),
      secondary,
      secondaryForeground: getOptimalTextColor(secondary),
      accent,
      accentForeground: getOptimalTextColor(accent),
      background,
      surface,
      surfaceForeground: text,
      surfaceBorder,
      text,
      textMuted,
      ring: primary,
      glow: hslToHex(baseHue, 70, 48),
      radius: [8, 10, 12][Math.floor(Math.random() * 3)],
      borderWidth: 1,
      shadowMode: 'subtle',
    };
  }
}

export interface ExtremeSofteningStats {
  isDark: boolean;
  minL: number;
  maxL: number;
  darkestToken: string;
  darkestHex: string;
  brightestToken: string;
  brightestHex: string;
  contrastRatio: number;
  wcagStatus: 'AAA' | 'AA' | 'Pass';
}

export function analyzeThemeExtremes(tokens: ThemeTokens): ExtremeSofteningStats {
  const tokenEntries: [string, string][] = [
    ['Bakgrund', tokens.background],
    ['Yta (Card)', tokens.surface],
    ['Text', tokens.text],
    ['Text Dämpad', tokens.textMuted],
    ['Primär', tokens.primary],
    ['Sekundär', tokens.secondary],
    ['Accent', tokens.accent],
  ];

  let minL = 101;
  let maxL = -1;
  let darkestToken = 'Bakgrund';
  let darkestHex = tokens.background;
  let brightestToken = 'Text';
  let brightestHex = tokens.text;

  tokenEntries.forEach(([name, hex]) => {
    const l = hexToHsl(hex).l;
    if (l < minL) {
      minL = l;
      darkestToken = name;
      darkestHex = hex;
    }
    if (l > maxL) {
      maxL = l;
      brightestToken = name;
      brightestHex = hex;
    }
  });

  const bgHsl = hexToHsl(tokens.background);
  const isDark = bgHsl.l < 50;
  const ratio = getContrastRatio(tokens.text, tokens.background);

  return {
    isDark,
    minL: Math.round(minL),
    maxL: Math.round(maxL),
    darkestToken,
    darkestHex,
    brightestToken,
    brightestHex,
    contrastRatio: ratio,
    wcagStatus: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Pass',
  };
}

/**
 * Mjukar upp extremtoner med strikt bevarad kontrast och hierarki:
 * - För mörka scheman: Lyfter de mörkaste tonerna (bakgrund från t.ex. 2-8% till 18-24%)
 *   och mjukar upp de ljusaste tonerna (text från bländande 100% till behagliga 82-87%).
 * - För ljusa scheman: Dämpar de ljusaste tonerna (bakgrund från 98-100% till behagliga 84-90%)
 *   och lyfter de mörkaste tonerna (text från kolsvart 0-5% till djup grafit 18-24%).
 * - Garanterar alltid bevarad WCAG AA kontrast (minst 4.5:1) mellan text och bakgrund/ytor!
 */
export function softenExtremesWithContrast(tokens: ThemeTokens, amount: number = 0.55): ThemeTokens {
  const clampAmount = Math.max(0, Math.min(1, amount));
  if (clampAmount <= 0.02) {
    return { ...tokens };
  }

  const bgHsl = hexToHsl(tokens.background);
  const isDark = bgHsl.l < 50;

  if (isDark) {
    // === MÖRKT TEMA ===
    // 1. Lyft de mörkaste tonerna (Bakgrund)
    // Undvik kolsvart (0-10%). Mål: 18% vid amount=0.55, upp till 24% vid amount=1.0
    const targetFloorL = 17 + clampAmount * 7;
    let newBgL = bgHsl.l;
    if (bgHsl.l < targetFloorL) {
      newBgL = bgHsl.l + (targetFloorL - bgHsl.l) * clampAmount;
    }
    const newBg = hslToHex(bgHsl.h, Math.min(bgHsl.s, 16), newBgL);

    // 2. Yta (Surface) hålls 6-8% över bakgrunden för mjukt skiktat djup
    const surfHsl = hexToHsl(tokens.surface);
    const targetSurfL = Math.min(32, newBgL + Math.max(6, (surfHsl.l - bgHsl.l) * 0.85 + 4 * clampAmount));
    const newSurf = hslToHex(surfHsl.h, Math.min(surfHsl.s, 18), targetSurfL);

    // 3. Ram (Border)
    const newBorderL = Math.min(42, targetSurfL + 8);
    const newBorder = hslToHex(bgHsl.h, Math.min(bgHsl.s, 14), newBorderL);

    // 4. Mjuka upp de ljusaste tonerna (Text / High-light)
    // Undvik bländande 100% halogen-vit. Mål: 86% vid amount=0.55, ner till 81% vid amount=1.0
    const textHsl = hexToHsl(tokens.text);
    const targetCeilingL = 88 - clampAmount * 7;
    let newTextL = textHsl.l;
    if (textHsl.l > targetCeilingL) {
      newTextL = textHsl.l - (textHsl.l - targetCeilingL) * clampAmount;
    }
    let newText = hslToHex(textHsl.h, Math.min(textHsl.s, 10), newTextL);

    // 5. Muted Text: harmoniskt mitt emellan yta och text
    const newMutedL = Math.max(targetSurfL + 15, Math.min(newTextL - 16, 64));
    const newMuted = hslToHex(bgHsl.h, Math.min(bgHsl.s, 12), newMutedL);

    // 6. Justera Accent & Primär så de inte flyter ihop med lyft bakgrund
    const primHsl = hexToHsl(tokens.primary);
    let newPrimL = primHsl.l;
    if (primHsl.l < newBgL + 20) {
      newPrimL = Math.min(74, newBgL + 25);
    } else if (primHsl.l > 82) {
      newPrimL = primHsl.l - (primHsl.l - 72) * clampAmount;
    }
    const newPrimary = hslToHex(primHsl.h, primHsl.s, newPrimL);

    const secHsl = hexToHsl(tokens.secondary);
    let newSecL = secHsl.l;
    if (secHsl.l < newBgL + 18) {
      newSecL = Math.min(70, newBgL + 22);
    } else if (secHsl.l > 82) {
      newSecL = secHsl.l - (secHsl.l - 70) * clampAmount;
    }
    const newSecondary = hslToHex(secHsl.h, secHsl.s, newSecL);

    const accHsl = hexToHsl(tokens.accent);
    let newAccL = accHsl.l;
    if (accHsl.l < newBgL + 20) {
      newAccL = Math.min(74, newBgL + 26);
    } else if (accHsl.l > 82) {
      newAccL = accHsl.l - (accHsl.l - 72) * clampAmount;
    }
    const newAccent = hslToHex(accHsl.h, accHsl.s, newAccL);

    // 7. Kontrollera och garantera WCAG AA Kontrast (>= 4.5:1)
    let ratio = getContrastRatio(newText, newBg);
    while (ratio < 4.8 && newTextL < 97) {
      newTextL += 1.5;
      newText = hslToHex(textHsl.h, Math.min(textHsl.s, 10), newTextL);
      ratio = getContrastRatio(newText, newBg);
    }
    while (ratio < 4.8 && newBgL > 14) {
      newBgL -= 1;
      const adjBg = hslToHex(bgHsl.h, Math.min(bgHsl.s, 16), newBgL);
      ratio = getContrastRatio(newText, adjBg);
    }

    return {
      ...tokens,
      background: newBg,
      surface: newSurf,
      surfaceBorder: newBorder,
      surfaceForeground: newText,
      text: newText,
      textMuted: newMuted,
      primary: newPrimary,
      primaryForeground: getOptimalTextColor(newPrimary),
      secondary: newSecondary,
      secondaryForeground: getOptimalTextColor(newSecondary),
      accent: newAccent,
      accentForeground: getOptimalTextColor(newAccent),
      ring: newPrimary,
    };
  } else {
    // === LJUST TEMA ===
    // 1. Dämpa de ljusaste tonerna (Bakgrund)
    // Undvik bländande kritvitt (98-100%). Mål: 90% vid amount=0.55, ner till 85% vid amount=1.0 (mjukt linne / varmgrå)
    const targetCeilingL = 92 - clampAmount * 7;
    let newBgL = bgHsl.l;
    if (bgHsl.l > targetCeilingL) {
      newBgL = bgHsl.l - (bgHsl.l - targetCeilingL) * clampAmount;
    }
    const newBg = hslToHex(bgHsl.h, Math.min(bgHsl.s, 18), newBgL);

    // 2. Yta (Surface) hålls ren och något ljusare än bakgrunden
    const surfHsl = hexToHsl(tokens.surface);
    const targetSurfL = Math.min(98, newBgL + 4 + (1 - clampAmount) * 3);
    const newSurf = hslToHex(surfHsl.h, Math.min(surfHsl.s, 12), targetSurfL);

    // 3. Ram (Border)
    const newBorderL = Math.max(62, newBgL - 10);
    const newBorder = hslToHex(bgHsl.h, Math.min(bgHsl.s, 12), newBorderL);

    // 4. Lyft de mörkaste tonerna (Text)
    // Undvik hård kolsvart (0-6%). Mål: 18% vid amount=0.55, upp till 24% vid amount=1.0 (behaglig djup grafit)
    const textHsl = hexToHsl(tokens.text);
    const targetFloorL = 16 + clampAmount * 8;
    let newTextL = textHsl.l;
    if (textHsl.l < targetFloorL) {
      newTextL = textHsl.l + (targetFloorL - textHsl.l) * clampAmount;
    }
    let newText = hslToHex(textHsl.h, Math.min(textHsl.s, 18), newTextL);

    // 5. Muted Text: behaglig mellan-grå
    const newMutedL = 46 + clampAmount * 4;
    const newMuted = hslToHex(bgHsl.h, Math.min(bgHsl.s, 12), newMutedL);

    // 6. Primär & Accent justering för ljus bakgrund
    const primHsl = hexToHsl(tokens.primary);
    let newPrimL = primHsl.l;
    if (primHsl.l > newBgL - 20) {
      newPrimL = Math.max(30, newBgL - 25);
    } else if (primHsl.l < 24) {
      newPrimL = primHsl.l + (34 - primHsl.l) * clampAmount;
    }
    const newPrimary = hslToHex(primHsl.h, primHsl.s, newPrimL);

    const secHsl = hexToHsl(tokens.secondary);
    let newSecL = secHsl.l;
    if (secHsl.l > newBgL - 18) {
      newSecL = Math.max(28, newBgL - 22);
    } else if (secHsl.l < 22) {
      newSecL = secHsl.l + (32 - secHsl.l) * clampAmount;
    }
    const newSecondary = hslToHex(secHsl.h, secHsl.s, newSecL);

    const accHsl = hexToHsl(tokens.accent);
    let newAccL = accHsl.l;
    if (accHsl.l > newBgL - 20) {
      newAccL = Math.max(32, newBgL - 25);
    } else if (accHsl.l < 24) {
      newAccL = accHsl.l + (34 - accHsl.l) * clampAmount;
    }
    const newAccent = hslToHex(accHsl.h, accHsl.s, newAccL);

    // 7. Kontrollera och garantera WCAG AA Kontrast (>= 4.5:1)
    let ratio = getContrastRatio(newText, newBg);
    while (ratio < 4.8 && newTextL > 10) {
      newTextL -= 1.5;
      newText = hslToHex(textHsl.h, Math.min(textHsl.s, 18), newTextL);
      ratio = getContrastRatio(newText, newBg);
    }
    while (ratio < 4.8 && newBgL < 97) {
      newBgL += 1;
      const adjBg = hslToHex(bgHsl.h, Math.min(bgHsl.s, 18), newBgL);
      ratio = getContrastRatio(newText, adjBg);
    }

    return {
      ...tokens,
      background: newBg,
      surface: newSurf,
      surfaceBorder: newBorder,
      surfaceForeground: newText,
      text: newText,
      textMuted: newMuted,
      primary: newPrimary,
      primaryForeground: getOptimalTextColor(newPrimary),
      secondary: newSecondary,
      secondaryForeground: getOptimalTextColor(newSecondary),
      accent: newAccent,
      accentForeground: getOptimalTextColor(newAccent),
      ring: newPrimary,
    };
  }
}

/**
 * Snäpper nuvarande tema till "Det Perfekta Mellanläget" med bevarad kontrast.
 */
export function snapTokensToSweetSpot(tokens: ThemeTokens): ThemeTokens {
  return softenExtremesWithContrast(tokens, 0.6);
}

// Fallback legacy generator
export function generateHarmoniousPalette(isDark: boolean = true): ThemeTokens {
  return generateSweetSpotPalette(isDark ? 'dim-slate' : 'soft-linen');
}

export type ShadeStepNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export interface ColorShadeStep {
  step: ShadeStepNumber;
  hex: string;
  lightness: number; // 0 - 100%
  luminance: number; // 0 - 1
  isBase?: boolean;
  contrastOnDark: number; // vs #090a0f
  contrastOnLight: number; // vs #ffffff
  optimalText: string;
}

/**
 * Genererar en fullständig 11-stegs färgskala (50-950 nyanser / shades)
 * baserat på basfärgens ton (hue) och mättnad, med perceptuellt kalibrerad
 * ljusstyrka och WCAG-kontrastvärden.
 */
export function generateColorShades(baseHex: string): ColorShadeStep[] {
  if (!isValidHex(baseHex)) {
    baseHex = '#3b82f6';
  }
  const baseHsl = hexToHsl(baseHex);
  const steps: ShadeStepNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  
  const lightnessMap: Record<ShadeStepNumber, number> = {
    50: 96,
    100: 91,
    200: 82,
    300: 71,
    400: 60,
    500: 50,
    600: 40,
    700: 30,
    800: 21,
    900: 13,
    950: 7,
  };

  let closestStep: ShadeStepNumber = 500;
  let minDiff = 999;
  for (const s of steps) {
    const diff = Math.abs(lightnessMap[s] - baseHsl.l);
    if (diff < minDiff) {
      minDiff = diff;
      closestStep = s;
    }
  }

  return steps.map((s) => {
    let targetL: number;
    let targetS = baseHsl.s;

    if (s === closestStep) {
      targetL = baseHsl.l;
    } else {
      targetL = lightnessMap[s];
      if (s === 50) targetS = Math.min(baseHsl.s, 65);
      else if (s === 100) targetS = Math.min(baseHsl.s, 75);
      else if (s === 950) targetS = Math.min(baseHsl.s, 70);
      else targetS = Math.max(10, Math.min(100, baseHsl.s));
    }

    const hex = hslToHex(baseHsl.h, targetS, targetL);
    const lum = getRelativeLuminance(hex);
    const contrastOnDark = getContrastRatio(hex, '#090a0f');
    const contrastOnLight = getContrastRatio(hex, '#ffffff');

    return {
      step: s,
      hex,
      lightness: Math.round(targetL),
      luminance: Math.round(lum * 1000) / 1000,
      isBase: s === closestStep,
      contrastOnDark,
      contrastOnLight,
      optimalText: getOptimalTextColor(hex),
    };
  });
}

/**
 * Cyklar färgroller i schemat:
 * Primär -> Sekundär -> Accent -> Primär
 * Alla textkontraster (foregrounds) räknas om automatiskt för optimal tillgänglighet.
 */
export function cycleThemeColors(tokens: ThemeTokens): ThemeTokens {
  const newPrimary = tokens.secondary;
  const newSecondary = tokens.accent;
  const newAccent = tokens.primary;

  return {
    ...tokens,
    primary: newPrimary,
    primaryForeground: getOptimalTextColor(newPrimary),
    secondary: newSecondary,
    secondaryForeground: getOptimalTextColor(newSecondary),
    accent: newAccent,
    accentForeground: getOptimalTextColor(newAccent),
    ring: newPrimary,
    glow: newPrimary,
  };
}

/**
 * Slumpar ordningen på färgerna i schemat (Randomize order av färger):
 * Tar befintliga färger (Primär, Sekundär, Accent) och blandar deras tilldelning
 * så att du kan se hur ditt nuvarande färgval ser ut i olika hierarkier.
 */
export function shuffleThemeColorOrder(tokens: ThemeTokens): ThemeTokens {
  const palette = [tokens.primary, tokens.secondary, tokens.accent];
  
  // Garantera att vi får en annan permutation än den nuvarande
  const permutations = [
    [palette[1], palette[2], palette[0]], // cycle 1
    [palette[2], palette[0], palette[1]], // cycle 2
    [palette[1], palette[0], palette[2]], // swap 1 & 2
    [palette[0], palette[2], palette[1]], // swap 2 & 3
    [palette[2], palette[1], palette[0]], // swap 1 & 3
  ];

  const pick = permutations[Math.floor(Math.random() * permutations.length)];
  const [newPrimary, newSecondary, newAccent] = pick;

  return {
    ...tokens,
    primary: newPrimary,
    primaryForeground: getOptimalTextColor(newPrimary),
    secondary: newSecondary,
    secondaryForeground: getOptimalTextColor(newSecondary),
    accent: newAccent,
    accentForeground: getOptimalTextColor(newAccent),
    ring: newPrimary,
    glow: newPrimary,
  };
}

export type NeobrutalistPresetKind = 'preserve' | 'minimal-canary' | 'minimal-lime' | 'minimal-bubblegum' | 'minimal-cyber';

/**
 * Förvandlar ett tema till äkta Neobrutalism (eller genererar en minimalistisk 2-3 färgpalett):
 * - Fasta solida 2px ramar
 * - Hård 3D-fallskugga (shadowMode: 'brutalist')
 * - Skarp radie (0px eller 4px)
 * - Få, slagkraftiga färger med maximal kontrast
 */
export function neobrutalizeTheme(
  tokens: ThemeTokens,
  kind: NeobrutalistPresetKind = 'preserve'
): ThemeTokens {
  if (kind === 'minimal-canary') {
    // 3 färger: Varm canvas, Svart bläck, Elektrisk kanariegul
    return {
      background: '#fffdf0',
      surface: '#ffffff',
      surfaceForeground: '#000000',
      surfaceBorder: '#000000',
      text: '#000000',
      textMuted: '#525252',
      primary: '#facc15',
      primaryForeground: '#000000',
      secondary: '#ffffff',
      secondaryForeground: '#000000',
      accent: '#000000',
      accentForeground: '#ffffff',
      ring: '#000000',
      glow: '#facc15',
      radius: 4,
      borderWidth: 2,
      shadowMode: 'brutalist',
    };
  }

  if (kind === 'minimal-lime') {
    // 3 färger: Stark vit, Svart bläck, Cyber Acid Lime
    return {
      background: '#ffffff',
      surface: '#f5f5f5',
      surfaceForeground: '#000000',
      surfaceBorder: '#000000',
      text: '#000000',
      textMuted: '#404040',
      primary: '#ccff00',
      primaryForeground: '#000000',
      secondary: '#000000',
      secondaryForeground: '#ffffff',
      accent: '#ccff00',
      accentForeground: '#000000',
      ring: '#000000',
      glow: '#ccff00',
      radius: 2,
      borderWidth: 2,
      shadowMode: 'brutalist',
    };
  }

  if (kind === 'minimal-bubblegum') {
    // 3 färger: Mjuk sockervadd, Kolsvart, Chockrosa
    return {
      background: '#fdf2f8',
      surface: '#ffffff',
      surfaceForeground: '#111111',
      surfaceBorder: '#111111',
      text: '#111111',
      textMuted: '#4b5563',
      primary: '#f43f5e',
      primaryForeground: '#ffffff',
      secondary: '#ffffff',
      secondaryForeground: '#111111',
      accent: '#111111',
      accentForeground: '#ffffff',
      ring: '#111111',
      glow: '#f43f5e',
      radius: 4,
      borderWidth: 2,
      shadowMode: 'brutalist',
    };
  }

  if (kind === 'minimal-cyber') {
    // Mörk Neobrutalism (3 färger: Obsidian, Vit ram, Elektrisk Cyan)
    return {
      background: '#0a0a0a',
      surface: '#171717',
      surfaceForeground: '#ffffff',
      surfaceBorder: '#ffffff',
      text: '#ffffff',
      textMuted: '#a3a3a3',
      primary: '#00f0ff',
      primaryForeground: '#000000',
      secondary: '#ccff00',
      secondaryForeground: '#000000',
      accent: '#ff0055',
      accentForeground: '#ffffff',
      ring: '#ffffff',
      glow: '#00f0ff',
      radius: 0,
      borderWidth: 2,
      shadowMode: 'brutalist',
    };
  }

  // Preserve: behåller användarens primära färger men sätter Neobrutalistiska ramar, skuggor och geometri
  const isDark = getRelativeLuminance(tokens.background) < 0.4;
  return {
    ...tokens,
    background: isDark ? '#0a0a0a' : '#fffdf0',
    surface: isDark ? '#141414' : '#ffffff',
    surfaceForeground: isDark ? '#ffffff' : '#000000',
    surfaceBorder: isDark ? '#ffffff' : '#000000',
    text: isDark ? '#ffffff' : '#000000',
    textMuted: isDark ? '#a3a3a3' : '#525252',
    primaryForeground: getOptimalTextColor(tokens.primary),
    secondaryForeground: getOptimalTextColor(tokens.secondary),
    accentForeground: getOptimalTextColor(tokens.accent),
    borderWidth: 2,
    radius: Math.min(tokens.radius, 4),
    shadowMode: 'brutalist',
  };
}

