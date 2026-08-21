import { useCallback, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { DocumentPanel } from '@/components/DocumentPanel';
import { ChatPanel } from '@/components/ChatPanel';
import { useTheme } from '@/hooks/useTheme';
import { useResizable } from '@/hooks/useResizable';
import { useSessions } from '@/hooks/useSessions';
import type { Session } from '@/types';

const SIDEBAR_MIN = 200;
const DOC_MIN = 320;
const CHAT_MIN = 320;

export default function App() {
  const { theme, toggle } = useTheme();
  const { sessions, activeSession, activeSessionId, selectSession, createSession, askQuestion } =
    useSessions();

  const [highlightRegionId, setHighlightRegionId] = useState<string | null>(null);

  // Sidebar width: panel is to the LEFT of its divider, so dragging right grows it
  const sidebar = useResizable({
    initial: 260,
    min: SIDEBAR_MIN,
    max: 440,
    direction: 1,
  });

  // Chat width: panel is to the RIGHT of its divider, so dragging left grows it
  const chat = useResizable({
    initial: 400,
    min: CHAT_MIN,
    max: 640,
    direction: -1,
  });

  const handleNewDocument = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx,.txt,.md';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      // Create a new session with a single placeholder page
      const pages: Session['pages'] = [
        {
          pageNumber: 1,
          regions: [
            {
              id: `r-${Date.now()}-1`,
              layer: 'text',
              text: `Uploaded "${file.name}". Document content extraction would appear here — plain text, chart regions with AI interpretations, and table regions with structured data. This is a portfolio demo with sample content.`,
              page: 1,
            },
          ],
        },
      ];
      createSession(file.name, 1, pages);
    };
    input.click();
  }, [createSession]);

  const handleSwapDocument = useCallback(() => {
    handleNewDocument();
  }, [handleNewDocument]);

  const handleCitationClick = useCallback((regionId: string) => {
    setHighlightRegionId(regionId);
  }, []);

  const handleAsk = useCallback(
    (question: string) => {
      if (activeSessionId) askQuestion(activeSessionId, question);
    },
    [activeSessionId, askQuestion],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app text-primary">
      {/* Sidebar */}
      <div
        style={{ width: sidebar.width }}
        className="h-full shrink-0 border-r border-app"
      >
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={selectSession}
          onNewDocument={handleNewDocument}
        />
      </div>

      {/* Sidebar divider */}
      <Divider onPointerDown={sidebar.onPointerDown} />

      {/* Document panel — flexes to fill remaining space */}
      <div className="h-full min-w-0 flex-1">
        {activeSession ? (
          <DocumentPanel
            session={activeSession}
            onSwapDocument={handleSwapDocument}
            highlightRegionId={highlightRegionId}
            onHighlightConsumed={() => setHighlightRegionId(null)}
          />
        ) : (
          <EmptyState onNewDocument={handleNewDocument} />
        )}
      </div>

      {/* Chat divider */}
      <Divider onPointerDown={chat.onPointerDown} />

      {/* Chat panel */}
      <div
        style={{ width: chat.width }}
        className="h-full shrink-0 border-l border-app"
      >
        {activeSession ? (
          <ChatPanel
            session={activeSession}
            onAsk={handleAsk}
            onCitationClick={handleCitationClick}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-elevated">
            <p className="text-sm text-tertiary">No session selected.</p>
          </div>
        )}
      </div>

      {/* Theme toggle — top-right floating */}
      <button
        onClick={toggle}
        className="fixed top-3 right-3 z-50 rounded-lg p-2 bg-elevated border border-app text-secondary hover:text-primary hover:bg-hover transition-colors shadow-sm"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{ marginRight: 12 }}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" strokeWidth={2} />
        ) : (
          <Moon className="h-4 w-4" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}

function Divider({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="h-full w-1.5 shrink-0 cursor-col-resize bg-transparent hover:bg-[var(--border-strong)] active:bg-[var(--accent)] transition-colors relative group"
    >
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
}

function EmptyState({ onNewDocument }: { onNewDocument: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-app gap-4">
      <p className="text-sm text-tertiary max-w-xs text-center">
        No document loaded. Upload a document to start a new research session.
      </p>
      <button
        onClick={onNewDocument}
        className="rounded-lg px-4 py-2 text-sm font-medium bg-accent text-accent-contrast hover:opacity-90 transition-opacity"
      >
        New document
      </button>
    </div>
  );
}
