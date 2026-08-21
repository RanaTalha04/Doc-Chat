import { useCallback, useEffect, useState } from 'react';
import type { ChatMessage, Session } from '@/types';
import { SAMPLE_SESSIONS } from '@/data/sessions';
import { generateAnswer } from '@/utils/ai';

const STORAGE_KEY = 'vra-sessions';

function loadSessions(): Session[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Session[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return SAMPLE_SESSIONS;
}

let idCounter = 0;
function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const initial = loadSessions();
    return initial.length > 0 ? initial[0].id : null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const selectSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, []);

  const createSession = useCallback(
    (filename: string, pageCount: number, pages: Session['pages']): string => {
      const id = uid('sess');
      const newSession: Session = {
        id,
        filename,
        pageCount,
        createdAt: Date.now(),
        pages,
        messages: [],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(id);
      return id;
    },
    [],
  );

  const addMessage = useCallback((sessionId: string, message: ChatMessage) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, messages: [...s.messages, message] } : s,
      ),
    );
  }, []);

  const askQuestion = useCallback(
    (sessionId: string, question: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;

      const userMsg: ChatMessage = {
        id: uid('m'),
        role: 'user',
        text: question,
        createdAt: Date.now(),
      };
      addMessage(sessionId, userMsg);

      // Generate a scripted AI answer based on the document content
      const answer = generateAnswer(session, question);
      const aiMsg: ChatMessage = {
        id: uid('m'),
        role: 'assistant',
        createdAt: Date.now() + 1,
        ...answer,
      };
      addMessage(sessionId, aiMsg);
    },
    [sessions, addMessage],
  );

  return {
    sessions,
    activeSession,
    activeSessionId,
    selectSession,
    createSession,
    askQuestion,
  };
}
