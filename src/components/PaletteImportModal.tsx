import React, { useState, useRef } from 'react';
import { ThemeTokens, ThemePreset, ThemeStyle } from '../types/theme';
import { extractPaletteFromImageFile, extractFromImageElement, ExtractedColor } from '../utils/imageColorExtractor';
import { getDescriptiveColorName } from '../utils/colorNames';
import { 
  X, 
  Globe, 
  Image as ImageIcon, 
  Sparkles, 
  Loader2, 
  Check, 
  ArrowRight, 
  Upload, 
  BookmarkPlus,
  RefreshCw,
  ExternalLink,
  Layers,
  Bot,
  Search,
  Copy,
  Palette
} from 'lucide-react';
import { FIGMA_COMBINATIONS, figmaComboToThemePreset, FigmaCombination } from '../data/figmaPalettes';

interface PaletteImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTokens: (tokens: ThemeTokens, name: string, mood: string, style: ThemeStyle) => void;
  onSaveToLibrary: (name: string, style: ThemeStyle, mood: string, tokens: ThemeTokens) => void;
  tokens?: ThemeTokens;
}

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'Nordisk Skymningsfjord',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    desc: 'Svala blå fjordtoner, gyllene solnedgång och mörka bergsryggar',
  },
  {
    name: 'Cyberpunk Neon Tokyo',
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    desc: 'Elektrisk magenta, neoncyan och nattliga regnvåta gator',
  },
  {
    name: 'Solkysst Terrakotta',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    desc: 'Varma medelhavstoner, ockragult och sandstensarkitektur',
  },
  {
    name: 'Grönskande Matcha Zen',
    src: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    desc: 'Lugnande skogsgrönska, friskt daggvått lövverk och solljus',
  },
];

const POPULAR_URL_SHORTCUTS = [
  { label: '🎨 Figma 100 Library', url: 'https://www.figma.com/resource-library/color-combinations/' },
  { label: 'Stripe', url: 'https://stripe.com' },
  { label: 'Apple', url: 'https://apple.com' },
  { label: 'Linear', url: 'https://linear.app' },
  { label: 'Spotify', url: 'https://spotify.com' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Supabase', url: 'https://supabase.com' },
  { label: 'Vercel', url: 'https://vercel.com' },
  { label: 'Airbnb', url: 'https://airbnb.com' },
];


export const PaletteImportModal: React.FC<PaletteImportModalProps> = ({
  isOpen,
  onClose,
  onApplyTokens,
  onSaveToLibrary,
  tokens,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'image'>('url');

  // URL state
  const [inputUrl, setInputUrl] = useState<string>('https://stripe.com');
  const [isUrlLoading, setIsUrlLoading] = useState<boolean>(false);
  const [urlExtractedData, setUrlExtractedData] = useState<any | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Image state
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [imageMode, setImageMode] = useState<'canvas' | 'gemini'>('canvas');
  const [imageExtractedData, setImageExtractedData] = useState<any | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle URL extraction
  const handleExtractFromUrl = async (targetUrl: string = inputUrl) => {
    if (!targetUrl.trim()) return;
    setIsUrlLoading(true);
    setUrlError(null);

    try {
      const response = await fetch('/api/extract-palette-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      if (!response.ok) {
        throw new Error('Kunde inte nå URL-extraheraren');
      }

      const data = await response.json();
      setUrlExtractedData(data);
    } catch (err: any) {
      setUrlError(err.message || 'Ett fel uppstod vid hämtning av färger från webblänken');
    } finally {
      setIsUrlLoading(false);
    }
  };

  // Handle Image extraction (Local canvas or Gemini Vision)
  const handleProcessImage = async (fileOrUrl: File | string, mode: 'canvas' | 'gemini') => {
    setIsImageLoading(true);
    setImageError(null);

    try {
      if (typeof fileOrUrl === 'string') {
        // Load image from URL
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Kunde inte ladda exempelbild'));
          img.src = fileOrUrl;
        });

        if (mode === 'canvas') {
          const result = extractFromImageElement(img, 'Exempelbild');
          setImageExtractedData(result);
        } else {
          // Convert to base64 for Gemini
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(600, img.naturalWidth);
          canvas.height = Math.min(600, img.naturalHeight);
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL('image/jpeg', 0.8);

          const res = await fetch('/api/extract-palette-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' }),
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setImageExtractedData(data);
        }
      } else {
        // File upload
        if (mode === 'canvas') {
          const result = await extractPaletteFromImageFile(fileOrUrl);
          setImageExtractedData(result);
        } else {
          // Gemini Vision API call
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(fileOrUrl);
          });

          const res = await fetch('/api/extract-palette-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, mimeType: fileOrUrl.type }),
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setImageExtractedData(data);
        }
      }
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || 'Kunde inte analysera bilden. Pröva lokal snabb-kvantisering.');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      handleProcessImage(file, imageMode);
    }
  };

  const handleSampleImageClick = (sample: typeof SAMPLE_PRESET_IMAGES[0]) => {
    setImagePreviewUrl(sample.src);
    setSelectedImageFile(null);
    handleProcessImage(sample.src, imageMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-200"
        style={tokens ? {
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          color: tokens.text,
          borderRadius: `${Math.max(tokens.radius + 4, 16)}px`
        } : undefined}
      >
        
        {/* Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-center justify-between"
          style={tokens ? {
            borderColor: tokens.surfaceBorder,
            backgroundColor: `${tokens.background}80`
          } : undefined}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Extrahera Färgskala från Länk eller Bild</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  AI & URL
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skapa automatiserade färgteman direkt från webbplatser eller bilduppladdning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="px-4 sm:px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'url'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Extrahera från Webblänk (URL)</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'image'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. AI Bild-Import & Kvantisering</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: WEB LINK / URL */}
          {activeTab === 'url' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ange valfri webblänk (t.ex. https://stripe.com eller din egen webbplats)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => handleExtractFromUrl()}
                    disabled={isUrlLoading}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isUrlLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyserar...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Extrahera Färgskala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Popular Brand Shortcuts */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Snabbtester (Populära Varumärken):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_URL_SHORTCUTS.map((brand) => (
                    <button
                      key={brand.label}
                      onClick={() => {
                        setInputUrl(brand.url);
                        handleExtractFromUrl(brand.url);
                      }}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {brand.label}
                    </button>
                  ))}
                </div>
              </div>

              {urlError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                  {urlError}
                </div>
              )}

              {/* Result Preview */}
              {urlExtractedData && (
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {urlExtractedData.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {urlExtractedData.mood}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                      {urlExtractedData.styleCategory || 'professionell'}
                    </span>
                  </div>

                  {/* Swatches preview */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {[
                      { label: 'Primär', hex: urlExtractedData.tokens.primary },
                      { label: 'Sekundär', hex: urlExtractedData.tokens.secondary },
                      { label: 'Accent', hex: urlExtractedData.tokens.accent },
                      { label: 'Bakgrund', hex: urlExtractedData.tokens.background },
                      { label: 'Kort', hex: urlExtractedData.tokens.surface },
                      { label: 'Text', hex: urlExtractedData.tokens.text },
                    ].map((s) => (
                      <div key={s.label} className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-center" style={{ backgroundColor: s.hex }}>
                        <div className="text-[10px] font-bold px-1 py-0.5 rounded bg-black/40 text-white truncate">
                          {s.label}
                        </div>
                        <div className="text-[10px] font-mono text-white drop-shadow mt-1">
                          {s.hex}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
                    <button
                      onClick={() => {
                        onSaveToLibrary(
                          urlExtractedData.name,
                          urlExtractedData.styleCategory || 'professionell',
                          urlExtractedData.mood,
                          urlExtractedData.tokens
                        );
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Spara i Temabibliotek</span>
                    </button>

                    <button
                      onClick={() => {
                        onApplyTokens(
                          urlExtractedData.tokens,
                          urlExtractedData.name,
                          urlExtractedData.mood,
                          urlExtractedData.styleCategory || 'professionell'
                        );
                        onClose();
                      }}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Tillämpa på Appen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IMAGE IMPORT & AI EXTRACTION */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              {/* Extraction Engine Mode Switcher */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Extraheringsmetod
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Välj mellan blixtsnabb lokal kvantisering eller avancerad AI Vision
                  </div>
                </div>

                <div className="flex p-1 bg-slate-200/80 dark:bg-slate-900 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setImageMode('canvas')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      imageMode === 'canvas'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ⚡ Snabb Canvas
                  </button>
                  <button
                    onClick={() => setImageMode('gemini')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      imageMode === 'gemini'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Bot className="w-3 h-3 text-indigo-500" />
                    <span>AI Vision</span>
                  </button>
                </div>
              </div>

              {/* Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-850"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Släpp en bild här eller klicka för att bläddra
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Stöder PNG, JPG, WebP eller SVG (skärmdumpar av appar, foton, konstverk)
                </p>
              </div>

              {/* Preset Sample Images */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Eller testa en förinställd bild:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SAMPLE_PRESET_IMAGES.map((sample) => (
                    <div
                      key={sample.name}
                      onClick={() => handleSampleImageClick(sample)}
                      className="group p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 cursor-pointer transition-all space-y-1.5"
                    >
                      <div className="w-full h-18 rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={sample.src}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {sample.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isImageLoading && (
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/30 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyserar pixelstrukturer och färgharmoni...</span>
                </div>
              )}

              {imageError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                  {imageError}
                </div>
              )}

              {/* Image Result Preview */}
              {imageExtractedData && (
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {imageExtractedData.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {imageExtractedData.mood}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                      {imageExtractedData.styleCategory || 'mjuk'}
                    </span>
                  </div>

                  {/* Swatches preview */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {[
                      { label: 'Primär', hex: imageExtractedData.tokens.primary },
                      { label: 'Sekundär', hex: imageExtractedData.tokens.secondary },
                      { label: 'Accent', hex: imageExtractedData.tokens.accent },
                      { label: 'Bakgrund', hex: imageExtractedData.tokens.background },
                      { label: 'Kort', hex: imageExtractedData.tokens.surface },
                      { label: 'Text', hex: imageExtractedData.tokens.text },
                    ].map((s) => (
                      <div key={s.label} className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-center" style={{ backgroundColor: s.hex }}>
                        <div className="text-[10px] font-bold px-1 py-0.5 rounded bg-black/40 text-white truncate">
                          {s.label}
                        </div>
                        <div className="text-[10px] font-mono text-white drop-shadow mt-1">
                          {s.hex}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
                    <button
                      onClick={() => {
                        onSaveToLibrary(
                          imageExtractedData.name,
                          imageExtractedData.styleCategory || 'mjuk',
                          imageExtractedData.mood,
                          imageExtractedData.tokens
                        );
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Spara i Temabibliotek</span>
                    </button>

                    <button
                      onClick={() => {
                        onApplyTokens(
                          imageExtractedData.tokens,
                          imageExtractedData.name,
                          imageExtractedData.mood,
                          imageExtractedData.styleCategory || 'mjuk'
                        );
                        onClose();
                      }}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Tillämpa på Appen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
