import React from 'react';
import { 
  ThemeTokens 
} from '../types/theme';
import { 
  ArrowRight, 
  Sparkles, 
  Check, 
  Zap, 
  Shield, 
  Star, 
  Code2, 
  Layers, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface LandingPagePreviewProps {
  tokens: ThemeTokens;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ tokens }) => {
  return (
    <div 
      className="p-6 md:p-10 rounded-2xl min-h-full space-y-12 transition-colors duration-200"
      style={{
        backgroundColor: tokens.background,
        color: tokens.text,
      }}
    >
      {/* Mini Mock Navigation */}
      <nav 
        className="flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-md"
        style={{
          backgroundColor: `${tokens.surface}e0`,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius}px`,
          borderWidth: `${tokens.borderWidth}px`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.primaryForeground,
            }}
          >
            ▲
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: tokens.text }}>
            VortexFlow
          </span>
        </div>

        {/* Clean Typographic Nav Links (Zero-pill discipline) */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium" style={{ color: tokens.textMuted }}>
          <span className="cursor-pointer hover:opacity-100 transition-opacity" style={{ color: tokens.text }}>Funktioner</span>
          <span className="cursor-pointer hover:opacity-100 transition-opacity">Arkitektur</span>
          <span className="cursor-pointer hover:opacity-100 transition-opacity">Priser</span>
          <span className="cursor-pointer hover:opacity-100 transition-opacity">Dokumentation</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border"
            style={{
              backgroundColor: 'transparent',
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${tokens.radius}px`,
            }}
          >
            Logga in
          </button>
          <button 
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all hover:opacity-90 shadow-sm"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.primaryForeground,
              borderRadius: `${tokens.radius}px`,
            }}
          >
            Starta Nu
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        {/* Announcement Kicker (No Pill Sandwich, clean typography with subtle dot) */}
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border"
          style={{
            backgroundColor: `${tokens.surface}`,
            borderColor: tokens.surfaceBorder,
            color: tokens.textMuted,
          }}
        >
          <span 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: tokens.accent }} 
          />
          <span>Next.js 15 & Vite 8 Stöd Lanserat</span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]" style={{ color: tokens.text }}>
          Bygg blixtsnabba gränssnitt med{' '}
          <span 
            className="underline decoration-wavy decoration-2"
            style={{ 
              color: tokens.primary,
              textDecorationColor: tokens.accent,
            }}
          >
            perfekt färgbalans
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: tokens.textMuted }}>
          Ett genomtänkt designsystem med semantiska färgregler, WCAG AA-kontroll och automatisk export direkt till dina favorit-AI-agenter.
        </p>

        {/* CTA Button Duo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-95 shadow-md cursor-pointer"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.primaryForeground,
              borderRadius: `${tokens.radius}px`,
              boxShadow: tokens.shadowMode === 'glow' ? `0 0 25px ${tokens.glow}70` : undefined,
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Skapa ditt projekt gratis</span>
          </button>

          <button
            className="w-full sm:w-auto px-5 py-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-85 border cursor-pointer"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${tokens.radius}px`,
              borderWidth: `${tokens.borderWidth}px`,
            }}
          >
            <Code2 className="w-4 h-4" style={{ color: tokens.secondary }} />
            <span>Kopiera CLI Kommando</span>
          </button>
        </div>

        {/* Social Proof (Avatars & Rating) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs" style={{ color: tokens.textMuted }}>
          <div className="flex -space-x-2">
            {['#38bdf8', '#818cf8', '#f43f5e', '#10b981'].map((c, i) => (
              <div 
                key={i} 
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                style={{ backgroundColor: c, borderColor: tokens.background }}
              >
                {['JD', 'AL', 'EK', 'MN'][i]}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex" style={{ color: tokens.accent }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-semibold" style={{ color: tokens.text }}>4.9/5</span>
            <span>från 3,200+ utvecklare</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-4 pt-4">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tokens.secondary }}>
            Arkitektur & Verktyg
          </span>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: tokens.text }}>
            Varför utvecklare älskar färgreglerna
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Zap,
              color: tokens.primary,
              title: 'Realtidstuning med HSL',
              desc: 'Justera mättnad, värme och ljusstyrka direkt. Se hur knapparna svarar utan omladdning.',
              stat: '0ms latens',
            },
            {
              icon: Shield,
              color: tokens.secondary,
              title: 'WCAG AA Kontrastvakt',
              desc: 'Algoritmen säkerställer automatiskt att text mot bakgrund och primärknappar alltid är läsbara.',
              stat: '4.5:1 ratio',
            },
            {
              icon: Layers,
              color: tokens.accent,
              title: 'Tailwind v4 @theme redo',
              desc: 'Genererar standardiserade CSS-variabler och @theme-direktiv redo att klistras in i din app.',
              stat: '1-klick export',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="space-y-3">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
                  style={{
                    backgroundColor: `${feat.color}20`,
                    color: feat.color,
                  }}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold" style={{ color: tokens.text }}>
                  {feat.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: tokens.textMuted }}>
                  {feat.desc}
                </p>
              </div>

              <div 
                className="pt-3 border-t text-[11px] font-mono font-semibold flex items-center justify-between"
                style={{ borderColor: tokens.surfaceBorder, color: tokens.textMuted }}
              >
                <span>Mått:</span>
                <span style={{ color: feat.color }}>{feat.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser Card */}
      <section 
        className="p-6 md:p-8 rounded-2xl border max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.accent,
          borderRadius: `${tokens.radius}px`,
          borderWidth: `${tokens.borderWidth}px`,
          boxShadow: tokens.shadowMode === 'glow' ? `0 0 30px ${tokens.glow}40` : undefined,
        }}
      >
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${tokens.accent}25`,
              color: tokens.accent,
            }}
          >
            <Sparkles className="w-3 h-3" />
            Mest Populär
          </div>
          <h3 className="text-lg font-bold" style={{ color: tokens.text }}>
            Design System Pro
          </h3>
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            Fullständiga token-bibliotek, obegränsade färgreglar och AI-prompt presets.
          </p>
        </div>

        <div className="text-center sm:text-right shrink-0 space-y-2">
          <div className="text-2xl font-black" style={{ color: tokens.text }}>
            199 kr<span className="text-xs font-normal" style={{ color: tokens.textMuted }}> /mån</span>
          </div>
          <button
            className="px-4 py-2 font-bold text-xs rounded-lg transition-all hover:opacity-90 shadow-sm cursor-pointer"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.primaryForeground,
              borderRadius: `${tokens.radius}px`,
            }}
          >
            Välj Plan
          </button>
        </div>
      </section>
    </div>
  );
};
