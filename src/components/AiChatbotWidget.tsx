import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageSquare, Send, X, ArrowRight } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { LeadServiceType, Locale, SiteSettings } from '../types/domain';
import { generateStandardChatReply } from '../utils/chatFallback';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStandardMode?: boolean;
}

interface AiChatbotWidgetProps {
  lang: Locale;
  siteSettings: SiteSettings;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onHandoffToLeadForm: (service: LeadServiceType, summaryNote: string) => void;
}

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function AiChatbotWidget({
  lang,
  siteSettings,
  isOpen,
  onToggle,
  onHandoffToLeadForm,
}: AiChatbotWidgetProps) {
  const t = COPY[lang].chat;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: COPY[lang].chat.welcome,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => (m.id === 'welcome' ? { ...m, content: COPY[lang].chat.welcome } : m))
    );
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setErrorMsg('');
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          messages: nextHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error('FALLBACK_STANDARD');
      }

      const data = (await response.json()) as { reply?: string; error?: string };
      if (!data.reply) {
        throw new Error('FALLBACK_STANDARD');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply!,
        },
      ]);
    } catch {
      const standardReply = generateStandardChatReply(trimmed, lang, siteSettings);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: standardReply,
          isStandardMode: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleHandoff = () => {
    const userQueries = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .slice(-2)
      .join(' | ');
    const summary = userQueries
      ? lang === 'en'
        ? `Summary from KotoAI chat: ${userQueries}`
        : `Ringkasan diskusi dengan KotoAI: ${userQueries}`
      : lang === 'en'
      ? 'Follow-up consultation from KotoAI assistant kotobatuah.com'
      : 'Konsultasi lanjutan dari asisten KotoAI kotobatuah.com';
    onToggle(false);
    onHandoffToLeadForm('Kampanye Digital', summary);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => onToggle(true)}
          aria-label={lang === 'en' ? 'Open KotoAI client assistant' : 'Buka asisten layanan klien KotoAI'}
          className="h-11 px-4 rounded-full bg-[#0D1117] hover:bg-stone-800 text-white shadow-lg border border-stone-700 inline-flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <MessageSquare className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
          <span className="whitespace-nowrap">{t.launcher}</span>
        </button>
      ) : (
        <div
          role="dialog"
          aria-label={t.title}
          className="w-[calc(100vw-2rem)] sm:w-96 max-h-[78vh] bg-white border border-stone-300 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#0D1117] text-white flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold tracking-tight">
                {t.title}
              </p>
              <p className="text-xs text-stone-400">
                {t.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggle(false)}
              aria-label={lang === 'en' ? 'Close KotoAI assistant' : 'Tutup asisten KotoAI'}
              className="w-8 h-8 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F7F4] min-h-[240px] max-h-[45vh]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  data-testid={`chat-msg-${msg.role}`}
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-white border border-stone-200 text-[#0D1117]'
                  }`}
                >
                  {renderFormattedText(msg.content)}
                  {msg.isStandardMode && (
                    <span className="block mt-2 pt-1.5 border-t border-stone-100 text-[11px] text-stone-500">
                      {t.fallbackCaption}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-500">
                  {t.typing}
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800"
              >
                {errorMsg}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-stone-200 flex flex-wrap gap-1.5">
              {t.quickPrompts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendMessage(q)}
                  className="text-left text-xs px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Handoff & Input */}
          <div className="p-3 bg-white border-t border-stone-200 space-y-2.5">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="kotoai-input" className="sr-only">
                {lang === 'en' ? 'Write your question' : 'Tulis pertanyaan Anda'}
              </label>
              <input
                id="kotoai-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 px-3 py-2 bg-[#F8F7F4] border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={lang === 'en' ? 'Send message' : 'Kirim pesan'}
                className="w-10 h-10 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={handleHandoff}
              className="w-full py-2 px-3 border border-stone-300 hover:bg-stone-100 text-[#0D1117] text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t.handoff}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
