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

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onToggleApplyThemeToApp}
              className="p-2 rounded-lg border text-sm transition-colors"
              style={applyThemeToApp ? {
                backgroundColor: `${tokens.primary}20`,
                borderColor: tokens.primary,
                color: tokens.primary,
              } : undefined}
              title="Växla helapps-tema"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg border text-sm transition-colors"
              style={applyThemeToApp ? {
                backgroundColor: sidebarOpen ? `${tokens.primary}20` : tokens.surface,
                borderColor: sidebarOpen ? tokens.primary : tokens.surfaceBorder,
                color: sidebarOpen ? tokens.primary : tokens.text,
              } : undefined}
              title="Färgreglar"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChatbot}
              className="p-2 rounded-lg border text-amber-500 text-sm cursor-pointer"
              style={applyThemeToApp ? {
                borderColor: tokens.surfaceBorder,
                backgroundColor: tokens.surface,
              } : undefined}
              title="AI Chatbot & Sökning"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenThemeManager}
              className="p-2 rounded-lg border text-sm cursor-pointer"
              style={applyThemeToApp ? {
                borderColor: tokens.surfaceBorder,
                backgroundColor: tokens.surface,
                color: tokens.text,
              } : undefined}
              title="Temahanterare"
            >
              <FolderHeart className="w-4 h-4 text-indigo-500" />
            </button>
            <button
              onClick={onOpenExport}
              className="px-3 py-1.5 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              style={applyThemeToApp ? {
                backgroundColor: tokens.primary,
                color: tokens.primaryForeground,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              } : undefined}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div 
          className="flex items-center p-1 rounded-xl border text-xs font-medium w-full md:w-auto overflow-x-auto justify-start transition-colors"
          style={applyThemeToApp ? {
            backgroundColor: tokens.background,
            borderColor: tokens.surfaceBorder,
            borderRadius: `${Math.min(tokens.radius + 3, 14)}px`
          } : undefined}
        >
          <button
            onClick={() => onSelectTab('gadgets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gadgets'
                ? 'shadow-sm font-semibold'
                : 'hover:opacity-80'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: activeTab === 'gadgets' ? tokens.primary : 'transparent',
              color: activeTab === 'gadgets' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 10)}px`
            } : undefined}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Knappar & Gadgets</span>
          </button>

          <button
            onClick={() => onSelectTab('components')}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'components'
                ? 'shadow-sm font-semibold'
                : 'hover:opacity-80'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: activeTab === 'components' ? tokens.primary : 'transparent',
              color: activeTab === 'components' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 10)}px`
            } : undefined}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Knappgenerator (States)</span>
          </button>

          <button
            onClick={() => onSelectTab('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'landing'
                ? 'shadow-sm font-semibold'
                : 'hover:opacity-80'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: activeTab === 'landing' ? tokens.primary : 'transparent',
              color: activeTab === 'landing' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 10)}px`
            } : undefined}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'shadow-sm font-semibold'
                : 'hover:opacity-80'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: activeTab === 'dashboard' ? tokens.primary : 'transparent',
              color: activeTab === 'dashboard' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 10)}px`
            } : undefined}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Webbapp / SaaS</span>
          </button>

          <button
            onClick={() => onSelectTab('contrast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'contrast'
                ? 'shadow-sm font-semibold'
                : 'hover:opacity-80'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: activeTab === 'contrast' ? tokens.primary : 'transparent',
              color: activeTab === 'contrast' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 10)}px`
            } : undefined}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>WCAG Kontrast</span>
          </button>

          <button
            onClick={() => onSelectTab('shades')}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'shades'
                ? 'shadow-sm font-semibold'
                : 'hover:opacity-80'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: activeTab === 'shades' ? tokens.primary : 'transparent',
              color: activeTab === 'shades' ? tokens.primaryForeground : tokens.textMuted,
              borderRadius: `${Math.min(tokens.radius, 10)}px`
            } : undefined}
          >
            <SunMedium className="w-3.5 h-3.5 animate-pulse" />
            <span>Ljuspelare & Shades</span>
          </button>
        </div>

        {/* Action Controls: App Theme Toggle, Ambient Pillars, Randomize, Import, Export */}
        <div className="hidden md:flex items-center gap-2">
          {/* Whole App Theme Toggle */}
          <button
            onClick={onToggleApplyThemeToApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-xs"
            style={applyThemeToApp ? {
              backgroundColor: `${tokens.primary}20`,
              borderColor: tokens.primary,
              color: tokens.primary,
              borderRadius: `${Math.min(tokens.radius, 8)}px`,
            } : {
              backgroundColor: 'transparent',
              borderColor: '#94a3b840',
              color: '#94a3b8',
              borderRadius: '8px'
            }}
            title={applyThemeToApp ? 'Hela studion är temasatt efter det valda schemat (Klicka för neutralt läge)' : 'Klicka för att tillämpa schemat på hela studion'}
          >
            <Palette className="w-3.5 h-3.5 animate-pulse" />
            <span>{applyThemeToApp ? 'Hela Appen: Temasatt' : 'App-tema: Av'}</span>
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
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90"
              style={{
                backgroundColor: backgroundEffect !== 'none' ? `${tokens.primary}18` : 'transparent',
                borderColor: backgroundEffect !== 'none' ? tokens.primary : tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`,
              }}
              title="Växla bakgrundseffekt: Spotlight, Vågor (Wavy), Gradient Animation, Ljuspelare, eller Ren minimalistisk"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>
                {backgroundEffect === 'spotlight' && 'Bakgrund: Spotlight ✨'}
                {backgroundEffect === 'wavy' && 'Bakgrund: Vågor 🌊'}
                {backgroundEffect === 'gradient' && 'Bakgrund: Gradient 🎨'}
                {backgroundEffect === 'pillars' && 'Bakgrund: Pelare 💡'}
                {backgroundEffect === 'none' && 'Bakgrund: Ren ⏹️'}
              </span>
            </button>
          )}

          {/* AI Design Assistant Button */}
          <button
            onClick={onOpenChatbot}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
            style={applyThemeToApp ? {
              backgroundColor: `${tokens.accent}15`,
              borderColor: `${tokens.accent}35`,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title="Chatta med AI Design Assistent med Google Search Grounding"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Konsult</span>
          </button>

          {/* Import URL/Image Button */}
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
            style={applyThemeToApp ? {
              backgroundColor: `${tokens.secondary}15`,
              borderColor: `${tokens.secondary}35`,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title="Extrahera färgskalor från webblänkar (Figma etc.) eller bildimport"
          >
            <Globe className="w-3.5 h-3.5" style={{ color: tokens.secondary }} />
            <span>Importera Länk / Bild</span>
          </button>

          {/* Theme Manager Button */}
          <button
            onClick={onOpenThemeManager}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
            style={applyThemeToApp ? {
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title="Öppna temahanteraren för att skapa, spara och ladda teman"
          >
            <FolderHeart className="w-3.5 h-3.5 text-indigo-500" />
            <span>Teman</span>
          </button>

          {/* Slumpa Färgpalett (Harmonisk standard) */}
          <button
            onClick={onRandomize}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer hover:opacity-90"
            style={applyThemeToApp ? {
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title="Slumpa fram en helt ny harmonisk färgskala"
          >
            <Dices className="w-3.5 h-3.5 text-emerald-500" />
            <span>Slumpa ny</span>
          </button>

          {/* Cykla Färger Button (Primary -> Secondary -> Accent) */}
          {onCycleColors && (
            <button
              onClick={onCycleColors}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer hover:opacity-90"
              style={applyThemeToApp ? {
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              } : undefined}
              title="Cykla färger: Rotera färgroller i schemat (Primär ➔ Sekundär ➔ Accent)"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-500 hover:rotate-180 transition-transform" />
              <span className="hidden md:inline">Cykla färger</span>
              <span className="md:hidden">Cykla</span>
            </button>
          )}

          {/* Randomize Order (Blanda färgordning) Button */}
          {onShuffleColors && (
            <button
              onClick={onShuffleColors}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer hover:opacity-90"
              style={applyThemeToApp ? {
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              } : undefined}
              title="Slumpa ordning på färgerna: Blanda om rollerna (Primär, Sekundär, Accent) för att testa nya hierarkier med samma nyanser"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden md:inline">Blanda ordning</span>
              <span className="md:hidden">Blanda</span>
            </button>
          )}

          {/* Slumpa Mellanläge (Sweet Spot) Button */}
          <button
            onClick={onRandomizeSweetSpot}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer shadow-xs"
            style={applyThemeToApp ? {
              backgroundColor: tokens.accent,
              color: tokens.accentForeground,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title="Slumpa fram det perfekta mellanläget: varken för mörkt eller för ljust!"
          >
            <Dices className="w-4 h-4 animate-spin-slow" />
            <span>Mellanläge</span>
          </button>

          {/* Dämpa Ytterligheter / Mjuk Kontrast Button */}
          <button
            onClick={onToggleSoftenExtremes || onSnapToSweetSpot}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              softenActive ? 'ring-1 shadow-xs' : 'hover:opacity-90'
            }`}
            style={applyThemeToApp ? {
              backgroundColor: softenActive ? `${tokens.primary}22` : tokens.background,
              borderColor: softenActive ? tokens.primary : tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`,
              boxShadow: softenActive ? `0 0 0 1px ${tokens.primary}50` : undefined,
            } : undefined}
            title={
              softenActive
                ? `Mjuk Kontrast är AKTIV (${Math.round((softenAmount || 0.55) * 100)}% dämpning). Klicka för att återställa till rå färgskala med full dynamik.`
                : 'Dämpa ytterligheter: Gör de mörkaste tonerna ljusare och de ljusaste tonerna mörkare med bevarad kontrast (WCAG AA) för både mörkt och ljust läge.'
            }
          >
            <span className="text-sm">⚖️</span>
            <span className="hidden md:inline">Dämpa extremer</span>
            <span className="md:hidden">Dämpa</span>
            {softenActive ? (
              <span 
                className="px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider ml-0.5"
                style={{
                  backgroundColor: tokens.primary,
                  color: tokens.primaryForeground,
                }}
              >
                PÅ
              </span>
            ) : null}
          </button>

          {/* Invert Light/Dark Theme */}
          <button
            onClick={onToggleThemeMode}
            className="p-2 rounded-lg border transition-colors cursor-pointer"
            style={applyThemeToApp ? {
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title={isDarkTheme ? 'Växla till ljust tema' : 'Växla till mörkt tema'}
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={applyThemeToApp ? {
              backgroundColor: tokens.primary,
              color: tokens.primaryForeground,
              borderRadius: `${Math.min(tokens.radius, 8)}px`,
              boxShadow: `0 2px 8px ${tokens.primary}40`
            } : undefined}
          >
            <Share2 className="w-3.5 h-3.5 opacity-90" />
            <span>Exportera</span>
          </button>
        </div>
      </div>
    </header>
  );
};
