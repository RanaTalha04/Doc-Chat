import { useEffect, useRef, useState } from 'react';
import { BarChart3, Check, FileText, Send, Table2 } from 'lucide-react';
import type { ChatMessage, Citation, LayerType, Session } from '@/types';

interface ChatPanelProps {
  session: Session;
  onAsk: (question: string) => void;
  onCitationClick: (regionId: string) => void;
}

export function ChatPanel({ session, onAsk, onCitationClick }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [session.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onAsk(trimmed);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col bg-elevated">
      {/* Header */}
      <div className="px-5 py-3 border-b border-app">
        <h2 className="text-sm font-semibold text-primary">ask the document</h2>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin px-5 py-4">
        <div className="space-y-4">
          {session.messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-tertiary max-w-xs mx-auto">
                Ask a question about this document. I'll search the text, charts, and tables
                and cite the source for each answer.
              </p>
            </div>
          )}
          {session.messages.map((msg) => (
            <MessageView key={msg.id} message={msg} onCitationClick={onCitationClick} />
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-app">
        <div className="flex items-end gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this document…"
            className="flex-1 rounded-lg bg-sunken border border-app px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-strong transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 rounded-lg bg-accent text-accent-contrast p-2.5 hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            <Send className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageView({
  message,
  onCitationClick,
}: {
  message: ChatMessage;
  onCitationClick: (regionId: string) => void;
}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 text-sm bg-[var(--bubble-user)] text-[var(--bubble-user-text)]">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="max-w-[90%]">
        <p className="text-sm leading-relaxed text-primary">
          {message.text}
        </p>
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.citations.map((c, i) => (
              <CitationChip key={`${c.regionId}-${i}`} citation={c} onClick={onCitationClick} />
            ))}
          </div>
        )}
      </div>
      {message.verification && <VerificationTag status={message.verification} />}
    </div>
  );
}

function CitationChip({
  citation,
  onClick,
}: {
  citation: Citation;
  onClick: (regionId: string) => void;
}) {
  const meta = LAYER_CHIP_META[citation.layer];
  const Icon = meta.icon;

  return (
    <button
      onClick={() => onClick(citation.regionId)}
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-medium transition-transform hover:scale-105 cursor-pointer"
      style={{ backgroundColor: meta.bgVar, color: meta.textVar }}
    >
      {Icon && <Icon className="h-3 w-3" strokeWidth={2} />}
      {citation.label}
    </button>
  );
}

function VerificationTag({ status }: { status: 'verified' | 'low_confidence' }) {
  if (status === 'verified') {
    return (
      <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium font-mono"
        style={{ backgroundColor: 'var(--verified-bg)', color: 'var(--verified-text)' }}
      >
        <Check className="h-3 w-3" strokeWidth={2.5} />
        verified against source
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium font-mono"
      style={{ backgroundColor: 'var(--lowconf-bg)', color: 'var(--lowconf-text)' }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--lowconf-text)' }} />
      low confidence
    </div>
  );
}

const LAYER_CHIP_META: Record<
  LayerType,
  { icon: typeof BarChart3 | null; bgVar: string; textVar: string }
> = {
  text: { icon: null, bgVar: 'var(--chip-text-bg)', textVar: 'var(--text-secondary)' },
  chart: { icon: BarChart3, bgVar: 'var(--chip-chart-bg)', textVar: 'var(--chip-chart-text)' },
  table: { icon: Table2, bgVar: 'var(--chip-table-bg)', textVar: 'var(--chip-table-text)' },
};
