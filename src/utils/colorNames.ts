import { hexToHsl, hexToRgb, getRelativeLuminance } from './colorUtils';
import { ThemeTokens } from '../types/theme';

/**
 * Returns a human-friendly, descriptive Swedish color name for a given hex code.
 */
export function getDescriptiveColorName(hex: string): string {
  const { h, s, l } = hexToHsl(hex);

  // Very low saturation = grayscale
  if (s < 12) {
    if (l < 10) return 'Djupsvart / Obsidian';
    if (l < 25) return 'Mörk Grafit / Skiffer';
    if (l < 45) return 'Mellangrå / Rökgrå';
    if (l < 70) return 'Silvrig Askgrå';
    if (l < 90) return 'Ljus Dimgrå';
    return 'Kritvit / Snövit';
  }

  // Very dark colors
  if (l < 14) {
    if (h >= 200 && h < 260) return 'Midnattsblå';
    if (h >= 120 && h < 180) return 'Mörk Barrskogsgrön';
    if (h >= 260 && h < 320) return 'Mörk Aubergine';
    if (h >= 340 || h < 20) return 'Mörk Vinröd';
    return 'Djupt Sotig Nyans';
  }

  // Very light colors (pastels / tints)
  if (l > 88) {
    if (h >= 20 && h < 55) return 'Varm Gräddvit / Pergament';
    if (h >= 55 && h < 90) return 'Ljus Vaniljgul';
    if (h >= 90 && h < 165) return 'Ljus Mint / Pistasch';
    if (h >= 165 && h < 220) return 'Isblå / Ljus Akvamarin';
    if (h >= 220 && h < 275) return 'Ljus Lavendel';
    if (h >= 275 && h < 340) return 'Ljus Puderrosa';
    return 'Porslinsvit Tint';
  }

  // Main hue categorization
  if (h >= 345 || h < 12) {
    if (l < 35) return 'Körsbärsröd / Bordeaux';
    if (s > 75) return 'Klarröd / Karmosin';
    return 'Korallröd';
  }
  if (h >= 12 && h < 38) {
    if (l < 40) return 'Rostbrun / Terrakotta';
    if (s > 70) return 'Brinnande Orange';
    return 'Varm Bärnsten';
  }
  if (h >= 38 && h < 65) {
    if (l < 40) return 'Ockragul / Senap';
    if (s > 75) return 'Solrosgul / Citrin';
    return 'Gyllene Vete';
  }
  if (h >= 65 && h < 155) {
    if (l < 30) return 'Mörk Skogsgrön';
    if (h < 100) return 'Olivgrön / Lime';
    if (s > 70) return 'Smaragdgrön / Neongrön';
    return 'Salviagrön / Jade';
  }
  if (h >= 155 && h < 195) {
    if (l < 35) return 'Mörk Petrol / Teal';
    if (s > 75) return 'Klar Turkos / Cyan';
    return 'Havsgrön Turkos';
  }
  if (h >= 195 && h < 245) {
    if (l < 35) return 'Marinblå / Djup Safir';
    if (s > 75) return 'Elektrisk Koboltblå';
    return 'Himmelsblå / Azur';
  }
  if (h >= 245 && h < 285) {
    if (l < 35) return 'Mörklila / Indigo';
    if (s > 75) return 'Vibrant Viol / Purpur';
    return 'Mjuk Syrenlila';
  }
  if (h >= 285 && h < 345) {
    if (l < 35) return 'Plommonlila';
    if (s > 75) return 'Magenta / Neonrosa';
    return 'Mjuk Rosé';
  }

  return 'Harmonisk Accent';
}

/**
 * Analyzes the emotional tone and personality of a palette
 */
export function analyzePaletteMood(tokens: ThemeTokens): {
  toneName: string;
  emotionalDescription: string;
  suggestedAppType: string;
  imagePrompt: string;
} {
  const p = hexToHsl(tokens.primary);
  const s = hexToHsl(tokens.secondary);
  const bg = hexToHsl(tokens.background);
  const isDark = bg.l < 40;

  const primaryName = getDescriptiveColorName(tokens.primary);
  const secondaryName = getDescriptiveColorName(tokens.secondary);
  const bgName = getDescriptiveColorName(tokens.background);
  const accentName = getDescriptiveColorName(tokens.accent);

  // Determine emotional category
  if (p.s > 75 && isDark) {
    return {
      toneName: 'Djärv, Högteknologisk & Elektrisk',
      emotionalDescription: `En pulserande och självsäker färgpalett med ${primaryName} och ${secondaryName} mot ${bgName}. Ger en futuristisk, energifylld och innovativ stämning.`,
      suggestedAppType: 'Krypto-plattformar, gaming-communities, AI-verktyg och nyskapande tech-startups.',
      imagePrompt: `A futuristic, high-contrast user interface and abstract digital art featuring a bold color palette of ${primaryName} (${tokens.primary}), ${secondaryName} (${tokens.secondary}) and neon ${accentName} (${tokens.accent}) glowing against a deep ${bgName} (${tokens.background}) backdrop. Clean composition, modern glowing accents, 8k resolution, sleek technology aesthetic.`
    };
  }

  if ((p.h >= 65 && p.h <= 165) || (s.h >= 65 && s.h <= 165)) {
    return {
      toneName: 'Lugnande, Naturlig & Organisk',
      emotionalDescription: `En harmonisk och avkopplande palett med ${primaryName} och ${secondaryName} i symbios med ${bgName}. Inger trygghet, balans och ekologisk omsorg.`,
      suggestedAppType: 'Natur- och hälsoappar, meditationsverktyg, hållbar e-handel och trädgårdsguider.',
      imagePrompt: `A tranquil and serene composition with an organic color palette of earthy ${primaryName} (${tokens.primary}), botanical ${secondaryName} (${tokens.secondary}) and calming ${bgName} (${tokens.background}). Soft natural ambient lighting, minimalist Scandinavian atmosphere, sustainable wellness design, highly detailed.`
    };
  }

  if (p.h >= 195 && p.h <= 245 && !isDark) {
    return {
      toneName: 'Professionell, Pålitlig & Förtroendeingivande',
      emotionalDescription: `En balanserad och vederhäftig affärspalett dominerad av ${primaryName} med accenter i ${secondaryName} och en krispig bas av ${bgName}. Skapar stabilitet och auktoritet.`,
      suggestedAppType: 'FinTech, SaaS-dashboard, juridiska plattformar och företagsledningssystem.',
      imagePrompt: `A clean, modern corporate and architectural workspace with a reliable color scheme of corporate ${primaryName} (${tokens.primary}), ${secondaryName} (${tokens.secondary}) and crisp ${bgName} (${tokens.background}). Professional precision, minimal geometry, high-end editorial lighting, crisp contrast.`
    };
  }

  if ((p.h >= 10 && p.h <= 45 && p.s > 40) || (s.h >= 10 && s.h <= 45)) {
    return {
      toneName: 'Nostalgisk, Retro & Varm',
      emotionalDescription: `En inbjudande retroinspirerad palett med rika toner av ${primaryName}, ${secondaryName} och ${accentName}. Väcker nostalgi, hantverk och analog charm.`,
      suggestedAppType: 'Kreativa studior, kaffebarer, podcast-appar och retrodesignade e-butiker.',
      imagePrompt: `A warm nostalgic 1970s and 1980s retro-modern design aesthetic utilizing ${primaryName} (${tokens.primary}), warm ${secondaryName} (${tokens.secondary}) and textured ${bgName} (${tokens.background}). Vintage analog feel, tactile grain, comforting daylight, stylish mid-century palette.`
    };
  }

  if (p.s < 30 || (bg.s < 15 && p.l < 30)) {
    return {
      toneName: 'Minimalistisk, Sofistikerad & Monokrom',
      emotionalDescription: `En renodlad och arkitektonisk palett med ${bgName}, ${primaryName} och subtila skiftningar. Fokuserar användarens uppmärksamhet på innehållet utan distraktioner.`,
      suggestedAppType: 'Arkitekturportföljer, lyxvarumärken, redaktionella magasin och fokuserade skrivappar.',
      imagePrompt: `A strictly minimalist, architectural layout and fine art photography using a refined palette of ${primaryName} (${tokens.primary}), monochrome ${bgName} (${tokens.background}) and sharp ${accentName} (${tokens.accent}). Crisp typographic discipline, elegant gallery atmosphere, museum lighting.`
    };
  }

  // Soft / Cozy
  return {
    toneName: 'Mjuk, Vänlig & Behaglig',
    emotionalDescription: `En mjuk och tillgänglig färgpalett med ${primaryName} och ${secondaryName} som vilar på ${bgName}. Skapar ett varmt välkomnande med behaglig visuell komfort.`,
    suggestedAppType: 'Sociala samarbetsappar, personlig produktivitet och utbildningsplattformar.',
    imagePrompt: `A gentle and friendly digital illustration featuring soft ${primaryName} (${tokens.primary}), subtle ${secondaryName} (${tokens.secondary}) and cozy ${bgName} (${tokens.background}). Warm diffused lighting, modern rounded aesthetics, welcoming UI atmosphere.`
  };
}

/**
 * Returns descriptive key-value details for all tokens in a theme
 */
export function getPaletteDescriptiveDetails(tokens: ThemeTokens) {
  return [
    { role: 'Primär (Primary)', hex: tokens.primary, name: getDescriptiveColorName(tokens.primary), purpose: 'Huvudknappar, aktiva länkar och primära åtgärder' },
    { role: 'Primär Text/Ikon (Foreground)', hex: tokens.primaryForeground, name: getDescriptiveColorName(tokens.primaryForeground), purpose: 'Text och ikoner inuti primärknappar' },
    { role: 'Sekundär (Secondary)', hex: tokens.secondary, name: getDescriptiveColorName(tokens.secondary), purpose: 'Sekundära knappar och stödjande accenter' },
    { role: 'Sekundär Text (Foreground)', hex: tokens.secondaryForeground, name: getDescriptiveColorName(tokens.secondaryForeground), purpose: 'Text på sekundära knappar' },
    { role: 'Accent / Highlight', hex: tokens.accent, name: getDescriptiveColorName(tokens.accent), purpose: 'Badges, kampanjmarkörer och mikrogadgets' },
    { role: 'Bakgrund (Background)', hex: tokens.background, name: getDescriptiveColorName(tokens.background), purpose: 'Hela sidans duk/canvas' },
    { role: 'Kort & Yta (Surface)', hex: tokens.surface, name: getDescriptiveColorName(tokens.surface), purpose: 'Kort, paneler och navigationsmenyer' },
    { role: 'Kantlinje (Border)', hex: tokens.surfaceBorder, name: getDescriptiveColorName(tokens.surfaceBorder), purpose: 'Ramar och avgränsare' },
    { role: 'Huvudtext', hex: tokens.text, name: getDescriptiveColorName(tokens.text), purpose: 'Rubriker och brödtext med hög kontrast' },
    { role: 'Dämpad Text (Muted)', hex: tokens.textMuted, name: getDescriptiveColorName(tokens.textMuted), purpose: 'Sekundära etiketter, datum och metadata' },
  ];
}
