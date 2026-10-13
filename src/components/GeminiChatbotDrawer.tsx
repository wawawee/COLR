import React, { useState, useRef, useEffect } from 'react';
import { ThemeTokens, ThemePreset } from '../types/theme';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Globe, 
  Loader2, 
  Check, 
  Compass, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface GeminiChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTokens: ThemeTokens;
  currentPresetName: string;
  onApplyPalette: (palette: any) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  groundingChunks?: any[];
  searchQueries?: string[];
  embeddedPalette?: any;
}

export const GeminiChatbotDrawer: React.FC<GeminiChatbotDrawerProps> = ({
  isOpen,
  onClose,
  currentTokens,
  currentPresetName,
  onApplyPalette,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hej! Jag är din AI Design Director och färgkonsult, uppkopplad med **Google Search** för realtidsdata om designtrender 2026. 

Vad för slags app eller känsla bygger du? Fråga mig om trendiga paletter, varumärkesfärger eller be mig generera ett unikt tema skräddarsytt för ditt projekt!`,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedPaletteId, setAppliedPaletteId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string = inputPrompt) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentTheme: {
            name: currentPresetName,
            tokens: currentTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Kunde inte kontakta AI-assistenten.');
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: 'reply-' + Date.now(),
        role: 'model',
        content: data.text,
        groundingChunks: data.groundingChunks,
        searchQueries: data.searchQueries,
        embeddedPalette: data.embeddedPalette,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'model',
          content: `Ursäkta, ett fel inträffade: ${err.message || 'Kunde inte slutföra AI-sökningen.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPalette = (palette: any, msgId: string) => {
    onApplyPalette(palette);
    setAppliedPaletteId(msgId);
    setTimeout(() => setAppliedPaletteId(null), 3000);
  };

  const samplePrompts = [
    'Trendiga färger för B2B SaaS 2026',
    'Skapa en mörk cyberpunk-palett med neoncyan',
    'Färger för en lyxig hotell- & spa-app',
    'Minimalistisk skandinavisk mono med röd accent',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-110 md:w-128 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slideLeft">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-amber-500 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                AI Färgkonsult & Chatbot
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <Globe className="w-2.5 h-2.5" />
                <span>Search Grounding</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Gemini 3.5 Flash med realtidssökning efter designtrender
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content.replace(/```json[\s\S]*?```/g, '')}</div>

                  {/* Search Grounding Sources */}
                  {msg.searchQueries && msg.searchQueries.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 text-[10px] space-y-1">
                      <div className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-indigo-500" />
                        <span>Söktermer via Google Search:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.searchQueries.map((q, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono">
                            {q}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Embedded Palette Card for 1-Click Apply */}
                {msg.embeddedPalette && (
                  <div className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 dark:text-indigo-200">
                        {msg.embeddedPalette.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        {msg.embeddedPalette.styleCategory || 'rekommenderad'}
                      </span>
                    </div>

                    {/* Swatches */}
                    <div className="flex items-center gap-1.5">
                      {[
                        msg.embeddedPalette.tokens.primary,
                        msg.embeddedPalette.tokens.secondary,
                        msg.embeddedPalette.tokens.accent,
                        msg.embeddedPalette.tokens.background,
                        msg.embeddedPalette.tokens.surface,
                      ].map((c, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleApplyPalette(msg.embeddedPalette, msg.id)}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      {appliedPaletteId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Applicerat på appen!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Tillämpa denna palett</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Söker på Google och formulerar designteman...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-1.5 text-[11px]">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 whitespace-nowrap cursor-pointer transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Fråga om färgtrender, stilar eller be om paletter..."
            disabled={isLoading}
            className="flex-1 text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
