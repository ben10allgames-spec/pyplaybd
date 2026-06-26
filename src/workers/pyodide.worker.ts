/// <reference lib="webworker" />
// Pyodide Web Worker — classic worker (uses importScripts).


let pyodide: any = null;
let ready: Promise<void> | null = null;

function init() {
  if (ready) return ready;
  ready = (async () => {
    // Import Pyodide loader from CDN
    (self as any).importScripts("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");
    pyodide = await (self as any).loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
    });
    // Override input() to ask main thread (blocks via Atomics not available — use prompt fallback)
    pyodide.runPython(`
import builtins
def _custom_input(prompt=""):
    raise EOFError("input() is not supported in this runtime. Define values inline instead.")
builtins.input = _custom_input
`);
  })();
  return ready;
}

self.onmessage = async (e: MessageEvent) => {
  const { id, type, payload } = e.data ?? {};
  try {
    if (type === "init") {
      await init();
      self.postMessage({ id, ok: true });
      return;
    }
    if (type === "install") {
      await init();
      await pyodide.loadPackage("micropip");
      const micropip = pyodide.pyimport("micropip");
      await micropip.install(payload.packageName);
      self.postMessage({ id, ok: true });
      return;
    }
    if (type === "run") {
      await init();
      pyodide.runPython(`
import sys
from io import StringIO
_stdout_capture = StringIO()
_stderr_capture = StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
`);
      try {
        await pyodide.runPythonAsync(payload.code);
      } catch (err) {
        const stdout = pyodide.runPython("_stdout_capture.getvalue()");
        const stderr = pyodide.runPython("_stderr_capture.getvalue()");
        pyodide.runPython("sys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__");
        const msg = err instanceof Error ? err.message : String(err);
        self.postMessage({ id, ok: true, result: { output: stdout || "", error: (stderr || "") + msg } });
        return;
      }
      const stdout = pyodide.runPython("_stdout_capture.getvalue()");
      const stderr = pyodide.runPython("_stderr_capture.getvalue()");
      pyodide.runPython("sys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__");
      self.postMessage({ id, ok: true, result: { output: stdout || "", error: stderr || null } });
      return;
    }
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

