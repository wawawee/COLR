import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Copy, 
  Check, 
  Wand2,
  RefreshCw,
  SunMedium,
  Layers,
  Shapes,
  Palette,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon,
  RotateCw,
  Shuffle,
  Boxes,
  PlusCircle,
  BookmarkPlus,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Hash,
  SlidersVertical,
  HelpCircle,
  X
} from 'lucide-react';
import { ThemeTokens, ThemeStyle } from '../types/theme';
import { 
  hexToHsl, 
  hslToHex, 
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  cmykToRgb,
  hexToCmyk,
  cmykToHex,
  isValidHex, 
  getOptimalTextColor, 
  getContrastRatio,
  adjustColor,
  generateColorShades,
  analyzeThemeExtremes,
  softenExtremesWithContrast,
  NeobrutalistPresetKind,
  METALLIC_CMYK_SWATCHES,
  MetallicColor
} from '../utils/colorUtils';
import { getDescriptiveColorName } from '../utils/colorNames';

export type TokenKey = 
  | 'primary'
  | 'primaryForeground'
  | 'secondary'
  | 'secondaryForeground'
  | 'accent'
  | 'accentForeground'
  | 'background'
  | 'surface'
  | 'surfaceForeground'
  | 'surfaceBorder'
  | 'text'
  | 'textMuted'
  | 'ring'
  | 'glow';

export interface TokenMeta {
  label: string;
  desc: string;
  category: 'Varumärke' | 'Ytor & Bas' | 'Typografi' | 'Effekter';
  icon?: string;
}

export const TOKEN_METADATA: Record<TokenKey, TokenMeta> = {
  primary: { 
    label: 'Primärfärg', 
    desc: 'Huvudknappar, aktiva länkar & call-to-actions', 
    category: 'Varumärke' 
  },
  primaryForeground: { 
    label: 'Text på Primär', 
    desc: 'Text & ikoner inuti primärknappar', 
    category: 'Varumärke' 
  },
  secondary: { 
    label: 'Sekundärfärg', 
    desc: 'Sekundära knappar, tags & badges', 
    category: 'Varumärke' 
  },
  secondaryForeground: { 
    label: 'Text på Sekundär', 
    desc: 'Text & ikoner inuti sekundärknappar', 
    category: 'Varumärke' 
  },
  accent: { 
    label: 'Accent / Highlight', 
    desc: 'Varningar, glöd & blickfång', 
    category: 'Varumärke' 
  },
  accentForeground: { 
    label: 'Text på Accent', 
    desc: 'Text & ikoner inuti accentknappar & badges', 
    category: 'Varumärke' 
  },
  background: { 
    label: 'Bakgrund (Canvas)', 
    desc: 'Applikationens grundläggande bakgrundsfärg', 
    category: 'Ytor & Bas' 
  },
  surface: { 
    label: 'Kort & Paneler', 
    desc: 'Ytor för cards, modaler & nav-fält', 
    category: 'Ytor & Bas' 
  },
  surfaceForeground: { 
    label: 'Text på Ytor', 
    desc: 'Standardtext inuti paneler och kort', 
    category: 'Ytor & Bas' 
  },
  surfaceBorder: { 
    label: 'Ramar & Linjer', 
    desc: 'Borders och diskreta avgränsare', 
    category: 'Ytor & Bas' 
  },
  text: { 
    label: 'Huvudtext', 
    desc: 'Rubriker och huvudsaklig brödtext', 
    category: 'Typografi' 
  },
  textMuted: { 
    label: 'Dämpad Text', 
    desc: 'Sekundära etiketter, datum och metadata', 
    category: 'Typografi' 
  },
  ring: { 
    label: 'Fokusring (Ring)', 
    desc: 'Tangentbordsfokus & aktiva markeringar', 
    category: 'Effekter' 
  },
  glow: { 
    label: 'Glöd & Ambient', 
    desc: 'Ljushöjdpunkter och neon-effekter', 
    category: 'Effekter' 
  },
};

interface ColorTunerProps {
  tokens: ThemeTokens;
  onChangeTokens: (tokens: ThemeTokens) => void;
  presetMood: string;
  onChangeMood: (mood: string) => void;
  onAutoContrast: () => void;
  onSnapToSweetSpot?: () => void;
  softenActive?: boolean;
  softenAmount?: number;
  onToggleSoftenExtremes?: () => void;
  onSetSoftenAmount?: (amount: number) => void;
  onCycleColors?: () => void;
  onShuffleColors?: () => void;
  onNeobrutalize?: (kind?: NeobrutalistPresetKind) => void;
  onSaveCurrentTheme?: (name: string, style: ThemeStyle, mood: string, customTokens?: ThemeTokens) => void;
  applyThemeToApp?: boolean;
}

export const ColorTuner: React.FC<ColorTunerProps> = ({
  tokens,
  onChangeTokens,
  presetMood,
  onChangeMood,
  onAutoContrast,
  onSnapToSweetSpot,
  softenActive = false,
  softenAmount = 0.55,
  onToggleSoftenExtremes,
  onSetSoftenAmount,
  onCycleColors,
  onShuffleColors,
  onNeobrutalize,
  onSaveCurrentTheme,
  applyThemeToApp = true
}) => {
  // Selected active token being tuned by the granular sliders
  const [activeToken, setActiveToken] = useState<TokenKey>('primary');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Direct hex inputs for top quick cards
  const [primaryInput, setPrimaryInput] = useState(tokens.primary);
  const [secondaryInput, setSecondaryInput] = useState(tokens.secondary);

  // Active token hex string input (for freeform typing)
  const [activeHexInput, setActiveHexInput] = useState(tokens[activeToken]?.replace('#', '') || '');

  // Slider control mode: 'rgb' vs 'hsl' vs 'cmyk'
  const [sliderMode, setSliderMode] = useState<'rgb' | 'hsl' | 'cmyk'>('rgb');

  // Filter category for the "Alla färg-tokens" list
  const [categoryFilter, setCategoryFilter] = useState<'Alla' | 'Varumärke' | 'Ytor & Bas' | 'Typografi' | 'Effekter'>('Alla');

  // Filter category for Metallic & CMYK swatches
  const [metallicFilter, setMetallicFilter] = useState<'Alla' | 'Guld' | 'Silver & Metall' | 'Brons & Koppar' | 'CMYK Primärer'>('Alla');

  // Accordion open state for Metallic & CMYK Palette
  const [metallicExpanded, setMetallicExpanded] = useState<boolean>(true);

  // Auto-optimize foreground text colors when background/primary/secondary/accent changes
  const [autoSyncForegrounds, setAutoSyncForegrounds] = useState<boolean>(true);

  // "Skapa Eget Tema" Modal / Expansion State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newThemeName, setNewThemeName] = useState<string>('Mitt Anpassade Tema');
  const [newThemeMood, setNewThemeMood] = useState<string>('Djärvt & personligt');
  const [newThemeStyle, setNewThemeStyle] = useState<ThemeStyle>('djärv');
  const [createSavedFeedback, setCreateSavedFeedback] = useState<boolean>(false);

  // Accordion open states
  const [allTokensExpanded, setAllTokensExpanded] = useState<boolean>(true);
  const [harmoniesExpanded, setHarmoniesExpanded] = useState<boolean>(false);

  // Sync inputs with tokens
  useEffect(() => {
    setPrimaryInput(tokens.primary);
  }, [tokens.primary]);

  useEffect(() => {
    setSecondaryInput(tokens.secondary);
  }, [tokens.secondary]);

  useEffect(() => {
    setActiveHexInput(tokens[activeToken]?.replace('#', '') || '');
  }, [tokens[activeToken], activeToken]);

  // Derived color objects for active token
  const currentRgb = useMemo(() => hexToRgb(tokens[activeToken] || '#000000'), [tokens, activeToken]);
  const currentHsl = useMemo(() => hexToHsl(tokens[activeToken] || '#000000'), [tokens, activeToken]);
  const currentCmyk = useMemo(() => hexToCmyk(tokens[activeToken] || '#000000'), [tokens, activeToken]);

  // Shades for active token
  const activeShades = useMemo(() => {
    return generateColorShades(tokens[activeToken] || '#000000');
  }, [tokens, activeToken]);

  // Compute live contrast and extreme brightness statistics
  const extremeStats = useMemo(() => {
    return analyzeThemeExtremes(tokens);
  }, [tokens]);

  // Core handler: updates a single token by hex value
  const handleHexChange = (key: TokenKey, hex: string) => {
    if (!isValidHex(hex)) return;
    
    const formattedHex = hex.startsWith('#') ? hex : '#' + hex;
    const updated: ThemeTokens = { ...tokens, [key]: formattedHex };
    
    // Automatically keep foreground legible if autoSync is active
    if (autoSyncForegrounds) {
      if (key === 'primary') {
        updated.primaryForeground = getOptimalTextColor(formattedHex);
        updated.ring = formattedHex;
      } else if (key === 'secondary') {
        updated.secondaryForeground = getOptimalTextColor(formattedHex);
      } else if (key === 'accent') {
        updated.accentForeground = getOptimalTextColor(formattedHex);
        updated.glow = formattedHex;
      } else if (key === 'surface') {
        updated.surfaceForeground = getOptimalTextColor(formattedHex);
      } else if (key === 'background') {
        updated.text = getOptimalTextColor(formattedHex);
        updated.textMuted = formattedHex.toLowerCase() === '#ffffff' ? '#64748b' : '#94a3b8';
      }
    }

    onChangeTokens(updated);
  };

  // Handle free-form typing in the active hex input box
  const handleActiveHexInputChange = (val: string) => {
    const clean = val.replace(/^#/, '');
    setActiveHexInput(clean);

    const formatted = '#' + clean.trim();
    if (isValidHex(formatted)) {
      handleHexChange(activeToken, formatted);
    }
  };

  const handleActiveHexBlur = () => {
    const formatted = '#' + activeHexInput.trim();
    if (!isValidHex(formatted)) {
      setActiveHexInput(tokens[activeToken]?.replace('#', '') || '');
    }
  };

  // Direct quick-card hex inputs (Primär / Sekundär)
  const handleDirectHexInput = (key: 'primary' | 'secondary', val: string) => {
    if (key === 'primary') setPrimaryInput(val);
    else setSecondaryInput(val);

    const trimmed = val.trim();
    const formatted = trimmed.startsWith('#') ? trimmed : '#' + trimmed;
    if (isValidHex(formatted)) {
      handleHexChange(key, formatted);
    }
  };

  // RGB Slider Handler: changes R, G, or B (0-255)
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(value)));
    const newRgb = { ...currentRgb, [channel]: clamped };
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    handleHexChange(activeToken, newHex);
  };

  // HSL Slider Handler: changes H (0-360), S (0-100), or L (0-100)
  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const maxVal = channel === 'h' ? 360 : 100;
    const clamped = Math.max(0, Math.min(maxVal, Math.round(value)));
    const newHsl = { ...currentHsl, [channel]: clamped };
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    handleHexChange(activeToken, newHex);
  };

  // CMYK Slider Handler: changes C (0-100), M (0-100), Y (0-100), or K (0-100)
  const handleCmykChange = (channel: 'c' | 'm' | 'y' | 'k', value: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    const newCmyk = { ...currentCmyk, [channel]: clamped };
    const newHex = cmykToHex(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    handleHexChange(activeToken, newHex);
  };

  const copyToClipboard = (tokenKey: TokenKey, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenKey);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  // Color harmony generator from active or primary color
  const generateHarmonyTheme = (harmonyType: 'complementary' | 'triadic' | 'analogous' | 'monochrome' | 'neobrutalist') => {
    const baseHex = tokens[activeToken] || tokens.primary;
    const baseHsl = hexToHsl(baseHex);
    let updated: ThemeTokens = { ...tokens };

    if (harmonyType === 'complementary') {
      const compHue = (baseHsl.h + 180) % 360;
      const compHex = hslToHex(compHue, baseHsl.s, baseHsl.l);
      const accentHex = hslToHex((baseHsl.h + 90) % 360, Math.min(100, baseHsl.s + 15), baseHsl.l);
      updated.primary = baseHex;
      updated.secondary = compHex;
      updated.accent = accentHex;
      updated.primaryForeground = getOptimalTextColor(baseHex);
      updated.secondaryForeground = getOptimalTextColor(compHex);
      updated.accentForeground = getOptimalTextColor(accentHex);
      updated.ring = baseHex;
    } else if (harmonyType === 'triadic') {
      const hue1 = (baseHsl.h + 120) % 360;
      const hue2 = (baseHsl.h + 240) % 360;
      const secHex = hslToHex(hue1, baseHsl.s, baseHsl.l);
      const accHex = hslToHex(hue2, baseHsl.s, baseHsl.l);
      updated.primary = baseHex;
      updated.secondary = secHex;
      updated.accent = accHex;
      updated.primaryForeground = getOptimalTextColor(baseHex);
      updated.secondaryForeground = getOptimalTextColor(secHex);
      updated.accentForeground = getOptimalTextColor(accHex);
      updated.ring = baseHex;
    } else if (harmonyType === 'analogous') {
      const hue1 = (baseHsl.h + 35) % 360;
      const hue2 = (baseHsl.h + 325) % 360;
      const secHex = hslToHex(hue1, baseHsl.s, baseHsl.l);
      const accHex = hslToHex(hue2, baseHsl.s, baseHsl.l);
      updated.primary = baseHex;
      updated.secondary = secHex;
      updated.accent = accHex;
      updated.primaryForeground = getOptimalTextColor(baseHex);
      updated.secondaryForeground = getOptimalTextColor(secHex);
      updated.accentForeground = getOptimalTextColor(accHex);
      updated.ring = baseHex;
    } else if (harmonyType === 'monochrome') {
      const secHex = hslToHex(baseHsl.h, Math.max(15, baseHsl.s - 25), Math.min(90, Math.max(20, baseHsl.l + 25)));
      const accHex = hslToHex(baseHsl.h, Math.min(100, baseHsl.s + 15), Math.max(15, baseHsl.l - 20));
      updated.primary = baseHex;
      updated.secondary = secHex;
      updated.accent = accHex;
      updated.primaryForeground = getOptimalTextColor(baseHex);
      updated.secondaryForeground = getOptimalTextColor(secHex);
      updated.accentForeground = getOptimalTextColor(accHex);
      updated.ring = baseHex;
    } else if (harmonyType === 'neobrutalist') {
      if (onNeobrutalize) {
        onNeobrutalize('preserve');
        return;
      }
      updated.shadowMode = 'brutalist';
      updated.radius = 4;
      updated.borderWidth = 2;
      updated.background = '#fffdfa';
      updated.surface = '#ffffff';
      updated.surfaceBorder = '#000000';
      updated.text = '#000000';
      updated.textMuted = '#444444';
      updated.primary = baseHex;
      updated.primaryForeground = getOptimalTextColor(baseHex);
      updated.secondary = '#111111';
      updated.secondaryForeground = '#ffffff';
      updated.accent = '#00f0ff';
      updated.accentForeground = '#000000';
      updated.ring = '#000000';
    }

    onChangeTokens(updated);
  };

  // Starter themes for "Skapa Eget Tema"
  const startNewThemeFromPreset = (starterType: 'neutral-light' | 'neutral-dark' | 'neobrutalist-canary' | 'clone') => {
    let freshTokens: ThemeTokens;
    let mood = '';
    let style: ThemeStyle = 'professionell';

    if (starterType === 'neutral-light') {
      freshTokens = {
        primary: '#2563eb',
        primaryForeground: '#ffffff',
        secondary: '#64748b',
        secondaryForeground: '#ffffff',
        accent: '#f59e0b',
        accentForeground: '#000000',
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceForeground: '#0f172a',
        surfaceBorder: '#e2e8f0',
        text: '#0f172a',
        textMuted: '#64748b',
        ring: '#2563eb',
        glow: '#3b82f6',
        radius: 10,
        borderWidth: 1,
        shadowMode: 'subtle',
      };
      mood = 'Minimalistisk och krispig ljus canvas med distinkt blå accent';
      style = 'minimalistisk';
    } else if (starterType === 'neutral-dark') {
      freshTokens = {
        primary: '#6366f1',
        primaryForeground: '#ffffff',
        secondary: '#475569',
        secondaryForeground: '#f8fafc',
        accent: '#ec4899',
        accentForeground: '#ffffff',
        background: '#09090b',
        surface: '#18181b',
        surfaceForeground: '#f4f4f5',
        surfaceBorder: '#27272a',
        text: '#f4f4f5',
        textMuted: '#a1a1aa',
        ring: '#6366f1',
        glow: '#818cf8',
        radius: 12,
        borderWidth: 1,
        shadowMode: 'elevated',
      };
      mood = 'Modern djup grafitmörk bas med levande neon-accenter';
      style = 'djärv';
    } else if (starterType === 'neobrutalist-canary') {
      freshTokens = {
        primary: '#facc15',
        primaryForeground: '#000000',
        secondary: '#000000',
        secondaryForeground: '#ffffff',
        accent: '#00f0ff',
        accentForeground: '#000000',
        background: '#fffdfa',
        surface: '#ffffff',
        surfaceForeground: '#000000',
        surfaceBorder: '#000000',
        text: '#000000',
        textMuted: '#404040',
        ring: '#000000',
        glow: '#facc15',
        radius: 4,
        borderWidth: 2,
        shadowMode: 'brutalist',
      };
      mood = 'Neobrutalism med 3 färger: Kanariegul, djup svärta och varm elfenbensvit';
      style = 'djärv';
    } else {
      // Clone current
      freshTokens = { ...tokens };
      mood = presetMood || 'Mitt skräddarsydda tema';
      style = 'djärv';
    }

    onChangeTokens(freshTokens);
    onChangeMood(mood);
    setNewThemeMood(mood);
    setNewThemeStyle(style);
    setActiveToken('primary');
  };

  // Save the custom theme to persistent storage
  const handleSaveThemeAction = () => {
    if (onSaveCurrentTheme) {
      onSaveCurrentTheme(
        newThemeName.trim() || 'Mitt Eget Tema',
        newThemeStyle,
        newThemeMood.trim() || presetMood,
        tokens
      );
      setCreateSavedFeedback(true);
      setTimeout(() => {
        setCreateSavedFeedback(false);
        setShowCreateModal(false);
      }, 1500);
    }
  };

  // Filtered tokens list
  const filteredTokenKeys = useMemo(() => {
    const keys = Object.keys(TOKEN_METADATA) as TokenKey[];
    if (categoryFilter === 'Alla') return keys;
    return keys.filter(k => TOKEN_METADATA[k].category === categoryFilter);
  }, [categoryFilter]);

  // Contrasts
  const textBgContrast = getContrastRatio(tokens.text, tokens.background);
  const primaryContrast = getContrastRatio(tokens.primaryForeground, tokens.primary);
  const activeColorName = getDescriptiveColorName(tokens[activeToken]);

  return (
    <aside 
      className="w-full lg:w-88 xl:w-96 shrink-0 border-r flex flex-col h-full overflow-y-auto p-4 space-y-4 transition-colors duration-200 select-none"
      style={applyThemeToApp ? {
        backgroundColor: tokens.surface,
        borderColor: tokens.surfaceBorder,
        color: tokens.text,
      } : undefined}
    >
      {/* 1. Header: Skapa Eget Tema Banner */}
      <div 
        className="p-3.5 rounded-xl border space-y-2.5 transition-all shadow-xs"
        style={applyThemeToApp ? {
          backgroundColor: tokens.background,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${Math.min(tokens.radius + 2, 14)}px`
        } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs"
              style={{
                backgroundColor: tokens.primary,
                color: tokens.primaryForeground,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
            >
              🎨
            </div>
            <div>
              <h2 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                <span>Skapa Eget Tema</span>
                <span 
                  className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase"
                  style={{
                    backgroundColor: `${tokens.primary}25`,
                    color: tokens.primary,
                  }}
                >
                  Reglar + RGB/HEX
                </span>
              </h2>
              <p className="text-[10px] leading-tight" style={{ color: tokens.textMuted }}>
                Styr alla färger med sliders, RGB och HEX
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(!showCreateModal)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
            style={applyThemeToApp ? {
              backgroundColor: showCreateModal ? tokens.primary : tokens.surface,
              color: showCreateModal ? tokens.primaryForeground : tokens.text,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title="Öppna verktyg för att skapa nytt tema från grunden"
          >
            {showCreateModal ? <X className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>{showCreateModal ? 'Stäng' : 'Nytt Tema'}</span>
          </button>
        </div>

        {/* Expandable "Skapa Tema från Grunden" Form */}
        {showCreateModal && (
          <div 
            className="pt-2 border-t space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ borderColor: tokens.surfaceBorder }}
          >
            <div className="text-[11px] font-semibold flex items-center justify-between">
              <span>1. Välj startgrund (Startpunkt):</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => startNewThemeFromPreset('neutral-light')}
                className="p-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: tokens.surface,
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>Neutral Ljus</span>
                </div>
                <div className="text-[9.5px] mt-0.5" style={{ color: tokens.textMuted }}>
                  Vit canvas & blå accent
                </div>
              </button>

              <button
                onClick={() => startNewThemeFromPreset('neutral-dark')}
                className="p-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: tokens.surface,
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span>Modern Mörk</span>
                </div>
                <div className="text-[9.5px] mt-0.5" style={{ color: tokens.textMuted }}>
                  Grafit & indigo neon
                </div>
              </button>

              <button
                onClick={() => startNewThemeFromPreset('neobrutalist-canary')}
                className="p-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: tokens.surface,
                  borderColor: '#000000',
                  borderRadius: '4px'
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Boxes className="w-3 h-3 text-amber-500" />
                  <span>Neobrutalism (3)</span>
                </div>
                <div className="text-[9.5px] mt-0.5" style={{ color: tokens.textMuted }}>
                  Gul, elfenben & svart
                </div>
              </button>

              <button
                onClick={() => startNewThemeFromPreset('clone')}
                className="p-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: tokens.surface,
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Copy className="w-3 h-3 text-emerald-500" />
                  <span>Kopiera Palett</span>
                </div>
                <div className="text-[9.5px] mt-0.5" style={{ color: tokens.textMuted }}>
                  Utgå från nuvarande
                </div>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10.5px] font-semibold block" style={{ color: tokens.textMuted }}>
                2. Temanamn & Stämning:
              </label>
              <input
                type="text"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="T.ex. Nordisk Midnattssol"
                className="w-full text-xs rounded-lg px-2.5 py-1.5 font-semibold border outline-none"
                style={{
                  backgroundColor: tokens.surface,
                  borderColor: tokens.surfaceBorder,
                  color: tokens.text,
                  borderRadius: `${Math.min(tokens.radius, 6)}px`
                }}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSaveThemeAction}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                style={{
                  backgroundColor: tokens.primary,
                  color: tokens.primaryForeground,
                  borderColor: tokens.primary,
                  borderRadius: `${Math.min(tokens.radius, 6)}px`
                }}
              >
                {createSavedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Sparat som Tema!</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Spara till Mina Teman</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Snabb Direkt-Hex för Primär & Sekundär */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div 
            className="text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
          >
            <span>Direkt Hex: Primär & Sekundär</span>
          </div>
          <span className="text-[10px] font-medium opacity-60">Skriv in #hex fritt</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Primärfärg Card med direkt Hex-input */}
          <div
            onClick={() => setActiveToken('primary')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeToken === 'primary' ? 'ring-2' : 'hover:opacity-95'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: activeToken === 'primary' ? `${tokens.primary}18` : tokens.background,
              borderColor: activeToken === 'primary' ? tokens.primary : tokens.surfaceBorder,
              borderRadius: `${Math.min(tokens.radius, 10)}px`,
              boxShadow: activeToken === 'primary' ? `0 0 0 1px ${tokens.ring}` : undefined,
            } : undefined}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-4 h-4 rounded-full border border-black/15 shadow-xs shrink-0" 
                  style={{ backgroundColor: tokens.primary }} 
                />
                <span className="text-xs font-bold transition-colors">
                  Primärfärg
                </span>
              </div>
              <span 
                className="text-[9px] font-bold uppercase px-1 py-0.5 rounded"
                style={{
                  backgroundColor: `${tokens.primary}25`,
                  color: tokens.primary
                }}
              >
                {activeToken === 'primary' ? 'Aktiv' : 'Välj'}
              </span>
            </div>

            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono"
              style={applyThemeToApp ? {
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${Math.min(tokens.radius, 6)}px`,
              } : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="color"
                value={isValidHex(tokens.primary) ? tokens.primary : '#3b82f6'}
                onChange={(e) => {
                  setPrimaryInput(e.target.value);
                  handleHexChange('primary', e.target.value);
                }}
                className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
                title="Välj färg från palett"
              />
              <span className="text-[11px] font-bold opacity-40 select-none">#</span>
              <input
                type="text"
                value={primaryInput.replace(/^#/, '')}
                onChange={(e) => handleDirectHexInput('primary', e.target.value)}
                onFocus={() => setActiveToken('primary')}
                placeholder="FFFFFF"
                maxLength={6}
                className="w-full bg-transparent font-mono font-bold uppercase outline-none text-[11px]"
                style={applyThemeToApp ? { color: tokens.text } : undefined}
              />
            </div>

            <div 
              className="text-[10px] font-medium truncate mt-1.5"
              style={applyThemeToApp ? { color: tokens.primary } : undefined}
            >
              {getDescriptiveColorName(tokens.primary)}
            </div>
          </div>

          {/* Sekundärfärg Card med direkt Hex-input */}
          <div
            onClick={() => setActiveToken('secondary')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeToken === 'secondary' ? 'ring-2' : 'hover:opacity-95'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: activeToken === 'secondary' ? `${tokens.secondary}18` : tokens.background,
              borderColor: activeToken === 'secondary' ? tokens.secondary : tokens.surfaceBorder,
              borderRadius: `${Math.min(tokens.radius, 10)}px`,
              boxShadow: activeToken === 'secondary' ? `0 0 0 1px ${tokens.ring}` : undefined,
            } : undefined}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-4 h-4 rounded-full border border-black/15 shadow-xs shrink-0" 
                  style={{ backgroundColor: tokens.secondary }} 
                />
                <span className="text-xs font-bold transition-colors">
                  Sekundärfärg
                </span>
              </div>
              <span 
                className="text-[9px] font-bold uppercase px-1 py-0.5 rounded"
                style={{
                  backgroundColor: `${tokens.secondary}25`,
                  color: tokens.secondary
                }}
              >
                {activeToken === 'secondary' ? 'Aktiv' : 'Välj'}
              </span>
            </div>

            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono"
              style={applyThemeToApp ? {
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${Math.min(tokens.radius, 6)}px`,
              } : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="color"
                value={isValidHex(tokens.secondary) ? tokens.secondary : '#64748b'}
                onChange={(e) => {
                  setSecondaryInput(e.target.value);
                  handleHexChange('secondary', e.target.value);
                }}
                className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
                title="Välj färg från palett"
              />
              <span className="text-[11px] font-bold opacity-40 select-none">#</span>
              <input
                type="text"
                value={secondaryInput.replace(/^#/, '')}
                onChange={(e) => handleDirectHexInput('secondary', e.target.value)}
                onFocus={() => setActiveToken('secondary')}
                placeholder="FFFFFF"
                maxLength={6}
                className="w-full bg-transparent font-mono font-bold uppercase outline-none text-[11px]"
                style={applyThemeToApp ? { color: tokens.text } : undefined}
              />
            </div>

            <div 
              className="text-[10px] font-medium truncate mt-1.5"
              style={applyThemeToApp ? { color: tokens.secondary } : undefined}
            >
              {getDescriptiveColorName(tokens.secondary)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Huvudreglage: Granulär färgkontroll med RGB / HSL Reglar + HEX */}
      <div 
        className="p-4 rounded-xl border space-y-3.5 transition-colors shadow-xs"
        style={applyThemeToApp ? {
          backgroundColor: tokens.background,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${Math.min(tokens.radius + 2, 12)}px`,
        } : undefined}
      >
        {/* Token Väljare & Info Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg border border-black/15 shadow-xs shrink-0 relative overflow-hidden"
              style={{ 
                backgroundColor: tokens[activeToken],
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
            >
              <input
                type="color"
                value={isValidHex(tokens[activeToken]) ? tokens[activeToken] : '#000000'}
                onChange={(e) => handleHexChange(activeToken, e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                title="Klicka för snabb färgväljare"
              />
            </div>
            <div className="min-w-0">
              <div 
                className="text-xs font-bold truncate transition-colors flex items-center gap-1.5"
                style={applyThemeToApp ? { color: tokens.text } : undefined}
              >
                <span>{TOKEN_METADATA[activeToken].label}</span>
                <span 
                  className="text-[8.5px] font-mono px-1 py-0.2 rounded uppercase"
                  style={{ backgroundColor: `${tokens.primary}20`, color: tokens.primary }}
                >
                  {TOKEN_METADATA[activeToken].category}
                </span>
              </div>
              <div 
                className="text-[10.5px] font-medium truncate"
                style={applyThemeToApp ? { color: tokens.primary } : undefined}
              >
                {activeColorName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => copyToClipboard(activeToken, tokens[activeToken])}
              className="p-1.5 rounded-md hover:opacity-80 transition-colors cursor-pointer shrink-0 border"
              style={applyThemeToApp ? {
                backgroundColor: tokens.surface,
                color: tokens.textMuted,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${Math.min(tokens.radius, 6)}px`,
              } : undefined}
              title="Kopiera Hex-kod"
            >
              {copiedToken === activeToken ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Direkt Hex Input + Färgväljare */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={isValidHex(tokens[activeToken]) ? tokens[activeToken] : '#000000'}
            onChange={(e) => {
              setActiveHexInput(e.target.value.replace('#', ''));
              handleHexChange(activeToken, e.target.value);
            }}
            className="w-9 h-9 rounded-lg border cursor-pointer p-0.5 shrink-0"
            style={applyThemeToApp ? {
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title="Öppna färgväljare"
          />

          <div className="flex-1 relative">
            <span 
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono select-none"
              style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
            >
              #
            </span>
            <input
              type="text"
              value={activeHexInput}
              onChange={(e) => handleActiveHexInputChange(e.target.value)}
              onBlur={handleActiveHexBlur}
              placeholder="FFFFFF"
              spellCheck={false}
              autoComplete="off"
              className="w-full text-xs font-mono pl-6 pr-2 py-1.5 rounded-lg uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors font-bold"
              style={applyThemeToApp ? {
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`,
                borderWidth: '1px'
              } : undefined}
              maxLength={7}
            />
          </div>

          <div 
            className="px-2 py-1.5 rounded-lg border text-[11px] font-mono shrink-0 select-all flex items-center gap-1.5"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${Math.min(tokens.radius, 8)}px`,
              color: tokens.textMuted
            }}
            title="Aktuella färgkoder i RGB & CMYK"
          >
            <span>rgb({currentRgb.r},{currentRgb.g},{currentRgb.b})</span>
            <span className="opacity-40">•</span>
            <span className="font-semibold" style={{ color: tokens.text }}>C{currentCmyk.c} M{currentCmyk.m} Y{currentCmyk.y} K{currentCmyk.k}</span>
          </div>
        </div>

        {/* Slider Mode Väljare: RGB Reglar vs HSL Reglar vs CMYK Reglar */}
        <div className="pt-1">
          <div 
            className="grid grid-cols-3 p-0.5 rounded-lg border text-xs font-semibold"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
          >
            <button
              onClick={() => setSliderMode('rgb')}
              className={`py-1.5 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px] ${
                sliderMode === 'rgb' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: sliderMode === 'rgb' ? tokens.primary : 'transparent',
                color: sliderMode === 'rgb' ? tokens.primaryForeground : tokens.text,
                borderRadius: `${Math.min(tokens.radius - 2, 6)}px`
              }}
            >
              <SlidersVertical className="w-3 h-3" />
              <span>RGB</span>
            </button>

            <button
              onClick={() => setSliderMode('hsl')}
              className={`py-1.5 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px] ${
                sliderMode === 'hsl' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: sliderMode === 'hsl' ? tokens.primary : 'transparent',
                color: sliderMode === 'hsl' ? tokens.primaryForeground : tokens.text,
                borderRadius: `${Math.min(tokens.radius - 2, 6)}px`
              }}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>HSL</span>
            </button>

            <button
              onClick={() => setSliderMode('cmyk')}
              className={`py-1.5 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px] ${
                sliderMode === 'cmyk' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: sliderMode === 'cmyk' ? tokens.primary : 'transparent',
                color: sliderMode === 'cmyk' ? tokens.primaryForeground : tokens.text,
                borderRadius: `${Math.min(tokens.radius - 2, 6)}px`
              }}
            >
              <Layers className="w-3 h-3" />
              <span>CMYK (Tryck)</span>
            </button>
          </div>
        </div>

        {/* RGB SLIDERS SEKTION */}
        {sliderMode === 'rgb' && (
          <div className="space-y-3 pt-1 text-xs animate-in fade-in duration-150">
            {/* RÖD (Red) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="flex items-center gap-1 font-bold text-rose-500">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  Röd (Red)
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentRgb.r}
                    onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">/255</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={currentRgb.r}
                onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(0, ${currentRgb.g}, ${currentRgb.b}), rgb(255, ${currentRgb.g}, ${currentRgb.b}))`
                }}
              />
            </div>

            {/* GRÖN (Green) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="flex items-center gap-1 font-bold text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Grön (Green)
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentRgb.g}
                    onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">/255</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={currentRgb.g}
                onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(${currentRgb.r}, 0, ${currentRgb.b}), rgb(${currentRgb.r}, 255, ${currentRgb.b}))`
                }}
              />
            </div>

            {/* BLÅ (Blue) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="flex items-center gap-1 font-bold text-blue-500">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  Blå (Blue)
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentRgb.b}
                    onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">/255</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={currentRgb.b}
                onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(${currentRgb.r}, ${currentRgb.g}, 0), rgb(${currentRgb.r}, ${currentRgb.g}, 255))`
                }}
              />
            </div>
          </div>
        )}

        {/* HSL SLIDERS SEKTION */}
        {sliderMode === 'hsl' && (
          <div className="space-y-3 pt-1 text-xs animate-in fade-in duration-150">
            {/* Nyans (Hue) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="font-bold">Nyans (Hue)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={currentHsl.h}
                    onChange={(e) => handleHslChange('h', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">°</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={currentHsl.h}
                onChange={(e) => handleHslChange('h', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                }}
              />
            </div>

            {/* Mättnad (Saturation) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="font-bold">Mättnad (Saturation)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentHsl.s}
                    onChange={(e) => handleHslChange('s', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentHsl.s}
                onChange={(e) => handleHslChange('s', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(${currentHsl.h}, 0%, ${currentHsl.l}%), hsl(${currentHsl.h}, 100%, ${currentHsl.l}%))`
                }}
              />
            </div>

            {/* Ljusstyrka (Lightness) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="font-bold">Ljusstyrka (Lightness)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentHsl.l}
                    onChange={(e) => handleHslChange('l', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentHsl.l}
                onChange={(e) => handleHslChange('l', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(${currentHsl.h}, ${currentHsl.s}%, 0%), hsl(${currentHsl.h}, ${currentHsl.s}%, 50%), hsl(${currentHsl.h}, ${currentHsl.s}%, 100%))`
                }}
              />
            </div>
          </div>
        )}

        {/* CMYK SLIDERS SEKTION (Fyrfärgstryck Process) */}
        {sliderMode === 'cmyk' && (
          <div className="space-y-3 pt-1 text-xs animate-in fade-in duration-150">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[10.5px] leading-tight text-sky-400">
              💡 <strong>CMYK-läge:</strong> Förberett för tryck och grafisk produktion. Justera Cyan, Magenta, Gul och Svart (Key) med direkt omräkning till RGB och HEX.
            </div>

            {/* CYAN (C) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="flex items-center gap-1 font-bold text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  Cyan (C)
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentCmyk.c}
                    onChange={(e) => handleCmykChange('c', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentCmyk.c}
                onChange={(e) => handleCmykChange('c', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(255, 255, 255), rgb(0, 255, 255))`
                }}
              />
            </div>

            {/* MAGENTA (M) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="flex items-center gap-1 font-bold text-pink-500">
                  <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />
                  Magenta (M)
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentCmyk.m}
                    onChange={(e) => handleCmykChange('m', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentCmyk.m}
                onChange={(e) => handleCmykChange('m', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(255, 255, 255), rgb(255, 0, 255))`
                }}
              />
            </div>

            {/* YELLOW / GUL (Y) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="flex items-center gap-1 font-bold text-yellow-400">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                  Yellow / Gul (Y)
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentCmyk.y}
                    onChange={(e) => handleCmykChange('y', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentCmyk.y}
                onChange={(e) => handleCmykChange('y', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(255, 255, 255), rgb(255, 255, 0))`
                }}
              />
            </div>

            {/* KEY / BLACK (K) Slider */}
            <div className="space-y-1">
              <div 
                className="flex justify-between items-center text-[11px] font-medium"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                <span className="flex items-center gap-1 font-bold text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-600 inline-block" />
                  Key / Svart (K)
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentCmyk.k}
                    onChange={(e) => handleCmykChange('k', Number(e.target.value))}
                    className="w-12 text-right font-mono font-bold text-[11px] px-1 py-0.5 rounded border bg-transparent"
                    style={{ borderColor: tokens.surfaceBorder }}
                  />
                  <span className="text-[10px] opacity-60">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentCmyk.k}
                onChange={(e) => handleCmykChange('k', Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(255, 255, 255), rgb(0, 0, 0))`
                }}
              />
            </div>
          </div>
        )}

        {/* Nyansskala (50–950) för den aktiva färgen */}
        <div className="pt-2 border-t space-y-1.5" style={applyThemeToApp ? { borderColor: tokens.surfaceBorder } : undefined}>
          <div 
            className="flex items-center justify-between text-[11px] font-medium"
            style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
          >
            <span className="flex items-center gap-1 font-semibold">
              <SunMedium className="w-3.5 h-3.5 text-amber-500" />
              <span>Nyansskala (50–950)</span>
            </span>
            <span className="text-[10px]" style={applyThemeToApp ? { color: tokens.textMuted } : undefined}>
              Klicka för att välja
            </span>
          </div>
          <div className="grid grid-cols-11 gap-1">
            {activeShades.map((s) => (
              <button
                key={s.step}
                onClick={() => handleHexChange(activeToken, s.hex)}
                className={`h-7 rounded flex flex-col items-center justify-end pb-0.5 border transition-transform hover:scale-115 cursor-pointer ${
                  s.isBase ? 'ring-2 ring-offset-1 scale-105 font-bold shadow-xs' : ''
                }`}
                style={{
                  backgroundColor: s.hex,
                  borderColor: s.isBase ? tokens.primary : 'rgba(0,0,0,0.15)',
                  color: s.optimalText
                }}
                title={`Nyans ${s.step}: ${s.hex} (Ljusstyrka: ${s.lightness}%)`}
              >
                <span className="text-[7.5px] leading-none opacity-90 font-mono">{s.step}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Automatisk Textkontrast Toggle */}
        <div 
          className="pt-2 border-t flex items-center justify-between text-[11px]"
          style={{ borderColor: tokens.surfaceBorder }}
        >
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={autoSyncForegrounds}
              onChange={(e) => setAutoSyncForegrounds(e.target.checked)}
              className="rounded cursor-pointer"
            />
            <span>Auto-synka textfärger (WCAG AA)</span>
          </label>
          <span 
            className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
            style={{
              backgroundColor: autoSyncForegrounds ? '#10b98120' : `${tokens.surfaceBorder}40`,
              color: autoSyncForegrounds ? '#10b981' : tokens.textMuted
            }}
          >
            {autoSyncForegrounds ? 'Aktiv' : 'Manuell'}
          </span>
        </div>
      </div>

      {/* 4. Färgharmonier & Palettgenerator (Generera från vald färg) */}
      <div 
        className="p-3.5 rounded-xl border transition-all space-y-2.5 shadow-xs"
        style={applyThemeToApp ? {
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${Math.min(tokens.radius, 12)}px`
        } : undefined}
      >
        <button
          onClick={() => setHarmoniesExpanded(!harmoniesExpanded)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
            <h3 className="text-xs font-bold">
              Färgharmonier & Snabbtema
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>
              Baserad på {TOKEN_METADATA[activeToken].label}
            </span>
            {harmoniesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {harmoniesExpanded && (
          <div className="pt-1.5 space-y-2 animate-in fade-in duration-150">
            <p className="text-[10.5px] leading-tight" style={{ color: tokens.textMuted }}>
              Härled matchande färger för hela temat utifrån den aktuella färgen:
            </p>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => generateHarmonyTheme('complementary')}
                className="py-1.5 px-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: tokens.background,
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`
                }}
                title="Skapar kontrastrik palett med motsatt färg på färghjulet (180°)"
              >
                <div className="font-bold text-[11px] flex items-center gap-1">
                  <span>🎯 Komplementär</span>
                </div>
                <div className="text-[9.5px] mt-0.5 opacity-75">
                  Motsatt nyans (+180°)
                </div>
              </button>

              <button
                onClick={() => generateHarmonyTheme('triadic')}
                className="py-1.5 px-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: tokens.background,
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`
                }}
                title="Tre balanserade färger jämnt fördelade på färghjulet (+120°, +240°)"
              >
                <div className="font-bold text-[11px] flex items-center gap-1">
                  <span>📐 Triadisk</span>
                </div>
                <div className="text-[9.5px] mt-0.5 opacity-75">
                  3 balanserade vinklar
                </div>
              </button>

              <button
                onClick={() => generateHarmonyTheme('analogous')}
                className="py-1.5 px-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: tokens.background,
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`
                }}
                title="Harmoniska närliggande färger (±35°)"
              >
                <div className="font-bold text-[11px] flex items-center gap-1">
                  <span>🌊 Analog</span>
                </div>
                <div className="text-[9.5px] mt-0.5 opacity-75">
                  Närliggande nyanser
                </div>
              </button>

              <button
                onClick={() => generateHarmonyTheme('monochrome')}
                className="py-1.5 px-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: tokens.background,
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`
                }}
                title="Olika ljus- och mättnadsgrader av samma grundfärg"
              >
                <div className="font-bold text-[11px] flex items-center gap-1">
                  <span>🖤 Monokrom</span>
                </div>
                <div className="text-[9.5px] mt-0.5 opacity-75">
                  Enhetlig nyans
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4.5 CMYK & METALLIC PALETT (GULD, SILVER, BRONS, KOPPAR & CMYK PRIMÄRER) */}
      <div 
        className="p-3.5 rounded-xl border transition-all space-y-2.5 shadow-xs"
        style={applyThemeToApp ? {
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${Math.min(tokens.radius, 12)}px`
        } : undefined}
      >
        <button
          onClick={() => setMetallicExpanded(!metallicExpanded)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base select-none">✨</span>
            <div>
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <span>CMYK & Metallics</span>
                <span 
                  className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded"
                  style={{
                    backgroundColor: '#d4af3722',
                    color: '#d4af37',
                    border: '1px solid #d4af3740'
                  }}
                >
                  Guld • Silver • Brons • CMYK
                </span>
              </h3>
              <p className="text-[10px] leading-tight" style={{ color: tokens.textMuted }}>
                Tryckfärger & ädelmetaller med precisa CMYK- och Hex-värden
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {metallicExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {metallicExpanded && (
          <div className="pt-1.5 space-y-2.5 animate-in fade-in duration-150">
            {/* Filter per metall-kategori */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10.5px]">
              {(['Alla', 'Guld', 'Silver & Metall', 'Brons & Koppar', 'CMYK Primärer'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMetallicFilter(cat)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer border ${
                    metallicFilter === cat ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: metallicFilter === cat ? tokens.primary : tokens.background,
                    color: metallicFilter === cat ? tokens.primaryForeground : tokens.text,
                    borderColor: tokens.surfaceBorder,
                    borderRadius: `${Math.min(tokens.radius, 6)}px`
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Färgbrickor för Guld, Silver, Koppar och CMYK */}
            <div className="grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto pr-0.5">
              {METALLIC_CMYK_SWATCHES
                .filter(m => metallicFilter === 'Alla' || m.category === metallicFilter)
                .map((item) => {
                  const isActive = tokens[activeToken]?.toUpperCase() === item.hex.toUpperCase();

                  return (
                    <div
                      key={item.name}
                      onClick={() => handleHexChange(activeToken, item.hex)}
                      className={`p-2 rounded-lg border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col justify-between ${
                        isActive ? 'ring-2' : ''
                      }`}
                      style={{
                        backgroundColor: tokens.background,
                        borderColor: isActive ? tokens.primary : tokens.surfaceBorder,
                        borderRadius: `${Math.min(tokens.radius, 8)}px`,
                        boxShadow: isActive ? `0 0 0 1px ${tokens.ring}` : undefined,
                      }}
                      title={`${item.name} (${item.nameEn})\nHex: ${item.hex}\nCMYK: C:${item.cmyk.c}% M:${item.cmyk.m}% Y:${item.cmyk.y}% K:${item.cmyk.k}%\n${item.description}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div 
                          className="w-5 h-5 rounded-md border border-black/20 shadow-xs shrink-0"
                          style={{ backgroundColor: item.hex }}
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold truncate leading-tight">
                            {item.name}
                          </div>
                          <div className="text-[9px] truncate font-mono opacity-65">
                            {item.hex}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-black/5 dark:border-white/5">
                        <span className="font-semibold text-sky-500">
                          C{item.cmyk.c} M{item.cmyk.m} Y{item.cmyk.y} K{item.cmyk.k}
                        </span>
                        <span 
                          className="text-[8.5px] px-1 rounded uppercase font-bold"
                          style={{
                            backgroundColor: `${tokens.primary}20`,
                            color: tokens.primary
                          }}
                        >
                          Välj
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="p-2 rounded-lg bg-neutral-500/10 border border-neutral-500/20 text-[10px] leading-relaxed opacity-80">
              💡 <em>Klicka på en metall eller CMYK-ton för att tillämpa den direkt på den valda rollen ({TOKEN_METADATA[activeToken].label}).</em>
            </div>
          </div>
        )}
      </div>

      {/* 5. ALLA FÄRGER I TEMAT (KONTROLLERA ALLA TOKENS) */}
      <div 
        className="p-3.5 rounded-xl border transition-all space-y-3 shadow-xs"
        style={applyThemeToApp ? {
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${Math.min(tokens.radius, 12)}px`
        } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Alla Färger i Temat ({Object.keys(TOKEN_METADATA).length})
            </h3>
          </div>
          <button
            onClick={() => setAllTokensExpanded(!allTokensExpanded)}
            className="text-[11px] font-semibold hover:underline cursor-pointer flex items-center gap-1"
            style={{ color: tokens.primary }}
          >
            <span>{allTokensExpanded ? 'Dölj lista' : 'Visa alla'}</span>
            {allTokensExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {allTokensExpanded && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            {/* Kategori-filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10.5px]">
              {(['Alla', 'Varumärke', 'Ytor & Bas', 'Typografi', 'Effekter'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer border ${
                    categoryFilter === cat ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: categoryFilter === cat ? tokens.primary : tokens.background,
                    color: categoryFilter === cat ? tokens.primaryForeground : tokens.text,
                    borderColor: tokens.surfaceBorder,
                    borderRadius: `${Math.min(tokens.radius, 6)}px`
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Token Lista med Direkt Hex & Color Picker för varje färg */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredTokenKeys.map((key) => {
                const hexVal = tokens[key];
                const meta = TOKEN_METADATA[key];
                const isSelected = activeToken === key;
                const rgb = hexToRgb(hexVal);

                return (
                  <div
                    key={key}
                    onClick={() => setActiveToken(key)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected ? 'ring-2' : 'hover:opacity-95'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${tokens.primary}18` : tokens.background,
                      borderColor: isSelected ? tokens.primary : tokens.surfaceBorder,
                      borderRadius: `${Math.min(tokens.radius, 8)}px`,
                      boxShadow: isSelected ? `0 0 0 1px ${tokens.ring}` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Swatch & native color picker */}
                      <div 
                        className="w-6 h-6 rounded-md border border-black/15 shadow-xs shrink-0 relative overflow-hidden"
                        style={{ backgroundColor: hexVal }}
                        title="Klicka för snabbval"
                      >
                        <input
                          type="color"
                          value={isValidHex(hexVal) ? hexVal : '#000000'}
                          onChange={(e) => handleHexChange(key, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate flex items-center gap-1.5">
                          <span>{meta.label}</span>
                          {isSelected && (
                            <span 
                              className="text-[8px] px-1 py-0.2 rounded font-extrabold uppercase"
                              style={{ backgroundColor: tokens.primary, color: tokens.primaryForeground }}
                            >
                              Styrs
                            </span>
                          )}
                        </div>
                        <div className="text-[9.5px] truncate font-mono opacity-60">
                          {hexVal} • rgb({rgb.r},{rgb.g},{rgb.b})
                        </div>
                      </div>
                    </div>

                    {/* Inline Hex Edit Input */}
                    <div 
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded border text-[11px] font-mono shrink-0"
                      style={{
                        backgroundColor: tokens.surface,
                        borderColor: tokens.surfaceBorder,
                        borderRadius: `${Math.min(tokens.radius, 6)}px`,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="opacity-40 font-bold select-none">#</span>
                      <input
                        type="text"
                        value={hexVal.replace(/^#/, '')}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          const formatted = val.startsWith('#') ? val : '#' + val;
                          if (isValidHex(formatted)) {
                            handleHexChange(key, formatted);
                          }
                        }}
                        onFocus={() => setActiveToken(key)}
                        maxLength={6}
                        className="w-14 bg-transparent font-mono font-bold uppercase outline-none text-[10.5px]"
                        style={{ color: tokens.text }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 6. Dämpa Ytterligheter (Mellanläge Tonal Range) */}
      <div 
        className="p-3.5 rounded-xl border transition-all space-y-3"
        style={applyThemeToApp ? {
          backgroundColor: tokens.surface,
          borderColor: softenActive ? tokens.primary : tokens.surfaceBorder,
          boxShadow: softenActive ? `0 0 0 1px ${tokens.primary}40, 0 4px 12px ${tokens.primary}12` : undefined,
          borderRadius: `${Math.min(tokens.radius, 12)}px`
        } : undefined}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">⚖️</span>
            <div>
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <span>Dämpa Ytterligheter</span>
                {softenActive && (
                  <span 
                    className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${tokens.primary}25`,
                      color: tokens.primary,
                      border: `1px solid ${tokens.primary}50`
                    }}
                  >
                    Aktiv
                  </span>
                )}
              </h3>
              <p className="text-[10px] leading-tight" style={{ color: tokens.textMuted }}>
                Mjukare mörka & dämpade ljusa toner med bevarad kontrast
              </p>
            </div>
          </div>

          <button
            onClick={onToggleSoftenExtremes || onSnapToSweetSpot}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              softenActive ? 'shadow-xs' : 'hover:opacity-90'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: softenActive ? tokens.primary : tokens.background,
              color: softenActive ? tokens.primaryForeground : tokens.text,
              borderColor: softenActive ? tokens.primary : tokens.surfaceBorder,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title={softenActive ? 'Återställ full dynamik (rå palett)' : 'Aktivera dämpning av extremtoner'}
          >
            {softenActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
            <span>{softenActive ? 'Mjukad' : 'Aktivera'}</span>
          </button>
        </div>

        {/* Live Kontrast & Extrem-mätare */}
        <div 
          className="p-2.5 rounded-lg border text-[11px] space-y-1.5"
          style={applyThemeToApp ? {
            backgroundColor: `${tokens.background}cc`,
            borderColor: tokens.surfaceBorder,
            borderRadius: `${Math.min(tokens.radius, 8)}px`
          } : undefined}
        >
          <div className="flex items-center justify-between text-[10.5px]">
            <span className="flex items-center gap-1 font-medium" style={{ color: tokens.textMuted }}>
              <span>{extremeStats.isDark ? '🌙 Dark Mode-schema' : '☀️ Light Mode-schema'}</span>
            </span>
            <span 
              className="font-bold flex items-center gap-1"
              style={{ color: extremeStats.contrastRatio >= 4.5 ? '#10b981' : '#f59e0b' }}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>WCAG {extremeStats.contrastRatio}:1 ({extremeStats.wcagStatus})</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: tokens.surfaceBorder }}>
            <div>
              <span className="text-[9.5px] block opacity-75">Mörkaste ton:</span>
              <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold">
                <span 
                  className="w-3 h-3 rounded-full border border-black/20 shrink-0" 
                  style={{ backgroundColor: extremeStats.darkestHex }} 
                />
                <span className="truncate">{extremeStats.darkestHex}</span>
                <span className="text-[9.5px] opacity-75 font-sans">({extremeStats.minL}%)</span>
              </div>
            </div>

            <div>
              <span className="text-[9.5px] block opacity-75">Ljusaste ton:</span>
              <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold">
                <span 
                  className="w-3 h-3 rounded-full border border-black/20 shrink-0" 
                  style={{ backgroundColor: extremeStats.brightestHex }} 
                />
                <span className="truncate">{extremeStats.brightestHex}</span>
                <span className="text-[9.5px] opacity-75 font-sans">({extremeStats.maxL}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Snabbval för intensitet */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span style={{ color: tokens.textMuted }}>Dämpningsgrad:</span>
            <span className="font-mono font-bold" style={{ color: tokens.text }}>
              {Math.round((softenActive ? softenAmount : 0) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {[
              { label: 'Original', val: 0 },
              { label: 'Subtil', val: 0.3 },
              { label: 'Balans', val: 0.55 },
              { label: 'Djup', val: 0.85 }
            ].map((preset) => {
              const isSelected = (!softenActive && preset.val === 0) || (softenActive && Math.abs(softenAmount - preset.val) < 0.15 && preset.val > 0);
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    if (onSetSoftenAmount) {
                      onSetSoftenAmount(preset.val);
                    } else if (onSnapToSweetSpot) {
                      onSnapToSweetSpot();
                    }
                  }}
                  className={`py-1 px-1.5 text-[10.5px] font-semibold rounded border transition-all cursor-pointer text-center ${
                    isSelected ? 'shadow-xs' : 'hover:opacity-90'
                  }`}
                  style={applyThemeToApp ? {
                    backgroundColor: isSelected ? `${tokens.primary}25` : tokens.background,
                    borderColor: isSelected ? tokens.primary : tokens.surfaceBorder,
                    color: isSelected ? tokens.primary : tokens.text,
                    borderRadius: `${Math.min(tokens.radius, 6)}px`
                  } : undefined}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7. Färgrotation & Cykling */}
      <div 
        className="p-3.5 rounded-xl border transition-all space-y-2.5"
        style={applyThemeToApp ? {
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${Math.min(tokens.radius, 12)}px`
        } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
            <h3 className="text-xs font-bold">
              Färgrotation & Hierarki
            </h3>
          </div>
          <span 
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={applyThemeToApp ? { 
              backgroundColor: tokens.background, 
              color: tokens.textMuted,
              border: `1px solid ${tokens.surfaceBorder}` 
            } : undefined}
          >
            P ➔ S ➔ A
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {onCycleColors && (
            <button
              onClick={onCycleColors}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={applyThemeToApp ? {
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`,
              } : undefined}
              title="Cykla färger: Flytta färgerna ett steg (Primär tar Sekundär, Sekundär tar Accent, Accent tar Primär)"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-500" />
              <span>Cykla färger</span>
            </button>
          )}

          {onShuffleColors && (
            <button
              onClick={onShuffleColors}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={applyThemeToApp ? {
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`,
              } : undefined}
              title="Slumpa ordning på färgerna: Blanda om rollerna (Primär, Sekundär, Accent) i din nuvarande palett"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-500" />
              <span>Blanda ordning</span>
            </button>
          )}
        </div>
      </div>

      {/* 8. Neobrutalism Generator (3D-Press & Få Färger) */}
      <div 
        className="p-3.5 rounded-xl border-2 transition-all space-y-3"
        style={applyThemeToApp ? {
          backgroundColor: tokens.surface,
          borderColor: tokens.shadowMode === 'brutalist' ? tokens.text : tokens.surfaceBorder,
          boxShadow: tokens.shadowMode === 'brutalist' ? `3px 3px 0px 0px ${tokens.text}` : undefined,
          borderRadius: `${Math.min(tokens.radius, 8)}px`
        } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span>Neobrutalism & Få Färger</span>
              {tokens.shadowMode === 'brutalist' && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-black font-extrabold uppercase">
                  Aktiv
                </span>
              )}
            </h3>
          </div>
          <span className="text-[10px] font-bold" style={{ color: tokens.textMuted }}>
            2-3 Färger
          </span>
        </div>

        {onNeobrutalize && (
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => onNeobrutalize('preserve')}
              className="w-full py-2 px-3 rounded text-xs font-bold border-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              style={applyThemeToApp ? {
                backgroundColor: tokens.primary,
                borderColor: tokens.text,
                color: tokens.primaryForeground,
                boxShadow: `2px 2px 0px 0px ${tokens.text}`,
                borderRadius: '4px',
              } : undefined}
              title="Konvertera nuvarande färgskala till äkta Neobrutalism med solida 2px ramar och 3D-skuggor"
            >
              <span>⚡ Neobrutalisera Nuvarande Palett</span>
            </button>

            {/* Snabbval: Minimalistiska 2-3 färgteman */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => onNeobrutalize('minimal-canary')}
                className="py-1.5 px-2 rounded text-[11px] font-bold border transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                style={applyThemeToApp ? {
                  backgroundColor: '#facc15',
                  borderColor: '#000000',
                  color: '#000000',
                  borderRadius: '4px',
                } : undefined}
                title="3 färger: Varm canvas, Svart bläck, Elektrisk kanariegul"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
                <span className="truncate">Kanariegul (3)</span>
              </button>

              <button
                onClick={() => onNeobrutalize('minimal-lime')}
                className="py-1.5 px-2 rounded text-[11px] font-bold border transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                style={applyThemeToApp ? {
                  backgroundColor: '#ccff00',
                  borderColor: '#000000',
                  color: '#000000',
                  borderRadius: '2px',
                } : undefined}
                title="3 färger: Stark vit, Svart bläck, Acid Lime"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
                <span className="truncate">Acid Lime (3)</span>
              </button>

              <button
                onClick={() => onNeobrutalize('minimal-bubblegum')}
                className="py-1.5 px-2 rounded text-[11px] font-bold border transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                style={applyThemeToApp ? {
                  backgroundColor: '#f43f5e',
                  borderColor: '#111111',
                  color: '#ffffff',
                  borderRadius: '4px',
                } : undefined}
                title="3 färger: Sockervadd, Svart bläck, Chockrosa"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
                <span className="truncate">Bubblegum (3)</span>
              </button>

              <button
                onClick={() => onNeobrutalize('minimal-cyber')}
                className="py-1.5 px-2 rounded text-[11px] font-bold border transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                style={applyThemeToApp ? {
                  backgroundColor: '#0a0a0a',
                  borderColor: '#ffffff',
                  color: '#00f0ff',
                  borderRadius: '0px',
                } : undefined}
                title="3 färger: Obsidian natt, Vit ram, Elektrisk Cyan"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">Cyber Dark (3)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 9. Geometri & Ramar */}
      <div className="space-y-3 pt-1">
        <h2 
          className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
        >
          <Shapes className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
          Geometri & Ramar
        </h2>

        {/* Radius Slider */}
        <div className="space-y-1.5">
          <div 
            className="flex justify-between text-xs font-medium transition-colors"
            style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
          >
            <span>Hörnradie (Radius)</span>
            <span className="font-mono" style={applyThemeToApp ? { color: tokens.text } : undefined}>{tokens.radius}px</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="24"
              value={tokens.radius}
              onChange={(e) => onChangeTokens({ ...tokens, radius: Number(e.target.value) })}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              style={applyThemeToApp ? {
                accentColor: tokens.primary,
                backgroundColor: tokens.background
              } : undefined}
            />
            <div
              className="w-6 h-6 border-2 shrink-0 transition-all"
              style={{ 
                borderRadius: `${tokens.radius}px`,
                borderColor: tokens.primary,
                backgroundColor: `${tokens.primary}20`
              }}
            />
          </div>
        </div>

        {/* Shadow Mode */}
        <div className="space-y-1.5">
          <label 
            className="text-xs font-medium block transition-colors"
            style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
          >
            Skuggstil (Shadow Style)
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {(['subtle', 'elevated', 'glow', 'brutalist', 'none'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onChangeTokens({ ...tokens, shadowMode: mode })}
                className="py-1.5 px-2 text-[11px] font-medium border capitalize transition-all cursor-pointer"
                style={applyThemeToApp ? {
                  backgroundColor: tokens.shadowMode === mode ? tokens.primary : tokens.background,
                  color: tokens.shadowMode === mode ? tokens.primaryForeground : tokens.text,
                  borderColor: tokens.shadowMode === mode ? tokens.primary : tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`,
                } : undefined}
              >
                {mode === 'subtle' ? 'Subtil' : 
                 mode === 'elevated' ? 'Upphöjd' : 
                 mode === 'glow' ? 'Glöd' : 
                 mode === 'brutalist' ? 'Brutalist' : 'Ingen'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Contrast Mini-Card */}
        <div 
          className="p-2.5 rounded-lg border text-[11px] space-y-1.5 transition-colors"
          style={applyThemeToApp ? {
            backgroundColor: tokens.background,
            borderColor: tokens.surfaceBorder,
            borderRadius: `${Math.min(tokens.radius, 8)}px`
          } : undefined}
        >
          <div className="flex items-center justify-between font-semibold">
            <span style={applyThemeToApp ? { color: tokens.text } : undefined}>Text vs Bakgrund:</span>
            <span className={`px-1.5 py-0.5 rounded font-mono ${
              textBgContrast >= 4.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {textBgContrast}:1 {textBgContrast >= 4.5 ? '✓ AA' : '✗ Låg'}
            </span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span style={applyThemeToApp ? { color: tokens.text } : undefined}>Primärknapp:</span>
            <span className={`px-1.5 py-0.5 rounded font-mono ${
              primaryContrast >= 4.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {primaryContrast}:1 {primaryContrast >= 4.5 ? '✓ AA' : '✗ Låg'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
