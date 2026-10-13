import React, { useState } from 'react';
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
  Boxes
} from 'lucide-react';
import { ThemeTokens } from '../types/theme';
import { 
  hexToHsl, 
  hslToHex, 
  isValidHex, 
  getOptimalTextColor, 
  getContrastRatio,
  adjustColor,
  generateColorShades,
  analyzeThemeExtremes,
  softenExtremesWithContrast,
  NeobrutalistPresetKind
} from '../utils/colorUtils';
import { getDescriptiveColorName } from '../utils/colorNames';

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
  applyThemeToApp?: boolean;
}

type TokenKey = 
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'background'
  | 'surface'
  | 'surfaceBorder'
  | 'text'
  | 'textMuted'
  | 'ring'
  | 'glow';

const TOKEN_LABELS: Record<TokenKey, { label: string; desc: string; category: string }> = {
  primary: { label: 'Primär (Primary)', desc: 'Huvudknappar, aktiva länkar & fokus', category: 'Brand' },
  secondary: { label: 'Sekundär (Secondary)', desc: 'Sekundära knappar, badges & sektioner', category: 'Brand' },
  accent: { label: 'Accent / Highlight', desc: 'Badges, glöd & larm', category: 'Brand' },
  background: { label: 'Bakgrund (Canvas)', desc: 'Sidans grundläggande färg', category: 'Surface' },
  surface: { label: 'Kort & Paneler', desc: 'Ytor för cards, modaler & nav', category: 'Surface' },
  surfaceBorder: { label: 'Ram / Delare', desc: 'Diskreta gränslinjer och borders', category: 'Surface' },
  text: { label: 'Huvudtext', desc: 'Rubriker och brödtext', category: 'Typo' },
  textMuted: { label: 'Dämpad text', desc: 'Sekundära etiketter och metadata', category: 'Typo' },
  ring: { label: 'Fokusring (Ring)', desc: 'Tangentbordsfokus & markering', category: 'Effects' },
  glow: { label: 'Glöd & Skugga', desc: 'Ljushöjdpunkter och neon-effekter', category: 'Effects' },
};

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
  applyThemeToApp = true
}) => {
  const [activeToken, setActiveToken] = useState<TokenKey>('primary');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [primaryInput, setPrimaryInput] = useState(tokens.primary);
  const [secondaryInput, setSecondaryInput] = useState(tokens.secondary);

  React.useEffect(() => {
    setPrimaryInput(tokens.primary);
  }, [tokens.primary]);

  React.useEffect(() => {
    setSecondaryInput(tokens.secondary);
  }, [tokens.secondary]);

  const handleDirectHexInput = (key: 'primary' | 'secondary', val: string) => {
    if (key === 'primary') setPrimaryInput(val);
    else setSecondaryInput(val);

    const trimmed = val.trim();
    const formatted = trimmed.startsWith('#') ? trimmed : '#' + trimmed;
    if (isValidHex(formatted)) {
      handleHexChange(key, formatted);
    }
  };

  // Compute live contrast and extreme brightness statistics
  const extremeStats = React.useMemo(() => {
    return analyzeThemeExtremes(tokens);
  }, [tokens]);

  // Update a single hex color and auto-adjust its optimal foreground if applicable
  const handleHexChange = (key: TokenKey, hex: string) => {
    if (!isValidHex(hex)) return;
    
    const updated = { ...tokens, [key]: hex };
    
    // Automatically keep foreground legible if primary/secondary/accent changes
    if (key === 'primary') {
      updated.primaryForeground = getOptimalTextColor(hex);
      updated.ring = hex;
    } else if (key === 'secondary') {
      updated.secondaryForeground = getOptimalTextColor(hex);
    } else if (key === 'accent') {
      updated.accentForeground = getOptimalTextColor(hex);
      updated.glow = hex;
    } else if (key === 'surface') {
      updated.surfaceForeground = tokens.text;
    }

    onChangeTokens(updated);
  };

  // Slider adjustments for individual HSL
  const currentHsl = hexToHsl(tokens[activeToken]);

  // Shades for active token
  const activeShades = React.useMemo(() => {
    return generateColorShades(tokens[activeToken]);
  }, [tokens[activeToken]]);

  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...currentHsl, [channel]: value };
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    handleHexChange(activeToken, newHex);
  };

  const copyToClipboard = (tokenKey: TokenKey, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedToken(tokenKey);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  // Calculate contrast with background
  const textBgContrast = getContrastRatio(tokens.text, tokens.background);
  const primaryContrast = getContrastRatio(tokens.primaryForeground, tokens.primary);
  const secondaryContrast = getContrastRatio(tokens.secondaryForeground, tokens.secondary);

  const activeColorName = getDescriptiveColorName(tokens[activeToken]);

  return (
    <aside 
      className="w-full lg:w-84 xl:w-92 shrink-0 border-r flex flex-col h-full overflow-y-auto p-4 space-y-5 transition-colors duration-200"
      style={applyThemeToApp ? {
        backgroundColor: tokens.surface,
        borderColor: tokens.surfaceBorder,
        color: tokens.text,
      } : undefined}
    >
      
      {/* Mood Banner */}
      <div 
        className="p-3 rounded-xl border space-y-2 transition-colors"
        style={applyThemeToApp ? {
          backgroundColor: tokens.background,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${Math.min(tokens.radius + 2, 12)}px`
        } : undefined}
      >
        <div className="flex items-center justify-between">
          <span 
            className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5"
            style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
            Tema & Mood Beskrivning
          </span>
          <span 
            className="text-[10px] font-mono"
            style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
          >
            AI Prompt
          </span>
        </div>
        <textarea
          value={presetMood}
          onChange={(e) => onChangeMood(e.target.value)}
          rows={2}
          className="w-full text-xs rounded-lg p-2 focus:outline-none resize-none font-medium leading-relaxed transition-colors"
          style={applyThemeToApp ? {
            backgroundColor: tokens.surface,
            borderColor: tokens.surfaceBorder,
            color: tokens.text,
            borderRadius: `${Math.min(tokens.radius, 8)}px`,
            borderWidth: '1px'
          } : undefined}
          placeholder="Beskriv stämningen (t.ex. Minimalistisk, Djärv neon, Varm retro...)"
        />
      </div>

      {/* Quick Primär & Sekundär med Direkt Hex-inmatning */}
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
          {/* 1. Primärfärg Card med direkt Hex-input */}
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
                <span 
                  className="text-xs font-bold transition-colors"
                  style={applyThemeToApp ? { color: tokens.text } : undefined}
                >
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

            {/* Direct Hex Input Box */}
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

          {/* 2. Sekundärfärg Card med direkt Hex-input */}
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
                <span 
                  className="text-xs font-bold transition-colors"
                  style={applyThemeToApp ? { color: tokens.text } : undefined}
                >
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

            {/* Direct Hex Input Box */}
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

      {/* Deep-Dive HSL Reglar för den valda färgen */}
      <div 
        className="p-4 rounded-xl border space-y-3.5 transition-colors"
        style={applyThemeToApp ? {
          backgroundColor: tokens.background,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${Math.min(tokens.radius + 2, 12)}px`,
        } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg border border-black/15 shadow-xs shrink-0"
              style={{ 
                backgroundColor: tokens[activeToken],
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
            />
            <div className="min-w-0">
              <div 
                className="text-xs font-bold truncate transition-colors"
                style={applyThemeToApp ? { color: tokens.text } : undefined}
              >
                {TOKEN_LABELS[activeToken].label}
              </div>
              <div 
                className="text-[10px] font-medium truncate"
                style={applyThemeToApp ? { color: tokens.primary } : undefined}
              >
                {activeColorName}
              </div>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(activeToken, tokens[activeToken])}
            className="p-1.5 rounded-md hover:opacity-80 transition-colors cursor-pointer shrink-0"
            style={applyThemeToApp ? {
              backgroundColor: tokens.surface,
              color: tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 6)}px`,
              border: `1px solid ${tokens.surfaceBorder}`
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

        {/* Direct Hex Input & Color Picker */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={tokens[activeToken]}
            onChange={(e) => handleHexChange(activeToken, e.target.value)}
            className="w-9 h-9 rounded-lg border cursor-pointer p-0.5"
            style={applyThemeToApp ? {
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
          />
          <div className="flex-1 relative">
            <span 
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono"
              style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
            >
              #
            </span>
            <input
              type="text"
              value={tokens[activeToken].replace('#', '')}
              onChange={(e) => handleHexChange(activeToken, '#' + e.target.value.trim())}
              className="w-full text-xs font-mono pl-6 pr-2 py-1.5 rounded-lg uppercase focus:outline-none transition-colors"
              style={applyThemeToApp ? {
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`,
                borderWidth: '1px'
              } : undefined}
              maxLength={6}
            />
          </div>
        </div>

        {/* Sliders / Reglar: HSL */}
        <div className="space-y-3 pt-1 text-xs">
          {/* Nyans (Hue) Slider */}
          <div className="space-y-1">
            <div 
              className="flex justify-between text-[11px] font-medium"
              style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
            >
              <span>Nyans (Hue)</span>
              <span className="font-mono font-semibold" style={applyThemeToApp ? { color: tokens.text } : undefined}>
                {currentHsl.h}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={currentHsl.h}
              onChange={(e) => handleHslChange('h', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
              }}
            />
          </div>

          {/* Mättnad (Saturation) Slider */}
          <div className="space-y-1">
            <div 
              className="flex justify-between text-[11px] font-medium"
              style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
            >
              <span>Mättnad (Saturation)</span>
              <span className="font-mono font-semibold" style={applyThemeToApp ? { color: tokens.text } : undefined}>
                {currentHsl.s}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentHsl.s}
              onChange={(e) => handleHslChange('s', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={applyThemeToApp ? {
                accentColor: tokens.primary,
                backgroundColor: tokens.surface
              } : undefined}
            />
          </div>

          {/* Ljusstyrka (Lightness) Slider */}
          <div className="space-y-1">
            <div 
              className="flex justify-between text-[11px] font-medium"
              style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
            >
              <span>Ljusstyrka (Lightness)</span>
              <span className="font-mono font-semibold" style={applyThemeToApp ? { color: tokens.text } : undefined}>
                {currentHsl.l}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentHsl.l}
              onChange={(e) => handleHslChange('l', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={applyThemeToApp ? {
                accentColor: tokens.primary,
                backgroundColor: tokens.surface
              } : undefined}
            />
          </div>

          {/* Mini Shade Spectrum for Active Token */}
          <div className="pt-2.5 border-t space-y-1.5" style={applyThemeToApp ? { borderColor: tokens.surfaceBorder } : undefined}>
            <div 
              className="flex items-center justify-between text-[11px] font-medium"
              style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
            >
              <span className="flex items-center gap-1 font-semibold" style={applyThemeToApp ? { color: tokens.text } : undefined}>
                <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                <span>Nyansskala (50–950)</span>
              </span>
              <span className="text-[10px]" style={applyThemeToApp ? { color: tokens.textMuted } : undefined}>
                Klicka för att välja nyans
              </span>
            </div>
            <div className="grid grid-cols-11 gap-1">
              {activeShades.map((s) => (
                <button
                  key={s.step}
                  onClick={() => handleHexChange(activeToken, s.hex)}
                  className={`h-7 rounded flex flex-col items-center justify-end pb-0.5 border transition-transform hover:scale-115 cursor-pointer ${
                    s.isBase ? 'ring-1 ring-offset-1 scale-105 font-bold shadow-xs' : ''
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
        </div>
      </div>

      {/* Dämpa Ytterligheter & Mjuk Kontrast (Tonal Range Equalizer) */}
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
              <h3 
                className="text-xs font-bold flex items-center gap-1.5"
                style={applyThemeToApp ? { color: tokens.text } : undefined}
              >
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
              <p 
                className="text-[10px] leading-tight"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                Mjukare mörka & dämpade ljusa toner med bevarad kontrast
              </p>
            </div>
          </div>

          {/* Huvudknapp för att växla På/Av */}
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
            <span className="flex items-center gap-1 font-medium" style={applyThemeToApp ? { color: tokens.textMuted } : undefined}>
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

          <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={applyThemeToApp ? { borderColor: tokens.surfaceBorder } : undefined}>
            <div>
              <span className="text-[9.5px] block opacity-75">Mörkaste ton (Lyfts):</span>
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
              <span className="text-[9.5px] block opacity-75">Ljusaste ton (Dämpas):</span>
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
            <span style={applyThemeToApp ? { color: tokens.textMuted } : undefined}>Dämpningsgrad:</span>
            <span className="font-mono font-bold" style={applyThemeToApp ? { color: tokens.text } : undefined}>
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

          {/* Slider för steglös kontroll */}
          {onSetSoftenAmount && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={softenActive ? softenAmount : 0}
              onChange={(e) => onSetSoftenAmount(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer mt-1"
              style={applyThemeToApp ? {
                accentColor: tokens.primary,
                backgroundColor: tokens.surfaceBorder
              } : undefined}
            />
          )}
        </div>
      </div>

      {/* Färgrotation & Palett-Verktyg (Cykla & Blanda färgordning) */}
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
            <h3 
              className="text-xs font-bold"
              style={applyThemeToApp ? { color: tokens.text } : undefined}
            >
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

        <p 
          className="text-[10.5px] leading-tight"
          style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
        >
          Testa olika färgpositioner i gränssnittet utan att förlora dina noga utvalda nyanser.
        </p>

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

      {/* Neobrutalism Generator & 3D-Press Panel (Få färger & Taktil mekanik) */}
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
            <h3 
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1"
              style={applyThemeToApp ? { color: tokens.text } : undefined}
            >
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

        <p 
          className="text-[10.5px] leading-tight"
          style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
        >
          Konvertera temat till taktil 3D-press: 2px solida ramar, hårda fallskuggor, 0-4px hörn och maximal kontrast med bara ett fåtal färger.
        </p>

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

      {/* Alla Tokens i Paletten */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
          >
            <Layers className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
            Övriga Färg-Tokens
          </h2>
          <div className="flex items-center gap-2">
            {onSnapToSweetSpot && (
              <button
                onClick={onSnapToSweetSpot}
                className="text-[11px] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                style={applyThemeToApp ? { color: tokens.accent } : undefined}
                title="Snäpp bakgrund och yta till det vilsamma mellanläget (mildra kolsvart och kritvitt)"
              >
                <span>⚖️ Mellanläge</span>
              </button>
            )}
            <button
              onClick={onAutoContrast}
              className="text-[11px] font-medium hover:underline flex items-center gap-1 cursor-pointer"
              style={applyThemeToApp ? { color: tokens.primary } : undefined}
              title="Justera textkontraster till säker WCAG AA-nivå"
            >
              <Wand2 className="w-3 h-3" />
              <span>Auto-kontrast</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(TOKEN_LABELS) as TokenKey[]).map((key) => {
            const hex = tokens[key];
            const isSelected = activeToken === key;
            return (
              <button
                key={key}
                onClick={() => setActiveToken(key)}
                className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all border cursor-pointer ${
                  isSelected ? 'shadow-xs' : 'hover:opacity-90'
                }`}
                style={applyThemeToApp ? {
                  backgroundColor: isSelected ? `${tokens.primary}18` : tokens.background,
                  borderColor: isSelected ? tokens.primary : tokens.surfaceBorder,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`,
                  boxShadow: isSelected ? `0 0 0 1px ${tokens.ring}` : undefined,
                } : undefined}
              >
                <div
                  className="w-4 h-4 rounded-md shrink-0 border border-black/10 dark:border-white/10 shadow-xs"
                  style={{ 
                    backgroundColor: hex,
                    borderRadius: `${Math.min(tokens.radius, 6)}px`
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div 
                    className="text-[11px] font-semibold truncate transition-colors"
                    style={applyThemeToApp ? { color: tokens.text } : undefined}
                  >
                    {TOKEN_LABELS[key].label.split(' ')[0]}
                  </div>
                  <div 
                    className="text-[10px] font-mono truncate"
                    style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
                  >
                    {hex}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Geometri & Master-Reglar */}
      <div className="space-y-3 pt-2">
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
