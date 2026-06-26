import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNotebookList, deleteNotebook, type StoredNotebook } from "@/hooks/useNotebookStorage";
import { FileText, Trash2, Plus, X, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  currentTitle: string;
  onRename: (title: string) => void;
}

export default function NotebookSidebar({
  open,
  onClose,
  activeId,
  onSelect,
  onCreate,
  currentTitle,
  onRename,
}: Props) {
  const { list, refresh } = useNotebookList();

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  const handleExport = (nb: StoredNotebook) => {
    const blob = new Blob([JSON.stringify(nb, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nb.title || "notebook"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    await deleteNotebook(id);
    refresh();
  };

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <aside className="fixed left-0 top-0 z-50 h-full w-72 sm:w-80 border-r border-border bg-card p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">My notebooks</h2>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-3">
          <label className="text-[10px] uppercase text-muted-foreground">Current notebook</label>
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => onRename(e.target.value)}
            placeholder="Untitled"
            className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <Button onClick={onCreate} className="w-full mb-4 gap-2" size="sm">
          <Plus className="h-3.5 w-3.5" /> New notebook
        </Button>

        <div className="space-y-1">
          {list.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No saved notebooks yet.</p>
          )}
          {list.map((nb) => (
            <div
              key={nb.id}
              className={`group flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-colors ${
                nb.id === activeId
                  ? "border-primary/40 bg-primary/5"
                  : "border-transparent hover:bg-muted/50"
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <button onClick={() => onSelect(nb.id)} className="flex-1 truncate text-left">
                {nb.title || "Untitled"}
                <span className="block text-[10px] text-muted-foreground">
                  {new Date(nb.updatedAt).toLocaleString()}
                </span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={() => handleExport(nb)}
                title="Export"
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive/60 hover:text-destructive opacity-0 group-hover:opacity-100"
                onClick={() => handleDelete(nb.id)}
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
