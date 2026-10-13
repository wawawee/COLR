import React, { useState } from 'react';
import { ThemeTokens } from '../types/theme';
import { getDescriptiveColorName } from '../utils/colorNames';
import { 
  ArrowRight, 
  Sparkles, 
  Send, 
  ExternalLink, 
  Check, 
  X, 
  AlertCircle, 
  ChevronRight, 
  Mail, 
  Lock, 
  Sliders, 
  Layers, 
  ToggleRight, 
  MousePointer,
  HelpCircle,
  Copy
} from 'lucide-react';

interface ComponentGeneratorProps {
  tokens: ThemeTokens;
}

export const ComponentGenerator: React.FC<ComponentGeneratorProps> = ({ tokens }) => {
  const [activeTab, setActiveTab] = useState<'buttons' | 'forms' | 'cards'>('buttons');
  const [testInputVal, setTestInputVal] = useState<string>('kontakt@mittforetag.se');
  const [testCheckbox, setTestCheckbox] = useState<boolean>(true);
  const [testRadio, setTestRadio] = useState<'a' | 'b'>('a');
  const [testToggle, setTestToggle] = useState<boolean>(true);
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const copySnippet = (name: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedState(name);
    setTimeout(() => setCopiedState(null), 1500);
  };

  return (
    <div 
      className="p-6 md:p-8 space-y-8 rounded-2xl min-h-full transition-colors duration-200"
      style={{
        backgroundColor: tokens.background,
        color: tokens.text,
      }}
    >
      {/* Header Banner */}
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
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${tokens.primary}20`,
                color: tokens.primary,
                borderRadius: `${Math.max(4, tokens.radius - 4)}px`,
              }}
            >
              Komponent- & Knappgenerator
            </span>
            <span style={{ color: tokens.textMuted }} className="text-xs">
              Alla tillstånd (Normal, Hover, Aktiv, Inaktiv)
            </span>
          </div>
          <h2 className="text-lg font-bold" style={{ color: tokens.text }}>
            Inspektera UI-komponenter i alla deras interaktiva tillstånd
          </h2>
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            Se exakt hur primära, sekundära, text- och länkknappar samt formulärfält svarar på användarinteraktioner.
          </p>
        </div>

        {/* Section Tabs */}
        <div 
          className="flex p-1 rounded-xl border gap-1 w-full sm:w-auto"
          style={{
            backgroundColor: tokens.background,
            borderColor: tokens.surfaceBorder,
            borderRadius: `${tokens.radius}px`,
          }}
        >
          {[
            { id: 'buttons', label: 'Knapptillstånd' },
            { id: 'forms', label: 'Formulärfält' },
            { id: 'cards', label: 'Kort & Ytor' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              style={{
                backgroundColor: activeTab === tab.id ? tokens.primary : 'transparent',
                color: activeTab === tab.id ? tokens.primaryForeground : tokens.textMuted,
                borderRadius: `${Math.max(4, tokens.radius - 3)}px`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: BUTTONS IN ALL STATES */}
      {activeTab === 'buttons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2" style={{ color: tokens.text }}>
              <MousePointer className="w-4 h-4" style={{ color: tokens.primary }} />
              Knappvariationer & Tillståndsmatris (States)
            </h3>
            <span className="text-xs" style={{ color: tokens.textMuted }}>
              Hörnradie: {tokens.radius}px
            </span>
          </div>

          {/* Detailed State Grid */}
          <div 
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${tokens.radius}px`,
              borderWidth: `${tokens.borderWidth}px`,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: tokens.surfaceBorder, backgroundColor: `${tokens.background}60` }}>
                    <th className="p-3.5 font-bold" style={{ color: tokens.text }}>Knapptyp</th>
                    <th className="p-3.5 font-bold" style={{ color: tokens.text }}>1. Normal (Default)</th>
                    <th className="p-3.5 font-bold" style={{ color: tokens.text }}>2. Hover (Mus över)</th>
                    <th className="p-3.5 font-bold" style={{ color: tokens.text }}>3. Aktiv (Nedtryckt)</th>
                    <th className="p-3.5 font-bold" style={{ color: tokens.text }}>4. Inaktiv (Disabled)</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: tokens.surfaceBorder }}>
                  
                  {/* ROW 1: PRIMARY BUTTON */}
                  <tr className="hover:opacity-95 transition-opacity">
                    <td className="p-3.5 font-semibold align-middle" style={{ color: tokens.text }}>
                      <div>Primärknapp</div>
                      <div className="text-[10px]" style={{ color: tokens.textMuted }}>
                        bg: {tokens.primary}
                      </div>
                    </td>

                    {/* Normal */}
                    <td className="p-3.5 align-middle">
                      <button
                        className="px-4 py-2 font-semibold text-xs rounded-lg transition-all shadow-sm"
                        style={{
                          backgroundColor: tokens.primary,
                          color: tokens.primaryForeground,
                          borderRadius: `${tokens.radius}px`,
                        }}
                      >
                        Spara Ändringar
                      </button>
                    </td>

                    {/* Hover */}
                    <td className="p-3.5 align-middle">
                      <div className="relative group inline-block">
                        <button
                          className="px-4 py-2 font-semibold text-xs rounded-lg shadow-md scale-102 opacity-90"
                          style={{
                            backgroundColor: tokens.primary,
                            color: tokens.primaryForeground,
                            borderRadius: `${tokens.radius}px`,
                            boxShadow: `0 4px 12px ${tokens.glow}50`,
                          }}
                        >
                          Spara Ändringar
                        </button>
                        <span className="block text-[10px] mt-1 font-mono" style={{ color: tokens.textMuted }}>
                          opacity: 90%, lyft
                        </span>
                      </div>
                    </td>

                    {/* Active */}
                    <td className="p-3.5 align-middle">
                      <div>
                        <button
                          className="px-4 py-2 font-semibold text-xs rounded-lg scale-95 opacity-95"
                          style={{
                            backgroundColor: tokens.primary,
                            color: tokens.primaryForeground,
                            borderRadius: `${tokens.radius}px`,
                          }}
                        >
                          Spara Ändringar
                        </button>
                        <span className="block text-[10px] mt-1 font-mono" style={{ color: tokens.textMuted }}>
                          scale: 95%, klick
                        </span>
                      </div>
                    </td>

                    {/* Disabled */}
                    <td className="p-3.5 align-middle">
                      <button
                        disabled
                        className="px-4 py-2 font-semibold text-xs rounded-lg opacity-40 cursor-not-allowed"
                        style={{
                          backgroundColor: tokens.primary,
                          color: tokens.primaryForeground,
                          borderRadius: `${tokens.radius}px`,
                        }}
                      >
                        Spara Ändringar
                      </button>
                    </td>
                  </tr>

                  {/* ROW 2: SECONDARY BUTTON */}
                  <tr className="hover:opacity-95 transition-opacity">
                    <td className="p-3.5 font-semibold align-middle" style={{ color: tokens.text }}>
                      <div>Sekundärknapp</div>
                      <div className="text-[10px]" style={{ color: tokens.textMuted }}>
                        border: {tokens.secondary}
                      </div>
                    </td>

                    {/* Normal */}
                    <td className="p-3.5 align-middle">
                      <button
                        className="px-4 py-2 font-semibold text-xs rounded-lg border transition-all"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: tokens.secondary,
                          color: tokens.secondary,
                          borderRadius: `${tokens.radius}px`,
                          borderWidth: `${tokens.borderWidth}px`,
                        }}
                      >
                        Avbryt Åtgärd
                      </button>
                    </td>

                    {/* Hover */}
                    <td className="p-3.5 align-middle">
                      <div>
                        <button
                          className="px-4 py-2 font-semibold text-xs rounded-lg border"
                          style={{
                            backgroundColor: `${tokens.secondary}15`,
                            borderColor: tokens.secondary,
                            color: tokens.secondary,
                            borderRadius: `${tokens.radius}px`,
                            borderWidth: `${tokens.borderWidth}px`,
                          }}
                        >
                          Avbryt Åtgärd
                        </button>
                        <span className="block text-[10px] mt-1 font-mono" style={{ color: tokens.textMuted }}>
                          tint: 15% bakgrund
                        </span>
                      </div>
                    </td>

                    {/* Active */}
                    <td className="p-3.5 align-middle">
                      <div>
                        <button
                          className="px-4 py-2 font-semibold text-xs rounded-lg border scale-95"
                          style={{
                            backgroundColor: `${tokens.secondary}30`,
                            borderColor: tokens.secondary,
                            color: tokens.secondary,
                            borderRadius: `${tokens.radius}px`,
                            borderWidth: `${tokens.borderWidth}px`,
                          }}
                        >
                          Avbryt Åtgärd
                        </button>
                        <span className="block text-[10px] mt-1 font-mono" style={{ color: tokens.textMuted }}>
                          tint: 30%, scale 95%
                        </span>
                      </div>
                    </td>

                    {/* Disabled */}
                    <td className="p-3.5 align-middle">
                      <button
                        disabled
                        className="px-4 py-2 font-semibold text-xs rounded-lg border opacity-35 cursor-not-allowed"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: tokens.secondary,
                          color: tokens.secondary,
                          borderRadius: `${tokens.radius}px`,
                          borderWidth: `${tokens.borderWidth}px`,
                        }}
                      >
                        Avbryt Åtgärd
                      </button>
                    </td>
                  </tr>

                  {/* ROW 3: TEXT BUTTON (GHOST) */}
                  <tr className="hover:opacity-95 transition-opacity">
                    <td className="p-3.5 font-semibold align-middle" style={{ color: tokens.text }}>
                      <div>Textknapp (Ghost)</div>
                      <div className="text-[10px]" style={{ color: tokens.textMuted }}>
                        Diskret, ingen fast ram
                      </div>
                    </td>

                    {/* Normal */}
                    <td className="p-3.5 align-middle">
                      <button
                        className="px-3 py-2 font-medium text-xs rounded-lg transition-all"
                        style={{
                          backgroundColor: 'transparent',
                          color: tokens.text,
                          borderRadius: `${tokens.radius}px`,
                        }}
                      >
                        Mer Information
                      </button>
                    </td>

                    {/* Hover */}
                    <td className="p-3.5 align-middle">
                      <div>
                        <button
                          className="px-3 py-2 font-medium text-xs rounded-lg"
                          style={{
                            backgroundColor: `${tokens.text}12`,
                            color: tokens.text,
                            borderRadius: `${tokens.radius}px`,
                          }}
                        >
                          Mer Information
                        </button>
                        <span className="block text-[10px] mt-1 font-mono" style={{ color: tokens.textMuted }}>
                          subtil text-hover
                        </span>
                      </div>
                    </td>

                    {/* Active */}
                    <td className="p-3.5 align-middle">
                      <div>
                        <button
                          className="px-3 py-2 font-medium text-xs rounded-lg scale-95"
                          style={{
                            backgroundColor: `${tokens.text}20`,
                            color: tokens.text,
                            borderRadius: `${tokens.radius}px`,
                          }}
                        >
                          Mer Information
                        </button>
                        <span className="block text-[10px] mt-1 font-mono" style={{ color: tokens.textMuted }}>
                          nedtryckt
                        </span>
                      </div>
                    </td>

                    {/* Disabled */}
                    <td className="p-3.5 align-middle">
                      <button
                        disabled
                        className="px-3 py-2 font-medium text-xs rounded-lg opacity-35 cursor-not-allowed"
                        style={{
                          backgroundColor: 'transparent',
                          color: tokens.textMuted,
                          borderRadius: `${tokens.radius}px`,
                        }}
                      >
                        Mer Information
                      </button>
                    </td>
                  </tr>

                  {/* ROW 4: LINK BUTTON */}
                  <tr className="hover:opacity-95 transition-opacity">
                    <td className="p-3.5 font-semibold align-middle" style={{ color: tokens.text }}>
                      <div>Länkknapp</div>
                      <div className="text-[10px]" style={{ color: tokens.textMuted }}>
                        Inline textlänk med färg
                      </div>
                    </td>

                    {/* Normal */}
                    <td className="p-3.5 align-middle">
                      <a
                        href="#test"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex items-center gap-1 font-semibold text-xs"
                        style={{ color: tokens.primary }}
                      >
                        <span>Dokumentation</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                    {/* Hover */}
                    <td className="p-3.5 align-middle">
                      <div>
                        <a
                          href="#test"
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex items-center gap-1 font-semibold text-xs underline underline-offset-4"
                          style={{ color: tokens.primary }}
                        >
                          <span>Dokumentation</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="block text-[10px] mt-1 font-mono" style={{ color: tokens.textMuted }}>
                          underline-offset
                        </span>
                      </div>
                    </td>

                    {/* Active */}
                    <td className="p-3.5 align-middle">
                      <div>
                        <a
                          href="#test"
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex items-center gap-1 font-semibold text-xs underline opacity-75"
                          style={{ color: tokens.secondary }}
                        >
                          <span>Dokumentation</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="block text-[10px] mt-1 font-mono" style={{ color: tokens.textMuted }}>
                          sekundär ton klick
                        </span>
                      </div>
                    </td>

                    {/* Disabled */}
                    <td className="p-3.5 align-middle">
                      <span
                        className="inline-flex items-center gap-1 font-semibold text-xs opacity-35 cursor-not-allowed"
                        style={{ color: tokens.textMuted }}
                      >
                        <span>Dokumentation</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* Button Sizes & Icon Placement Showcase */}
          <div 
            className="p-5 rounded-2xl border space-y-4"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${tokens.radius}px`,
              borderWidth: `${tokens.borderWidth}px`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: tokens.text }}>
                Storlekar & Ikonplacering
              </span>
              <span className="text-[11px]" style={{ color: tokens.textMuted }}>
                Small · Medium · Large
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Small */}
              <button
                className="px-3 py-1.5 text-[11px] font-semibold rounded flex items-center gap-1.5 shadow-xs transition-all hover:opacity-90"
                style={{
                  backgroundColor: tokens.primary,
                  color: tokens.primaryForeground,
                  borderRadius: `${Math.max(3, tokens.radius - 4)}px`,
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>Liten (Small)</span>
              </button>

              {/* Medium */}
              <button
                className="px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-all hover:opacity-90"
                style={{
                  backgroundColor: tokens.primary,
                  color: tokens.primaryForeground,
                  borderRadius: `${tokens.radius}px`,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Medium Standard</span>
              </button>

              {/* Large */}
              <button
                className="px-6 py-3 text-sm font-bold rounded-xl flex items-center gap-2.5 shadow-sm transition-all hover:opacity-90"
                style={{
                  backgroundColor: tokens.primary,
                  color: tokens.primaryForeground,
                  borderRadius: `${tokens.radius + 4}px`,
                }}
              >
                <span>Stor (Large Action)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Pill Variant */}
              <button
                className="px-5 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 border transition-all"
                style={{
                  borderColor: tokens.secondary,
                  color: tokens.secondary,
                  backgroundColor: `${tokens.secondary}10`,
                }}
              >
                <span>Pill Radie (9999px)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FORM CONTROLS IN MULTIPLE STATES */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2" style={{ color: tokens.text }}>
              <Layers className="w-4 h-4" style={{ color: tokens.secondary }} />
              Formulärfält i olika tillstånd (Input States)
            </h3>
            <span className="text-xs" style={{ color: tokens.textMuted }}>
              Fokusring: {tokens.ring}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Normal State Input */}
            <div 
              className="p-5 rounded-xl border space-y-2"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold" style={{ color: tokens.text }}>
                  1. Normal / Redigerbart Fält
                </label>
                <span className="text-[10px] font-mono" style={{ color: tokens.textMuted }}>
                  Default
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tokens.textMuted }} />
                <input
                  type="email"
                  value={testInputVal}
                  onChange={(e) => setTestInputVal(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border transition-all focus:outline-none"
                  style={{
                    backgroundColor: tokens.background,
                    borderColor: tokens.surfaceBorder,
                    color: tokens.text,
                    borderRadius: `${tokens.radius}px`,
                  }}
                />
              </div>
              <p className="text-[11px]" style={{ color: tokens.textMuted }}>
                Fältet använder webbplatsens bakgrundsfärg som canvas.
              </p>
            </div>

            {/* 2. Focused State (Simulated Focus Ring) */}
            <div 
              className="p-5 rounded-xl border space-y-2"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold" style={{ color: tokens.text }}>
                  2. Fokuserat Tillstånd (Focused State)
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${tokens.ring}20`, color: tokens.ring }}>
                  focus-visible
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tokens.primary }} />
                <input
                  type="text"
                  defaultValue="Lösenord ••••••••"
                  readOnly
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border transition-all"
                  style={{
                    backgroundColor: tokens.background,
                    borderColor: tokens.ring,
                    color: tokens.text,
                    borderRadius: `${tokens.radius}px`,
                    boxShadow: `0 0 0 3px ${tokens.ring}35`,
                  }}
                />
              </div>
              <p className="text-[11px]" style={{ color: tokens.textMuted }}>
                Markerad med aktiv fokusring i temats ring-färg ({tokens.ring}).
              </p>
            </div>

            {/* 3. Error State */}
            <div 
              className="p-5 rounded-xl border space-y-2"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold" style={{ color: tokens.text }}>
                  3. Felaktigt Tillstånd (Validation Error)
                </label>
                <span className="text-[10px] text-rose-500 font-bold">
                  Ogiltigt värde
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="ogiltig-epost-adress"
                  readOnly
                  className="w-full text-xs px-3 py-2.5 rounded-lg border"
                  style={{
                    backgroundColor: tokens.background,
                    borderColor: '#f43f5e',
                    color: tokens.text,
                    borderRadius: `${tokens.radius}px`,
                    boxShadow: '0 0 0 2px rgba(244, 63, 94, 0.2)',
                  }}
                />
                <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-rose-500 font-medium">
                Vänligen ange en giltig e-postadress.
              </p>
            </div>

            {/* 4. Disabled State */}
            <div 
              className="p-5 rounded-xl border space-y-2"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold" style={{ color: tokens.textMuted }}>
                  4. Inaktivt Tillstånd (Disabled State)
                </label>
                <span className="text-[10px] font-mono opacity-60">
                  disabled
                </span>
              </div>
              <input
                type="text"
                disabled
                defaultValue="Låst systemfält (kan ej redigeras)"
                className="w-full text-xs px-3 py-2.5 rounded-lg border opacity-50 cursor-not-allowed"
                style={{
                  backgroundColor: `${tokens.surfaceBorder}40`,
                  borderColor: tokens.surfaceBorder,
                  color: tokens.textMuted,
                  borderRadius: `${tokens.radius}px`,
                }}
              />
              <p className="text-[11px]" style={{ color: tokens.textMuted }}>
                Fältet är låst för inmatning.
              </p>
            </div>
          </div>

          {/* Checkboxes, Radios, Switches */}
          <div 
            className="p-5 rounded-2xl border space-y-4"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${tokens.radius}px`,
              borderWidth: `${tokens.borderWidth}px`,
            }}
          >
            <div className="text-xs font-bold" style={{ color: tokens.text }}>
              Interaktiva Väljare: Checkbox, Radio och Switch
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Checkbox */}
              <label className="flex items-center gap-3 text-xs cursor-pointer select-none">
                <div
                  onClick={() => setTestCheckbox(!testCheckbox)}
                  className="w-5 h-5 rounded flex items-center justify-center transition-all border"
                  style={{
                    backgroundColor: testCheckbox ? tokens.primary : 'transparent',
                    borderColor: testCheckbox ? tokens.primary : tokens.surfaceBorder,
                    color: tokens.primaryForeground,
                    borderRadius: `${Math.max(3, tokens.radius - 4)}px`,
                  }}
                >
                  {testCheckbox && <Check className="w-3.5 h-3.5" />}
                </div>
                <span style={{ color: tokens.text }}>Acceptera villkor</span>
              </label>

              {/* Radio Group */}
              <div className="flex items-center gap-4 text-xs">
                <label 
                  onClick={() => setTestRadio('a')}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <div
                    className="w-4 h-4 rounded-full border flex items-center justify-center"
                    style={{
                      borderColor: testRadio === 'a' ? tokens.primary : tokens.surfaceBorder,
                    }}
                  >
                    {testRadio === 'a' && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.primary }} />
                    )}
                  </div>
                  <span style={{ color: tokens.text }}>Val A</span>
                </label>

                <label 
                  onClick={() => setTestRadio('b')}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <div
                    className="w-4 h-4 rounded-full border flex items-center justify-center"
                    style={{
                      borderColor: testRadio === 'b' ? tokens.primary : tokens.surfaceBorder,
                    }}
                  >
                    {testRadio === 'b' && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.primary }} />
                    )}
                  </div>
                  <span style={{ color: tokens.text }}>Val B</span>
                </label>
              </div>

              {/* Switch */}
              <div className="flex items-center justify-between sm:justify-start gap-3 text-xs">
                <button
                  onClick={() => setTestToggle(!testToggle)}
                  className="w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer relative"
                  style={{
                    backgroundColor: testToggle ? tokens.primary : tokens.surfaceBorder,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full bg-white transition-transform shadow-xs"
                    style={{
                      transform: testToggle ? 'translateX(20px)' : 'translateX(0)',
                    }}
                  />
                </button>
                <span style={{ color: tokens.text }}>Automatisk sparning</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CARDS & SURFACES */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2" style={{ color: tokens.text }}>
              <Layers className="w-4 h-4" style={{ color: tokens.accent }} />
              Kort-varianter (Cards & Surfaces)
            </h3>
            <span className="text-xs" style={{ color: tokens.textMuted }}>
              Skuggstil: {tokens.shadowMode}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Default Surface Card */}
            <div 
              className="p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tokens.primary }}>
                  Standard Kort
                </span>
                <h4 className="text-base font-bold" style={{ color: tokens.text }}>
                  Yta för Innehåll & Data
                </h4>
                <p className="text-xs" style={{ color: tokens.textMuted }}>
                  Rent och avskalat utan onödig dekoration. Passar blogginlägg och data.
                </p>
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: tokens.surfaceBorder }}>
                <span style={{ color: tokens.textMuted }}>Status</span>
                <span className="font-semibold" style={{ color: tokens.primary }}>Aktiv</span>
              </div>
            </div>

            {/* Card 2: Accent Highlight Card */}
            <div 
              className="p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.accent,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
                boxShadow: tokens.shadowMode === 'glow' ? `0 0 25px ${tokens.glow}40` : undefined,
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tokens.accent }}>
                    Accent Highlight
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: `${tokens.accent}20`,
                      color: tokens.accent,
                    }}
                  >
                    Rekommenderas
                  </span>
                </div>
                <h4 className="text-base font-bold" style={{ color: tokens.text }}>
                  Kampanj & VIP-funktion
                </h4>
                <p className="text-xs" style={{ color: tokens.textMuted }}>
                  Ramlinjen matchar accentfärgen ({tokens.accent}) för maximal synlighet.
                </p>
              </div>

              <button
                className="w-full py-2 font-bold text-xs rounded-lg transition-all hover:opacity-90 cursor-pointer"
                style={{
                  backgroundColor: tokens.accent,
                  color: tokens.accentForeground,
                  borderRadius: `${tokens.radius}px`,
                }}
              >
                Upptäck Funktion
              </button>
            </div>

            {/* Card 3: Interactive Action Card */}
            <div 
              className="p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all cursor-pointer hover:border-opacity-100"
              style={{
                backgroundColor: `${tokens.primary}08`,
                borderColor: `${tokens.primary}40`,
                borderRadius: `${tokens.radius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tokens.secondary }}>
                  Interaktivt Val
                </span>
                <h4 className="text-base font-bold" style={{ color: tokens.text }}>
                  Klicka för att Välja
                </h4>
                <p className="text-xs" style={{ color: tokens.textMuted }}>
                  Lätt tonad bakgrund baserad på primärfärgen med subtil interaktion.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: tokens.primary }}>
                <span>Fortsätt konfigurera</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
