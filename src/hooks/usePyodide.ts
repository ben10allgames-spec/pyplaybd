import { useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
    _pyInputCallback: ((prompt: string) => string) | null;
  }
}

const UNSUPPORTED_BROWSER_PACKAGES: Record<string, string> = {
  streamlit: 'Streamlit is not supported in the browser Python runtime because it needs a server process and local system access. Use PY Play lessons/notebooks for code practice, or use browser-friendly packages like numpy, pandas, matplotlib, and scipy.',
  flask: 'Flask is a server-side web framework and cannot run inside the browser Python runtime.',
  django: 'Django is a server-side web framework and cannot run inside the browser Python runtime.',
  fastapi: 'FastAPI requires a backend server and is not supported in the browser Python runtime.',
  torch: 'PyTorch native wheels are not available in the browser Python runtime.',
  tensorflow: 'TensorFlow is too large and depends on native binaries that are not available in the browser Python runtime.',
  pyspark: 'PySpark requires a Spark runtime and is not supported in the browser Python runtime.',
};

const getUnsupportedPackageReason = (packageName: string) => {
  const normalized = packageName.trim().toLowerCase();

  if (UNSUPPORTED_BROWSER_PACKAGES[normalized]) {
    return UNSUPPORTED_BROWSER_PACKAGES[normalized];
  }

  if (normalized.startsWith('opencv')) {
    return 'OpenCV packages require native compiled binaries that are not available in the browser Python runtime.';
  }

  return null;
};

const formatPackageInstallError = (packageName: string, errorMessage: string) => {
  const lowerMessage = errorMessage.toLowerCase();

  if (
    lowerMessage.includes('no known package') ||
    lowerMessage.includes('no matching distribution') ||
    lowerMessage.includes("can't find a pure python 3 wheel") ||
    lowerMessage.includes('not a valid wheel')
  ) {
    return `Package "${packageName}" is not available for this browser-based Python runtime. PY Play supports Pyodide-compatible packages only.`;
  }

  return errorMessage;
};

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [installingPackage, setInstallingPackage] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const loadPyodide = async () => {
      try {
        console.log('[Pyodide] Starting load...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.async = true;

        await new Promise<void>((resolve, reject) => {
          script.onload = () => { console.log('[Pyodide] Script loaded'); resolve(); };
          script.onerror = () => reject(new Error('Failed to load Pyodide script'));
          document.head.appendChild(script);
        });

        console.log('[Pyodide] Initializing runtime...');
        const py = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
        console.log('[Pyodide] Runtime ready');

        // Setup input() override using window.prompt
        py.runPython(`
import builtins
from js import window

_original_input = builtins.input

def _custom_input(prompt=""):
    result = window.prompt(str(prompt) if prompt else "Enter input:")
    if result is None:
        raise EOFError("Input cancelled by user")
    return str(result)

builtins.input = _custom_input
`);

        console.log('[Pyodide] Setup complete');
        setPyodide(py);
        setLoading(false);
      } catch (err) {
        console.error('[Pyodide] Load failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Python runtime');
        setLoading(false);
      }
    };

    loadPyodide();
  }, []);

  const installPackage = useCallback(async (packageName: string): Promise<{ success: boolean; error: string | null }> => {
    if (!pyodide) return { success: false, error: 'Python runtime not loaded' };

    const trimmedPackageName = packageName.trim();
    const unsupportedReason = getUnsupportedPackageReason(trimmedPackageName);

    if (unsupportedReason) {
      return { success: false, error: unsupportedReason };
    }

    setInstallingPackage(true);
    try {
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      await micropip.install(trimmedPackageName);
      setInstallingPackage(false);
      return { success: true, error: null };
    } catch (err) {
      console.error('[Pyodide] Package install failed:', trimmedPackageName, err);
      setInstallingPackage(false);
      return {
        success: false,
        error: formatPackageInstallError(
          trimmedPackageName,
          err instanceof Error ? err.message : String(err),
        ),
      };
    }
  }, [pyodide]);

  const runCode = useCallback(async (code: string): Promise<{ output: string; error: string | null }> => {
    console.log('[Pyodide] runCode called, pyodide ready:', !!pyodide);
    if (!pyodide) {
      return { output: '', error: 'Python runtime not loaded yet' };
    }

    try {
      pyodide.runPython(`
import sys
from io import StringIO
_stdout_capture = StringIO()
_stderr_capture = StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
`);

      await pyodide.runPythonAsync(code);

      const stdout = pyodide.runPython('_stdout_capture.getvalue()');
      const stderr = pyodide.runPython('_stderr_capture.getvalue()');

      pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

      return {
        output: stdout || '',
        error: stderr || null,
      };
    } catch (err) {
      try {
        pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
      } catch {}

      const errorMessage = err instanceof Error ? err.message : String(err);
      return { output: '', error: errorMessage };
    }
  }, [pyodide]);

  return { pyodide, loading, error, runCode, installPackage, installingPackage };
}
