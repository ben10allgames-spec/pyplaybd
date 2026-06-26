import { useEffect, useRef, useState, useCallback } from "react";

type Pending = {
  resolve: (v: any) => void;
  reject: (e: any) => void;
};

const UNSUPPORTED: Record<string, string> = {
  streamlit: "Streamlit needs a server and isn't supported in the browser runtime.",
  flask: "Flask is server-side and isn't supported in the browser runtime.",
  django: "Django is server-side and isn't supported in the browser runtime.",
  fastapi: "FastAPI requires a backend server.",
  torch: "PyTorch native wheels aren't available here.",
  tensorflow: "TensorFlow isn't supported in the browser runtime.",
};

export function usePyodideWorker() {
  const workerRef = useRef<Worker | null>(null);
  const counterRef = useRef(0);
  const pendingRef = useRef<Map<number, Pending>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [installingPackage, setInstallingPackage] = useState(false);

  const spawn = useCallback(() => {
    // Reject any pending requests before respawning
    for (const [, p] of pendingRef.current) p.reject(new Error("Worker restarted"));
    pendingRef.current.clear();
    if (workerRef.current) workerRef.current.terminate();

    const w = new Worker(new URL("../workers/pyodide.worker.ts", import.meta.url));
    w.onmessage = (e: MessageEvent) => {
      const { id, ok, result, error: err } = e.data ?? {};
      const pending = pendingRef.current.get(id);
      if (!pending) return;
      pendingRef.current.delete(id);
      if (ok) pending.resolve(result);
      else pending.reject(new Error(err || "Worker error"));
    };
    w.onerror = (ev) => {
      console.error("[Pyodide worker] error", ev);
    };
    workerRef.current = w;
  }, []);

  const send = useCallback(
    (type: string, payload?: any, timeoutMs = 0) =>
      new Promise<any>((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error("Worker not ready"));
          return;
        }
        const id = ++counterRef.current;
        pendingRef.current.set(id, { resolve, reject });
        workerRef.current.postMessage({ id, type, payload });
        if (timeoutMs > 0) {
          setTimeout(() => {
            if (pendingRef.current.has(id)) {
              pendingRef.current.delete(id);
              reject(new Error(`Timed out after ${Math.round(timeoutMs / 1000)}s`));
            }
          }, timeoutMs);
        }
      }),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    try {
      spawn();
    } catch (e: any) {
      setError(`Failed to start Python worker: ${e?.message ?? e}`);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Startup check: init Pyodide, then run a tiny sanity snippet to confirm
    // the classic worker actually works end-to-end before marking ready.
    (async () => {
      try {
        await send("init", undefined, 60000);
        const sanity = await send("run", { code: "print('ok')" }, 15000);
        if (cancelled) return;
        if (sanity?.error || sanity?.output?.trim() !== "ok") {
          throw new Error(sanity?.error || "Python runtime failed startup self-test");
        }
        setError(null);
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Failed to load Python runtime");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [spawn, send]);

  const runCode = useCallback(
    async (code: string, timeoutMs = 15000): Promise<{ output: string; error: string | null }> => {
      try {
        return await send("run", { code }, timeoutMs);
      } catch (e: any) {
        const msg = e?.message ?? String(e);
        // On timeout/crash, respawn worker so next run works
        if (msg.includes("Timed out") || msg.includes("Worker")) {
          spawn();
          await send("init").catch(() => {});
        }
        return { output: "", error: msg };
      }
    },
    [send, spawn],
  );

  const installPackage = useCallback(
    async (packageName: string): Promise<{ success: boolean; error: string | null }> => {
      const norm = packageName.trim().toLowerCase();
      if (UNSUPPORTED[norm]) return { success: false, error: UNSUPPORTED[norm] };
      setInstallingPackage(true);
      try {
        await send("install", { packageName: packageName.trim() });
        return { success: true, error: null };
      } catch (e: any) {
        return { success: false, error: e?.message ?? "Install failed" };
      } finally {
        setInstallingPackage(false);
      }
    },
    [send],
  );

  const stop = useCallback(() => {
    spawn();
    setLoading(true);
    send("init")
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [spawn, send]);

  return { loading, error, runCode, installPackage, installingPackage, stop };
}
