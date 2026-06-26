import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Header from "@/components/Header";
import NotebookCell, { type CellData, type CellType } from "@/components/NotebookCell";
import PackageInstaller from "@/components/PackageInstaller";
import ShareSaveDownload from "@/components/ShareSaveDownload";
import Footer from "@/components/Footer";
import NotebookSidebar from "@/components/NotebookSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { usePyodideWorker } from "@/hooks/usePyodideWorker";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useAutoSave,
  loadNotebook,
  newNotebookId,
  setActiveId,
  getActiveId,
  saveNotebook,
} from "@/hooks/useNotebookStorage";
import { setInlineCompletionsEnabled } from "@/lib/inline-completions";
import { suggestCode } from "@/lib/ai.functions";
import { toast } from "@/hooks/use-toast";
import {
  Play,
  Plus,
  Loader2,
  Package,
  RotateCcw,
  Square,
  Sparkles,
  FolderOpen,
  Type,
  Code as CodeIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PY Play — Python notebook in your browser" },
      {
        name: "description",
        content:
          "Run Python in your browser with a Colab-style notebook: text and code cells, autocomplete, auto-indent, AI fixes, and offline storage.",
      },
      { property: "og:title", content: "PY Play — Python notebook in your browser" },
      {
        property: "og:description",
        content: "Notebook-style Python playground with AI suggestions and offline notebooks.",
      },
    ],
  }),
  component: Index,
});

let executionCounter = 0;

const createCell = (code = "", type: CellType = "code"): CellData => ({
  id: "cell_" + Math.random().toString(36).slice(2, 10),
  type,
  code,
  output: "",
  error: null,
  isRunning: false,
  executionCount: null,
  executionTime: null,
});

const DEFAULT_CELLS = (): CellData[] => [
  createCell(
    "# Welcome to PY Play 🐍\n# Press the play button or Shift+Enter to run\n\nprint(\"Hello, World!\")",
  ),
];

function Index() {
  const { loading: pyLoading, error: pyError, runCode, installPackage, installingPackage, stop } =
    usePyodideWorker();
  const isMobile = useIsMobile();
  const cellsRef = useRef<CellData[]>([]);

  const [notebookId, setNotebookId] = useState<string>("");
  const [title, setTitle] = useState<string>("Untitled");
  const [cells, setCells] = useState<CellData[]>(DEFAULT_CELLS());
  const [activeCellId, setActiveCellId] = useState(cells[0].id);
  const [showPackages, setShowPackages] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const suggestFn = useServerFn(suggestCode);

  // Hydration: load most-recent notebook from IndexedDB or fall back to share URL
  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const codeParam = params.get("code");
        if (codeParam) {
          try {
            const decoded = decodeURIComponent(atob(codeParam));
            const id = newNotebookId();
            setNotebookId(id);
            setActiveId(id);
            const c = createCell(decoded);
            setCells([c]);
            setActiveCellId(c.id);
            window.history.replaceState({}, "", "/");
            setHydrated(true);
            return;
          } catch {}
        }
        const id = await getActiveId();
        if (id) {
          const nb = await loadNotebook(id);
          if (nb && nb.cells.length) {
            setNotebookId(nb.id);
            setTitle(nb.title);
            setCells(nb.cells);
            setActiveCellId(nb.cells[0].id);
            setHydrated(true);
            return;
          }
        }
        const fresh = newNotebookId();
        setNotebookId(fresh);
        await setActiveId(fresh);
        setHydrated(true);
      } catch (e) {
        console.error(e);
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    cellsRef.current = cells;
  }, [cells]);

  useAutoSave(hydrated ? notebookId : "", title, cells, 500);

  // ===== Mutations =====
  const handleCodeChange = useCallback((id: string, code: string) => {
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, code } : c)));
  }, []);

  const handleSetEditing = useCallback((id: string, editing: boolean) => {
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, editing } : c)));
  }, []);

  const handleRunCell = useCallback(
    async (id: string) => {
      if (pyLoading) return;
      const cell = cellsRef.current.find((c) => c.id === id);
      if (!cell || cell.type !== "code" || !cell.code.trim()) return;
      const code = cell.code;
      setCells((prev) => prev.map((c) => (c.id === id ? { ...c, isRunning: true, output: "", error: null } : c)));
      const startTime = performance.now();
      const result = await runCode(code);
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
      executionCounter++;
      setCells((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                isRunning: false,
                output: result.output,
                error: result.error,
                executionCount: executionCounter,
                executionTime: `${elapsed}s`,
              }
            : c,
        ),
      );
    },
    [runCode, pyLoading],
  );

  const handleRunAll = useCallback(async () => {
    for (const cell of cellsRef.current) {
      if (cell.type === "code") await handleRunCell(cell.id);
    }
  }, [handleRunCell]);

  const handleAddBelow = useCallback((id: string, type: CellType = "code") => {
    setCells((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      const newCell = createCell("", type);
      const next = [...prev];
      next.splice(idx + 1, 0, newCell);
      setActiveCellId(newCell.id);
      return next;
    });
  }, []);

  const handleAddCell = useCallback((type: CellType = "code") => {
    const newCell = createCell("", type);
    setCells((prev) => [...prev, newCell]);
    setActiveCellId(newCell.id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setCells((prev) => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex((c) => c.id === id);
      const remaining = prev.filter((c) => c.id !== id);
      setActiveCellId(remaining[Math.max(0, idx - 1)]?.id ?? remaining[0].id);
      return remaining;
    });
  }, []);

  const handleMove = useCallback((id: string, dir: -1 | 1) => {
    setCells((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const handleClearAll = () => {
    const fresh = DEFAULT_CELLS();
    setCells(fresh);
    setActiveCellId(fresh[0].id);
    executionCounter = 0;
  };

  const handleNewNotebook = useCallback(async () => {
    const id = newNotebookId();
    const fresh = DEFAULT_CELLS();
    setNotebookId(id);
    setTitle("Untitled");
    setCells(fresh);
    setActiveCellId(fresh[0].id);
    await setActiveId(id);
    await saveNotebook({ id, title: "Untitled", cells: fresh, updatedAt: Date.now() });
    setShowSidebar(false);
  }, []);

  const handleSelectNotebook = useCallback(async (id: string) => {
    const nb = await loadNotebook(id);
    if (!nb) return;
    setNotebookId(nb.id);
    setTitle(nb.title);
    setCells(nb.cells);
    setActiveCellId(nb.cells[0]?.id ?? "");
    await setActiveId(nb.id);
    setShowSidebar(false);
  }, []);

  // ===== Inline completions debouncer =====
  const debouncedSuggest = useMemo(() => {
    let lastCall = 0;
    let pendingTimer: ReturnType<typeof setTimeout> | null = null;
    return (prefix: string, suffix: string) => {
      if (!aiEnabled) return Promise.resolve("");
      return new Promise<string>((resolve) => {
        if (pendingTimer) clearTimeout(pendingTimer);
        pendingTimer = setTimeout(async () => {
          const now = Date.now();
          if (now - lastCall < 350) return resolve("");
          lastCall = now;
          try {
            const res = await suggestFn({ data: { prefix, suffix } });
            if (res.error) {
              if (res.error.includes("rate limit") || res.error.includes("credits")) {
                toast({ title: "AI suggestions paused", description: res.error });
              }
              resolve("");
            } else {
              resolve(res.suggestion ?? "");
            }
          } catch {
            resolve("");
          }
        }, 400);
      });
    };
  }, [aiEnabled, suggestFn]);

  useEffect(() => {
    setInlineCompletionsEnabled(aiEnabled);
  }, [aiEnabled]);

  // Shift+Enter to run active cell
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "Enter") {
        const target = e.target as HTMLElement | null;
        if (target?.tagName === "TEXTAREA") return;
        e.preventDefault();
        if (activeCellId) handleRunCell(activeCellId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeCellId, handleRunCell]);

  // Catch unhandled promise rejections to prevent silent crashes
  useEffect(() => {
    const onErr = (e: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", e.reason);
    };
    window.addEventListener("unhandledrejection", onErr);
    return () => window.removeEventListener("unhandledrejection", onErr);
  }, []);

  const allCode = cells.filter((c) => c.type === "code").map((c) => c.code).join("\n\n");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Header aiEnabled={aiEnabled} onToggleAi={() => setAiEnabled((v) => !v)} />

      {/* Toolbar */}
      <div className="flex items-center gap-1 sm:gap-1.5 border-b border-border bg-card/50 px-2 sm:px-4 py-1.5 overflow-x-auto sticky top-0 z-30 backdrop-blur">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSidebar(true)}
          className="gap-1 shrink-0 h-8 text-xs"
          title="My notebooks"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          <span className="hidden sm:inline truncate max-w-[120px]">{title || "Untitled"}</span>
        </Button>

        <Button
          onClick={handleRunAll}
          disabled={pyLoading}
          className="gap-1 sm:gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary shrink-0 h-8 text-xs sm:text-sm"
          size="sm"
        >
          {pyLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{pyLoading ? "Loading…" : "Run All"}</span>
        </Button>

        <Button variant="outline" size="sm" onClick={stop} className="gap-1 shrink-0 h-8 text-xs" title="Stop & restart Python">
          <Square className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Stop</span>
        </Button>

        <Button variant="outline" size="sm" onClick={() => handleAddCell("code")} className="gap-1 shrink-0 h-8 text-xs">
          <CodeIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Code</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAddCell("markdown")} className="gap-1 shrink-0 h-8 text-xs">
          <Type className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Text</span>
        </Button>

        <Button variant="outline" size="sm" onClick={handleClearAll} className="gap-1 shrink-0 h-8 text-xs">
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPackages(!showPackages)}
          className="gap-1 shrink-0 h-8 text-xs"
        >
          <Package className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Packages</span>
        </Button>

        <ShareSaveDownload
          code={allCode}
          fileName={`${title || "notebook"}.py`}
          onLoadCode={(code) => {
            const newCell = createCell(code);
            setCells([newCell]);
            setActiveCellId(newCell.id);
          }}
        />

        {!isMobile && (
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground shrink-0">
            <Sparkles className={`h-3 w-3 ${aiEnabled ? "text-primary" : "text-muted-foreground/50"}`} />
            Shift+Enter to run
          </span>
        )}
      </div>

      {showPackages && (
        <PackageInstaller onInstall={installPackage} installing={installingPackage} />
      )}

      {/* Notebook body — page-level scroll, NOT inner overflow, so mobile can scroll past Monaco */}
      <main className="flex-1 bg-background pb-24">
        <div className="mx-auto max-w-4xl p-2 sm:p-6 space-y-2 sm:space-y-3">
          {pyError && (
            <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <div className="font-semibold text-destructive mb-1">Python runtime failed to start</div>
              <div className="text-muted-foreground break-words mb-3">{pyError}</div>
              <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                Reload page
              </Button>
            </div>
          )}
          {cells.map((cell, i) => (
            <ErrorBoundary key={cell.id} fallbackTitle="Cell crashed">
              <NotebookCell
                cell={cell}
                index={i}
                totalCells={cells.length}
                onCodeChange={handleCodeChange}
                onRun={handleRunCell}
                onDelete={handleDelete}
                onAddBelow={handleAddBelow}
                onMoveUp={(id) => handleMove(id, -1)}
                onMoveDown={(id) => handleMove(id, 1)}
                onSetEditing={handleSetEditing}
                isActive={activeCellId === cell.id}
                onFocus={setActiveCellId}
                pyLoading={pyLoading}
                suggestFn={debouncedSuggest}
              />
            </ErrorBoundary>
          ))}

          <div className="flex gap-2">
            <button
              onClick={() => handleAddCell("code")}
              className="flex-1 rounded-lg border border-dashed border-border/60 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add code cell
            </button>
            <button
              onClick={() => handleAddCell("markdown")}
              className="flex-1 rounded-lg border border-dashed border-border/60 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Type className="h-3.5 w-3.5" />
              Add text cell
            </button>
          </div>
        </div>
      </main>

      <Footer />

      <NotebookSidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        activeId={notebookId}
        onSelect={handleSelectNotebook}
        onCreate={handleNewNotebook}
        currentTitle={title}
        onRename={setTitle}
      />
    </div>
  );
}
