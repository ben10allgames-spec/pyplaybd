/**
 * Parse a Python error traceback to extract line number and concise message.
 */
export function parseErrorLine(error: string): { line: number | null; message: string } {
  // Match "File "<exec>", line N" or "File "<string>", line N" patterns from Pyodide
  const lineMatch = error.match(/File\s+["']<(?:exec|string|module)>["'],\s+line\s+(\d+)/);
  // Also match "line N" in SyntaxError output
  const syntaxLineMatch = error.match(/line\s+(\d+)/i);

  const line = lineMatch
    ? parseInt(lineMatch[1], 10)
    : syntaxLineMatch
    ? parseInt(syntaxLineMatch[1], 10)
    : null;

  // Extract the last error line (the actual error message)
  const lines = error.trim().split('\n');
  const lastLine = lines[lines.length - 1]?.trim() || error;

  // For the concise display, show the error type + message
  const errorTypeMatch = lastLine.match(/^(\w+Error:\s*.+)/);
  const message = errorTypeMatch ? errorTypeMatch[1] : lastLine;

  return { line, message };
}
