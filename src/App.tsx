import React, { useState, useEffect } from 'react';
import { ThemeTokens, ThemePreset, PreviewTab, ThemeStyle } from './types/theme';
import { THEME_PRESETS } from './utils/presets';
import { 
  generateHarmoniousPalette, 
  generateSweetSpotPalette, 
  snapTokensToSweetSpot, 
  softenExtremesWithContrast,
  getOptimalTextColor, 
  getRelativeLuminance,
  cycleThemeColors,
  shuffleThemeColorOrder,
  neobrutalizeTheme,
  NeobrutalistPresetKind
} from './utils/colorUtils';
import { Header } from './components/Header';
import { ColorTuner } from './components/ColorTuner';
import { ProTemplateGallery } from './components/ProTemplateGallery';
import { GadgetShowcase } from './components/GadgetShowcase';
import { ComponentGenerator } from './components/ComponentGenerator';
import { LandingPagePreview } from './components/LandingPagePreview';
import { DashboardPreview } from './components/DashboardPreview';
import { ContrastAnalyzer } from './components/ContrastAnalyzer';
import { ShadesLightShowcase } from './components/ShadesLightShowcase';
import { ExportModal } from './components/ExportModal';
import { ThemeManagerModal } from './components/ThemeManagerModal';
import { PaletteImportModal } from './components/PaletteImportModal';
import { GeminiChatbotDrawer } from './components/GeminiChatbotDrawer';
import { Spotlight } from './components/ui/spotlight-new';
import { WavyBackground } from './components/ui/wavy-background';
import { BackgroundGradientAnimation } from './components/ui/background-gradient-animation';

const LOCAL_STORAGE_KEY = 'colorcraft_saved_custom_themes';

export default function App() {
  const [currentPreset, setCurrentPreset] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [tokens, setTokens] = useState<ThemeTokens>(THEME_PRESETS[0].tokens);
  // Uncompressed base tokens for non-destructive toggle & range adjustment
  const [baseTokens, setBaseTokens] = useState<ThemeTokens>(THEME_PRESETS[0].tokens);
  const [softenActive, setSoftenActive] = useState<boolean>(false);
  const [softenAmount, setSoftenAmount] = useState<number>(0.55);
  const [presetMood, setPresetMood] = useState<string>(THEME_PRESETS[0].mood);
  const [activeTab, setActiveTab] = useState<PreviewTab>('gadgets');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isThemeManagerOpen, setIsThemeManagerOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [applyThemeToApp, setApplyThemeToApp] = useState<boolean>(true);
  const [ambientLightPillars, setAmbientLightPillars] = useState<boolean>(false);
  const [backgroundEffect, setBackgroundEffect] = useState<'spotlight' | 'wavy' | 'gradient' | 'pillars' | 'none'>('spotlight');
  const [savedCustomThemes, setSavedCustomThemes] = useState<ThemePreset[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load custom themes from localStorage', e);
    }
    return [];
  });

  // Save custom themes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCustomThemes));
    } catch (e) {
      console.error('Failed to persist custom themes', e);
    }
  }, [savedCustomThemes]);

  // Apply active tokens across entire app document and body
  useEffect(() => {
    if (applyThemeToApp) {
      document.documentElement.style.setProperty('--theme-bg', tokens.background);
      document.documentElement.style.setProperty('--theme-surface', tokens.surface);
      document.documentElement.style.setProperty('--theme-surface-border', tokens.surfaceBorder);
      document.documentElement.style.setProperty('--theme-text', tokens.text);
      document.documentElement.style.setProperty('--theme-text-muted', tokens.textMuted);
      document.documentElement.style.setProperty('--theme-primary', tokens.primary);
      document.documentElement.style.setProperty('--theme-primary-fg', tokens.primaryForeground);
      document.documentElement.style.setProperty('--theme-secondary', tokens.secondary);
      document.documentElement.style.setProperty('--theme-secondary-fg', tokens.secondaryForeground);
      document.documentElement.style.setProperty('--theme-accent', tokens.accent);
      document.documentElement.style.setProperty('--theme-accent-fg', tokens.accentForeground);
      document.documentElement.style.setProperty('--theme-ring', tokens.ring);
      document.documentElement.style.setProperty('--theme-radius', `${tokens.radius}px`);

      document.body.style.backgroundColor = tokens.background;
      document.body.style.color = tokens.text;
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }, [tokens, applyThemeToApp]);

  // Determine if active scheme is dark based on background luminance
  const isDarkTheme = React.useMemo(() => {
    const bg = tokens.background.replace('#', '');
    const r = parseInt(bg.substring(0, 2), 16) || 0;
    const g = parseInt(bg.substring(2, 4), 16) || 0;
    const b = parseInt(bg.substring(4, 6), 16) || 0;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum < 0.5;
  }, [tokens.background]);

  // Helper to apply tokens respecting current soften mode
  const applyTokensWithSoften = (
    rawTokens: ThemeTokens,
    shouldSoften: boolean = softenActive,
    amount: number = softenAmount
  ) => {
    setBaseTokens(rawTokens);
    if (shouldSoften) {
      setTokens(softenExtremesWithContrast(rawTokens, amount));
    } else {
      setTokens(rawTokens);
    }
  };

  // Toggle softening extremes: lifts darkest tones & tones down brightest tones with preserved contrast
  const handleToggleSoftenExtremes = () => {
    const nextActive = !softenActive;
    setSoftenActive(nextActive);
    if (nextActive) {
      setTokens(softenExtremesWithContrast(baseTokens, softenAmount));
    } else {
      setTokens(baseTokens);
    }
  };

  // Adjust softening amount smoothly (0 to 1)
  const handleSetSoftenAmount = (amount: number) => {
    setSoftenAmount(amount);
    if (amount <= 0.02) {
      setSoftenActive(false);
      setTokens(baseTokens);
    } else {
      setSoftenActive(true);
      setTokens(softenExtremesWithContrast(baseTokens, amount));
    }
  };

  // Handle manual edits from ColorTuner
  const handleUpdateTokens = (newTokens: ThemeTokens) => {
    setTokens(newTokens);
    setBaseTokens(newTokens);
  };

  // Handle selecting a preset
  const handleSelectPreset = (preset: ThemePreset) => {
    setCurrentPreset(preset);
    applyTokensWithSoften(preset.tokens);
    setPresetMood(preset.mood);
  };

  // Handle saving current palette as a custom theme
  const handleSaveCurrentTheme = (name: string, style: ThemeStyle, mood: string, customTokens?: ThemeTokens) => {
    const newTheme: ThemePreset = {
      id: 'custom-' + Date.now(),
      name,
      mood: mood || presetMood,
      styleCategory: style,
      category: isDarkTheme ? 'dark' : 'light',
      description: `Eget sparat tema (${style})`,
      tokens: customTokens ? { ...customTokens } : { ...tokens },
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    setSavedCustomThemes((prev) => [newTheme, ...prev]);
    setCurrentPreset(newTheme);
    if (customTokens) {
      setTokens(customTokens);
      setPresetMood(mood);
    }
  };

  // Handle deleting a saved custom theme
  const handleDeleteCustomTheme = (id: string) => {
    setSavedCustomThemes((prev) => prev.filter((t) => t.id !== id));
    if (currentPreset.id === id) {
      handleSelectPreset(THEME_PRESETS[0]);
    }
  };

  // Handle applying tokens from URL or image import
  const handleApplyImportedTokens = (
    importedTokens: ThemeTokens,
    name: string,
    mood: string,
    style: ThemeStyle
  ) => {
    setTokens(importedTokens);
    setPresetMood(mood);
    const importedPreset: ThemePreset = {
      id: 'imported-' + Date.now(),
      name,
      mood,
      styleCategory: style,
      category: isDarkTheme ? 'dark' : 'light',
      description: 'Importerat schema från webblänk eller bild',
      tokens: importedTokens,
      isCustom: true,
    };
    setCurrentPreset(importedPreset);
  };

  // Handle AI Chatbot Palette application
  const handleApplyChatbotPalette = (palette: any) => {
    if (palette.tokens) {
      setTokens(palette.tokens);
    }
    const aiPreset: ThemePreset = {
      id: 'ai-gen-' + Date.now(),
      name: palette.name || 'AI Genererat Tema',
      mood: palette.mood || presetMood,
      styleCategory: palette.styleCategory || 'professionell',
      category: isDarkTheme ? 'dark' : 'light',
      description: 'Genererad av AI Design Director',
      tokens: palette.tokens || tokens,
      isCustom: true,
    };
    setCurrentPreset(aiPreset);
    if (palette.mood) {
      setPresetMood(palette.mood);
    }
  };

  // Handle Randomize / Roll the dice (Standard)
  const handleRandomize = () => {
    const newTokens = generateHarmoniousPalette(isDarkTheme);
    applyTokensWithSoften(newTokens);
    const randomizedPreset: ThemePreset = {
      id: 'random-' + Date.now(),
      name: 'Slumpad Harmonisk Palett',
      mood: 'Dynamiskt genererad färgskala med balanserad mättnad och godkänd kontrast.',
      styleCategory: 'djärv',
      category: isDarkTheme ? 'dark' : 'light',
      description: 'Slumpmässigt framtagen färgskala.',
      tokens: newTokens,
    };
    setCurrentPreset(randomizedPreset);
    setPresetMood('Harmonisk modern färgskala framtagen för hög visuell skärpa och god kontrast.');
  };

  // Handle Slumpa Mellanläge (Det perfekta mellanläget: varken för mörkt eller för ljust)
  const handleRandomizeSweetSpot = () => {
    const newTokens = generateSweetSpotPalette('random');
    setSoftenActive(false);
    setBaseTokens(newTokens);
    setTokens(newTokens);
    const isDark = getRelativeLuminance(newTokens.background) < 0.4;
    const sweetSpotPreset: ThemePreset = {
      id: 'sweet-spot-' + Date.now(),
      name: isDark ? 'Slumpat Mellanläge (Mjuk Skiffer)' : 'Slumpat Mellanläge (Mjukt Linne)',
      mood: 'Det perfekta mellanläget: varken kolsvart eller bländvit. Vilsam färgskala som fungerar dygnet runt utan mode-växling.',
      styleCategory: 'mellanläge',
      category: isDark ? 'dark' : 'light',
      description: 'Specialkalibrerad för att eliminera ögontrötthet med 18-20% eller 89-92% ljusstyrka.',
      tokens: newTokens,
    };
    setCurrentPreset(sweetSpotPreset);
    setPresetMood('Det perfekta mellanläget: balanserad och vilsam färgskala för optimal läsbarhet och mjuk kontrast.');
  };

  // Handle Snäpp/Mildra nuvarande färgskala till Mellanläge
  const handleSnapToSweetSpot = () => {
    handleToggleSoftenExtremes();
  };

  // Cykla färgroller (Primary ➔ Secondary ➔ Accent ➔ Primary)
  const handleCycleColors = () => {
    const cycled = cycleThemeColors(tokens);
    setTokens(cycled);
    setBaseTokens(cycled);
  };

  // Slumpa ordningen på färger i schemat (Randomize color order)
  const handleShuffleColors = () => {
    const shuffled = shuffleThemeColorOrder(tokens);
    setTokens(shuffled);
    setBaseTokens(shuffled);
  };

  // Neobrutalisera temat (solida 2px ramar, 3D-fallskuggor och minimalistisk 2-3 färgpalett)
  const handleNeobrutalize = (kind: NeobrutalistPresetKind = 'preserve') => {
    const neoTokens = neobrutalizeTheme(tokens, kind);
    setTokens(neoTokens);
    setBaseTokens(neoTokens);
    const isDark = getRelativeLuminance(neoTokens.background) < 0.4;
    const neoPreset: ThemePreset = {
      id: 'neobrutalist-' + Date.now(),
      name: kind === 'preserve'
        ? 'Neobrutalistisk 3D-Press'
        : kind === 'minimal-canary'
        ? 'Neobrutalism (Kanariegul & Svart)'
        : kind === 'minimal-lime'
        ? 'Neobrutalism (Acid Lime)'
        : kind === 'minimal-bubblegum'
        ? 'Neobrutalism (Bubblegum Chockrosa)'
        : 'Neobrutalism (Cyber Cyan Dark)',
      mood: 'Taktil Neobrutalism med solida ramar, 3D-fallskuggor och minimalistisk färgdisciplin (2-3 färger).',
      styleCategory: 'djärv',
      category: isDark ? 'dark' : 'light',
      description: 'Optimerad för maximal kontrast, ren canvas och taktil tryckkänsla i alla skalor.',
      tokens: neoTokens,
      isCustom: true,
    };
    setCurrentPreset(neoPreset);
    setPresetMood('Neobrutalistisk estetik: solida 2px ramar, 3D-fallskugga och hög visuell slagkraft.');
  };

  // Toggle Dark/Light Mode inversion
  const handleToggleThemeMode = () => {
    if (isDarkTheme) {
      // Invert to Light mode
      const newTokens: ThemeTokens = {
        ...tokens,
        background: '#f8fafc',
        surface: '#ffffff',
        surfaceForeground: '#0f172a',
        surfaceBorder: '#e2e8f0',
        text: '#0f172a',
        textMuted: '#64748b',
        primaryForeground: getOptimalTextColor(tokens.primary),
        secondaryForeground: getOptimalTextColor(tokens.secondary),
        accentForeground: getOptimalTextColor(tokens.accent),
      };
      applyTokensWithSoften(newTokens);
    } else {
      // Invert to Dark mode
      const newTokens: ThemeTokens = {
        ...tokens,
        background: '#090a0f',
        surface: '#13151f',
        surfaceForeground: '#f8fafc',
        surfaceBorder: '#232738',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        primaryForeground: getOptimalTextColor(tokens.primary),
        secondaryForeground: getOptimalTextColor(tokens.secondary),
        accentForeground: getOptimalTextColor(tokens.accent),
      };
      applyTokensWithSoften(newTokens);
    }
  };

  // Auto-fix WCAG AA contrast across all tokens
  const handleAutoContrast = () => {
    const updated: ThemeTokens = {
      ...tokens,
      text: isDarkTheme ? '#f8fafc' : '#09090b',
      textMuted: isDarkTheme ? '#94a3b8' : '#64748b',
      surfaceForeground: isDarkTheme ? '#f8fafc' : '#09090b',
      primaryForeground: getOptimalTextColor(tokens.primary),
      secondaryForeground: getOptimalTextColor(tokens.secondary),
      accentForeground: getOptimalTextColor(tokens.accent),
    };
    setTokens(updated);
  };

  // Reset to original preset tokens
  const handleReset = () => {
    setTokens(currentPreset.tokens);
    setPresetMood(currentPreset.mood);
  };

  const allAvailableThemes = [...savedCustomThemes, ...THEME_PRESETS];

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200"
      style={applyThemeToApp ? {
        backgroundColor: tokens.background,
        color: tokens.text,
      } : undefined}
    >
      {/* Top Application Header */}
      <Header
        selectedPreset={currentPreset}
        allThemes={allAvailableThemes}
        tokens={tokens}
        applyThemeToApp={applyThemeToApp}
        onToggleApplyThemeToApp={() => setApplyThemeToApp(!applyThemeToApp)}
        ambientPillars={ambientLightPillars}
        onToggleAmbientPillars={() => setAmbientLightPillars(!ambientLightPillars)}
        backgroundEffect={backgroundEffect}
        onChangeBackgroundEffect={setBackgroundEffect}
        softenActive={softenActive}
        softenAmount={softenAmount}
        onToggleSoftenExtremes={handleToggleSoftenExtremes}
        onSelectPreset={handleSelectPreset}
        onRandomize={handleRandomize}
        onRandomizeSweetSpot={handleRandomizeSweetSpot}
        onSnapToSweetSpot={handleSnapToSweetSpot}
        onCycleColors={handleCycleColors}
        onShuffleColors={handleShuffleColors}
        onNeobrutalize={() => handleNeobrutalize('preserve')}
        isDarkTheme={isDarkTheme}
        onToggleThemeMode={handleToggleThemeMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenThemeManager={() => setIsThemeManagerOpen(true)}
        onOpenImportModal={() => setIsImportOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onReset={handleReset}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Dynamic Ambient Background: Spotlight (Aceternity New), Wavy Canvas, Gradient Animation, or Pillars */}
      {backgroundEffect === 'spotlight' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <Spotlight
            gradientFirst={
              isDarkTheme
                ? `radial-gradient(68.54% 68.72% at 55.02% 31.46%, ${tokens.primary}25 0, ${tokens.primary}08 50%, transparent 80%)`
                : `radial-gradient(68.54% 68.72% at 55.02% 31.46%, ${tokens.primary}18 0, ${tokens.primary}05 50%, transparent 80%)`
            }
            gradientSecond={
              isDarkTheme
                ? `radial-gradient(50% 50% at 50% 50%, ${tokens.secondary}20 0, ${tokens.secondary}06 80%, transparent 100%)`
                : `radial-gradient(50% 50% at 50% 50%, ${tokens.secondary}14 0, ${tokens.secondary}03 80%, transparent 100%)`
            }
            gradientThird={
              isDarkTheme
                ? `radial-gradient(50% 50% at 50% 50%, ${tokens.accent}18 0, ${tokens.accent}04 80%, transparent 100%)`
                : `radial-gradient(50% 50% at 50% 50%, ${tokens.accent}12 0, ${tokens.accent}02 80%, transparent 100%)`
            }
          />
        </div>
      )}

      {backgroundEffect === 'wavy' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35 select-none">
          <WavyBackground
            colors={[tokens.primary, tokens.secondary, tokens.accent, tokens.ring, tokens.glow]}
            backgroundFill={tokens.background}
            blur={10}
            speed="slow"
            waveOpacity={0.4}
            containerClassName="h-full w-full"
          />
        </div>
      )}

      {backgroundEffect === 'gradient' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
          <BackgroundGradientAnimation
            gradientBackgroundStart={tokens.background}
            gradientBackgroundEnd={tokens.surface}
            firstColor={(() => {
              const clean = tokens.primary.replace('#', '');
              const r = parseInt(clean.substring(0, 2), 16) || 120;
              const g = parseInt(clean.substring(2, 4), 16) || 120;
              const b = parseInt(clean.substring(4, 6), 16) || 240;
              return `${r}, ${g}, ${b}`;
            })()}
            secondColor={(() => {
              const clean = tokens.secondary.replace('#', '');
              const r = parseInt(clean.substring(0, 2), 16) || 200;
              const g = parseInt(clean.substring(2, 4), 16) || 80;
              const b = parseInt(clean.substring(4, 6), 16) || 180;
              return `${r}, ${g}, ${b}`;
            })()}
            thirdColor={(() => {
              const clean = tokens.accent.replace('#', '');
              const r = parseInt(clean.substring(0, 2), 16) || 60;
              const g = parseInt(clean.substring(2, 4), 16) || 200;
              const b = parseInt(clean.substring(4, 6), 16) || 220;
              return `${r}, ${g}, ${b}`;
            })()}
            pointerColor="150, 150, 255"
            interactive={false}
            containerClassName="h-full w-full"
          />
        </div>
      )}

      {backgroundEffect === 'pillars' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
          <div 
            className="absolute -bottom-20 left-[18%] w-[160px] sm:w-[220px] h-[95%] origin-bottom animate-pillar-1"
            style={{
              background: `linear-gradient(to top, ${tokens.primary}88 0%, ${tokens.primary}22 50%, transparent 100%)`,
              filter: 'blur(55px)'
            }}
          />
          <div 
            className="absolute -bottom-20 left-[52%] w-[200px] sm:w-[260px] h-[100%] origin-bottom animate-pillar-2"
            style={{
              background: `linear-gradient(to top, ${tokens.accent}99 0%, ${tokens.accent}28 50%, transparent 100%)`,
              filter: 'blur(65px)'
            }}
          />
          <div 
            className="absolute -bottom-20 left-[82%] w-[150px] sm:w-[200px] h-[90%] origin-bottom animate-pillar-3"
            style={{
              background: `linear-gradient(to top, ${tokens.secondary}77 0%, ${tokens.secondary}18 50%, transparent 100%)`,
              filter: 'blur(50px)'
            }}
          />
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* Left Side: Color Tuner & Sliders (Reglar) */}
        <div 
          className={`lg:block ${sidebarOpen ? 'block' : 'hidden'} transition-all`}
        >
          <ColorTuner
            tokens={tokens}
            onChangeTokens={handleUpdateTokens}
            presetMood={presetMood}
            onChangeMood={setPresetMood}
            onAutoContrast={handleAutoContrast}
            onSnapToSweetSpot={handleSnapToSweetSpot}
            softenActive={softenActive}
            softenAmount={softenAmount}
            onToggleSoftenExtremes={handleToggleSoftenExtremes}
            onSetSoftenAmount={handleSetSoftenAmount}
            onCycleColors={handleCycleColors}
            onShuffleColors={handleShuffleColors}
            onNeobrutalize={handleNeobrutalize}
            onSaveCurrentTheme={handleSaveCurrentTheme}
            applyThemeToApp={applyThemeToApp}
          />
        </div>

        {/* Center / Right: Interactive Preview Canvas */}
        <main 
          className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 transition-colors duration-200"
          style={applyThemeToApp ? {
            backgroundColor: `${tokens.background}f4`,
          } : undefined}
        >
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Prominent Pro Templates Gallery Bar (Clear & Direct Access to all 100+ schemes) */}
            <ProTemplateGallery
              presets={allAvailableThemes}
              activePresetId={currentPreset.id}
              onSelectPreset={handleSelectPreset}
              tokens={tokens}
              applyThemeToApp={applyThemeToApp}
            />

            {/* Active Preview Showcase */}
            <div 
              className="shadow-xl overflow-hidden transition-all border"
              style={applyThemeToApp ? {
                borderColor: tokens.surfaceBorder,
                borderRadius: `${Math.max(tokens.radius + 4, 16)}px`,
                boxShadow: tokens.shadowMode === 'glow' 
                  ? `0 0 35px -5px ${tokens.glow || tokens.primary}35`
                  : tokens.shadowMode === 'elevated'
                  ? '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25)'
                  : tokens.shadowMode === 'brutalist'
                  ? '4px 4px 0px 0px rgba(0,0,0,1)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
              } : undefined}
            >
              {activeTab === 'gadgets' && (
                <GadgetShowcase 
                  tokens={tokens} 
                  onChangeTokens={handleUpdateTokens}
                  onNeobrutalize={handleNeobrutalize}
                />
              )}
              {activeTab === 'components' && (
                <ComponentGenerator tokens={tokens} />
              )}
              {activeTab === 'landing' && (
                <LandingPagePreview tokens={tokens} />
              )}
              {activeTab === 'dashboard' && (
                <DashboardPreview tokens={tokens} />
              )}
              {activeTab === 'contrast' && (
                <ContrastAnalyzer 
                  tokens={tokens} 
                  onChangeTokens={handleUpdateTokens} 
                />
              )}
              {activeTab === 'shades' && (
                <ShadesLightShowcase 
                  tokens={tokens} 
                  onChangeTokens={handleUpdateTokens} 
                  applyThemeToApp={applyThemeToApp} 
                  softenActive={softenActive}
                  softenAmount={softenAmount}
                  onToggleSoftenExtremes={handleToggleSoftenExtremes}
                />
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        tokens={tokens}
        presetName={currentPreset.name}
        presetMood={presetMood}
      />

      {/* Theme Manager Modal */}
      <ThemeManagerModal
        isOpen={isThemeManagerOpen}
        onClose={() => setIsThemeManagerOpen(false)}
        currentTokens={tokens}
        currentMood={presetMood}
        onLoadTheme={handleSelectPreset}
        savedCustomThemes={savedCustomThemes}
        onSaveCurrentTheme={handleSaveCurrentTheme}
        onDeleteCustomTheme={handleDeleteCustomTheme}
        activePresetId={currentPreset.id}
      />

      {/* Palette Import Modal (URL & Image) */}
      <PaletteImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onApplyTokens={handleApplyImportedTokens}
        onSaveToLibrary={handleSaveCurrentTheme}
        tokens={tokens}
      />

      {/* Gemini AI Design Chatbot Drawer */}
      <GeminiChatbotDrawer
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        currentTokens={tokens}
        currentPresetName={currentPreset.name}
        onApplyPalette={handleApplyChatbotPalette}
      />
    </div>
  );
}
