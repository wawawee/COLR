import React, { useState, useMemo } from 'react';
import { ThemePreset, ThemeStyle, ThemeTokens } from '../types/theme';
import { getDescriptiveColorName } from '../utils/colorNames';
import { 
  Sparkles, 
  Search, 
  Check, 
  Flame, 
  Layers, 
  Laptop, 
  Compass, 
  Crown, 
  Zap, 
  Radio, 
  Feather, 
  Shield,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  SunMedium
} from 'lucide-react';

interface ProTemplateGalleryProps {
  presets: ThemePreset[];
  activePresetId: string;
  onSelectPreset: (preset: ThemePreset) => void;
  compact?: boolean;
  tokens?: ThemeTokens;
  applyThemeToApp?: boolean;
}

export const ProTemplateGallery: React.FC<ProTemplateGalleryProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  compact = false,
  tokens,
  applyThemeToApp = true,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('alla');
  const [figmaSubCategory, setFigmaSubCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const figmaCategories = [
    { id: 'all', label: 'Alla (100)' },
    { id: 'monochromatic', label: 'Monochromatic' },
    { id: 'romantic', label: 'Romantic' },
    { id: 'playful', label: 'Playful' },
    { id: 'vibrant', label: 'Vibrant' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'tranquil', label: 'Tranquil' },
    { id: 'seasonal', label: 'Seasonal' },
  ];

  const categories = [
    { id: 'alla', label: 'Alla Scheman', icon: Layers, count: presets.length },
    { id: 'figma', label: '🎨 Figma 100 Library', icon: Sparkles, count: presets.filter(p => p.id.startsWith('figma-')).length },
    { id: 'mellanläge', label: '⚖️ Mellanläge (Sweet Spot)', icon: SunMedium, count: presets.filter(p => p.styleCategory === 'mellanläge').length },
    { id: 'tech', label: 'Tech & SaaS', icon: Laptop, count: presets.filter(p => p.category === 'tech').length },
    { id: 'minimalistisk', label: 'Minimalistisk', icon: Compass, count: presets.filter(p => p.styleCategory === 'minimalistisk').length },
    { id: 'editorial', label: 'Lyx & Editorial', icon: Crown, count: presets.filter(p => p.category === 'editorial').length },
    { id: 'djärv', label: 'Cyber & Neon', icon: Zap, count: presets.filter(p => p.styleCategory === 'djärv').length },
    { id: 'retro', label: 'Retro & Analog', icon: Radio, count: presets.filter(p => p.styleCategory === 'retro').length },
    { id: 'mjuk', label: 'Mjuk & Pastell', icon: Feather, count: presets.filter(p => p.styleCategory === 'mjuk').length },
    { id: 'professionell', label: 'FinTech & Säkerhet', icon: Shield, count: presets.filter(p => p.styleCategory === 'professionell').length },
  ];

  const filteredPresets = useMemo(() => {
    return presets.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.styleCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tokens.primary.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'alla') return true;
      if (activeCategory === 'figma') {
        if (!p.id.startsWith('figma-')) return false;
        if (figmaSubCategory !== 'all') {
          return p.description.toLowerCase().includes(figmaSubCategory.toLowerCase()) ||
                 p.name.toLowerCase().includes(figmaSubCategory.toLowerCase());
        }
        return true;
      }
      if (activeCategory === 'tech') return p.category === 'tech';
      if (activeCategory === 'editorial') return p.category === 'editorial';
      return p.styleCategory === activeCategory;
    });
  }, [presets, searchQuery, activeCategory, figmaSubCategory]);

  const activePreset = presets.find(p => p.id === activePresetId) || presets[0];

  return (
    <div 
      className="border rounded-2xl shadow-sm transition-all overflow-hidden mb-5"
      style={applyThemeToApp && tokens ? {
        backgroundColor: tokens.surface,
        borderColor: tokens.surfaceBorder,
        borderRadius: `${Math.max(tokens.radius + 4, 16)}px`
      } : undefined}
    >
      
      {/* Top Banner / Toggle Header */}
      <div 
        className="p-4 sm:p-5 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors"
        style={applyThemeToApp && tokens ? {
          background: `linear-gradient(90deg, ${tokens.surface}, ${tokens.background})`,
          borderColor: tokens.surfaceBorder,
        } : undefined}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-md transition-all"
            style={applyThemeToApp && tokens ? {
              background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.secondary})`,
              color: tokens.primaryForeground,
              boxShadow: `0 4px 12px ${tokens.primary}35`,
              borderRadius: `${Math.min(tokens.radius + 3, 14)}px`
            } : undefined}
          >
            <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 
                className="text-base font-bold tracking-tight transition-colors"
                style={applyThemeToApp && tokens ? { color: tokens.text } : undefined}
              >
                Pro Templates Galleri
              </h2>
              <span 
                className="text-xs font-bold px-2 py-0.5 rounded-full border transition-colors"
                style={applyThemeToApp && tokens ? {
                  backgroundColor: `${tokens.primary}18`,
                  borderColor: `${tokens.primary}35`,
                  color: tokens.primary
                } : undefined}
              >
                {presets.length} Handkurerade Teman
              </span>
            </div>
            <p 
              className="text-xs transition-colors"
              style={applyThemeToApp && tokens ? { color: tokens.textMuted } : undefined}
            >
              Aktivt schema: <span className="font-semibold" style={applyThemeToApp && tokens ? { color: tokens.text } : undefined}>{activePreset.name}</span> ({activePreset.styleCategory})
            </p>
          </div>
        </div>

        {/* Search & Collapse Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={applyThemeToApp && tokens ? { color: tokens.textMuted } : undefined} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök template, stil eller hex..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none transition-colors font-medium"
              style={applyThemeToApp && tokens ? {
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 10)}px`,
                borderWidth: '1px'
              } : undefined}
            />
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg border transition-colors cursor-pointer"
            style={applyThemeToApp && tokens ? {
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${Math.min(tokens.radius, 8)}px`
            } : undefined}
            title={isExpanded ? 'Minimera galleri' : 'Expandera galleri'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Category Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer"
                  style={applyThemeToApp && tokens ? {
                    backgroundColor: isActive ? tokens.primary : tokens.background,
                    color: isActive ? tokens.primaryForeground : tokens.text,
                    borderColor: isActive ? tokens.primary : tokens.surfaceBorder,
                    borderWidth: '1px',
                    borderRadius: `${Math.min(tokens.radius, 8)}px`,
                  } : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span 
                    className="text-[10px] px-1 rounded"
                    style={applyThemeToApp && tokens ? {
                      backgroundColor: isActive ? 'rgba(0,0,0,0.2)' : `${tokens.surfaceBorder}`,
                      color: isActive ? tokens.primaryForeground : tokens.textMuted
                    } : undefined}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-filter bar for Figma category */}
          {activeCategory === 'figma' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs px-0.5">
              <span 
                className="text-[11px] font-bold shrink-0 uppercase tracking-wider mr-1"
                style={applyThemeToApp && tokens ? { color: tokens.textMuted } : undefined}
              >
                Figma-stil:
              </span>
              {figmaCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setFigmaSubCategory(sub.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
                  style={applyThemeToApp && tokens ? {
                    backgroundColor: figmaSubCategory === sub.id ? tokens.secondary : tokens.background,
                    color: figmaSubCategory === sub.id ? tokens.secondaryForeground : tokens.textMuted,
                    borderColor: figmaSubCategory === sub.id ? tokens.secondary : tokens.surfaceBorder,
                    borderWidth: '1px',
                    borderRadius: `${Math.min(tokens.radius, 8)}px`,
                  } : undefined}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredPresets.map((preset) => {
              const isSelected = activePresetId === preset.id;
              const isFigma = preset.id.startsWith('figma-');
              const t = preset.tokens;

              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative group ${
                    isSelected ? 'ring-2 shadow-sm' : 'hover:scale-[1.01]'
                  }`}
                  style={applyThemeToApp && tokens ? {
                    backgroundColor: isSelected ? `${tokens.primary}12` : tokens.background,
                    borderColor: isSelected ? tokens.primary : tokens.surfaceBorder,
                    borderRadius: `${Math.min(tokens.radius, 12)}px`,
                  } : undefined}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <h4 
                        className="text-xs font-bold truncate transition-colors"
                        style={applyThemeToApp && tokens ? { color: tokens.text } : undefined}
                      >
                        {preset.name}
                      </h4>
                      {isFigma ? (
                        <span 
                          className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded border shrink-0"
                          style={applyThemeToApp && tokens ? {
                            backgroundColor: `${tokens.accent}18`,
                            borderColor: `${tokens.accent}35`,
                            color: tokens.accent,
                            borderRadius: `${Math.min(tokens.radius, 6)}px`
                          } : undefined}
                        >
                          Figma 100
                        </span>
                      ) : (
                        <span 
                          className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border shrink-0"
                          style={applyThemeToApp && tokens ? {
                            backgroundColor: tokens.surface,
                            borderColor: tokens.surfaceBorder,
                            color: tokens.textMuted,
                            borderRadius: `${Math.min(tokens.radius, 6)}px`
                          } : undefined}
                        >
                          {preset.styleCategory}
                        </span>
                      )}
                    </div>

                    <p 
                      className="text-[11px] line-clamp-2 leading-relaxed mb-2.5 transition-colors"
                      style={applyThemeToApp && tokens ? { color: tokens.textMuted } : undefined}
                    >
                      {preset.mood}
                    </p>

                    {/* Swatches strip */}
                    <div className="flex items-center gap-1.5">
                      {[
                        { color: t.primary, label: 'Primär' },
                        { color: t.secondary, label: 'Sekundär' },
                        { color: t.accent, label: 'Accent' },
                        { color: t.background, label: 'Bakgrund' },
                        { color: t.surface, label: 'Kort' },
                      ].map((swatch, idx) => (
                        <div
                          key={idx}
                          title={`${swatch.label}: ${swatch.color} (${getDescriptiveColorName(swatch.color)})`}
                          className="w-5 h-5 rounded-md border border-black/10 dark:border-white/10 shadow-xs"
                          style={{ 
                            backgroundColor: swatch.color,
                            borderRadius: `${Math.min(tokens?.radius || 6, 6)}px`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom selection indicator */}
                  <div 
                    className="flex items-center justify-between pt-2 border-t text-[11px]"
                    style={applyThemeToApp && tokens ? { borderColor: tokens.surfaceBorder } : undefined}
                  >
                    <span 
                      className="font-mono text-[10px]"
                      style={applyThemeToApp && tokens ? { color: tokens.textMuted } : undefined}
                    >
                      {t.primary}
                    </span>
                    {isSelected ? (
                      <span 
                        className="font-bold flex items-center gap-1"
                        style={applyThemeToApp && tokens ? { color: tokens.primary } : undefined}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aktiv</span>
                      </span>
                    ) : (
                      <span 
                        className="font-medium group-hover:underline flex items-center gap-0.5"
                        style={applyThemeToApp && tokens ? { color: tokens.primary } : undefined}
                      >
                        <span>Välj tema</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPresets.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Inga färgteman matchade din sökning &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
