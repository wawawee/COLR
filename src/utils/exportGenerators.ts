import { ThemeTokens } from '../types/theme';
import { getDescriptiveColorName, analyzePaletteMood, getPaletteDescriptiveDetails } from './colorNames';

export interface PromptConfig {
  agentType: 'cursor' | 'windsurf' | 'claude' | 'v0' | 'generic';
  framework: 'vite-tailwind-v4' | 'nextjs-tailwind-v4' | 'vite-tailwind-v3' | 'nextjs-shadcn';
  customMoodText?: string;
  presetName?: string;
}

/**
 * 1. Genererar ren lista/tabell över alla definierade färger i HEX-format med beskrivande namn
 */
export function generateHexColorsSummary(tokens: ThemeTokens, themeName?: string): string {
  const details = getPaletteDescriptiveDetails(tokens);
  const moodAnalysis = analyzePaletteMood(tokens);

  return `# FÄRGPALETT & HEX-SPECIFIKATION
Tema: ${themeName || 'Anpassat Tema'}
Känslomässig Ton: ${moodAnalysis.toneName}

| Roll / Token | HEX-kod | Beskrivande Färgnamn | Användningsområde |
| :--- | :--- | :--- | :--- |
${details.map(d => `| **${d.role}** | \`${d.hex}\` | ${d.name} | ${d.purpose} |`).join('\n')}

---
### Snabb-kopiering för CSS / Kod:
PRIMARY="${tokens.primary}"
PRIMARY_FOREGROUND="${tokens.primaryForeground}"
SECONDARY="${tokens.secondary}"
SECONDARY_FOREGROUND="${tokens.secondaryForeground}"
ACCENT="${tokens.accent}"
BACKGROUND="${tokens.background}"
SURFACE="${tokens.surface}"
BORDER="${tokens.surfaceBorder}"
TEXT="${tokens.text}"
TEXT_MUTED="${tokens.textMuted}"
`;
}

/**
 * 2. Genererar en prompt-sträng för AI-modeller (t.ex. bildgenerering Midjourney/Flux/Imagen/Gemini)
 * som beskriver den valda färgpaletten och dess känslomässiga ton.
 */
export function generateAIModelImagePrompt(tokens: ThemeTokens, themeName?: string, customNote?: string): string {
  const mood = analyzePaletteMood(tokens);
  const pName = getDescriptiveColorName(tokens.primary);
  const sName = getDescriptiveColorName(tokens.secondary);
  const bgName = getDescriptiveColorName(tokens.background);
  const aName = getDescriptiveColorName(tokens.accent);

  return `### 🎨 AI PROMPT: BILD- & STÄMNINGSGENERERING (Midjourney / Imagen / Gemini)

"${customNote ? customNote + '. ' : ''}${mood.emotionalDescription} Färgskalan definieras av primär ton ${pName} (${tokens.primary}), sekundär ton ${sName} (${tokens.secondary}) och en subtil accent i ${aName} (${tokens.accent}) mot ${bgName} (${tokens.background}). Lämpar sig utmärkt för ${mood.suggestedAppType}"

---

### Engelska (Optimerad för Midjourney v6 / Flux / Imagen 3):
\`\`\`text
${mood.imagePrompt}
\`\`\`

---

### Detaljerad stämnings- och känsloanalys:
- **Känslomässig karaktär:** ${mood.toneName}
- **Atmosfär:** ${mood.emotionalDescription}
- **Primärfärg:** ${tokens.primary} (${pName})
- **Sekundärfärg:** ${tokens.secondary} (${sName})
- **Accentfärg:** ${tokens.accent} (${aName})
- **Bakgrundsfärg:** ${tokens.background} (${bgName})
- **Rekommenderad applikationstyp:** ${mood.suggestedAppType}
`;
}

/**
 * 3. AI Agent System Prompt (Cursor, Windsurf, Claude Code, etc.)
 */
export function generateAIAgentPrompt(tokens: ThemeTokens, config: PromptConfig): string {
  const moodAnalysis = analyzePaletteMood(tokens);
  const mood = config.customMoodText || moodAnalysis.emotionalDescription;
  const frameworkName = 
    config.framework === 'vite-tailwind-v4' ? 'Vite + React med Tailwind CSS v4' :
    config.framework === 'nextjs-tailwind-v4' ? 'Next.js App Router med Tailwind CSS v4' :
    config.framework === 'vite-tailwind-v3' ? 'Vite + Tailwind CSS v3' : 'Next.js med shadcn/ui & Tailwind CSS';

  const agentHeader = 
    config.agentType === 'cursor' ? '# CURSOR RULES: DESIGN SYSTEM & THEME TOKENS' :
    config.agentType === 'windsurf' ? '# WINDSURF RULES: COLOR SCHEME & MOOD SPEC' :
    config.agentType === 'claude' ? '# CLAUDE CODE INSTRUCTIONS: UI THEMING & DESIGN GUIDELINES' :
    config.agentType === 'v0' ? '# V0 / LOVABLE PROMPT: COLOR DIRECTIVE & TAILWIND THEME' :
    '# AI AGENT SYSTEM PROMPT: DESIGN THEME';

  const details = getPaletteDescriptiveDetails(tokens);

  return `${agentHeader}

## 1. INTENTION, MOOD & KÄNSLOMÄSSIG TON
- **Tema:** ${config.presetName || 'Anpassat Tema'}
- **Känslomässig stämning:** ${mood}
- **Atmosfär och stil:** ${moodAnalysis.toneName}
- **Målstack:** ${frameworkName}
- **Riktlinjer:** Använd definierade semantiska tokens. Undvik generisk AI-slop (undvik slumpmässiga lila toningar om det inte explicit specificeras, och undvik onödiga piller-inramningar runt textmetadata). Respektera WCAG AA kontrast.

---

## 2. DEFINIERADE FÄRGER I HEX-FORMAT & BESKRIVANDE NAMN
${details.map(d => `- **${d.role}**: \`${d.hex}\` (${d.name}) — ${d.purpose}`).join('\n')}

- **Geometri:** Hörnradie \`${tokens.radius}px\`, Ramtjocklek \`${tokens.borderWidth}px\`, Skugga \`${tokens.shadowMode}\`.

---

## 3. TAILWIND CSS v4 KONFIGURATION (@theme)
Klistra in detta i din globala CSS-fil (\`src/index.css\` eller \`app/globals.css\`):

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: ${tokens.primary};
  --color-primary-foreground: ${tokens.primaryForeground};
  --color-secondary: ${tokens.secondary};
  --color-secondary-foreground: ${tokens.secondaryForeground};
  --color-accent: ${tokens.accent};
  --color-accent-foreground: ${tokens.accentForeground};
  --color-background: ${tokens.background};
  --color-surface: ${tokens.surface};
  --color-surface-foreground: ${tokens.surfaceForeground};
  --color-border: ${tokens.surfaceBorder};
  --color-text: ${tokens.text};
  --color-muted: ${tokens.textMuted};
  --color-ring: ${tokens.ring};
  --color-glow: ${tokens.glow};
  
  --radius-theme: ${tokens.radius}px;
}
\`\`\`

---

## 4. KNAPPAR OCH KOMPONENT-TILLSTÅND (STATES)
1. **Primärknapp**:
   - Normal: \`bg-primary text-primary-foreground\`
   - Hover: \`hover:opacity-90 hover:scale-[1.01]\`
   - Aktiv (klickad): \`active:scale-[0.98]\`
   - Inaktiv (disabled): \`disabled:opacity-50 disabled:cursor-not-allowed\`
2. **Sekundärknapp**:
   - Normal: \`border border-border bg-surface text-text\`
   - Hover: \`hover:bg-surface/80\`
   - Inaktiv: \`disabled:opacity-50\`
3. **Textknapp (Ghost)**:
   - Normal: \`bg-transparent text-text hover:bg-surface/50\`
4. **Länkknapp**:
   - Normal: \`text-primary hover:underline underline-offset-4\`
`;
}

export function generateTailwindV4CSS(tokens: ThemeTokens): string {
  return `@import "tailwindcss";

@theme {
  /* Brand & Accents */
  --color-primary: ${tokens.primary};
  --color-primary-foreground: ${tokens.primaryForeground};
  --color-secondary: ${tokens.secondary};
  --color-secondary-foreground: ${tokens.secondaryForeground};
  --color-accent: ${tokens.accent};
  --color-accent-foreground: ${tokens.accentForeground};

  /* Surfaces & Base */
  --color-background: ${tokens.background};
  --color-surface: ${tokens.surface};
  --color-surface-foreground: ${tokens.surfaceForeground};
  --color-border: ${tokens.surfaceBorder};

  /* Typography */
  --color-text: ${tokens.text};
  --color-muted: ${tokens.textMuted};

  /* Effects */
  --color-ring: ${tokens.ring};
  --color-glow: ${tokens.glow};

  /* Radii */
  --radius-theme: ${tokens.radius}px;
}
`;
}

export function generateCSSVariables(tokens: ThemeTokens): string {
  return `:root {
  --primary: ${tokens.primary};
  --primary-foreground: ${tokens.primaryForeground};
  --secondary: ${tokens.secondary};
  --secondary-foreground: ${tokens.secondaryForeground};
  --accent: ${tokens.accent};
  --accent-foreground: ${tokens.accentForeground};
  --background: ${tokens.background};
  --surface: ${tokens.surface};
  --surface-foreground: ${tokens.surfaceForeground};
  --border: ${tokens.surfaceBorder};
  --text: ${tokens.text};
  --muted: ${tokens.textMuted};
  --ring: ${tokens.ring};
  --glow: ${tokens.glow};
  --radius: ${tokens.radius}px;
}
`;
}

export function generateTailwindV3Config(tokens: ThemeTokens): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${tokens.primary}',
          foreground: '${tokens.primaryForeground}',
        },
        secondary: {
          DEFAULT: '${tokens.secondary}',
          foreground: '${tokens.secondaryForeground}',
        },
        accent: {
          DEFAULT: '${tokens.accent}',
          foreground: '${tokens.accentForeground}',
        },
        background: '${tokens.background}',
        surface: {
          DEFAULT: '${tokens.surface}',
          foreground: '${tokens.surfaceForeground}',
          border: '${tokens.surfaceBorder}',
        },
        text: '${tokens.text}',
        muted: '${tokens.textMuted}',
      },
      borderRadius: {
        themed: '${tokens.radius}px',
      },
    },
  },
  plugins: [],
};
`;
}

export function generateJSONTokens(tokens: ThemeTokens, name?: string, mood?: string): string {
  return JSON.stringify(
    {
      name: name || 'Custom Theme',
      mood: mood || 'Modern Web Application Theme',
      colors: {
        primary: { hex: tokens.primary, name: getDescriptiveColorName(tokens.primary) },
        primaryForeground: { hex: tokens.primaryForeground, name: getDescriptiveColorName(tokens.primaryForeground) },
        secondary: { hex: tokens.secondary, name: getDescriptiveColorName(tokens.secondary) },
        secondaryForeground: { hex: tokens.secondaryForeground, name: getDescriptiveColorName(tokens.secondaryForeground) },
        accent: { hex: tokens.accent, name: getDescriptiveColorName(tokens.accent) },
        accentForeground: { hex: tokens.accentForeground, name: getDescriptiveColorName(tokens.accentForeground) },
        background: { hex: tokens.background, name: getDescriptiveColorName(tokens.background) },
        surface: { hex: tokens.surface, name: getDescriptiveColorName(tokens.surface) },
        border: { hex: tokens.surfaceBorder, name: getDescriptiveColorName(tokens.surfaceBorder) },
        text: { hex: tokens.text, name: getDescriptiveColorName(tokens.text) },
        textMuted: { hex: tokens.textMuted, name: getDescriptiveColorName(tokens.textMuted) },
      },
      geometry: {
        radius: `${tokens.radius}px`,
        borderWidth: `${tokens.borderWidth}px`,
        shadowMode: tokens.shadowMode,
      },
    },
    null,
    2
  );
}

/**
 * Generates raw JSON that strictly follows the ThemeTokens interface structure,
 * allowing users to copy-paste the entire theme configuration directly into their
 * project files, Tailwind configs, or state stores.
 */
export function generateRawThemeTokensJSON(tokens: ThemeTokens): string {
  return JSON.stringify(tokens, null, 2);
}

/**
 * Generates a ready-to-use Tailwind config showing how to wire the ThemeTokens
 * directly into tailwind.config.ts / tailwind.config.js
 */
export function generateThemeTokensTailwindIntegration(tokens: ThemeTokens): string {
  return `// tailwind.config.ts (Direct ThemeTokens integration)
import type { Config } from 'tailwindcss';

// Paste or import your ThemeTokens JSON directly:
const theme = ${JSON.stringify(tokens, null, 2)};

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: theme.primary,
          foreground: theme.primaryForeground,
        },
        secondary: {
          DEFAULT: theme.secondary,
          foreground: theme.secondaryForeground,
        },
        accent: {
          DEFAULT: theme.accent,
          foreground: theme.accentForeground,
        },
        background: theme.background,
        surface: {
          DEFAULT: theme.surface,
          foreground: theme.surfaceForeground,
          border: theme.surfaceBorder,
        },
        text: {
          DEFAULT: theme.text,
          muted: theme.textMuted,
        },
        ring: theme.ring,
        glow: theme.glow,
      },
      borderRadius: {
        theme: \`\${theme.radius}px\`,
      },
      borderWidth: {
        theme: \`\${theme.borderWidth}px\`,
      },
    },
  },
  plugins: [],
} satisfies Config;
`;
}

/**
 * Generates a TypeScript module export matching the ThemeTokens interface
 */
export function generateTypeScriptThemeTokens(tokens: ThemeTokens, varName = 'themeTokens'): string {
  return `import { ThemeTokens } from './types/theme';

export const ${varName}: ThemeTokens = ${JSON.stringify(tokens, null, 2)};
`;
}

