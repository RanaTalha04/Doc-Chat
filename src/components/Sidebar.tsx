import { FileText, Plus } from 'lucide-react';
import type { Session } from '@/types';
import { relativeTime } from '@/utils/time';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNewDocument: () => void;
}

export function Sidebar({ sessions, activeSessionId, onSelect, onNewDocument }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sunken">
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-mono text-[11px] uppercase tracking-[0.18em] text-tertiary mb-3">
          Visual Research Assistant
        </h1>
        <button
          onClick={onNewDocument}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-primary border border-app bg-elevated hover:bg-hover transition-colors"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          New document
        </button>
      </div>

      <div className="px-4 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-tertiary">
          Sessions
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-2 pb-4">
        {sessions.length === 0 ? (
          <p className="px-2 py-4 text-sm text-tertiary">No sessions yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <li key={session.id}>
                  <button
                    onClick={() => onSelect(session.id)}
                    className={`w-full text-left rounded-lg px-2.5 py-2.5 transition-colors group ${
                      isActive
                        ? 'bg-accent text-accent-contrast'
                        : 'hover:bg-hover text-primary'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <FileText
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          isActive ? 'text-accent-contrast' : 'text-tertiary'
                        }`}
                        strokeWidth={2}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium truncate ${
                            isActive ? 'text-accent-contrast' : 'text-primary'
                          }`}
                        >
                          {session.filename}
                        </p>
                        <p
                          className={`font-mono text-[11px] mt-0.5 flex items-center gap-1.5 ${
                            isActive ? 'text-accent-contrast opacity-70' : 'text-tertiary'
                          }`}
                        >
                          <span>{session.pageCount}p</span>
                          <span className="opacity-40">·</span>
                          <span>{relativeTime(session.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
