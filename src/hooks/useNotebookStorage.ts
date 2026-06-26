import { useCallback, useEffect, useRef, useState } from "react";
import { get, set, del, keys } from "idb-keyval";
import type { CellData } from "@/components/NotebookCell";

export type StoredNotebook = {
  id: string;
  title: string;
  cells: CellData[];
  updatedAt: number;
};

const NB_PREFIX = "pyplay:nb:";
const ACTIVE_KEY = "pyplay:active";

export async function listNotebooks(): Promise<StoredNotebook[]> {
  const allKeys = (await keys()) as string[];
  const nbKeys = allKeys.filter((k) => typeof k === "string" && k.startsWith(NB_PREFIX));
  const items = await Promise.all(
    nbKeys.map(async (k) => (await get(k)) as StoredNotebook | undefined),
  );
  return items
    .filter((x): x is StoredNotebook => !!x)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteNotebook(id: string) {
  await del(NB_PREFIX + id);
}

export async function saveNotebook(nb: StoredNotebook) {
  await set(NB_PREFIX + nb.id, nb);
}

export async function loadNotebook(id: string): Promise<StoredNotebook | undefined> {
  return (await get(NB_PREFIX + id)) as StoredNotebook | undefined;
}

export async function getActiveId(): Promise<string | undefined> {
  return (await get(ACTIVE_KEY)) as string | undefined;
}

export async function setActiveId(id: string) {
  await set(ACTIVE_KEY, id);
}

export function newNotebookId() {
  return "nb_" + Math.random().toString(36).slice(2, 10);
}

/** Auto-save the given cells under id, debounced. */
export function useAutoSave(
  id: string,
  title: string,
  cells: CellData[],
  delay = 500,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const nb: StoredNotebook = { id, title, cells, updatedAt: Date.now() };
      await saveNotebook(nb);
      setSavedAt(nb.updatedAt);
    }, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [id, title, cells, delay]);

  return savedAt;
}

export function useNotebookList() {
  const [list, setList] = useState<StoredNotebook[]>([]);
  const refresh = useCallback(async () => {
    setList(await listNotebooks());
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { list, refresh };
}
