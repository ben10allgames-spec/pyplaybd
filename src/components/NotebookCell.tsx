import { useState, useRef, useEffect, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Play,
  Loader2,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Wand2,
  Check,
  Copy,
  Lightbulb,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseErrorLine } from "@/lib/parse-error";
import { getErrorSuggestion } from "@/lib/python-errors";
import { useAIFix } from "@/hooks/useAIFix";
import { useIsMobile } from "@/hooks/use-mobile";
import { configurePythonLanguage, pythonEditorOptions } from "@/lib/monaco-python";
import { registerInlineCompletions } from "@/lib/inline-completions";

export type CellType = "code" | "markdown";

export interface CellData {
  id: string;
  type: CellType;
  code: string;
  output: string;
  error: string | null;
  isRunning: boolean;
  executionCount: number | null;
  executionTime: string | null;
  /** For markdown cells: whether currently in edit mode */
  editing?: boolean;
}

interface NotebookCellProps {
  cell: CellData;
  index: number;
  totalCells: number;
  onCodeChange: (id: string, code: string) => void;
  onRun: (id: string) => void;
  onDelete: (id: string) => void;
  onAddBelow: (id: string, type?: CellType) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onSetEditing?: (id: string, editing: boolean) => void;
  isActive: boolean;
  onFocus: (id: string) => void;
  pyLoading?: boolean;
  /** When provided, registers an inline-completion fetcher with monaco. */
  suggestFn?: (prefix: string, suffix: string) => Promise<string>;
}

const NotebookCell = ({
  cell,
  index,
  totalCells,
  onCodeChange,
  onRun,
  onDelete,
  onAddBelow,
  onMoveUp,
  onMoveDown,
  onSetEditing,
  isActive,
  onFocus,
  pyLoading = false,
  suggestFn,
}: NotebookCellProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const isMobile = useIsMobile();
  const { fixing, fixedCode, explanation, getAIFix, clearFix } = useAIFix();
  const [showFullTrace, setShowFullTrace] = useState(false);
  const [copied, setCopied] = useState(false);

  const lineCount = cell.code.split("\n").length;
  const editorHeight = Math.max(80, Math.min(lineCount * 20 + 24, 400));

  const parsed = cell.error ? parseErrorLine(cell.error) : null;
  const suggestion = cell.error ? getErrorSuggestion(cell.error) : null;

  const handleMount: OnMount = (ed, monaco) => {
    editorRef.current = ed;
    configurePythonLanguage(monaco);
    if (suggestFn) registerInlineCompletions(monaco, suggestFn);
    ed.onDidFocusEditorText(() => onFocus(cell.id));
  };

  // Highlight error line
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const model = ed.getModel();
    if (!model) return;
    const monaco = (window as any).monaco;
    if (monaco) monaco.editor.setModelMarkers(model, "python-error", []);
    if (decorationsRef.current) {
      decorationsRef.current.clear();
      decorationsRef.current = null;
    }
    if (parsed?.line && parsed.line > 0 && parsed.line <= model.getLineCount()) {
      decorationsRef.current = ed.createDecorationsCollection([
        {
          range: { startLineNumber: parsed.line, startColumn: 1, endLineNumber: parsed.line, endColumn: 1 },
          options: { isWholeLine: true, className: "error-line-highlight" },
        },
      ]);
    }
  }, [cell.error, parsed?.line]);

  useEffect(() => {
    clearFix();
  }, [cell.code, clearFix]);

  const handleAIFix = useCallback(async () => {
    if (!cell.error) return;
    await getAIFix(cell.code, cell.error);
  }, [cell.code, cell.error, getAIFix]);

  const handleApplyFix = useCallback(
    (code: string) => {
      onCodeChange(cell.id, code);
      clearFix();
    },
    [cell.id, onCodeChange, clearFix],
  );

  const handleCopyFix = useCallback(() => {
    if (fixedCode) {
      navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fixedCode]);

  // ===== Markdown cell =====
  if (cell.type === "markdown") {
    const isEditing = cell.editing ?? cell.code.length === 0;
    return (
      <div
        className={`group relative border rounded-lg transition-colors ${
          isActive ? "border-primary/40" : "border-border hover:border-muted-foreground/30"
        } bg-card/30`}
        onClick={() => onFocus(cell.id)}
      >
        <div className="flex items-center gap-1 px-2 py-1 border-b border-border/50">
          <span className="font-mono text-[10px] text-muted-foreground px-2">Markdown</span>
          <div className="ml-auto flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onSetEditing?.(cell.id, !isEditing);
              }}
              title={isEditing ? "Render" : "Edit"}
            >
              {isEditing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            </Button>
            {!isMobile && (
              <>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onMoveUp(cell.id)} disabled={index === 0}>
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onMoveDown(cell.id)} disabled={index === totalCells - 1}>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onAddBelow(cell.id, "code")}>
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive/60 hover:text-destructive"
              onClick={() => onDelete(cell.id)}
              disabled={totalCells <= 1}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {isEditing ? (
          <textarea
            value={cell.code}
            placeholder="Write markdown… # Heading, **bold**, lists, links, ```python code blocks```"
            onChange={(e) => onCodeChange(cell.id, e.target.value)}
            onBlur={() => {
              if (cell.code.trim()) onSetEditing?.(cell.id, false);
            }}
            className="w-full bg-transparent px-3 py-2 font-mono text-sm text-foreground focus:outline-none resize-y min-h-[80px]"
            autoFocus
          />
        ) : (
          <div
            className="prose-md px-4 py-3 cursor-text text-sm"
            onDoubleClick={() => onSetEditing?.(cell.id, true)}
          >
            {cell.code.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{cell.code}</ReactMarkdown>
            ) : (
              <span className="text-muted-foreground italic">Empty text cell — click pencil to edit</span>
            )}
          </div>
        )}
      </div>
    );
  }

  // ===== Code cell =====
  return (
    <div
      className={`group relative border rounded-lg transition-colors ${
        isActive ? "border-primary/50 shadow-sm shadow-primary/10" : "border-border hover:border-muted-foreground/30"
      }`}
      onClick={() => onFocus(cell.id)}
    >
      <div className="flex items-center gap-1 px-2 py-1 border-b border-border/50 bg-card/50">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 touch-manipulation"
          onClick={(e) => {
            e.stopPropagation();
            onRun(cell.id);
          }}
          disabled={cell.isRunning || pyLoading}
          title="Run cell (Shift+Enter)"
        >
          {cell.isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Play className="h-4 w-4 text-primary" />
          )}
        </Button>

        <span className="font-mono text-[10px] text-muted-foreground min-w-[32px]">
          [{cell.executionCount ?? " "}]
        </span>

        {cell.executionTime && (
          <span className="font-mono text-[10px] text-muted-foreground">{cell.executionTime}</span>
        )}

        <div
          className={`ml-auto flex items-center gap-0.5 ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
        >
          {!isMobile && (
            <>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onMoveUp(cell.id)} disabled={index === 0}>
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onMoveDown(cell.id)} disabled={index === totalCells - 1}>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onAddBelow(cell.id, "code")} title="Add code cell below">
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive/60 hover:text-destructive"
            onClick={() => onDelete(cell.id)}
            disabled={totalCells <= 1}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div style={{ height: editorHeight }}>
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={cell.code}
          onChange={(value) => onCodeChange(cell.id, value || "")}
          onMount={handleMount}
          options={pythonEditorOptions(isMobile)}
        />
      </div>

      {(cell.output || cell.error) && (
        <div className="border-t border-border/50 bg-background/50 px-3 py-2 max-h-[350px] overflow-auto">
          {cell.output && !cell.error && (
            <pre className="font-mono text-xs text-foreground/80 whitespace-pre-wrap">{cell.output}</pre>
          )}

          {cell.error && (
            <div className="space-y-2">
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 space-y-1">
                {parsed?.line && (
                  <span className="inline-block rounded bg-destructive/20 px-1.5 py-0.5 font-mono text-[10px] text-destructive mb-1">
                    ⚠ Line {parsed.line}
                  </span>
                )}
                <pre className="whitespace-pre-wrap text-destructive text-xs font-semibold">
                  {parsed?.message || cell.error}
                </pre>
              </div>

              <button
                onClick={() => setShowFullTrace(!showFullTrace)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {showFullTrace ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />}
                {showFullTrace ? "Hide" : "Show"} full traceback
              </button>
              {showFullTrace && (
                <pre className="whitespace-pre-wrap text-destructive/70 text-[10px] bg-destructive/5 rounded p-2 max-h-32 overflow-auto">
                  {cell.error}
                </pre>
              )}

              {suggestion && (
                <div className="rounded-md border border-warning/30 bg-warning/5 p-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-warning" />
                    <span className="text-[11px] font-semibold text-warning">Quick Fix</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{suggestion.fix}</p>
                </div>
              )}

              {!fixedCode && (
                <Button
                  onClick={handleAIFix}
                  disabled={fixing}
                  size="sm"
                  className="gap-1.5 h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {fixing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                  {fixing ? "AI is fixing…" : "✨ Fix with AI"}
                </Button>
              )}

              {fixedCode && (
                <div className="rounded-md border border-primary/30 bg-primary/5 p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Wand2 className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-semibold text-primary">AI Suggested Fix</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopyFix}>
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap text-foreground bg-background/50 rounded p-2 text-[11px] max-h-40 overflow-auto">
                    {fixedCode}
                  </pre>
                  {explanation && (
                    <div className="flex items-start gap-1.5 rounded bg-muted/50 p-2">
                      <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <p className="text-[10px] text-muted-foreground">{explanation}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => handleApplyFix(fixedCode)}
                    size="sm"
                    className="gap-1.5 h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Apply Fix
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotebookCell;
