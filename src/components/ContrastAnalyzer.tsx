import React from 'react';
import { 
  ThemeTokens 
} from '../types/theme';
import { 
  getContrastRatio, 
  getOptimalTextColor 
} from '../utils/colorUtils';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wand2, 
  Sparkles,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface ContrastAnalyzerProps {
  tokens: ThemeTokens;
  onChangeTokens: (tokens: ThemeTokens) => void;
}

export const ContrastAnalyzer: React.FC<ContrastAnalyzerProps> = ({
  tokens,
  onChangeTokens,
}) => {
  const contrastPairs = [
    {
      label: 'Huvudtext på Bakgrund',
      desc: 'Brödtext, rubriker och primär läsning mot sidans canvas.',
      fg: tokens.text,
      bg: tokens.background,
      fgKey: 'text' as const,
      bgKey: 'background' as const,
      isText: true,
    },
    {
      label: 'Kort-text på Surface',
      desc: 'Text och data inuti modaler, kort och paneler.',
      fg: tokens.surfaceForeground,
      bg: tokens.surface,
      fgKey: 'surfaceForeground' as const,
      bgKey: 'surface' as const,
      isText: true,
    },
    {
      label: 'Knapptext på Primary',
      desc: 'Text och ikoner inuti primära knappar (call to actions).',
      fg: tokens.primaryForeground,
      bg: tokens.primary,
      fgKey: 'primaryForeground' as const,
      bgKey: 'primary' as const,
      isButton: true,
    },
    {
      label: 'Knapptext på Secondary',
      desc: 'Sekundära knappar och navigationsmarkörer.',
      fg: tokens.secondaryForeground,
      bg: tokens.secondary,
      fgKey: 'secondaryForeground' as const,
      bgKey: 'secondary' as const,
      isButton: true,
    },
    {
      label: 'Accent-text på Accent',
      desc: 'Badges, kampanjknappar och uppmärksamhetsytor.',
      fg: tokens.accentForeground,
      bg: tokens.accent,
      fgKey: 'accentForeground' as const,
      bgKey: 'accent' as const,
      isButton: true,
    },
    {
      label: 'Dämpad text på Kort (Muted)',
      desc: 'Sekundär metadata, datum, bildtexter och hjälptexter.',
      fg: tokens.textMuted,
      bg: tokens.surface,
      fgKey: 'textMuted' as const,
      bgKey: 'surface' as const,
      isText: true,
      relaxedThreshold: true,
    },
  ];

  const handleFixPair = (fgKey: keyof ThemeTokens, bgKey: keyof ThemeTokens) => {
    const bgVal = tokens[bgKey] as string;
    const optimalFg = getOptimalTextColor(bgVal);
    onChangeTokens({
      ...tokens,
      [fgKey]: optimalFg,
    });
  };

  return (
    <div 
      className="p-6 md:p-8 rounded-2xl min-h-full space-y-7 transition-colors duration-200"
      style={{
        backgroundColor: tokens.background,
        color: tokens.text,
      }}
    >
      <div 
        className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius}px`,
          borderWidth: `${tokens.borderWidth}px`,
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" style={{ color: tokens.primary }} />
            <h2 className="text-base font-bold" style={{ color: tokens.text }}>
              WCAG 2.1 Tillgänglighets- & Kontrollanalys
            </h2>
          </div>
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            Kräver minst 4.5:1 för standard brödtext (WCAG AA) och 3.0:1 för stor text/knappar.
          </p>
        </div>

        <button
          onClick={() => {
            onChangeTokens({
              ...tokens,
              primaryForeground: getOptimalTextColor(tokens.primary),
              secondaryForeground: getOptimalTextColor(tokens.secondary),
              accentForeground: getOptimalTextColor(tokens.accent),
              surfaceForeground: getOptimalTextColor(tokens.surface),
              text: getOptimalTextColor(tokens.background),
            });
          }}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm cursor-pointer"
          style={{
            backgroundColor: tokens.primary,
            color: tokens.primaryForeground,
            borderRadius: `${tokens.radius}px`,
          }}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Optimera alla kontraster till WCAG AA</span>
        </button>
      </div>

      {/* Grid of Contrast Pairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contrastPairs.map((pair, idx) => {
          const ratio = getContrastRatio(pair.fg, pair.bg);
          const minRatio = pair.relaxedThreshold ? 3.0 : 4.5;
          const passesAA = ratio >= minRatio;
          const passesAAA = ratio >= 7.0;

          return (
            <div
              key={idx}
              className="p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: tokens.text }}>
                    {pair.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {passesAAA ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        AAA ({ratio}:1)
                      </span>
                    ) : passesAA ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        AA ({ratio}:1)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        Underkänd ({ratio}:1)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: tokens.textMuted }}>
                  {pair.desc}
                </p>

                {/* Live Preview Sample */}
                <div 
                  className="p-3.5 rounded-lg border flex items-center justify-between shadow-xs"
                  style={{
                    backgroundColor: pair.bg,
                    color: pair.fg,
                    borderColor: tokens.surfaceBorder,
                    borderRadius: `${tokens.radius}px`,
                  }}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold">Granska läsbarhet</div>
                    <div className="text-[11px] opacity-90">Snabb brun räv hoppar över lat hund</div>
                  </div>
                  <div className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-current opacity-70">
                    {pair.fg}
                  </div>
                </div>
              </div>

              {/* Action fix if failing */}
              <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: tokens.surfaceBorder }}>
                <span className="text-[11px] font-mono" style={{ color: tokens.textMuted }}>
                  Krav: ≥ {minRatio}:1
                </span>
                {!passesAA ? (
                  <button
                    onClick={() => handleFixPair(pair.fgKey, pair.bgKey)}
                    className="text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                    style={{
                      backgroundColor: `${tokens.primary}20`,
                      color: tokens.primary,
                    }}
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Fixa färg</span>
                  </button>
                ) : (
                  <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Godkänd
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
