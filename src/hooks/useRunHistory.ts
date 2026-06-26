import { useState, useCallback } from 'react';

export interface RunRecord {
  id: string;
  code: string;
  output: string;
  error: string | null;
  timestamp: Date;
  label?: string;
}

const MAX_HISTORY = 50;

export function useRunHistory() {
  const [history, setHistory] = useState<RunRecord[]>([]);

  const addRun = useCallback((code: string, output: string, error: string | null) => {
    const record: RunRecord = {
      id: crypto.randomUUID(),
      code,
      output,
      error,
      timestamp: new Date(),
    };
    setHistory(prev => [record, ...prev].slice(0, MAX_HISTORY));
    return record;
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addRun, clearHistory };
}
