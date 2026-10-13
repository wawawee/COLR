import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Known popular brand color schemes for fast, reliable URL extraction
const POPULAR_BRAND_PALETTES: Record<string, any> = {
  'stripe.com': {
    name: 'Stripe Indigo Horizon',
    mood: 'Professionell, djärv och modern med Stripes ikoniska lila-blå toner och rena ytor.',
    styleCategory: 'professionell',
    tokens: {
      primary: '#635bff',
      primaryForeground: '#ffffff',
      secondary: '#00d4b2',
      secondaryForeground: '#0a2540',
      accent: '#ff705a',
      accentForeground: '#ffffff',
      background: '#0a2540',
      surface: '#113255',
      surfaceForeground: '#ffffff',
      surfaceBorder: '#1c4470',
      text: '#ffffff',
      textMuted: '#adbdcc',
      ring: '#635bff',
      glow: '#635bff',
      radius: 8,
      borderWidth: 1,
      shadowMode: 'subtle',
    },
  },
  'apple.com': {
    name: 'Apple Cupertino Titanium',
    mood: 'Exklusiv, minimalistisk precision med neutral titan, mörk obsidian och safirblå accenter.',
    styleCategory: 'minimalistisk',
    tokens: {
      primary: '#0071e3',
      primaryForeground: '#ffffff',
      secondary: '#86868b',
      secondaryForeground: '#ffffff',
      accent: '#2997ff',
      accentForeground: '#ffffff',
      background: '#000000',
      surface: '#161617',
      surfaceForeground: '#f5f5f7',
      surfaceBorder: '#424245',
      text: '#f5f5f7',
      textMuted: '#86868b',
      ring: '#0071e3',
      glow: '#0071e3',
      radius: 12,
      borderWidth: 1,
      shadowMode: 'subtle',
    },
  },
  'linear.app': {
    name: 'Linear Obsidian Violet',
    mood: 'Minimalistisk och högpresterande developer-darkmode med djup rymd och dämpad indigo.',
    styleCategory: 'minimalistisk',
    tokens: {
      primary: '#5e6ad2',
      primaryForeground: '#ffffff',
      secondary: '#4b5563',
      secondaryForeground: '#ffffff',
      accent: '#7070ff',
      accentForeground: '#ffffff',
      background: '#08090c',
      surface: '#14151b',
      surfaceForeground: '#eeeeee',
      surfaceBorder: '#232530',
      text: '#f4f5f6',
      textMuted: '#8a8f98',
      ring: '#5e6ad2',
      glow: '#5e6ad2',
      radius: 6,
      borderWidth: 1,
      shadowMode: 'subtle',
    },
  },
  'spotify.com': {
    name: 'Spotify Soundstage',
    mood: 'Ikonisk musikapp med neon-smaragdgrön på kolsvart botten och hög kontrast.',
    styleCategory: 'djärv',
    tokens: {
      primary: '#1ed760',
      primaryForeground: '#121212',
      secondary: '#1db954',
      secondaryForeground: '#121212',
      accent: '#ffffff',
      accentForeground: '#121212',
      background: '#121212',
      surface: '#181818',
      surfaceForeground: '#ffffff',
      surfaceBorder: '#282828',
      text: '#ffffff',
      textMuted: '#b3b3b3',
      ring: '#1ed760',
      glow: '#1ed760',
      radius: 8,
      borderWidth: 1,
      shadowMode: 'glow',
    },
  },
  'github.com': {
    name: 'GitHub Primer Dark',
    mood: 'Strukturerad och pålitlig kodmiljö med djup skiffer, diskreta ramar och smaragdgrön deploy-accent.',
    styleCategory: 'professionell',
    tokens: {
      primary: '#238636',
      primaryForeground: '#ffffff',
      secondary: '#58a6ff',
      secondaryForeground: '#0d1117',
      accent: '#3fb950',
      accentForeground: '#0d1117',
      background: '#0d1117',
      surface: '#161b22',
      surfaceForeground: '#c9d1d9',
      surfaceBorder: '#30363d',
      text: '#f0f6fc',
      textMuted: '#8b949e',
      ring: '#58a6ff',
      glow: '#238636',
      radius: 6,
      borderWidth: 1,
      shadowMode: 'subtle',
    },
  },
  'supabase.com': {
    name: 'Supabase Matrix Emerald',
    mood: 'Djärv open source Postgres estetik med smaragdgrön laser och djupsvart konsol.',
    styleCategory: 'djärv',
    tokens: {
      primary: '#3ecf8e',
      primaryForeground: '#1c1c1c',
      secondary: '#24b47e',
      secondaryForeground: '#ffffff',
      accent: '#6ee7b7',
      accentForeground: '#064e3b',
      background: '#171717',
      surface: '#232323',
      surfaceForeground: '#ededed',
      surfaceBorder: '#2e2e2e',
      text: '#ededed',
      textMuted: '#9e9e9e',
      ring: '#3ecf8e',
      glow: '#3ecf8e',
      radius: 6,
      borderWidth: 1,
      shadowMode: 'glow',
    },
  },
  'airbnb.com': {
    name: 'Airbnb Coral Haven',
    mood: 'Varm, inbjudande och social livsstil med energisk korallrosa på ljust elfenben.',
    styleCategory: 'mjuk',
    tokens: {
      primary: '#ff385c',
      primaryForeground: '#ffffff',
      secondary: '#e00b41',
      secondaryForeground: '#ffffff',
      accent: '#008489',
      accentForeground: '#ffffff',
      background: '#ffffff',
      surface: '#ffffff',
      surfaceForeground: '#222222',
      surfaceBorder: '#dddddd',
      text: '#222222',
      textMuted: '#717171',
      ring: '#ff385c',
      glow: '#ff385c',
      radius: 12,
      borderWidth: 1,
      shadowMode: 'subtle',
    },
  },
  'vercel.com': {
    name: 'Vercel Monochrome Precision',
    mood: 'Radikal arkitektonisk minimalism med rent svart/vitt och geometriska kanter.',
    styleCategory: 'minimalistisk',
    tokens: {
      primary: '#000000',
      primaryForeground: '#ffffff',
      secondary: '#333333',
      secondaryForeground: '#ffffff',
      accent: '#0070f3',
      accentForeground: '#ffffff',
      background: '#ffffff',
      surface: '#fafafa',
      surfaceForeground: '#171717',
      surfaceBorder: '#eaeaea',
      text: '#000000',
      textMuted: '#666666',
      ring: '#0070f3',
      glow: '#0070f3',
      radius: 6,
      borderWidth: 1,
      shadowMode: 'subtle',
    },
  },
  'figma.com': {
    name: 'Figma Brand & Resource Library',
    mood: 'Figma design tokens: Ikoniska Figma Red, Purple, Blue och Green balanserat med neutral mörk yta.',
    styleCategory: 'djärv',
    isFigmaLibrary: true,
    tokens: {
      primary: '#0d99ff',
      primaryForeground: '#ffffff',
      secondary: '#9747ff',
      secondaryForeground: '#ffffff',
      accent: '#f24e1e',
      accentForeground: '#ffffff',
      background: '#1e1e1e',
      surface: '#2c2c2c',
      surfaceForeground: '#ffffff',
      surfaceBorder: '#383838',
      text: '#ffffff',
      textMuted: '#b3b3b3',
      ring: '#0d99ff',
      glow: '#9747ff',
      radius: 8,
      borderWidth: 1,
      shadowMode: 'subtle',
    },
  },
};


// 1. URL Palette Extractor Endpoint
app.post('/api/extract-palette-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL är obligatorisk' });
    }

    // Clean URL to extract domain name
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://cleanUrl';
    }

    let hostname = '';
    try {
      hostname = new URL(cleanUrl).hostname.replace(/^www\./, '');
    } catch {
      hostname = cleanUrl.toLowerCase();
    }

    // Check if we have an instant verified brand scheme
    for (const [domain, preset] of Object.entries(POPULAR_BRAND_PALETTES)) {
      if (hostname.includes(domain.replace('.com', '').replace('.app', ''))) {
        return res.json({
          source: 'verified_brand',
          ...preset,
        });
      }
    }

    // Fallback: If GEMINI_API_KEY is available, we can ask Gemini Flash with web search or design reasoning
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Du är en expert på frontend UI-design, färgskalor och varumärken.
Analysera varumärket/webbplatsen med URL: "${cleanUrl}" (domän: "${hostname}").
Extrahera eller återskapa dess exakta eller mest representativa färgpalett och Tailwind-tokens.

Returnera ENBART ett giltigt JSON-objekt i följande format (utan markdown-kodblock, bara rå JSON):
{
  "name": "Namn på temat (t.ex. 'Stripe Indigo' eller 'Webbplats Namn')",
  "mood": "Kort beskrivning av färgpalettens ton och atmosfär",
  "styleCategory": "minimalistisk" | "djärv" | "retro" | "mjuk" | "professionell",
  "tokens": {
    "primary": "#hex",
    "primaryForeground": "#hex",
    "secondary": "#hex",
    "secondaryForeground": "#hex",
    "accent": "#hex",
    "accentForeground": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "surfaceForeground": "#hex",
    "surfaceBorder": "#hex",
    "text": "#hex",
    "textMuted": "#hex",
    "ring": "#hex",
    "glow": "#hex",
    "radius": 8,
    "borderWidth": 1,
    "shadowMode": "subtle"
  }
}`,
        });

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            source: 'gemini_ai',
            ...parsed,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini URL extraction error:', geminiErr);
      }
    }

    // Algorithmic fallback based on hostname hash
    let hash = 0;
    for (let i = 0; i < hostname.length; i++) {
      hash = (hash << 5) - hash + hostname.charCodeAt(i);
      hash |= 0;
    }
    const hue = Math.abs(hash) % 360;
    const secHue = (hue + 45) % 360;

    return res.json({
      source: 'algorithmic',
      name: `${hostname.charAt(0).toUpperCase() + hostname.slice(1)} Palett`,
      mood: `Automatisk extraherad harmonisk färgskala för ${hostname}.`,
      styleCategory: 'professionell',
      tokens: {
        primary: `hsl(${hue}, 80%, 50%)`,
        primaryForeground: '#ffffff',
        secondary: `hsl(${secHue}, 70%, 45%)`,
        secondaryForeground: '#ffffff',
        accent: `hsl(${(hue + 180) % 360}, 85%, 55%)`,
        accentForeground: '#ffffff',
        background: '#090a0f',
        surface: '#13151f',
        surfaceForeground: '#f8fafc',
        surfaceBorder: '#232738',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        ring: `hsl(${hue}, 80%, 50%)`,
        glow: `hsl(${hue}, 80%, 50%)`,
        radius: 8,
        borderWidth: 1,
        shadowMode: 'subtle',
      },
    });
  } catch (error: any) {
    console.error('URL extraction failed:', error);
    res.status(500).json({ error: 'Kunde inte extrahera färgskala från URL' });
  }
});

// 2. Image Palette Extractor via Gemini Vision Endpoint
app.post('/api/extract-palette-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 saknas' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({ 
        error: 'GEMINI_API_KEY saknas i miljön. Använd lokal canvas-kvantisering.' 
      });
    }

    const ai = new GoogleGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType,
              },
            },
            {
              text: `Du är en expert på färgteori, visuell estetik och designsystem (Tailwind CSS v4).
Analysera den bifogade bilden. Identifiera dess dominerande färger, atmosfär och accenter för att skapa ett komplett UI-färgschema för en modern webbapplikation.

Returnera ENBART ett giltigt JSON-objekt i följande format (utan markdown eller extra text):
{
  "name": "Kreativt namn inspirerat av bilden (t.ex. 'Nordisk Skymningsfjord' eller 'Solkysst Terrakotta')",
  "mood": "En poetisk och precis beskrivning av färgskalans känslomässiga ton och stämning (t.ex. 'En lugnande och naturlig palett med mjuka gröna och jordnära toner')",
  "styleCategory": "minimalistisk" | "djärv" | "retro" | "mjuk" | "professionell",
  "tokens": {
    "primary": "#hex (den starkaste, mest karaktäristiska färgen i bilden)",
    "primaryForeground": "#hex (#ffffff eller #09090b för hög kontrast)",
    "secondary": "#hex (stödjande harmonisk nyans från bilden)",
    "secondaryForeground": "#hex",
    "accent": "#hex (en iögonfallande höjdpunkt eller glödfärg)",
    "accentForeground": "#hex",
    "background": "#hex (bildens mörka skuggbotten eller ljusa bakgrund)",
    "surface": "#hex (kort- och panel-yta som vilar mot bakgrunden)",
    "surfaceForeground": "#hex",
    "surfaceBorder": "#hex (diskret ramfärg)",
    "text": "#hex (huvudtext med hög WCAG kontrast mot bakgrunden)",
    "textMuted": "#hex (dämpad metadata-text)",
    "ring": "#hex",
    "glow": "#hex",
    "radius": 10,
    "borderWidth": 1,
    "shadowMode": "subtle" | "glow" | "elevated" | "brutalist"
  }
}`,
            },
          ],
        },
      ],
    });

    const rawText = response.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Kunde inte parsa JSON från AI-svaret');
    }

    const result = JSON.parse(jsonMatch[0]);
    return res.json({
      source: 'gemini_vision',
      ...result,
    });
  } catch (error: any) {
    console.error('Image palette extraction error:', error);
    res.status(500).json({ error: error?.message || 'Misslyckades att analysera bilden med AI' });
  }
});

// 3. Multi-Turn AI Design Chatbot with Google Search Grounding
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, currentTheme } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Meddelandelistan saknas' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY saknas i servermiljön.' });
    }

    const ai = new GoogleGenAI();

    // Map conversation history to Gemini contents format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || m.text }],
    }));

    const systemInstruction = `Du är en svensktalande Senior Design Director och Färgteoretiker för ColorCraft Studio.
Ditt uppdrag är att hjälpa användaren att hitta, finslipa och skapa proffsiga färgpaletter och teman för webbapplikationer och landingpages (Vite / Next.js med Tailwind CSS v4).
Använd live Google Search för att hämta aktuell data om designtrender, populära varumärkespaletter och färgpsykologi.

När du rekommenderar ett färgschema eller skapar ett nytt för användaren:
Beskriv dess stämning och varför färgerna fungerar ihop.
Om användaren ber om en ny palett eller du föreslår en, inkludera ALLTID ett JSON-kodblock i slutet av ditt svar i exakt detta format så att användaren kan klicka för att applicera den direkt:

\`\`\`json
{
  "applyPalette": true,
  "name": "Namn på Paletten",
  "mood": "Stämningsbeskrivning",
  "styleCategory": "minimalistisk" | "djärv" | "retro" | "mjuk" | "professionell",
  "tokens": {
    "primary": "#hex",
    "primaryForeground": "#hex",
    "secondary": "#hex",
    "secondaryForeground": "#hex",
    "accent": "#hex",
    "accentForeground": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "surfaceForeground": "#hex",
    "surfaceBorder": "#hex",
    "text": "#hex",
    "textMuted": "#hex",
    "ring": "#hex",
    "glow": "#hex",
    "radius": 8,
    "borderWidth": 1,
    "shadowMode": "subtle"
  }
}
\`\`\`

Aktivt tema i appen just nu: ${JSON.stringify(currentTheme || {})}.
Var vänlig, professionell och estetiskt medveten.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });
    } catch (searchToolErr) {
      console.warn('Chat with googleSearch tool failed, retrying without tools:', searchToolErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction,
        },
      });
    }

    const replyText = response.text || '';

    // Check for web grounding search metadata
    const groundingChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks;
    const searchQueries = (response.candidates?.[0] as any)?.groundingMetadata?.webSearchQueries;

    // Check if there is an embedded palette JSON to offer 1-click apply
    let embeddedPalette = null;
    const jsonMatch = replyText.match(/```json\s*(\{[\s\S]*?"applyPalette":\s*true[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        embeddedPalette = JSON.parse(jsonMatch[1]);
      } catch (e) {
        // ignore json parse error
      }
    }

    return res.json({
      text: replyText,
      groundingChunks: groundingChunks || [],
      searchQueries: searchQueries || [],
      embeddedPalette,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error?.message || 'Ett fel uppstod i chatten' });
  }
});

// Vite Middleware integration in dev, or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ColorCraft server running on port ${PORT}`);
  });
}

startServer();
