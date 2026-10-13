import React, { useState, useRef, useMemo } from 'react';
import { 
  ThemeTokens, 
  ThemePreset 
} from '../types/theme';
import { 
  generateColorShades, 
  ColorShadeStep, 
  ShadeStepNumber, 
  getOptimalTextColor,
  getContrastRatio,
  hexToHsl
} from '../utils/colorUtils';
import { 
  SunMedium, 
  Sparkles, 
  Sliders, 
  Copy, 
  Check, 
  Layers, 
  Eye, 
  MousePointer, 
  Zap, 
  Play, 
  Pause, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Info,
  Maximize2
} from 'lucide-react';

interface ShadesLightShowcaseProps {
  tokens: ThemeTokens;
  onChangeTokens?: (tokens: ThemeTokens) => void;
  applyThemeToApp?: boolean;
  softenActive?: boolean;
  softenAmount?: number;
  onToggleSoftenExtremes?: () => void;
}

type LightMode = 'pillars' | 'spotlight' | 'cursor' | 'crossbeams';
type StageBackground = 'dark' | 'slate' | 'studio' | 'light';
type ActiveSourceToken = 'primary' | 'secondary' | 'accent' | 'background' | 'surface';

export const ShadesLightShowcase: React.FC<ShadesLightShowcaseProps> = ({
  tokens,
  onChangeTokens,
  applyThemeToApp = true,
  softenActive = false,
  softenAmount = 0.55,
  onToggleSoftenExtremes,
}) => {
  // Source color being inspected in shades
  const [sourceToken, setSourceToken] = useState<ActiveSourceToken>('primary');
  const [selectedShadeStep, setSelectedShadeStep] = useState<ShadeStepNumber>(500);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Stage lighting controls
  const [lightMode, setLightMode] = useState<LightMode>('pillars');
  const [stageBg, setStageBg] = useState<StageBackground>('dark');
  const [lightIntensity, setLightIntensity] = useState<number>(75); // 20 to 100%
  const [lightSpeed, setLightSpeed] = useState<'paused' | 'gentle' | 'vivid'>('gentle');
  const [beamWidth, setBeamWidth] = useState<'narrow' | 'normal' | 'wide'>('normal');
  const [activeBeamSource, setActiveBeamSource] = useState<'primary' | 'secondary' | 'accent' | 'selectedShade' | 'white'>('primary');

  // Mouse tracking on stage
  const stageRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHoveringStage, setIsHoveringStage] = useState<boolean>(false);

  // Continuous scrubber value
  const [scrubberVal, setScrubberVal] = useState<number>(50);

  // Compute active base hex from selected source token
  const baseHex = useMemo(() => {
    switch (sourceToken) {
      case 'primary': return tokens.primary;
      case 'secondary': return tokens.secondary;
      case 'accent': return tokens.accent;
      case 'background': return tokens.background;
      case 'surface': return tokens.surface;
      default: return tokens.primary;
    }
  }, [tokens, sourceToken]);

  // Compute 11-step shades for base color
  const shades = useMemo(() => {
    return generateColorShades(baseHex);
  }, [baseHex]);

  // Find currently selected shade object
  const activeShade = useMemo(() => {
    return shades.find(s => s.step === selectedShadeStep) || shades[5];
  }, [shades, selectedShadeStep]);

  // Compute beam light color based on selection
  const beamColor = useMemo(() => {
    switch (activeBeamSource) {
      case 'primary': return tokens.primary;
      case 'secondary': return tokens.secondary;
      case 'accent': return tokens.accent;
      case 'selectedShade': return activeShade.hex;
      case 'white': return '#ffffff';
      default: return tokens.primary;
    }
  }, [activeBeamSource, tokens, activeShade]);

  // Handle stage mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleApplyAsToken = (target: 'primary' | 'secondary' | 'accent', hex: string) => {
    if (!onChangeTokens) return;
    const updated = { ...tokens, [target]: hex };
    if (target === 'primary') {
      updated.primaryForeground = getOptimalTextColor(hex);
      updated.ring = hex;
    } else if (target === 'secondary') {
      updated.secondaryForeground = getOptimalTextColor(hex);
    } else if (target === 'accent') {
      updated.accentForeground = getOptimalTextColor(hex);
      updated.glow = hex;
    }
    onChangeTokens(updated);
  };

  // Stage background color map
  const getStageBgColor = () => {
    switch (stageBg) {
      case 'dark': return '#07080f';
      case 'slate': return '#141722';
      case 'studio': return '#212433';
      case 'light': return '#f8fafc';
    }
  };

  // Stage text color
  const stageIsDark = stageBg !== 'light';
  const stageTextColor = stageIsDark ? '#f8fafc' : '#0f172a';
  const stageMutedColor = stageIsDark ? '#94a3b8' : '#64748b';

  // Animation duration style
  const getAnimDuration = () => {
    if (lightSpeed === 'paused') return '0s';
    if (lightSpeed === 'vivid') return '6s';
    return '11s';
  };

  return (
    <div 
      className="p-4 sm:p-6 lg:p-8 space-y-8 rounded-2xl transition-colors duration-200"
      style={{
        backgroundColor: tokens.background,
        color: tokens.text,
      }}
    >
      {/* Title & Introduction */}
      <div 
        className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius + 4}px`,
        }}
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1.5"
              style={{
                backgroundColor: `${tokens.primary}22`,
                color: tokens.primary,
                borderRadius: `${Math.max(4, tokens.radius - 4)}px`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin text-primary" style={{ animationDuration: '6s' }} />
              Ljuspelare & Nyans-laboratorium
            </span>
            <span style={{ color: tokens.textMuted }} className="text-xs hidden sm:inline">
              Upplev färger i dynamiska ljussken & 11 stegs nyanser
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: tokens.text }}>
            Ljuspelare, Rörliga Spotlights & Nyanser (Shades)
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: tokens.textMuted }}>
            Många färger är för bländande eller för mörka i platta färgprover. Här ser du hur färgens alla nyanser 
            (50 till 950) reagerar i <strong>rörliga ljuspelare</strong>, <strong>svepande spotlights</strong> och 
            hur subtila toner framträder när ljuset rör sig över ytorna.
          </p>
        </div>

        {/* Quick Source Token Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: tokens.textMuted }}>
            Inspektera:
          </span>
          <div 
            className="flex items-center p-1 rounded-xl border text-xs gap-1"
            style={{ backgroundColor: tokens.background, borderColor: tokens.surfaceBorder }}
          >
            {[
              { key: 'primary', label: 'Primär', color: tokens.primary },
              { key: 'secondary', label: 'Sekundär', color: tokens.secondary },
              { key: 'accent', label: 'Accent', color: tokens.accent },
              { key: 'background', label: 'Bakgrund', color: tokens.background },
              { key: 'surface', label: 'Yta/Kort', color: tokens.surface },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setSourceToken(item.key as ActiveSourceToken)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  sourceToken === item.key ? 'shadow-sm font-bold' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: sourceToken === item.key ? tokens.primary : 'transparent',
                  color: sourceToken === item.key ? tokens.primaryForeground : tokens.textMuted,
                  borderRadius: `${Math.min(tokens.radius, 8)}px`
                }}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: item.color }} 
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. INTERACTIVE LIGHT STAGE (SCEN MED LJUSPELARE OCH SPOTLIGHTS) */}
      <div 
        className="rounded-2xl border overflow-hidden shadow-2xl transition-all"
        style={{
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius + 8}px`,
        }}
      >
        {/* Stage Toolbar */}
        <div 
          className="p-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{
            backgroundColor: tokens.surface,
            borderColor: tokens.surfaceBorder,
            color: tokens.text
          }}
        >
          {/* Light Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs flex items-center gap-1.5" style={{ color: tokens.textMuted }}>
              <SunMedium className="w-3.5 h-3.5 text-amber-500" />
              <span>Ljuseffekt:</span>
            </span>
            <div 
              className="flex items-center p-0.5 rounded-lg border gap-0.5"
              style={{ backgroundColor: tokens.background, borderColor: tokens.surfaceBorder }}
            >
              {[
                { id: 'pillars', label: 'Ljuspelare (Pillars)', icon: Sparkles },
                { id: 'spotlight', label: 'Rörlig Spotlight', icon: SunMedium },
                { id: 'cursor', label: 'Följ Muspekaren', icon: MousePointer },
                { id: 'crossbeams', label: 'Korsande Strålar', icon: Zap },
              ].map(mode => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setLightMode(mode.id as LightMode)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      lightMode === mode.id ? 'font-bold shadow-xs' : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: lightMode === mode.id ? tokens.primary : 'transparent',
                      color: lightMode === mode.id ? tokens.primaryForeground : tokens.textMuted,
                      borderRadius: `${Math.min(tokens.radius, 6)}px`
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage Controls: Color, Speed, Background */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Beam Color Tint */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: tokens.textMuted }}>Strålfärg:</span>
              <div 
                className="flex items-center p-0.5 rounded-lg border gap-1"
                style={{ backgroundColor: tokens.background, borderColor: tokens.surfaceBorder }}
              >
                {[
                  { id: 'primary', label: 'Primär', color: tokens.primary },
                  { id: 'secondary', label: 'Sekundär', color: tokens.secondary },
                  { id: 'accent', label: 'Accent', color: tokens.accent },
                  { id: 'selectedShade', label: `Nyans ${activeShade.step}`, color: activeShade.hex },
                  { id: 'white', label: 'Kristallvit', color: '#ffffff' },
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBeamSource(b.id as any)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                      activeBeamSource === b.id ? 'font-bold shadow-xs' : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: activeBeamSource === b.id ? `${b.color}25` : 'transparent',
                      borderColor: activeBeamSource === b.id ? b.color : 'transparent',
                      color: activeBeamSource === b.id ? b.color : tokens.textMuted
                    }}
                    title={b.label}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="hidden sm:inline">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Background selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: tokens.textMuted }}>Scen:</span>
              <div 
                className="flex items-center p-0.5 rounded-lg border gap-0.5"
                style={{ backgroundColor: tokens.background, borderColor: tokens.surfaceBorder }}
              >
                {[
                  { id: 'dark', label: 'Rymdsvart', color: '#07080f' },
                  { id: 'slate', label: 'Skiffer', color: '#141722' },
                  { id: 'studio', label: 'Studio', color: '#212433' },
                  { id: 'light', label: 'Ljus', color: '#f8fafc' },
                ].map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => setStageBg(bg.id as StageBackground)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                      stageBg === bg.id ? 'font-bold shadow-xs' : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: stageBg === bg.id ? tokens.primary : 'transparent',
                      color: stageBg === bg.id ? tokens.primaryForeground : tokens.textMuted,
                      borderRadius: `${Math.min(tokens.radius, 4)}px`
                    }}
                  >
                    <span className="w-2 h-2 rounded-full border border-black/20" style={{ backgroundColor: bg.color }} />
                    <span>{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Speed toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLightSpeed(s => s === 'paused' ? 'gentle' : s === 'gentle' ? 'vivid' : 'paused')}
                className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                style={{
                  backgroundColor: tokens.background,
                  borderColor: tokens.surfaceBorder,
                  color: tokens.text
                }}
                title="Växla ljusets rörelsehastighet"
              >
                {lightSpeed === 'paused' ? <Play className="w-3 h-3 text-emerald-500" /> : <Pause className="w-3 h-3 text-amber-500" />}
                <span>
                  {lightSpeed === 'paused' ? 'Pausad' : lightSpeed === 'gentle' ? 'Lugn rörelse' : 'Livlig'}
                </span>
              </button>
            </div>

            {/* Quick Dämpa Ytterligheter Toggle */}
            {onToggleSoftenExtremes && (
              <button
                onClick={onToggleSoftenExtremes}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  softenActive ? 'shadow-xs' : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: softenActive ? `${tokens.primary}25` : tokens.background,
                  borderColor: softenActive ? tokens.primary : tokens.surfaceBorder,
                  color: softenActive ? tokens.primary : tokens.text
                }}
                title={
                  softenActive 
                    ? `Mjuk Kontrast är AKTIV (${Math.round(softenAmount * 100)}%). Klicka för full dynamik.`
                    : 'Dämpa ytterligheter: Gör de mörkaste tonerna ljusare och de ljusaste tonerna mörkare med bevarad kontrast.'
                }
              >
                <span>⚖️</span>
                <span>Dämpa extremer</span>
                <span 
                  className="px-1 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: softenActive ? tokens.primary : tokens.surfaceBorder,
                    color: softenActive ? tokens.primaryForeground : tokens.textMuted
                  }}
                >
                  {softenActive ? 'PÅ' : 'AV'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Canvas / Visual Stage */}
        <div 
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringStage(true)}
          onMouseLeave={() => setIsHoveringStage(false)}
          className="relative min-h-[480px] sm:min-h-[540px] p-6 sm:p-10 flex flex-col items-center justify-center overflow-hidden transition-colors select-none"
          style={{
            backgroundColor: getStageBgColor(),
            color: stageTextColor,
          }}
        >
          {/* ========================================================================= */}
          {/* LIGHT LAYER: VOLUMETRIC PILLARS, ORBITING SPOTLIGHTS & CURSOR LIGHT */}
          {/* ========================================================================= */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            
            {/* Ambient Background Aura */}
            <div 
              className="absolute inset-0 opacity-40 transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 50% 100%, ${beamColor}28 0%, transparent 70%)`
              }}
            />

            {/* MODE 1: VOLUMETRIC LIGHT PILLARS (Ljuspelare som rör sig) */}
            {lightMode === 'pillars' && (
              <>
                {/* Pillar 1 - Left-Center */}
                <div 
                  className={`absolute bottom-0 left-[20%] w-[120px] sm:w-[180px] h-[120%] origin-bottom ${
                    lightSpeed !== 'paused' ? 'animate-pillar-1' : ''
                  }`}
                  style={{
                    background: `linear-gradient(to top, ${beamColor}88 0%, ${beamColor}44 40%, ${beamColor}11 75%, transparent 100%)`,
                    filter: 'blur(35px)',
                    opacity: (lightIntensity / 100) * 0.85,
                  }}
                />

                {/* Pillar 2 - Center Main Beam */}
                <div 
                  className={`absolute bottom-0 left-[45%] w-[160px] sm:w-[240px] h-[130%] origin-bottom ${
                    lightSpeed !== 'paused' ? 'animate-pillar-2' : ''
                  }`}
                  style={{
                    background: `linear-gradient(to top, ${beamColor}aa 0%, ${beamColor}55 45%, ${beamColor}18 80%, transparent 100%)`,
                    filter: 'blur(45px)',
                    opacity: (lightIntensity / 100) * 0.95,
                  }}
                />

                {/* Pillar 3 - Right-Center */}
                <div 
                  className={`absolute bottom-0 left-[72%] w-[130px] sm:w-[190px] h-[115%] origin-bottom ${
                    lightSpeed !== 'paused' ? 'animate-pillar-3' : ''
                  }`}
                  style={{
                    background: `linear-gradient(to top, ${beamColor}77 0%, ${beamColor}35 35%, ${beamColor}0d 70%, transparent 100%)`,
                    filter: 'blur(40px)',
                    opacity: (lightIntensity / 100) * 0.75,
                  }}
                />

                {/* High-intensity Core Beams (sharp interior shafts) */}
                <div 
                  className={`absolute bottom-0 left-[48%] w-[24px] sm:w-[36px] h-[110%] origin-bottom ${
                    lightSpeed !== 'paused' ? 'animate-pillar-2' : ''
                  }`}
                  style={{
                    background: `linear-gradient(to top, #ffffffcc 0%, ${beamColor}bb 30%, ${beamColor}44 70%, transparent 100%)`,
                    filter: 'blur(10px)',
                    opacity: (lightIntensity / 100) * 0.7,
                  }}
                />

                {/* Floor Reflection Line */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[100px]"
                  style={{
                    background: `linear-gradient(to top, ${beamColor}45 0%, transparent 100%)`,
                    filter: 'blur(15px)'
                  }}
                />
              </>
            )}

            {/* MODE 2: MOVING CINEMATIC SPOTLIGHTS (Svepande strålkastare) */}
            {lightMode === 'spotlight' && (
              <>
                {/* Spotlight 1: Clockwise Orbiting Spotlight */}
                <div 
                  className={`absolute top-[20%] left-[30%] w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full ${
                    lightSpeed !== 'paused' ? 'animate-spotlight-1' : ''
                  }`}
                  style={{
                    background: `radial-gradient(circle, ${beamColor}99 0%, ${beamColor}44 40%, ${beamColor}10 70%, transparent 85%)`,
                    filter: 'blur(40px)',
                    opacity: lightIntensity / 100,
                  }}
                />

                {/* Spotlight 2: Counter-Clockwise Complementary Spotlight */}
                <div 
                  className={`absolute top-[40%] right-[25%] w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full ${
                    lightSpeed !== 'paused' ? 'animate-spotlight-2' : ''
                  }`}
                  style={{
                    background: `radial-gradient(circle, ${tokens.accent}88 0%, ${tokens.accent}35 45%, transparent 75%)`,
                    filter: 'blur(45px)',
                    opacity: (lightIntensity / 100) * 0.75,
                  }}
                />

                {/* Top Conical Beam Projection */}
                <div 
                  className={`absolute -top-[100px] left-[35%] w-[300px] h-[600px] origin-top ${
                    lightSpeed !== 'paused' ? 'animate-pillar-1' : ''
                  }`}
                  style={{
                    background: `conic-gradient(from 165deg at 50% 0%, transparent 0deg, ${beamColor}35 25deg, ${beamColor}55 35deg, ${beamColor}35 45deg, transparent 70deg)`,
                    filter: 'blur(20px)',
                    opacity: (lightIntensity / 100) * 0.8,
                  }}
                />
              </>
            )}

            {/* MODE 3: INTERACTIVE CURSOR SPOTLIGHT (Följ muspekaren) */}
            {lightMode === 'cursor' && (
              <>
                <div 
                  className="absolute w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
                  style={{
                    left: `${mousePos.x}%`,
                    top: `${mousePos.y}%`,
                    background: `radial-gradient(circle, ${beamColor}99 0%, ${beamColor}45 35%, ${beamColor}12 65%, transparent 80%)`,
                    filter: 'blur(35px)',
                    opacity: lightIntensity / 100,
                  }}
                />
                {/* Secondary subtle halo */}
                <div 
                  className="absolute w-[180px] h-[180px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${mousePos.x}%`,
                    top: `${mousePos.y}%`,
                    background: `radial-gradient(circle, #ffffff99 0%, ${beamColor}88 50%, transparent 80%)`,
                    filter: 'blur(12px)',
                    opacity: (lightIntensity / 100) * 0.85,
                  }}
                />
              </>
            )}

            {/* MODE 4: CROSSING BEAMS */}
            {lightMode === 'crossbeams' && (
              <>
                {/* Left diagonal beam */}
                <div 
                  className={`absolute -bottom-[50px] -left-[10%] w-[180px] sm:w-[260px] h-[140%] origin-bottom-left rotate-[28deg] ${
                    lightSpeed !== 'paused' ? 'animate-pillar-1' : ''
                  }`}
                  style={{
                    background: `linear-gradient(to top, ${beamColor}99 0%, ${beamColor}44 45%, transparent 90%)`,
                    filter: 'blur(35px)',
                    opacity: (lightIntensity / 100) * 0.85,
                  }}
                />
                {/* Right diagonal beam */}
                <div 
                  className={`absolute -bottom-[50px] -right-[10%] w-[180px] sm:w-[260px] h-[140%] origin-bottom-right -rotate-[28deg] ${
                    lightSpeed !== 'paused' ? 'animate-pillar-2' : ''
                  }`}
                  style={{
                    background: `linear-gradient(to top, ${tokens.accent}99 0%, ${tokens.accent}44 45%, transparent 90%)`,
                    filter: 'blur(35px)',
                    opacity: (lightIntensity / 100) * 0.85,
                  }}
                />
              </>
            )}

            {/* Atmospheric Dust / Particle Grid */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(circle, ${stageIsDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
                backgroundSize: '32px 32px'
              }}
            />
          </div>

          {/* ========================================================================= */}
          {/* ILLUMINATED STAGE CONTENT: CARDS & SPECULAR HIGHLIGHTS UNDER SPOTLIGHT */}
          {/* ========================================================================= */}
          <div className="relative z-10 w-full max-w-4xl space-y-6">

            {/* Interactive Notice on stage */}
            <div className="flex items-center justify-between text-[11px] font-medium px-2 py-1">
              <span className="flex items-center gap-1.5 opacity-80" style={{ color: stageMutedColor }}>
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {lightMode === 'cursor' 
                    ? 'Rör musen över scenen för att rikta spotlighten' 
                    : 'Observera hur ljuspelaren belyser kortens glaskanter, text och skuggor'}
                </span>
              </span>
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: `${beamColor}20`,
                  borderColor: `${beamColor}50`,
                  color: beamColor
                }}
              >
                Aktiv Ljuskälla: {activeBeamSource === 'selectedShade' ? `Nyans ${activeShade.step} (${activeShade.hex})` : activeBeamSource}
              </span>
            </div>

            {/* The Centerpiece: Floating Glassmorphic Card under the beam */}
            <div 
              className="relative p-6 sm:p-8 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-2xl overflow-hidden"
              style={{
                backgroundColor: stageIsDark 
                  ? 'rgba(18, 21, 32, 0.72)' 
                  : 'rgba(255, 255, 255, 0.85)',
                borderColor: `${beamColor}55`,
                boxShadow: `0 20px 45px -15px ${beamColor}40, 0 0 30px -10px ${beamColor}25`,
                borderRadius: `${tokens.radius + 6}px`
              }}
            >
              {/* Dynamic Specular Border Highlight (simulates light reflection on glass edge) */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  border: `1.5px solid ${beamColor}88`,
                  borderRadius: `${tokens.radius + 6}px`,
                  maskImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 75%)`,
                  WebkitMaskImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 75%)`,
                }}
              />

              {/* Inner ambient specular glow */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${beamColor}35 0%, transparent 60%)`,
                }}
              />

              {/* Card Content Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left side: Heading & Live component controls */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border"
                      style={{
                        backgroundColor: `${beamColor}25`,
                        borderColor: `${beamColor}60`,
                        color: beamColor,
                        borderRadius: `${Math.min(tokens.radius, 8)}px`
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Shade Testbänk</span>
                    </span>
                    <span className="text-xs" style={{ color: stageMutedColor }}>
                      Ljusstyrka {activeShade.lightness}% • Kontrast {activeShade.contrastOnDark}:1
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Hur nyanser bygger djup i modern design
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: stageMutedColor }}>
                    Istället för att bara använda en enda platt färg, använder du ljusare toner (100–300) 
                    för mjuka bakgrunder & badges, mellanlägen (500–600) för knappar och djupare nyanser (700–900) 
                    för skuggor och subtila delare under strålkastare.
                  </p>

                  {/* Real Interactive Button & Controls under light */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      style={{
                        backgroundColor: beamColor,
                        color: getOptimalTextColor(beamColor),
                        boxShadow: `0 6px 20px ${beamColor}55`,
                        borderRadius: `${tokens.radius}px`
                      }}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Primär Knapp i Ljussken</span>
                    </button>

                    <button
                      className="px-3.5 py-2.5 rounded-xl font-semibold text-xs border backdrop-blur-md transition-colors cursor-pointer"
                      style={{
                        backgroundColor: `${beamColor}18`,
                        borderColor: `${beamColor}45`,
                        color: stageTextColor,
                        borderRadius: `${tokens.radius}px`
                      }}
                    >
                      <span>Sekundär Glasbadge</span>
                    </button>

                    <div 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs"
                      style={{
                        borderColor: `${beamColor}35`,
                        backgroundColor: stageIsDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
                        color: stageMutedColor
                      }}
                    >
                      <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: beamColor }} />
                      <span>Volumetrisk reflektion aktiv</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Live Metric & Spectrum Visualizer */}
                <div className="md:col-span-5 space-y-4">
                  <div 
                    className="p-4 rounded-xl border backdrop-blur-md space-y-3"
                    style={{
                      backgroundColor: stageIsDark ? 'rgba(10, 12, 20, 0.75)' : 'rgba(255, 255, 255, 0.9)',
                      borderColor: `${beamColor}40`,
                      borderRadius: `${tokens.radius}px`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: stageMutedColor }}>
                        Spektral Ljusintensitet
                      </span>
                      <span className="text-xs font-bold" style={{ color: beamColor }}>
                        {lightIntensity}% Dimmer
                      </span>
                    </div>

                    {/* Mini live frequency/light wave */}
                    <div className="h-12 flex items-end gap-1.5 pt-2">
                      {[42, 68, 90, 75, 100, 85, 60, 92, 70, 88, 55, 95].map((val, idx) => (
                        <div 
                          key={idx}
                          className="flex-1 rounded-t transition-all duration-300"
                          style={{
                            height: `${Math.max(15, (val * (lightIntensity / 100)))}%`,
                            backgroundColor: idx === 4 || idx === 7 ? beamColor : `${beamColor}55`,
                            boxShadow: idx === 4 ? `0 0 10px ${beamColor}` : 'none'
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]" style={{ color: stageMutedColor }}>
                      <span>50 (Ljus tint)</span>
                      <span>500 (Bas)</span>
                      <span>950 (Djup skugga)</span>
                    </div>
                  </div>

                  {/* Quick Color Code chip */}
                  <div 
                    className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
                    style={{
                      borderColor: `${beamColor}35`,
                      backgroundColor: stageIsDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
                      color: stageTextColor
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded border border-white/20" style={{ backgroundColor: beamColor }} />
                      <span>{beamColor.toUpperCase()}</span>
                    </div>
                    <button
                      onClick={() => handleCopyHex(beamColor)}
                      className="flex items-center gap-1 font-sans text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {copiedHex === beamColor ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHex === beamColor ? 'Kopierad' : 'Kopiera'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Two Side-by-Side Stress-Test Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box 1: "För Bright / Bländande?" */}
              <div 
                className="p-4 sm:p-5 rounded-xl border backdrop-blur-md space-y-2 transition-all"
                style={{
                  backgroundColor: stageIsDark ? 'rgba(15, 18, 28, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${tokens.radius}px`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Om färgen är för bright (Överexponerad)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                    Ljusstyrka &gt; 75%
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: stageMutedColor }}>
                  I platt läge kan super-ljusa färger (t.ex. neoncyan eller skarp gul) bleka bort text och sakna kontrast. 
                  I en ljuspelare ser du hur nyans <strong>600 eller 700</strong> fungerar som en perfekt mättad kärna, 
                  medan nyans <strong>100–300</strong> används för strålens yttre glöd.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                    {shades.slice(0, 6).map(s => (
                      <div key={s.step} className="flex-1 h-full" style={{ backgroundColor: s.hex }} title={`Nyans ${s.step}: ${s.hex}`} />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: stageMutedColor }}>50 → 500</span>
                </div>
              </div>

              {/* Box 2: "För Mörk / Krossade skuggor?" */}
              <div 
                className="p-4 sm:p-5 rounded-xl border backdrop-blur-md space-y-2 transition-all"
                style={{
                  backgroundColor: stageIsDark ? 'rgba(15, 18, 28, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                  borderColor: tokens.surfaceBorder,
                  borderRadius: `${tokens.radius}px`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Om färgen är för mörk (Krossad svärta)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                    Ljusstyrka &lt; 20%
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: stageMutedColor }}>
                  Mycket mörka färger försvinner lätt mot mörk bakgrund. Under en rörlig spotlight ser du hur nyans 
                  <strong>400–500</strong> framträder som en krispig kantlinje (specular highlight) och ger 
                  ett lyxigt, sofistikerat djup utan att kännas platt.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                    {shades.slice(5).map(s => (
                      <div key={s.step} className="flex-1 h-full" style={{ backgroundColor: s.hex }} title={`Nyans ${s.step}: ${s.hex}`} />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: stageMutedColor }}>500 → 950</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 2. COMPLETE 11-STEP SHADE SPECTRUM MATRIX (50 TILL 950) */}
      <div 
        className="p-5 sm:p-6 rounded-2xl border space-y-5 transition-all"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius + 4}px`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold tracking-tight" style={{ color: tokens.text }}>
                Fullständig 11-stegs Nyansskala (Tonal Shades 50–950)
              </h3>
              <span 
                className="text-[11px] font-semibold px-2 py-0.5 rounded border uppercase"
                style={{
                  backgroundColor: `${tokens.primary}15`,
                  borderColor: `${tokens.primary}35`,
                  color: tokens.primary
                }}
              >
                Klicka för att rikta strålkastare
              </span>
            </div>
            <p className="text-xs" style={{ color: tokens.textMuted }}>
              Beräknad från {sourceToken} ({baseHex}). Klicka på valfri nyans för att se den i ljuspelarna ovan eller applicera i temat.
            </p>
          </div>

          {/* Active shade indicator & Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApplyAsToken('primary', activeShade.hex)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              style={{
                backgroundColor: activeShade.hex,
                color: activeShade.optimalText,
                borderRadius: `${Math.min(tokens.radius, 6)}px`
              }}
              title={`Sätt ${activeShade.hex} som Primär färg i hela appen`}
            >
              Använd nyans {activeShade.step} som Primär
            </button>
            <button
              onClick={() => handleApplyAsToken('accent', activeShade.hex)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer"
              style={{
                borderColor: tokens.surfaceBorder,
                backgroundColor: tokens.background,
                color: tokens.text,
                borderRadius: `${Math.min(tokens.radius, 6)}px`
              }}
              title={`Sätt ${activeShade.hex} som Accent i hela appen`}
            >
              Som Accent
            </button>
          </div>
        </div>

        {/* The 11 Swatches Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2.5">
          {shades.map((shade) => {
            const isSelected = selectedShadeStep === shade.step;
            return (
              <div
                key={shade.step}
                onClick={() => {
                  setSelectedShadeStep(shade.step);
                  setActiveBeamSource('selectedShade');
                }}
                className={`group relative p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer select-none ${
                  isSelected 
                    ? 'ring-2 ring-offset-2 scale-105 z-10 shadow-lg' 
                    : 'hover:scale-102 hover:shadow-md'
                }`}
                style={{
                  backgroundColor: tokens.background,
                  borderColor: isSelected ? tokens.primary : tokens.surfaceBorder,
                  borderRadius: `${tokens.radius}px`,
                  // @ts-ignore
                  '--tw-ring-color': tokens.primary
                }}
              >
                {/* Color block */}
                <div 
                  className="w-full h-16 sm:h-20 rounded-lg flex flex-col items-center justify-between p-1.5 transition-transform border border-black/10"
                  style={{
                    backgroundColor: shade.hex,
                    color: shade.optimalText,
                    borderRadius: `${Math.max(4, tokens.radius - 2)}px`
                  }}
                >
                  <div className="w-full flex items-center justify-between text-[10px] font-bold">
                    <span>{shade.step}</span>
                    {shade.isBase && (
                      <span className="px-1 py-0.2 bg-black/30 rounded text-[9px] uppercase font-mono">
                        Bas
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono tracking-tight font-semibold">
                    {shade.hex}
                  </span>
                </div>

                {/* Metrics below */}
                <div className="mt-2 space-y-1 text-center">
                  <div className="flex items-center justify-between text-[10px]" style={{ color: tokens.textMuted }}>
                    <span>Ljus:</span>
                    <span className="font-semibold" style={{ color: tokens.text }}>{shade.lightness}%</span>
                  </div>

                  {/* Contrast pill */}
                  <div className="flex items-center justify-between text-[9px]">
                    <span 
                      className={`px-1 py-0.2 rounded font-mono ${
                        shade.contrastOnDark >= 4.5 ? 'bg-emerald-500/15 text-emerald-500 font-bold' : 'text-zinc-400'
                      }`}
                      title={`Kontrast mot mörk bakgrund (#090a0f): ${shade.contrastOnDark}:1`}
                    >
                      {shade.contrastOnDark}:1 M
                    </span>
                    <span 
                      className={`px-1 py-0.2 rounded font-mono ${
                        shade.contrastOnLight >= 4.5 ? 'bg-emerald-500/15 text-emerald-500 font-bold' : 'text-zinc-400'
                      }`}
                      title={`Kontrast mot vit bakgrund (#ffffff): ${shade.contrastOnLight}:1`}
                    >
                      {shade.contrastOnLight}:1 V
                    </span>
                  </div>
                </div>

                {/* Copy button on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyHex(shade.hex);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/75 cursor-pointer"
                  title="Kopiera hex"
                >
                  {copiedHex === shade.hex ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Continuous Shade Scrubber Slider */}
        <div 
          className="p-4 rounded-xl border space-y-2"
          style={{
            backgroundColor: tokens.background,
            borderColor: tokens.surfaceBorder,
            borderRadius: `${tokens.radius}px`
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold flex items-center gap-1.5" style={{ color: tokens.text }}>
              <Sliders className="w-3.5 h-3.5 text-primary" />
              <span>Kontinuerlig Nyans-skanner (Scrubber)</span>
            </span>
            <span style={{ color: tokens.textMuted }} className="font-mono text-[11px]">
              Dra för att utforska kontinuerlig övergång från mörkt till ljust
            </span>
          </div>

          {/* Gradient bar with slider */}
          <div className="relative pt-1">
            <div 
              className="h-4 rounded-full overflow-hidden border border-black/10"
              style={{
                background: `linear-gradient(to right, ${shades.map(s => s.hex).join(', ')})`
              }}
            />
            <input 
              type="range"
              min="0"
              max="100"
              value={scrubberVal}
              onChange={(e) => {
                const val = Number(e.target.value);
                setScrubberVal(val);
                // Map to closest step
                const stepIdx = Math.min(10, Math.floor((val / 100) * 11));
                const s = shades[stepIdx];
                if (s) {
                  setSelectedShadeStep(s.step);
                  setActiveBeamSource('selectedShade');
                }
              }}
              className="w-full mt-2 accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* 3. PRACTICAL UI APPLICATIONS IN DIFFERENT SHADES */}
      <div 
        className="p-5 sm:p-6 rounded-2xl border space-y-4 transition-all"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius + 4}px`,
        }}
      >
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold tracking-tight" style={{ color: tokens.text }}>
            Hur nyanserna ska tillämpas i UI-gränssnitt
          </h3>
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            Se hur samma grundfärg delas upp i 4 praktiska designlager för att undvika övermättnad och garantera visuell harmoni.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Tint Layer (100-200) */}
          <div 
            className="p-4 rounded-xl border space-y-3"
            style={{
              backgroundColor: `${shades[1].hex}20`,
              borderColor: `${shades[2].hex}40`,
              borderRadius: `${tokens.radius}px`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: shades[6].hex }}>
                1. Ytor & Badges (100–200)
              </span>
              <span className="text-[10px] font-mono" style={{ color: tokens.textMuted }}>{shades[1].hex}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: tokens.text }}>
              Lätta, mjuka nyanser är perfekta för chip-bakgrunder, radmarkeringar och aktiva taggar utan att distrahera.
            </p>
            <div 
              className="px-2.5 py-1 rounded inline-block text-[11px] font-semibold"
              style={{ backgroundColor: shades[1].hex, color: shades[1].optimalText }}
            >
              Aktiv Filter-tagg
            </div>
          </div>

          {/* Card 2: Mid-tone Focus (500-600) */}
          <div 
            className="p-4 rounded-xl border space-y-3"
            style={{
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${tokens.radius}px`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: shades[5].hex }}>
                2. Knappar & Fokus (500–600)
              </span>
              <span className="text-[10px] font-mono" style={{ color: tokens.textMuted }}>{shades[5].hex}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: tokens.textMuted }}>
              Huvudknappar, aktiva ikoner och radioknappar. Tillräcklig mättnad för att fånga ögat omedelbart.
            </p>
            <button 
              className="w-full py-1.5 rounded text-xs font-bold text-center shadow-sm cursor-pointer"
              style={{ backgroundColor: shades[5].hex, color: shades[5].optimalText }}
            >
              Huvudhandling
            </button>
          </div>

          {/* Card 3: Deep Shadows & Borders (700-800) */}
          <div 
            className="p-4 rounded-xl border space-y-3"
            style={{
              backgroundColor: tokens.background,
              borderColor: `${shades[7].hex}60`,
              borderRadius: `${tokens.radius}px`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: shades[7].hex }}>
                3. Delare & Skuggor (700–800)
              </span>
              <span className="text-[10px] font-mono" style={{ color: tokens.textMuted }}>{shades[7].hex}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: tokens.textMuted }}>
              Subtila konturer, djupa kantskuggor och text i ljust läge. Ger struktur utan att bli för hård.
            </p>
            <div 
              className="p-2 rounded text-center text-xs font-semibold border"
              style={{ borderColor: shades[7].hex, color: shades[7].hex }}
            >
              Rammad Kortgräns
            </div>
          </div>

          {/* Card 4: Light Pillar Highlight (Atmospheric) */}
          <div 
            className="relative p-4 rounded-xl border space-y-3 overflow-hidden"
            style={{
              backgroundColor: '#0a0d17',
              borderColor: `${beamColor}55`,
              borderRadius: `${tokens.radius}px`,
              color: '#ffffff'
            }}
          >
            <div 
              className="absolute -top-10 -right-10 w-24 h-24 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${beamColor}aa 0%, transparent 70%)`,
                filter: 'blur(15px)'
              }}
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: beamColor }}>
                4. Ljuspelare (Glow)
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Speculär</span>
            </div>
            <p className="relative z-10 text-xs leading-relaxed text-zinc-300">
              Ger gränssnittet liv genom rörlig glöd och ljuspelare som mjukt lyfter kort och viktiga statusar.
            </p>
            <div 
              className="relative z-10 py-1 px-2 rounded text-[11px] font-bold text-center border"
              style={{
                backgroundColor: `${beamColor}20`,
                borderColor: beamColor,
                color: beamColor
              }}
            >
              Levande Stråle
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
