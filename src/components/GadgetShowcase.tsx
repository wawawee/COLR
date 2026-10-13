import React, { useState } from 'react';
import { 
  ThemeTokens 
} from '../types/theme';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Bookmark, 
  Share2, 
  Download, 
  Loader2, 
  Search, 
  Bell, 
  Sliders, 
  Check, 
  X, 
  Copy, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Play, 
  Pause,
  Plus,
  Minus,
  Boxes,
  MousePointerClick,
  Volume2,
  VolumeX,
  Lightbulb
} from 'lucide-react';
import { NeobrutalistPresetKind, getOptimalTextColor } from '../utils/colorUtils';

interface GadgetShowcaseProps {
  tokens: ThemeTokens;
  onChangeTokens?: (tokens: ThemeTokens) => void;
  onNeobrutalize?: (kind?: NeobrutalistPresetKind) => void;
}

export const GadgetShowcase: React.FC<GadgetShowcaseProps> = ({ 
  tokens,
  onChangeTokens,
  onNeobrutalize 
}) => {
  const [clickCount, setClickCount] = useState<number>(142);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [toggleState, setToggleState] = useState<boolean>(true);
  const [segmentedTab, setSegmentedTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState<string>('Vite Nextjs template');
  const [sliderVal, setSliderVal] = useState<number>(68);
  const [toastVisible, setToastVisible] = useState<boolean>(true);

  // Neobrutalist Laboratory State
  const [neoPressCount, setNeoPressCount] = useState<number>(0);
  const [neoColorChoice, setNeoColorChoice] = useState<'primary' | 'secondary' | 'accent' | 'surface' | 'dark'>('primary');
  const [neoRadiusChoice, setNeoRadiusChoice] = useState<number>(4);
  const [neoSoundActive, setNeoSoundActive] = useState<boolean>(true);
  const [neoGuideOpen, setNeoGuideOpen] = useState<boolean>(true);

  // Synthesize lightweight mechanical click sound on button press
  const playTactileClick = () => {
    setNeoPressCount(prev => prev + 1);
    if (!neoSoundActive) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext not available or blocked in browser
    }
  };

  // Dynamic shadow class or style based on tokens.shadowMode
  const getShadowStyle = (type: 'card' | 'btn' | 'glow') => {
    switch (tokens.shadowMode) {
      case 'glow':
        return { boxShadow: `0 0 20px -3px ${tokens.glow}55` };
      case 'elevated':
        return { boxShadow: '0 12px 28px -6px rgba(0,0,0,0.25), 0 4px 10px -2px rgba(0,0,0,0.1)' };
      case 'brutalist':
        return { boxShadow: `4px 4px 0px 0px ${tokens.surfaceBorder}` };
      case 'subtle':
        return { boxShadow: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)' };
      case 'none':
      default:
        return {};
    }
  };

  const handleSimulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setClickCount((c) => c + 1);
    }, 1000);
  };

  return (
    <div 
      className="p-6 md:p-8 space-y-8 rounded-2xl min-h-full transition-colors duration-200"
      style={{
        backgroundColor: tokens.background,
        color: tokens.text,
      }}
    >
      {/* Top Banner & Quick Color Swatch Line */}
      <div 
        className="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius}px`,
          borderWidth: `${tokens.borderWidth}px`,
          ...getShadowStyle('card'),
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${tokens.accent}22`,
                color: tokens.accent,
                borderRadius: `${Math.max(4, tokens.radius - 4)}px`,
              }}
            >
              Interaktiv Testbänk
            </span>
            <span style={{ color: tokens.textMuted }} className="text-xs">
              Live Tailwind v4 Tokens
            </span>
          </div>
          <h2 className="text-lg font-bold tracking-tight" style={{ color: tokens.text }}>
            Knappar, Formgadgets & UI-Komponenter
          </h2>
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            Klicka och interagera med knapparna nedan för att känna hur färgerna samspelar i verkliga användarfall.
          </p>
        </div>

        {/* Live Mini Swatch Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg border" style={{ borderColor: tokens.surfaceBorder, backgroundColor: tokens.background }}>
          {[
            { label: 'P', color: tokens.primary, title: 'Primary' },
            { label: 'S', color: tokens.secondary, title: 'Secondary' },
            { label: 'A', color: tokens.accent, title: 'Accent' },
            { label: 'B', color: tokens.background, title: 'Background' },
            { label: 'C', color: tokens.surface, title: 'Surface' },
            { label: 'T', color: tokens.text, title: 'Text' },
          ].map((item) => (
            <div
              key={item.label}
              title={`${item.title}: ${item.color}`}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shadow-xs border border-black/10"
              style={{
                backgroundColor: item.color,
                color: item.label === 'P' ? tokens.primaryForeground : 
                       item.label === 'S' ? tokens.secondaryForeground :
                       item.label === 'A' ? tokens.accentForeground : tokens.text,
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* SEKTION 1: BUTTON MATRIX (Olika sorters random knappar) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2" style={{ color: tokens.text }}>
              <Zap className="w-4 h-4" style={{ color: tokens.primary }} />
              1. Knapp-Galleriet (Button Matrix)
            </h3>
            <p className="text-xs" style={{ color: tokens.textMuted }}>
              Standardknappar, glödande knappar, ghost, brutalistiska och micro-interaktioner.
            </p>
          </div>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5 rounded-2xl border"
          style={{
            backgroundColor: tokens.surface,
            borderColor: tokens.surfaceBorder,
            borderRadius: `${tokens.radius}px`,
            borderWidth: `${tokens.borderWidth}px`,
          }}
        >
          {/* 1. Primary Solid Action Button */}
          <div className="p-3.5 rounded-xl border flex flex-col justify-between gap-3" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}50` }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: tokens.textMuted }}>
                Primär Solid Knapp
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: tokens.textMuted }}>
                Huvudåtgärd med klickräknare.
              </p>
            </div>
            <button
              onClick={() => setClickCount(c => c + 1)}
              className="w-full py-2.5 px-4 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              style={{
                backgroundColor: tokens.primary,
                color: tokens.primaryForeground,
                borderRadius: `${tokens.radius}px`,
                boxShadow: tokens.shadowMode === 'glow' ? `0 0 15px ${tokens.glow}66` : undefined,
              }}
            >
              <span>Klicka här ({clickCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. Secondary Outline / Ghost */}
          <div className="p-3.5 rounded-xl border flex flex-col justify-between gap-3" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}50` }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: tokens.textMuted }}>
                Sekundär Ramknapp
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: tokens.textMuted }}>
                Stödjande handlingar & avbryt.
              </p>
            </div>
            <button
              className="w-full py-2.5 px-4 font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:opacity-85 active:scale-95 border cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                borderColor: tokens.secondary,
                color: tokens.secondary,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sekundär Filter</span>
            </button>
          </div>

          {/* 3. Accent Glow Button */}
          <div className="p-3.5 rounded-xl border flex flex-col justify-between gap-3" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}50` }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: tokens.textMuted }}>
                Accent Neon-Glöd Knapp
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: tokens.textMuted }}>
                För speciella kampanjer & VIP.
              </p>
            </div>
            <button
              className="w-full py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-95 cursor-pointer relative overflow-hidden"
              style={{
                backgroundColor: tokens.accent,
                color: tokens.accentForeground,
                borderRadius: `${tokens.radius}px`,
                boxShadow: `0 0 20px 2px ${tokens.glow}80`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Uppgradera till Pro</span>
            </button>
          </div>

          {/* 4. Brutalist Hard-Shadow Button */}
          <div className="p-3.5 rounded-xl border flex flex-col justify-between gap-3" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}50` }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: tokens.textMuted }}>
                Neobrutalist Press-knapp
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: tokens.textMuted }}>
                Tydlig taktil 3D-känsla.
              </p>
            </div>
            <button
              className="w-full py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:translate-x-1 active:translate-y-1 cursor-pointer border-2"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.text,
                color: tokens.text,
                borderRadius: `${Math.min(6, tokens.radius)}px`,
                boxShadow: `3px 3px 0px 0px ${tokens.text}`,
              }}
            >
              <span>Arkiv & Exportera</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5. Gradient Shift Button */}
          <div className="p-3.5 rounded-xl border flex flex-col justify-between gap-3" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}50` }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: tokens.textMuted }}>
                Toning (Gradient Mesh)
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: tokens.textMuted }}>
                Från Primary till Secondary.
              </p>
            </div>
            <button
              className="w-full py-2.5 px-4 font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${tokens.primary} 0%, ${tokens.secondary} 100%)`,
                color: '#ffffff',
                borderRadius: `${tokens.radius}px`,
              }}
            >
              <span>Generera Palett</span>
              <Zap className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6. Soft Tint / Glass Button */}
          <div className="p-3.5 rounded-xl border flex flex-col justify-between gap-3" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}50` }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: tokens.textMuted }}>
                Mjuk Tint / Glassmorphism
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: tokens.textMuted }}>
                Halvtransparent med primärfärg.
              </p>
            </div>
            <button
              className="w-full py-2.5 px-4 font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:bg-opacity-30 active:scale-95 cursor-pointer border"
              style={{
                backgroundColor: `${tokens.primary}20`,
                borderColor: `${tokens.primary}40`,
                color: tokens.primary,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifiera Licens</span>
            </button>
          </div>

          {/* 7. Loading Async Button */}
          <div className="p-3.5 rounded-xl border flex flex-col justify-between gap-3" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}50` }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: tokens.textMuted }}>
                Async Loader Knapp
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: tokens.textMuted }}>
                Simulera API anrop / rendering.
              </p>
            </div>
            <button
              onClick={handleSimulateLoad}
              disabled={isLoading}
              className="w-full py-2.5 px-4 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-75"
              style={{
                backgroundColor: tokens.secondary,
                color: tokens.secondaryForeground,
                borderRadius: `${tokens.radius}px`,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Kompilerar...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kör Byggprocess</span>
                </>
              )}
            </button>
          </div>

          {/* 8. Interactive Icon Action Cluster */}
          <div className="p-3.5 rounded-xl border flex flex-col justify-between gap-3" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}50` }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: tokens.textMuted }}>
                Ikonknappar & Reaktivitet
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: tokens.textMuted }}>
                Gilla, bokmärk, dela.
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex-1 py-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
                style={{
                  borderColor: tokens.surfaceBorder,
                  backgroundColor: isLiked ? `${tokens.accent}20` : 'transparent',
                  color: isLiked ? tokens.accent : tokens.textMuted,
                  borderRadius: `${Math.max(4, tokens.radius - 2)}px`,
                }}
                title="Gilla"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="flex-1 py-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
                style={{
                  borderColor: tokens.surfaceBorder,
                  backgroundColor: isBookmarked ? `${tokens.primary}20` : 'transparent',
                  color: isBookmarked ? tokens.primary : tokens.textMuted,
                  borderRadius: `${Math.max(4, tokens.radius - 2)}px`,
                }}
                title="Spara"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => navigator.clipboard.writeText('https://vitejs.dev')}
                className="flex-1 py-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer hover:opacity-80"
                style={{
                  borderColor: tokens.surfaceBorder,
                  color: tokens.textMuted,
                  borderRadius: `${Math.max(4, tokens.radius - 2)}px`,
                }}
                title="Dela länk"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEKTION 1.5: NEOBRUTALIST PRESS-KNAPPAR I ALLA SKALOR (XS ➔ XL) & MINIMAL FÄRGFILOSOFI */}
      <section 
        className="p-5 sm:p-6 rounded-2xl border-2 space-y-6 transition-all"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.shadowMode === 'brutalist' ? tokens.text : tokens.surfaceBorder,
          boxShadow: tokens.shadowMode === 'brutalist' 
            ? `5px 5px 0px 0px ${tokens.text}` 
            : '0 4px 20px -2px rgba(0,0,0,0.06)',
          borderRadius: `${Math.min(tokens.radius, 12)}px`,
        }}
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: tokens.surfaceBorder }}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-7 h-7 rounded flex items-center justify-center border-2 shrink-0 font-bold text-xs"
                style={{
                  backgroundColor: tokens.primary,
                  borderColor: tokens.text,
                  color: tokens.primaryForeground,
                  boxShadow: `2px 2px 0px 0px ${tokens.text}`
                }}
              >
                <Boxes className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-black tracking-tight" style={{ color: tokens.text }}>
                Neobrutalist Press-knapp Laboratorium (Alla Skalor: XS ➔ XL)
              </h3>
            </div>
            <p className="text-xs" style={{ color: tokens.textMuted }}>
              Tydlig taktil 3D-mekanik: knappen trycks ned i underlaget när den klickas, och skuggan kollapsar momentant.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Click Counter Pill */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border-2"
              style={{
                backgroundColor: `${tokens.background}`,
                borderColor: tokens.text,
                color: tokens.text,
                boxShadow: `2px 2px 0px 0px ${tokens.text}`,
                borderRadius: `${neoRadiusChoice}px`
              }}
            >
              <MousePointerClick className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Taktila Klick:</span>
              <span className="font-mono text-xs px-1 rounded bg-black/10 dark:bg-white/10">{neoPressCount}</span>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={() => setNeoSoundActive(!neoSoundActive)}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer hover:opacity-85"
              style={{
                borderColor: tokens.surfaceBorder,
                color: neoSoundActive ? tokens.primary : tokens.textMuted,
                backgroundColor: neoSoundActive ? `${tokens.primary}15` : 'transparent'
              }}
              title={neoSoundActive ? 'Stäng av mekaniskt klickljud' : 'Slå på mekaniskt klickljud'}
            >
              {neoSoundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden sm:inline">{neoSoundActive ? 'Ljud På' : 'Ljud Av'}</span>
            </button>
          </div>
        </div>

        {/* Laboratorie-Kontroller: Välj färg & hörnradie */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border bg-black/5 dark:bg-white/5" style={{ borderColor: tokens.surfaceBorder }}>
          {/* Färgval */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: tokens.text }}>
              Färg på knapp:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'primary', label: 'Primär', bg: tokens.primary, fg: tokens.primaryForeground },
                { id: 'secondary', label: 'Sekundär', bg: tokens.secondary, fg: tokens.secondaryForeground },
                { id: 'accent', label: 'Accent', bg: tokens.accent, fg: tokens.accentForeground },
                { id: 'surface', label: 'Vit/Canvas', bg: '#ffffff', fg: '#000000' },
                { id: 'dark', label: 'Svart Bläck', bg: '#000000', fg: '#ffffff' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setNeoColorChoice(opt.id as any)}
                  className={`px-2 py-1 rounded text-[11px] font-bold border-2 transition-all cursor-pointer ${
                    neoColorChoice === opt.id ? 'scale-105 ring-2 ring-amber-400' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: opt.bg,
                    color: opt.fg,
                    borderColor: '#000000',
                    boxShadow: neoColorChoice === opt.id ? '2px 2px 0px 0px #000' : 'none'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hörnradie */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: tokens.text }}>
              Hörnradie:
            </span>
            <div className="flex items-center gap-1">
              {[
                { val: 0, label: '0px (Skarpt)' },
                { val: 4, label: '4px (Retro)' },
                { val: 9999, label: 'Kapsel (Pill)' },
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => setNeoRadiusChoice(r.val)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                    neoRadiusChoice === r.val ? 'font-bold border-amber-500 bg-amber-500/10' : 'opacity-70'
                  }`}
                  style={{
                    color: tokens.text,
                    borderColor: neoRadiusChoice === r.val ? tokens.text : tokens.surfaceBorder,
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* De 5 Skalorna: XS, SM, MD, LG, XL */}
        {(() => {
          // Beräkna vald bakgrund och textfärg för lab-knapparna
          let btnBg = tokens.primary;
          let btnFg = tokens.primaryForeground;
          if (neoColorChoice === 'secondary') {
            btnBg = tokens.secondary;
            btnFg = tokens.secondaryForeground;
          } else if (neoColorChoice === 'accent') {
            btnBg = tokens.accent;
            btnFg = tokens.accentForeground;
          } else if (neoColorChoice === 'surface') {
            btnBg = '#ffffff';
            btnFg = '#000000';
          } else if (neoColorChoice === 'dark') {
            btnBg = '#000000';
            btnFg = '#ffffff';
          }
          const inkColor = '#000000';

          return (
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: tokens.textMuted }}>
                Prova att klicka och trycka ned knapparna i alla skalor:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* 1. XS (Extra Small) */}
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-dashed text-center" style={{ borderColor: tokens.surfaceBorder }}>
                  <span className="text-[10.5px] font-bold font-mono" style={{ color: tokens.textMuted }}>
                    1. Skala XS
                  </span>
                  <button
                    onClick={playTactileClick}
                    className="font-bold text-[11px] tracking-wide px-3 py-1 border-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer inline-flex items-center gap-1 select-none"
                    style={{
                      backgroundColor: btnBg,
                      color: btnFg,
                      borderColor: inkColor,
                      boxShadow: `2px 2px 0px 0px ${inkColor}`,
                      borderRadius: `${Math.min(neoRadiusChoice, 6)}px`,
                    }}
                  >
                    <span>XS Knapp</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <span className="text-[9.5px] font-mono" style={{ color: tokens.textMuted }}>
                    2px ram • 2px skugga
                  </span>
                </div>

                {/* 2. SM (Small) */}
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-dashed text-center" style={{ borderColor: tokens.surfaceBorder }}>
                  <span className="text-[10.5px] font-bold font-mono" style={{ color: tokens.textMuted }}>
                    2. Skala SM
                  </span>
                  <button
                    onClick={playTactileClick}
                    className="font-bold text-xs tracking-wide px-4 py-1.5 border-2 transition-transform active:translate-x-1 active:translate-y-1 cursor-pointer inline-flex items-center gap-1.5 select-none"
                    style={{
                      backgroundColor: btnBg,
                      color: btnFg,
                      borderColor: inkColor,
                      boxShadow: `3px 3px 0px 0px ${inkColor}`,
                      borderRadius: `${Math.min(neoRadiusChoice, 8)}px`,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SM Knapp</span>
                  </button>
                  <span className="text-[9.5px] font-mono" style={{ color: tokens.textMuted }}>
                    2px ram • 3px skugga
                  </span>
                </div>

                {/* 3. MD (Medium / Standard) */}
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-dashed text-center" style={{ borderColor: tokens.surfaceBorder }}>
                  <span className="text-[10.5px] font-bold font-mono" style={{ color: tokens.textMuted }}>
                    3. Skala MD
                  </span>
                  <button
                    onClick={playTactileClick}
                    className="font-black text-sm tracking-wide px-5 py-2.5 border-2 transition-transform active:translate-x-1 active:translate-y-1 cursor-pointer inline-flex items-center gap-2 select-none"
                    style={{
                      backgroundColor: btnBg,
                      color: btnFg,
                      borderColor: inkColor,
                      boxShadow: `4px 4px 0px 0px ${inkColor}`,
                      borderRadius: `${Math.min(neoRadiusChoice, 10)}px`,
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span>MD Standard</span>
                  </button>
                  <span className="text-[9.5px] font-mono" style={{ color: tokens.textMuted }}>
                    2px ram • 4px skugga
                  </span>
                </div>

                {/* 4. LG (Large / Hero) */}
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-dashed text-center" style={{ borderColor: tokens.surfaceBorder }}>
                  <span className="text-[10.5px] font-bold font-mono" style={{ color: tokens.textMuted }}>
                    4. Skala LG
                  </span>
                  <button
                    onClick={playTactileClick}
                    className="font-black text-base tracking-wide px-6 py-3.5 border-[3px] transition-transform active:translate-x-1.5 active:translate-y-1.5 cursor-pointer inline-flex items-center gap-2 select-none"
                    style={{
                      backgroundColor: btnBg,
                      color: btnFg,
                      borderColor: inkColor,
                      boxShadow: `5px 5px 0px 0px ${inkColor}`,
                      borderRadius: `${Math.min(neoRadiusChoice, 12)}px`,
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    <span>LG Hero CTA</span>
                  </button>
                  <span className="text-[9.5px] font-mono" style={{ color: tokens.textMuted }}>
                    3px ram • 5px skugga
                  </span>
                </div>

                {/* 5. XL (Extra Large / Jumbo) */}
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-dashed text-center" style={{ borderColor: tokens.surfaceBorder }}>
                  <span className="text-[10.5px] font-bold font-mono" style={{ color: tokens.textMuted }}>
                    5. Skala XL
                  </span>
                  <button
                    onClick={playTactileClick}
                    className="font-black text-lg tracking-wider px-8 py-4 border-[3px] transition-transform active:translate-x-2 active:translate-y-2 cursor-pointer inline-flex items-center gap-2.5 select-none"
                    style={{
                      backgroundColor: btnBg,
                      color: btnFg,
                      borderColor: inkColor,
                      boxShadow: `6px 6px 0px 0px ${inkColor}`,
                      borderRadius: `${Math.min(neoRadiusChoice, 14)}px`,
                    }}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                    <span>XL JUMBO</span>
                  </button>
                  <span className="text-[9.5px] font-mono" style={{ color: tokens.textMuted }}>
                    3px ram • 6px skugga
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Guiden: "Hur kan man göra ett helt tema mer i den stilen med kanske bara några få färger ibland?" */}
        <div 
          className="p-4 sm:p-5 rounded-xl border-2 space-y-4"
          style={{
            backgroundColor: `${tokens.background}80`,
            borderColor: tokens.surfaceBorder,
            borderRadius: `${Math.min(tokens.radius, 10)}px`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs sm:text-sm font-black" style={{ color: tokens.text }}>
                Hur gör man ett helt tema i Neobrutalism med bara 2-3 färger?
              </h4>
            </div>
            <button
              onClick={() => setNeoGuideOpen(!neoGuideOpen)}
              className="text-xs font-semibold hover:underline cursor-pointer"
              style={{ color: tokens.primary }}
            >
              {neoGuideOpen ? 'Dölj förklaring' : 'Läs designreglerna'}
            </button>
          </div>

          {neoGuideOpen && (
            <div className="space-y-3 text-xs leading-relaxed" style={{ color: tokens.text }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Regel 1 */}
                <div className="p-3 rounded-lg border bg-black/5 dark:bg-white/5 space-y-1.5" style={{ borderColor: tokens.surfaceBorder }}>
                  <div className="font-bold flex items-center gap-1.5 text-amber-500">
                    <span>1. Få Färger (Max 2-3)</span>
                  </div>
                  <p className="text-[11px] leading-normal" style={{ color: tokens.textMuted }}>
                    I stället för 10 olika gråskalor används ren kontrast: <strong>Canvas</strong> (vit eller pergament), <strong>Svart Bläck</strong> (#000000 för text, ramar och skuggor) och <strong>EN enda stark accentfärg</strong> (t.ex. banangul eller acid lime). Alla knappar och badges får då maximal genomslagskraft.
                  </p>
                </div>

                {/* Regel 2 */}
                <div className="p-3 rounded-lg border bg-black/5 dark:bg-white/5 space-y-1.5" style={{ borderColor: tokens.surfaceBorder }}>
                  <div className="font-bold flex items-center gap-1.5 text-blue-500">
                    <span>2. Hårda 3D-Fallskuggor</span>
                  </div>
                  <p className="text-[11px] leading-normal" style={{ color: tokens.textMuted }}>
                    Inga suddiga blur-skuggor! Använd strikt formel:<br />
                    <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">
                      box-shadow: 4px 4px 0px 0px #000;
                    </code><br />
                    Detta ger den karaktäristiska serietidnings- och arkadestetiken som gör elementen påtagligt taktila.
                  </p>
                </div>

                {/* Regel 3 */}
                <div className="p-3 rounded-lg border bg-black/5 dark:bg-white/5 space-y-1.5" style={{ borderColor: tokens.surfaceBorder }}>
                  <div className="font-bold flex items-center gap-1.5 text-emerald-500">
                    <span>3. Den Mekaniska Pressen</span>
                  </div>
                  <p className="text-[11px] leading-normal" style={{ color: tokens.textMuted }}>
                    Vid CSS <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">:active</code> flyttas knappen ned:<br />
                    <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">
                      translate(4px, 4px); box-shadow: 0;
                    </code><br />
                    Elementet &quot;trycks ner&quot; i bakgrunden precis som en fysisk cherry-switch eller arkadknapp.
                  </p>
                </div>
              </div>

              {/* Snabb-Tillämpning: Aktivera direkt på temat */}
              {onNeobrutalize && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t" style={{ borderColor: tokens.surfaceBorder }}>
                  <span className="text-xs font-bold" style={{ color: tokens.text }}>
                    Vill du testa detta tema direkt i hela appen?
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onNeobrutalize('preserve')}
                      className="px-3 py-1.5 rounded text-xs font-bold border-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                      style={{
                        backgroundColor: tokens.primary,
                        borderColor: '#000000',
                        color: tokens.primaryForeground,
                        boxShadow: '2px 2px 0px 0px #000000',
                        borderRadius: '4px'
                      }}
                      title="Konvertera nuvarande palett till Neobrutalism med solida 2px ramar och 3D-skuggor"
                    >
                      ⚡ Neobrutalisera Mitt Tema
                    </button>

                    <button
                      onClick={() => onNeobrutalize('minimal-canary')}
                      className="px-2.5 py-1.5 rounded text-xs font-bold border-2 transition-transform active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: '#facc15',
                        borderColor: '#000000',
                        color: '#000000',
                        boxShadow: '2px 2px 0px 0px #000000',
                        borderRadius: '4px'
                      }}
                      title="Minimalistisk 3-färgspalett: Varm pergament, Svart bläck, Kanariegul"
                    >
                      🍋 Kanariegul (3)
                    </button>

                    <button
                      onClick={() => onNeobrutalize('minimal-lime')}
                      className="px-2.5 py-1.5 rounded text-xs font-bold border-2 transition-transform active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: '#ccff00',
                        borderColor: '#000000',
                        color: '#000000',
                        boxShadow: '2px 2px 0px 0px #000000',
                        borderRadius: '2px'
                      }}
                      title="Minimalistisk 3-färgspalett: Vit, Svart bläck, Cyber Acid Lime"
                    >
                      🧪 Acid Lime (3)
                    </button>

                    <button
                      onClick={() => onNeobrutalize('minimal-bubblegum')}
                      className="px-2.5 py-1.5 rounded text-xs font-bold border-2 transition-transform active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: '#f43f5e',
                        borderColor: '#111111',
                        color: '#ffffff',
                        boxShadow: '2px 2px 0px 0px #111111',
                        borderRadius: '4px'
                      }}
                      title="Minimalistisk 3-färgspalett: Sockervadd, Kolsvart bläck, Chockrosa"
                    >
                      🍬 Bubblegum (3)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SEKTION 2: WEBB-APP GADGETS & FORM-ELEMENT */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2" style={{ color: tokens.text }}>
            <Sliders className="w-4 h-4" style={{ color: tokens.accent }} />
            2. Moderna Webb-App Gadgets & Kontroller
          </h3>
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            Sökfält med anpassad fokusring, interaktiva sliders, switchar, tabbar och statuspuffar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Gadget 1: Sökfält med dynamisk fokusring */}
          <div 
            className="p-5 rounded-2xl border space-y-3"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${tokens.radius}px`,
              borderWidth: `${tokens.borderWidth}px`,
              ...getShadowStyle('card'),
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: tokens.text }}>
                Sök & Inputfält
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: tokens.surfaceBorder, color: tokens.textMuted }}>
                ring: {tokens.ring}
              </span>
            </div>
            <div className="relative">
              <Search 
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" 
                style={{ color: tokens.textMuted }} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-8 py-2.5 rounded-lg border transition-all focus:outline-none"
                style={{
                  backgroundColor: tokens.background,
                  borderColor: tokens.surfaceBorder,
                  color: tokens.text,
                  borderRadius: `${tokens.radius}px`,
                }}
                placeholder="Sök moduler..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs p-0.5 rounded cursor-pointer"
                  style={{ color: tokens.textMuted }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: tokens.textMuted }}>
              <span>Populärt:</span>
              <span 
                className="cursor-pointer hover:underline" 
                style={{ color: tokens.primary }}
                onClick={() => setSearchQuery('Tailwind v4')}
              >
                Tailwind v4
              </span>
              <span>·</span>
              <span 
                className="cursor-pointer hover:underline" 
                style={{ color: tokens.secondary }}
                onClick={() => setSearchQuery('Next.js 15')}
              >
                Next.js 15
              </span>
            </div>
          </div>

          {/* Gadget 2: Segmented Control & Switch */}
          <div 
            className="p-5 rounded-2xl border space-y-3"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${tokens.radius}px`,
              borderWidth: `${tokens.borderWidth}px`,
              ...getShadowStyle('card'),
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: tokens.text }}>
                Segmenterade Tabbar & Switch
              </span>
              <span className="text-[10px]" style={{ color: tokens.accent }}>
                Aktiv: {segmentedTab}
              </span>
            </div>

            {/* Segmented control */}
            <div 
              className="flex p-1 rounded-xl border gap-1"
              style={{
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${tokens.radius}px`,
              }}
            >
              {(['daily', 'weekly', 'monthly'] as const).map((tab) => {
                const isActive = segmentedTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSegmentedTab(tab)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer"
                    style={{
                      backgroundColor: isActive ? tokens.primary : 'transparent',
                      color: isActive ? tokens.primaryForeground : tokens.textMuted,
                      borderRadius: `${Math.max(4, tokens.radius - 3)}px`,
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : undefined,
                    }}
                  >
                    {tab === 'daily' ? 'Dag' : tab === 'weekly' ? 'Vecka' : 'Månad'}
                  </button>
                );
              })}
            </div>

            {/* Modern switch */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-xs font-medium" style={{ color: tokens.text }}>
                  Realtidssynkning
                </div>
                <div className="text-[10px]" style={{ color: tokens.textMuted }}>
                  Uppdatera komponenter direkt
                </div>
              </div>
              <button
                onClick={() => setToggleState(!toggleState)}
                className="w-11 h-6 rounded-full p-1 transition-colors cursor-pointer relative"
                style={{
                  backgroundColor: toggleState ? tokens.primary : `${tokens.surfaceBorder}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white transition-transform shadow-xs"
                  style={{
                    transform: toggleState ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Gadget 3: Interactive Slider & Range Bar */}
          <div 
            className="p-5 rounded-2xl border space-y-3"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${tokens.radius}px`,
              borderWidth: `${tokens.borderWidth}px`,
              ...getShadowStyle('card'),
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: tokens.text }}>
                Interaktiv Slider Bar
              </span>
              <span 
                className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${tokens.primary}20`,
                  color: tokens.primary,
                  borderRadius: `${Math.max(4, tokens.radius - 4)}px`,
                }}
              >
                {sliderVal}%
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: tokens.primary,
                  backgroundColor: `${tokens.primary}30`,
                }}
              />
              <div className="flex justify-between text-[10px]" style={{ color: tokens.textMuted }}>
                <span>0% Låg</span>
                <span>50% Balans</span>
                <span>100% Max</span>
              </div>
            </div>

            {/* Micro Counter Gadget */}
            <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: tokens.surfaceBorder }}>
              <span className="text-[11px]" style={{ color: tokens.textMuted }}>
                Volymsteg:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSliderVal(v => Math.max(0, v - 5))}
                  className="p-1 rounded border hover:opacity-80 cursor-pointer"
                  style={{ borderColor: tokens.surfaceBorder, color: tokens.text }}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setSliderVal(v => Math.min(100, v + 5))}
                  className="p-1 rounded border hover:opacity-80 cursor-pointer"
                  style={{ borderColor: tokens.surfaceBorder, color: tokens.text }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEKTION 3: INTERAKTIV TOAST & STATUS-NOTIFIKATION */}
      {toastVisible && (
        <div 
          className="p-4 rounded-xl border flex items-center justify-between gap-4 transition-all"
          style={{
            backgroundColor: tokens.surface,
            borderColor: tokens.accent,
            borderRadius: `${tokens.radius}px`,
            borderWidth: `${tokens.borderWidth}px`,
            boxShadow: `0 8px 24px -4px ${tokens.glow}40`,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${tokens.accent}25`,
                color: tokens.accent,
              }}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold" style={{ color: tokens.text }}>
                Temat är synkat med din preview!
              </div>
              <div className="text-[11px]" style={{ color: tokens.textMuted }}>
                Alla tokens renderas i realtid utan omkompilering. Klicka &quot;Exportera till Agent&quot; för färdiga regler.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setToastVisible(false)}
              className="p-1.5 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
              style={{ color: tokens.textMuted }}
              title="Stäng toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
