import { RunRecord } from '@/hooks/useRunHistory';
import { History, CheckCircle, AlertTriangle, Trash2, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryPanelProps {
  history: RunRecord[];
  onRestore: (record: RunRecord) => void;
  onClear: () => void;
}

const HistoryPanel = ({ history, onRestore, onClear }: HistoryPanelProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const truncateCode = (code: string, maxLen = 60) => {
    const firstLine = code.split('\n').find(l => l.trim() && !l.trim().startsWith('#')) || code.split('\n')[0];
    return firstLine.length > maxLen ? firstLine.slice(0, maxLen) + '…' : firstLine;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider">History</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{history.length}</span>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-6 px-1.5 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Clock className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">Run history will appear here</p>
          </div>
        ) : (
          <div className="p-1">
            {history.map((record, i) => (
              <button
                key={record.id}
                onClick={() => onRestore(record)}
                className="group flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/50"
              >
                <div className="mt-0.5 shrink-0">
                  {record.error ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs text-foreground/80">{truncateCode(record.code)}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{formatTime(record.timestamp)}</p>
                </div>
                <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-primary" />
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;
