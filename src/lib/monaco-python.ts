import type * as Monaco from "monaco-editor";

let configured = false;

/** Configure Python language: smart indent after `:`, dedent after return/pass/etc. */
export function configurePythonLanguage(monaco: typeof Monaco) {
  if (configured) return;
  configured = true;

  monaco.languages.setLanguageConfiguration("python", {
    indentationRules: {
      // Increase indent after lines ending with `:` (def/class/if/for/while/try/except/with/else/elif/finally)
      increaseIndentPattern: /^\s*(def|class|if|elif|else|for|while|with|try|except|finally|match|case)\b.*:\s*(#.*)?$/,
      // Decrease indent for `else/elif/except/finally`
      decreaseIndentPattern: /^\s*(else|elif|except|finally)\b.*:\s*$/,
    },
    onEnterRules: [
      {
        beforeText: /:\s*(#.*)?$/,
        action: { indentAction: monaco.languages.IndentAction.Indent },
      },
      {
        beforeText: /^\s*(return|pass|break|continue|raise)(\s.*)?$/,
        action: { indentAction: monaco.languages.IndentAction.Outdent },
      },
    ],
    autoClosingPairs: [
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: "{", close: "}" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string"] },
      { open: '"""', close: '"""' },
    ],
    surroundingPairs: [
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: "{", close: "}" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    brackets: [
      ["(", ")"],
      ["[", "]"],
      ["{", "}"],
    ],
  });
}

/** Default editor options shared across cells. */
export function pythonEditorOptions(isMobile: boolean): Monaco.editor.IStandaloneEditorConstructionOptions {
  return {
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: isMobile ? 13 : 14,
    minimap: { enabled: false },
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    wordWrap: "on",
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    detectIndentation: false,
    autoIndent: "full",
    formatOnPaste: true,
    bracketPairColorization: { enabled: true },
    renderLineHighlight: "line",
    smoothScrolling: true,
    cursorBlinking: "smooth",
    padding: { top: 8, bottom: 8 },
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      // CRITICAL: don't capture mouse-wheel — let the page scroll past the editor on mobile
      alwaysConsumeMouseWheel: false,
    },
    // On mobile, disable hover/popups that fight touch
    quickSuggestions: !isMobile,
    suggestOnTriggerCharacters: !isMobile,
    parameterHints: { enabled: !isMobile },
    hover: { enabled: !isMobile },
    fixedOverflowWidgets: true,
  };
}
