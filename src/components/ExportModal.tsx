import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Code, 
  FileJson, 
  FileText, 
  Bot, 
  Terminal,
  Layers,
  Image as ImageIcon,
  Palette,
  Braces
} from 'lucide-react';
import { ThemeTokens } from '../types/theme';
import { 
  generateAIAgentPrompt, 
  generateAIModelImagePrompt,
  generateHexColorsSummary,
  generateTailwindV4CSS, 
  generateCSSVariables, 
  generateTailwindV3Config, 
  generateJSONTokens,
  generateRawThemeTokensJSON,
  generateThemeTokensTailwindIntegration,
  generateTypeScriptThemeTokens,
  PromptConfig 
} from '../utils/exportGenerators';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: ThemeTokens;
  presetName: string;
  presetMood: string;
}

type ExportTab = 'hex-table' | 'raw-json' | 'image-prompt' | 'prompt' | 'tailwind-v4' | 'css-vars' | 'json';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  tokens,
  presetName,
  presetMood,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('hex-table');
  const [rawJsonFormat, setRawJsonFormat] = useState<'raw-tokens' | 'tailwind-config' | 'typescript'>('raw-tokens');
  const [agentType, setAgentType] = useState<PromptConfig['agentType']>('cursor');
  const [framework, setFramework] = useState<PromptConfig['framework']>('vite-tailwind-v4');
  const [customMood, setCustomMood] = useState<string>(presetMood);
  const [customImageNote, setCustomImageNote] = useState<string>('En modern webbapplikation med ren och inbjudande estetik');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Prepare active output text
  let outputText = '';
  let fileName = '';

  switch (activeTab) {
    case 'hex-table':
      outputText = generateHexColorsSummary(tokens, presetName);
      fileName = `${presetName.toLowerCase().replace(/\s+/g, '-')}-hex-colors.md`;
      break;
    case 'raw-json':
      if (rawJsonFormat === 'tailwind-config') {
        outputText = generateThemeTokensTailwindIntegration(tokens);
        fileName = 'tailwind.config.ts';
      } else if (rawJsonFormat === 'typescript') {
        outputText = generateTypeScriptThemeTokens(tokens);
        fileName = 'themeTokens.ts';
      } else {
        outputText = generateRawThemeTokensJSON(tokens);
        fileName = `${presetName.toLowerCase().replace(/\s+/g, '-')}-theme-tokens.json`;
      }
      break;
    case 'image-prompt':
      outputText = generateAIModelImagePrompt(tokens, presetName, customImageNote);
      fileName = `${presetName.toLowerCase().replace(/\s+/g, '-')}-ai-image-prompt.txt`;
      break;
    case 'prompt':
      outputText = generateAIAgentPrompt(tokens, {
        agentType,
        framework,
        customMoodText: customMood,
        presetName,
      });
      fileName = `${presetName.toLowerCase().replace(/\s+/g, '-')}-agent-prompt.md`;
      break;
    case 'tailwind-v4':
      outputText = generateTailwindV4CSS(tokens);
      fileName = 'theme-tailwind-v4.css';
      break;
    case 'css-vars':
      outputText = generateCSSVariables(tokens);
      fileName = 'theme-variables.css';
      break;
    case 'json':
      outputText = generateJSONTokens(tokens, presetName, customMood);
      fileName = 'theme-tokens.json';
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          color: tokens.text,
          borderRadius: `${Math.max(tokens.radius + 4, 16)}px`
        }}
      >
        
        {/* Modal Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-center justify-between transition-colors"
          style={{
            borderColor: tokens.surfaceBorder,
            backgroundColor: `${tokens.background}80`
          }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg text-white flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: tokens.primary,
                color: tokens.primaryForeground,
                borderRadius: `${Math.min(tokens.radius, 8)}px`
              }}
            >
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 
                className="text-base font-bold flex items-center gap-2"
                style={{ color: tokens.text }}
              >
                <span>Exportera Färger & AI-Prompts</span>
                <span 
                  className="text-xs font-semibold px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${tokens.primary}18`,
                    borderColor: `${tokens.primary}35`,
                    color: tokens.primary,
                    borderRadius: `${Math.min(tokens.radius, 6)}px`
                  }}
                >
                  {presetName}
                </span>
              </h2>
              <p 
                className="text-xs"
                style={{ color: tokens.textMuted }}
              >
                HEX-koder, bildgenererings-prompts, Tailwind v4 och AI-agentregler
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{
              color: tokens.textMuted,
              backgroundColor: tokens.background,
              borderRadius: `${Math.min(tokens.radius, 6)}px`
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div 
          className="px-4 sm:px-5 pt-3 border-b flex gap-2 overflow-x-auto"
          style={{
            backgroundColor: tokens.background,
            borderColor: tokens.surfaceBorder
          }}
        >
          <button
            onClick={() => setActiveTab('hex-table')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer"
            style={{
              borderColor: activeTab === 'hex-table' ? tokens.primary : 'transparent',
              color: activeTab === 'hex-table' ? tokens.primary : tokens.textMuted
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>1. HEX-Färger & Namn</span>
          </button>

          <button
            onClick={() => setActiveTab('raw-json')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'raw-json'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Braces className="w-3.5 h-3.5 text-amber-500" />
            <span>Raw JSON (ThemeTokens)</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              Tailwind
            </span>
          </button>

          <button
            onClick={() => setActiveTab('image-prompt')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'image-prompt'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. AI Bildprompt & Känsloton</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. AI Agent (Cursor / Claude)</span>
          </button>

          <button
            onClick={() => setActiveTab('tailwind-v4')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tailwind-v4'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Tailwind v4 (@theme)</span>
          </button>

          <button
            onClick={() => setActiveTab('css-vars')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'css-vars'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CSS Variabler</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'json'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Design Tokens (W3C)</span>
          </button>
        </div>

        {/* Customization controls if in 'raw-json' tab */}
        {activeTab === 'raw-json' && (
          <div className="p-4 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Raw ThemeTokens Export & Tailwind Integration
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {rawJsonFormat === 'raw-tokens' && 'Följer ThemeTokens-strukturen exakt. Klistra in direkt i din Tailwind-konfig, theme.json eller projektkod.'}
                  {rawJsonFormat === 'tailwind-config' && 'Färdig tailwind.config.ts med ThemeTokens integrerade i colors, border-radius och ramar.'}
                  {rawJsonFormat === 'typescript' && 'TypeScript-export med ThemeTokens-interface för stark typning i Vite/Next.js.'}
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                <button
                  onClick={() => setRawJsonFormat('raw-tokens')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    rawJsonFormat === 'raw-tokens'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {'{ }'} Raw JSON
                </button>
                <button
                  onClick={() => setRawJsonFormat('tailwind-config')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    rawJsonFormat === 'tailwind-config'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Tailwind Config
                </button>
                <button
                  onClick={() => setRawJsonFormat('typescript')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    rawJsonFormat === 'typescript'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  TypeScript (.ts)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customization controls if in 'image-prompt' tab */}
        {activeTab === 'image-prompt' && (
          <div className="p-4 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Anpassa appens syfte för bildprompten (t.ex. natur-app, fintech, gaming)
            </label>
            <input
              type="text"
              value={customImageNote}
              onChange={(e) => setCustomImageNote(e.target.value)}
              placeholder="Beskriv appens kontext..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium"
            />
          </div>
        )}

        {/* Customization controls if in 'prompt' tab */}
        {activeTab === 'prompt' && (
          <div className="p-4 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Mål-Agent / Verktyg
                </label>
                <select
                  value={agentType}
                  onChange={(e) => setAgentType(e.target.value as PromptConfig['agentType'])}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="cursor">Cursor (.cursorrules)</option>
                  <option value="windsurf">Windsurf Rules</option>
                  <option value="claude">Claude Code System Prompt</option>
                  <option value="v0">v0 / Lovable Prompt</option>
                  <option value="generic">Generisk Modell (Gemini / ChatGPT)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Teknisk Stack
                </label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as PromptConfig['framework'])}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="vite-tailwind-v4">Vite + React (Tailwind CSS v4)</option>
                  <option value="nextjs-tailwind-v4">Next.js App Router (Tailwind v4)</option>
                  <option value="vite-tailwind-v3">Vite (Tailwind CSS v3)</option>
                  <option value="nextjs-shadcn">Next.js + shadcn/ui</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Mood / Estetisk instruktion för Agenten
              </label>
              <input
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                placeholder="Exempel: Skandinavisk minimalism med varma accenter och skarp typografi"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>
          </div>
        )}

        {/* Code Output Viewer */}
        <div className="flex-1 overflow-hidden p-4 relative">
          <pre className="w-full h-80 sm:h-96 p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-auto leading-relaxed border border-slate-800 select-all">
            {outputText}
          </pre>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
            <span>Fil: {fileName}</span>
            <span>·</span>
            <span>{outputText.length} tecken</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ladda ner</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Kopierad till urklipp!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopiera</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
