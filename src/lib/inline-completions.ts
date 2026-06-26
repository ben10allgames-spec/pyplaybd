import type * as Monaco from "monaco-editor";

type SuggestFn = (prefix: string, suffix: string) => Promise<string>;

let registered: Monaco.IDisposable | null = null;
let currentFetcher: SuggestFn | null = null;
let enabled = false;

/** Register a single inline completion provider for Python. Updates the active fetcher. */
export function registerInlineCompletions(monaco: typeof Monaco, fetcher: SuggestFn) {
  currentFetcher = fetcher;
  enabled = true;
  if (registered) return;

  registered = monaco.languages.registerInlineCompletionsProvider("python", {
    async provideInlineCompletions(model: any, position: any, _ctx: any, token: any) {
      if (!enabled || !currentFetcher) return { items: [] };
      // Don't suggest while typing inside whitespace-only line if line is super short
      const value = model.getValue();
      const offset = model.getOffsetAt(position);
      const prefix = value.slice(Math.max(0, offset - 4000), offset);
      const suffix = value.slice(offset, offset + 1500);
      // Skip when at top of empty file
      if (prefix.trim().length === 0) return { items: [] };
      try {
        const text = await currentFetcher(prefix, suffix);
        if (token.isCancellationRequested) return { items: [] };
        if (!text || !text.trim()) return { items: [] };
        return {
          items: [
            {
              insertText: text,
              range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column,
              ),
            },
          ],
        };
      } catch {
        return { items: [] };
      }
    },
    handleItemDidShow() {},
    handlePartialAccept() {},
    freeInlineCompletions() {},
  } as any);
}

export function setInlineCompletionsEnabled(value: boolean) {
  enabled = value;
}

export function isInlineCompletionsEnabled() {
  return enabled;
}
