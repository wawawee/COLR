import { ThemeTokens, ThemeStyle } from '../types/theme';
import { rgbToHex, rgbToHsl, hslToHex, getOptimalTextColor, getRelativeLuminance } from './colorUtils';
import { getDescriptiveColorName, analyzePaletteMood } from './colorNames';

export interface ExtractedColor {
  hex: string;
  name: string;
  count: number;
  percentage: number;
}

export interface ExtractedPaletteResult {
  tokens: ThemeTokens;
  dominantColors: ExtractedColor[];
  name: string;
  mood: string;
  styleCategory: ThemeStyle;
  source: 'canvas_kmeans' | 'gemini_vision';
}

/**
 * Extracts dominant colors from an Image element using HTML5 Canvas.
 * Implements fast median-cut / quantization for instant client-side performance.
 */
export async function extractPaletteFromImageFile(file: File): Promise<ExtractedPaletteResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const result = extractFromImageElement(img, file.name);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Kunde inte ladda bilden'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Kunde inte läsa filen'));
    reader.readAsDataURL(file);
  });
}

export function extractFromImageElement(img: HTMLImageElement, fileName?: string): ExtractedPaletteResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Kunde inte initiera canvas context');

  // Downsample to max 120x120 for instant performance
  const maxDim = 120;
  const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1);
  canvas.width = Math.max(1, Math.floor(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.floor(img.naturalHeight * scale));

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Collect color frequencies with quantization (step of 16 in RGB)
  const colorBuckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const totalPixels = canvas.width * canvas.height;

  for (let i = 0; i < imgData.length; i += 4) {
    const a = imgData[i + 3];
    if (a < 128) continue; // ignore transparent pixels

    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];

    // Quantize to bucket of 16
    const qr = Math.round(r / 16) * 16;
    const qg = Math.round(g / 16) * 16;
    const qb = Math.round(b / 16) * 16;
    const key = `${qr},${qg},${qb}`;

    const existing = colorBuckets.get(key);
    if (existing) {
      existing.count += 1;
      existing.r = Math.round((existing.r + r) / 2);
      existing.g = Math.round((existing.g + g) / 2);
      existing.b = Math.round((existing.b + b) / 2);
    } else {
      colorBuckets.set(key, { r, g, b, count: 1 });
    }
  }

  // Sort by frequency
  const sorted = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);
  if (sorted.length === 0) throw new Error('Inga färger kunde extraheras från bilden');

  // Convert top buckets to Hex
  const topColors: ExtractedColor[] = sorted.slice(0, 8).map(c => {
    const hex = rgbToHex(c.r, c.g, c.b);
    return {
      hex,
      name: getDescriptiveColorName(hex),
      count: c.count,
      percentage: Math.round((c.count / totalPixels) * 100),
    };
  });

  // Pick vibrant color for primary
  let primaryCandidate = topColors[0].hex;
  let maxVibrancy = -1;

  for (const c of topColors) {
    const hsl = rgbToHsl(
      parseInt(c.hex.slice(1, 3), 16),
      parseInt(c.hex.slice(3, 5), 16),
      parseInt(c.hex.slice(5, 7), 16)
    );
    // Vibrancy score combines saturation and avoids extreme darkness/whiteness
    const vibrancy = hsl.s * (1 - Math.abs(hsl.l - 50) / 50);
    if (vibrancy > maxVibrancy) {
      maxVibrancy = vibrancy;
      primaryCandidate = c.hex;
    }
  }

  // Pick secondary color distinct from primary
  const primaryHsl = rgbToHsl(
    parseInt(primaryCandidate.slice(1, 3), 16),
    parseInt(primaryCandidate.slice(3, 5), 16),
    parseInt(primaryCandidate.slice(5, 7), 16)
  );

  let secondaryCandidate = topColors[1]?.hex || primaryCandidate;
  let maxDist = -1;

  for (const c of topColors) {
    if (c.hex === primaryCandidate) continue;
    const hsl = rgbToHsl(
      parseInt(c.hex.slice(1, 3), 16),
      parseInt(c.hex.slice(3, 5), 16),
      parseInt(c.hex.slice(5, 7), 16)
    );
    const hueDist = Math.abs(hsl.h - primaryHsl.h);
    if (hueDist > maxDist) {
      maxDist = hueDist;
      secondaryCandidate = c.hex;
    }
  }

  // Determine if background should be dark or light based on overall image luminance
  let avgLuminance = 0;
  for (const c of topColors) {
    avgLuminance += getRelativeLuminance(c.hex) * (c.count / totalPixels);
  }

  const isDark = avgLuminance < 0.4;
  const background = isDark ? '#0b0d14' : '#faf9f6';
  const surface = isDark ? '#141724' : '#ffffff';
  const surfaceBorder = isDark ? '#252a3d' : '#e6e2d8';
  const text = isDark ? '#f8fafc' : '#141416';
  const textMuted = isDark ? '#94a3b8' : '#686f7c';

  const accentCandidate = topColors[2]?.hex || secondaryCandidate;

  const tokens: ThemeTokens = {
    primary: primaryCandidate,
    primaryForeground: getOptimalTextColor(primaryCandidate),
    secondary: secondaryCandidate,
    secondaryForeground: getOptimalTextColor(secondaryCandidate),
    accent: accentCandidate,
    accentForeground: getOptimalTextColor(accentCandidate),
    background,
    surface,
    surfaceForeground: text,
    surfaceBorder,
    text,
    textMuted,
    ring: primaryCandidate,
    glow: primaryCandidate,
    radius: 10,
    borderWidth: 1,
    shadowMode: isDark ? 'glow' : 'subtle',
  };

  const moodAnalysis = analyzePaletteMood(tokens);
  const cleanTitle = fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Bildpalett';

  return {
    tokens,
    dominantColors: topColors,
    name: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
    mood: moodAnalysis.emotionalDescription,
    styleCategory: isDark ? 'djärv' : 'mjuk',
    source: 'canvas_kmeans',
  };
}
