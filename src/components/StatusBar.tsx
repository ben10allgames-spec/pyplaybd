import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

interface StatusBarProps {
  pyLoading: boolean;
  isRunning: boolean;
  error: string | null;
  code: string;
}

const StatusBar = ({ pyLoading, isRunning, error, code }: StatusBarProps) => {
  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="flex items-center justify-between border-t border-border bg-card/80 px-3 py-1 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-3">
        {pyLoading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            Loading Python…
          </span>
        ) : isRunning ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            Running…
          </span>
        ) : error ? (
          <span className="flex items-center gap-1 text-destructive">
            <AlertTriangle className="h-3 w-3" />
            Error
          </span>
        ) : (
          <span className="flex items-center gap-1 text-success">
            <CheckCircle className="h-3 w-3" />
            Ready
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span>Ln {lineCount}</span>
        <span>Ch {charCount}</span>
        <span>Python</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default StatusBar;
