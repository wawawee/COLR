import React, { useState } from 'react';
import { ThemePreset, ThemeTokens, ThemeStyle } from '../types/theme';
import { THEME_PRESETS } from '../utils/presets';
import { getDescriptiveColorName } from '../utils/colorNames';
import { 
  X, 
  FolderHeart, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  Download, 
  Upload, 
  Filter,
  BookmarkPlus
} from 'lucide-react';

interface ThemeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTokens: ThemeTokens;
  currentMood: string;
  onLoadTheme: (preset: ThemePreset) => void;
  savedCustomThemes: ThemePreset[];
  onSaveCurrentTheme: (name: string, style: ThemeStyle, mood: string) => void;
  onDeleteCustomTheme: (id: string) => void;
  activePresetId: string;
}

export const ThemeManagerModal: React.FC<ThemeManagerModalProps> = ({
  isOpen,
  onClose,
  currentTokens,
  currentMood,
  onLoadTheme,
  savedCustomThemes,
  onSaveCurrentTheme,
  onDeleteCustomTheme,
  activePresetId,
}) => {
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('alla');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newThemeName, setNewThemeName] = useState<string>('Mitt Anpassade Tema');
  const [newThemeStyle, setNewThemeStyle] = useState<ThemeStyle>('minimalistisk');
  const [newThemeMood, setNewThemeMood] = useState<string>(currentMood);

  if (!isOpen) return null;

  // Combine built-in presets and user-saved custom themes
  const allThemes: ThemePreset[] = [...savedCustomThemes, ...THEME_PRESETS];

  const filteredThemes = allThemes.filter((theme) => {
    if (selectedStyleFilter === 'alla') return true;
    if (selectedStyleFilter === 'sparade') return theme.isCustom;
    return theme.styleCategory === selectedStyleFilter;
  });

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeName.trim()) return;
    onSaveCurrentTheme(newThemeName.trim(), newThemeStyle, newThemeMood.trim());
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: currentTokens.surface,
          borderColor: currentTokens.surfaceBorder,
          color: currentTokens.text,
          borderRadius: `${Math.max(currentTokens.radius + 4, 16)}px`
        }}
      >
        
        {/* Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-center justify-between"
          style={{
            borderColor: currentTokens.surfaceBorder,
            backgroundColor: `${currentTokens.background}80`
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <FolderHeart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Färghantare & Temabibliotek</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Tailwind v4
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skapa, spara, ladda och utforska förinställda teman baserade på designstilar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaving(!isSaving)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Spara Nuvarande Tema</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Theme Drawer/Form */}
        {isSaving && (
          <form onSubmit={handleSaveSubmit} className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-200 dark:border-indigo-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Spara dina justerade färgreglar som ett nytt tema
              </span>
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Avbryt
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Temanamn
                </label>
                <input
                  type="text"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium"
                  placeholder="t.ex. Min Skandinaviska Startup"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designstil
                </label>
                <select
                  value={newThemeStyle}
                  onChange={(e) => setNewThemeStyle(e.target.value as ThemeStyle)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="minimalistisk">Minimalistisk</option>
                  <option value="djärv">Djärv</option>
                  <option value="retro">Retro</option>
                  <option value="mjuk">Mjuk</option>
                  <option value="professionell">Professionell</option>
                  <option value="annan">Annan</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Känslomässig Ton & Mood
                </label>
                <input
                  type="text"
                  value={newThemeMood}
                  onChange={(e) => setNewThemeMood(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium"
                  placeholder="Kort beskrivning av känslan"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
              >
                Spara i Biblioteket
              </button>
            </div>
          </form>
        )}

        {/* Style Filter Bar */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto bg-slate-50 dark:bg-slate-900/50 text-xs">
          {[
            { id: 'alla', label: 'Alla Teman' },
            { id: 'minimalistisk', label: 'Minimalistisk' },
            { id: 'djärv', label: 'Djärv' },
            { id: 'retro', label: 'Retro' },
            { id: 'mjuk', label: 'Mjuk' },
            { id: 'professionell', label: 'Professionell' },
            { id: 'sparade', label: `Mina Sparade (${savedCustomThemes.length})` },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedStyleFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedStyleFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredThemes.map((theme) => {
            const isActive = activePresetId === theme.id;
            const t = theme.tokens;

            return (
              <div
                key={theme.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3.5 transition-all ${
                  isActive
                    ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {theme.name}
                      </h3>
                      {theme.isCustom && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          Eget Tema
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {theme.styleCategory}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {theme.mood}
                  </p>

                  {/* Swatches circle row */}
                  <div className="flex items-center gap-2 mb-3">
                    {[
                      { color: t.primary, label: 'Primär' },
                      { color: t.secondary, label: 'Sekundär' },
                      { color: t.accent, label: 'Accent' },
                      { color: t.background, label: 'Bakgrund' },
                      { color: t.surface, label: 'Kort' },
                      { color: t.text, label: 'Text' },
                    ].map((swatch, i) => (
                      <div
                        key={i}
                        title={`${swatch.label}: ${swatch.color} (${getDescriptiveColorName(swatch.color)})`}
                        className="w-6 h-6 rounded-md shadow-xs border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: swatch.color }}
                      />
                    ))}
                  </div>

                  {/* Key Colors in both HEX and Descriptive Name */}
                  <div className="text-[11px] space-y-1 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 font-mono">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span className="font-sans text-slate-500">Primärknapp:</span>
                      <span className="font-bold">{t.primary} <span className="font-sans font-normal text-slate-500">({getDescriptiveColorName(t.primary)})</span></span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span className="font-sans text-slate-500">Sekundär:</span>
                      <span className="font-bold">{t.secondary} <span className="font-sans font-normal text-slate-500">({getDescriptiveColorName(t.secondary)})</span></span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span className="font-sans text-slate-500">Accent:</span>
                      <span className="font-bold">{t.accent} <span className="font-sans font-normal text-slate-500">({getDescriptiveColorName(t.accent)})</span></span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span className="font-sans text-slate-500">Bakgrund:</span>
                      <span className="font-bold">{t.background} <span className="font-sans font-normal text-slate-500">({getDescriptiveColorName(t.background)})</span></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  {theme.isCustom ? (
                    <button
                      onClick={() => onDeleteCustomTheme(theme.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Radera</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Inbyggd standard
                    </span>
                  )}

                  <button
                    onClick={() => {
                      onLoadTheme(theme);
                      onClose();
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Aktivt Tema</span>
                      </>
                    ) : (
                      <span>Ladda Tema</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
