import { getErrorSuggestion } from '@/lib/python-errors';
import { parseErrorLine } from '@/lib/parse-error';
import { AlertTriangle, CheckCircle, Lightbulb, Terminal, Wand2, Loader2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface OutputPanelProps {
  output: string;
  error: string | null;
  isRunning: boolean;
  code: string;
  onApplyFix?: (fixedCode: string) => void;
  fixing?: boolean;
  fixedCode?: string | null;
  explanation?: string | null;
  onRequestFix?: () => void;
}

const OutputPanel = ({ output, error, isRunning, code, onApplyFix, fixing, fixedCode, explanation, onRequestFix }: OutputPanelProps) => {
  const suggestion = error ? getErrorSuggestion(error) : null;
  const parsed = error ? parseErrorLine(error) : null;
  const [copied, setCopied] = useState(false);
  const [showFullTrace, setShowFullTrace] = useState(false);

  const handleCopy = () => {
    if (fixedCode) {
      navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="font-mono text-sm text-muted-foreground">Output</span>
        {isRunning && (
          <span className="ml-auto flex items-center gap-1 text-xs text-primary animate-pulse-glow">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Running...
          </span>
        )}
        {!isRunning && !error && output && (
          <CheckCircle className="ml-auto h-4 w-4 text-success" />
        )}
        {!isRunning && error && (
          <AlertTriangle className="ml-auto h-4 w-4 text-destructive" />
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {!output && !error && !isRunning && (
          <p className="text-muted-foreground italic">Click "Run" or press Ctrl+Enter to execute your code...</p>
        )}

        {output && (
          <pre className="whitespace-pre-wrap text-foreground">{output}</pre>
        )}

        {error && (
          <div className="space-y-3">
            {/* Concise error with line number */}
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
              {parsed?.line && (
                <span className="inline-block rounded bg-destructive/20 px-1.5 py-0.5 font-mono text-[11px] text-destructive mb-1">
                  Line {parsed.line}
                </span>
              )}
              <pre className="whitespace-pre-wrap text-destructive text-sm font-semibold">{parsed?.message || error}</pre>
            </div>

            {/* Expandable full traceback */}
            <button
              onClick={() => setShowFullTrace(!showFullTrace)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showFullTrace ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showFullTrace ? 'Hide' : 'Show'} full traceback
            </button>
            {showFullTrace && (
              <pre className="whitespace-pre-wrap text-destructive/70 text-xs bg-destructive/5 rounded p-2 max-h-40 overflow-auto">{error}</pre>
            )}

            {suggestion && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <span className="font-sans text-sm font-semibold text-warning">Fix Suggestion</span>
                </div>
                <p className="font-sans text-sm text-foreground">{suggestion.message}</p>
                <p className="font-sans text-sm text-muted-foreground">{suggestion.fix}</p>
              </div>
            )}

            {/* AI Fix Button */}
            {!fixedCode && (
              <Button
                onClick={onRequestFix}
                disabled={fixing}
                size="sm"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {fixing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {fixing ? 'AI is fixing...' : '✨ Fix with AI'}
              </Button>
            )}

            {/* AI Suggested Fix */}
            {fixedCode && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    <span className="font-sans text-sm font-semibold text-primary">AI Suggested Fix</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap text-foreground bg-background/50 rounded p-2 text-xs max-h-48 overflow-auto">{fixedCode}</pre>
                {explanation && (
                  <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="font-sans text-xs text-muted-foreground">{explanation}</p>
                  </div>
                )}
                <Button
                  onClick={() => onApplyFix?.(fixedCode)}
                  size="sm"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="h-4 w-4" />
                  Apply Fix
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
