import React from 'react';
import { 
  Palette, 
  Dices, 
  Sparkles, 
  Sun, 
  Moon, 
  SlidersHorizontal,
  LayoutTemplate,
  Laptop,
  CheckCircle2,
  Share2,
  FolderHeart,
  MousePointer,
  Globe,
  SunMedium,
  RotateCw,
  Shuffle,
  Boxes
} from 'lucide-react';
import { ThemePreset, PreviewTab, ThemeTokens } from '../types/theme';
import { THEME_PRESETS } from '../utils/presets';

interface HeaderProps {
  selectedPreset: ThemePreset;
  allThemes: ThemePreset[];
  tokens: ThemeTokens;
  applyThemeToApp: boolean;
  onToggleApplyThemeToApp: () => void;
  ambientPillars?: boolean;
  onToggleAmbientPillars?: () => void;
  backgroundEffect?: 'spotlight' | 'wavy' | 'gradient' | 'pillars' | 'none';
  onChangeBackgroundEffect?: (effect: 'spotlight' | 'wavy' | 'gradient' | 'pillars' | 'none') => void;
  softenActive?: boolean;
  softenAmount?: number;
  onToggleSoftenExtremes?: () => void;
  onSelectPreset: (preset: ThemePreset) => void;
  onRandomize: () => void;
  onRandomizeSweetSpot: () => void;
  onSnapToSweetSpot: () => void;
  onCycleColors?: () => void;
  onShuffleColors?: () => void;
  onNeobrutalize?: () => void;
  isDarkTheme: boolean;
  onToggleThemeMode: () => void;
  activeTab: PreviewTab;
  onSelectTab: (tab: PreviewTab) => void;
  onOpenExport: () => void;
  onOpenThemeManager: () => void;
  onOpenImportModal: () => void;
  onOpenChatbot: () => void;
  onReset: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedPreset,
  allThemes,
  tokens,
  applyThemeToApp,
  onToggleApplyThemeToApp,
  ambientPillars = false,
  onToggleAmbientPillars,
  backgroundEffect = 'spotlight',
  onChangeBackgroundEffect,
  softenActive = false,
  softenAmount = 0.55,
  onToggleSoftenExtremes,
  onSelectPreset,
  onRandomize,
  onRandomizeSweetSpot,
  onSnapToSweetSpot,
  onCycleColors,
  onShuffleColors,
  onNeobrutalize,
  isDarkTheme,
  onToggleThemeMode,
  activeTab,
  onSelectTab,
  onOpenExport,
  onOpenThemeManager,
  onOpenImportModal,
  onOpenChatbot,
  sidebarOpen,
  onToggleSidebar
}) => {
  return (
    <header 
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md px-4 py-2.5 transition-colors duration-200"
      style={applyThemeToApp ? {
        backgroundColor: `${tokens.surface}f6`,
        borderColor: tokens.surfaceBorder,
        color: tokens.text,
      } : undefined}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-all duration-200"
              style={applyThemeToApp ? {
                background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.secondary})`,
                color: tokens.primaryForeground,
                boxShadow: `0 4px 12px ${tokens.primary}35`,
                borderRadius: `${Math.min(tokens.radius + 3, 14)}px`
              } : undefined}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 
                  className="text-base font-bold tracking-tight transition-colors"
                  style={applyThemeToApp ? { color: tokens.text } : undefined}
                >
                  ColorCraft Studio
                </h1>
                <span 
                  className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded border transition-colors"
                  style={applyThemeToApp ? {
                    backgroundColor: `${tokens.primary}18`,
                    borderColor: `${tokens.primary}35`,
                    color: tokens.primary,
                    borderRadius: `${Math.min(tokens.radius, 6)}px`
                  } : undefined}
                >
                  Tailwind v4 & AI
                </span>
              </div>
              <p 
                className="text-xs hidden sm:block transition-colors"
                style={applyThemeToApp ? { color: tokens.textMuted } : undefined}
              >
                Interaktiv färgjusteringsmodul, 100 Figma-kombinationer & temalägen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleApplyThemeToApp}
              className="h-9 w-9 rounded-lg border text-sm inline-flex items-center justify-center transition-colors cursor-pointer shrink-0"
              style={applyThemeToApp ? {
                backgroundColor: `${tokens.primary}20`,
                borderColor: tokens.primary,
                color: tokens.primary,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              } : {
                backgroundColor: tokens.surface,
                borderColor: tokens.surfaceBorder,
                color: tokens.textMuted,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
              title="Växla helapps-tema"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleSidebar}
              className="h-9 w-9 rounded-lg border text-sm inline-flex items-center justify-center transition-colors cursor-pointer shrink-0"
              style={{
                backgroundColor: sidebarOpen ? `${tokens.primary}20` : tokens.surface,
                borderColor: sidebarOpen ? tokens.primary : tokens.surfaceBorder,
                color: sidebarOpen ? tokens.primary : tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
              title="Färgreglar"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChatbot}
              className="h-9 w-9 rounded-lg border text-amber-500 text-sm inline-flex items-center justify-center cursor-pointer shrink-0"
              style={{
                borderColor: tokens.surfaceBorder,
                backgroundColor: tokens.surface,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
              title="AI Chatbot & Sökning"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenThemeManager}
              className="h-9 w-9 rounded-lg border text-sm inline-flex items-center justify-center cursor-pointer shrink-0"
              style={{
                borderColor: tokens.surfaceBorder,
                backgroundColor: tokens.surface,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
              title="Temahanterare"
            >
              <FolderHeart className="w-4 h-4 text-indigo-500" />
            </button>
            <button
              onClick={onOpenExport}
              className="h-9 px-3 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              style={{
                backgroundColor: tokens.primary,
                color: tokens.primaryForeground,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div 
          className="flex items-center p-1 rounded-xl border text-xs font-medium w-full md:w-auto overflow-x-auto justify-start transition-colors gap-0.5"
          style={applyThemeToApp ? {
            backgroundColor: tokens.background,
            borderColor: tokens.surfaceBorder,
            borderRadius: `${Math.min(tokens.radius + 3, 14)}px`
          } : undefined}
        >
          <button
            onClick={() => onSelectTab('gadgets')}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gadgets'
                ? 'shadow-xs font-bold'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'gadgets' ? tokens.primary : 'transparent',
              color: activeTab === 'gadgets' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Knappar & Gadgets</span>
          </button>

          <button
            onClick={() => onSelectTab('components')}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'components'
                ? 'shadow-xs font-bold'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'components' ? tokens.primary : 'transparent',
              color: activeTab === 'components' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Knappgenerator (States)</span>
          </button>

          <button
            onClick={() => onSelectTab('landing')}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'landing'
                ? 'shadow-xs font-bold'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'landing' ? tokens.primary : 'transparent',
              color: activeTab === 'landing' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'shadow-xs font-bold'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'dashboard' ? tokens.primary : 'transparent',
              color: activeTab === 'dashboard' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Webbapp / SaaS</span>
          </button>

          <button
            onClick={() => onSelectTab('contrast')}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'contrast'
                ? 'shadow-xs font-bold'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'contrast' ? tokens.primary : 'transparent',
              color: activeTab === 'contrast' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>WCAG Kontrast</span>
          </button>

          <button
            onClick={() => onSelectTab('shades')}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'shades'
                ? 'shadow-xs font-bold'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'shades' ? tokens.primary : 'transparent',
              color: activeTab === 'shades' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
          >
            <SunMedium className="w-3.5 h-3.5" />
            <span>Ljuspelare & Shades</span>
          </button>
        </div>

        {/* Action Controls: App Theme Toggle, Ambient Pillars, Randomize, Import, Export */}
        <div className="hidden md:flex items-center gap-1.5 flex-wrap lg:flex-nowrap">
          {/* Whole App Theme Toggle */}
          <button
            onClick={onToggleApplyThemeToApp}
            className="h-9 px-3 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
            style={applyThemeToApp ? {
              backgroundColor: `${tokens.primary}20`,
              borderColor: tokens.primary,
              color: tokens.primary,
              borderRadius: `${Math.min(tokens.radius, 8)}px`,
            } : {
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
            title={applyThemeToApp ? 'Hela studion är temasatt efter det valda schemat (Klicka för neutralt läge)' : 'Klicka för att tillämpa schemat på hela studion'}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{applyThemeToApp ? 'Hela Appen: På' : 'App-tema: Av'}</span>
          </button>

          {/* Background Effect Selector / Toggle (Spotlight, Vågor, Gradient, Pelare, Ren) */}
          {onChangeBackgroundEffect && (
            <button
              onClick={() => {
                const nextEffect = 
                  backgroundEffect === 'spotlight' ? 'wavy' :
                  backgroundEffect === 'wavy' ? 'gradient' :
                  backgroundEffect === 'gradient' ? 'pillars' :
                  backgroundEffect === 'pillars' ? 'none' : 'spotlight';
                onChangeBackgroundEffect(nextEffect);
              }}
              className="h-9 px-3 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:opacity-90 whitespace-nowrap"
              style={{
                backgroundColor: backgroundEffect !== 'none' ? `${tokens.primary}18` : tokens.background,
                borderColor: backgroundEffect !== 'none' ? tokens.primary : tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`,
              }}
              title="Växla bakgrundseffekt: Spotlight, Vågor (Wavy), Gradient Animation, Ljuspelare, eller Ren minimalistisk"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {backgroundEffect === 'spotlight' && 'Spotlight ✨'}
                {backgroundEffect === 'wavy' && 'Vågor 🌊'}
                {backgroundEffect === 'gradient' && 'Gradient 🎨'}
                {backgroundEffect === 'pillars' && 'Pelare 💡'}
                {backgroundEffect === 'none' && 'Ren bakgrund'}
              </span>
            </button>
          )}

          {/* AI Design Assistant Button */}
          <button
            onClick={onOpenChatbot}
            className="h-9 px-3 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            style={{
              backgroundColor: `${tokens.accent}15`,
              borderColor: `${tokens.accent}35`,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
            title="Chatta med AI Design Assistent med Google Search Grounding"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Konsult</span>
          </button>

          {/* Import URL/Image Button */}
          <button
            onClick={onOpenImportModal}
            className="h-9 px-3 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            style={{
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
            title="Extrahera färgskalor från webblänkar (Figma etc.) eller bildimport"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Importera</span>
          </button>

          {/* Theme Manager Button */}
          <button
            onClick={onOpenThemeManager}
            className="h-9 px-3 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            style={{
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
            title="Öppna temahanteraren för att skapa, spara och ladda teman"
          >
            <FolderHeart className="w-3.5 h-3.5 text-indigo-500" />
            <span>Teman</span>
          </button>

          {/* Slumpa Färgpalett (Harmonisk standard) */}
          <button
            onClick={onRandomize}
            className="h-9 px-3 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-90 shadow-xs whitespace-nowrap"
            style={{
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
            title="Slumpa fram en helt ny harmonisk färgskala"
          >
            <Dices className="w-3.5 h-3.5 text-emerald-500" />
            <span>Slumpa</span>
          </button>

          {/* Cykla Färger Button (Primary -> Secondary -> Accent) */}
          {onCycleColors && (
            <button
              onClick={onCycleColors}
              className="h-9 px-2.5 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-90 shadow-xs whitespace-nowrap"
              style={{
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
              title="Cykla färger: Rotera färgroller i schemat (Primär ➔ Sekundär ➔ Accent)"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-500 hover:rotate-180 transition-transform" />
              <span>Cykla</span>
            </button>
          )}

          {/* Randomize Order (Blanda färgordning) Button */}
          {onShuffleColors && (
            <button
              onClick={onShuffleColors}
              className="h-9 px-2.5 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-90 shadow-xs whitespace-nowrap"
              style={{
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
              title="Slumpa ordning på färgerna: Blanda om rollerna (Primär, Sekundär, Accent)"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-500" />
              <span>Blanda</span>
            </button>
          )}

          {/* Slumpa Mellanläge (Sweet Spot) Button */}
          <button
            onClick={onRandomizeSweetSpot}
            className="h-9 px-3 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer shadow-xs whitespace-nowrap"
            style={{
              backgroundColor: `${tokens.accent}22`,
              borderColor: tokens.accent,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
            title="Slumpa fram det perfekta mellanläget: varken för mörkt eller för ljust!"
          >
            <Dices className="w-3.5 h-3.5 text-amber-500" />
            <span>Mellanläge</span>
          </button>

          {/* Dämpa Ytterligheter / Mjuk Kontrast Button */}
          <button
            onClick={onToggleSoftenExtremes || onSnapToSweetSpot}
            className={`h-9 px-2.5 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap ${
              softenActive ? 'ring-1' : 'hover:opacity-90'
            }`}
            style={{
              backgroundColor: softenActive ? `${tokens.primary}22` : tokens.background,
              borderColor: softenActive ? tokens.primary : tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`,
            }}
            title={
              softenActive
                ? `Mjuk Kontrast är AKTIV (${Math.round((softenAmount || 0.55) * 100)}% dämpning). Klicka för att återställa till rå färgskala med full dynamik.`
                : 'Dämpa ytterligheter: Gör de mörkaste tonerna ljusare och de ljusaste tonerna mörkare med bevarad kontrast (WCAG AA).'
            }
          >
            <span>⚖️</span>
            <span>Dämpa</span>
            {softenActive && (
              <span 
                className="px-1 py-0.2 rounded text-[9px] font-bold uppercase"
                style={{
                  backgroundColor: tokens.primary,
                  color: tokens.primaryForeground,
                }}
              >
                PÅ
              </span>
            )}
          </button>

          {/* Invert Light/Dark Theme */}
          <button
            onClick={onToggleThemeMode}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border transition-colors cursor-pointer shadow-xs shrink-0"
            style={{
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            }}
            title={isDarkTheme ? 'Växla till ljust tema' : 'Växla till mörkt tema'}
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="h-9 px-3.5 rounded-lg text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 border border-transparent"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.primaryForeground,
              borderRadius: `${Math.min(tokens.radius, 8)}px`,
              boxShadow: `0 2px 8px ${tokens.primary}35`
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Exportera</span>
          </button>
        </div>
      </div>
    </header>
  );
};
