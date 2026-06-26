import Editor, { OnMount } from '@monaco-editor/react';
import { useRef, useEffect } from 'react';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  errorLine?: number | null;
  errorMessage?: string | null;
}

const CodeEditor = ({ code, onChange, errorLine, errorMessage }: CodeEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const model = ed.getModel();
    if (!model) return;

    // Clear old markers
    const monaco = (window as any).monaco;
    if (monaco) {
      monaco.editor.setModelMarkers(model, 'python-error', []);
    }

    if (decorationsRef.current) {
      decorationsRef.current.clear();
      decorationsRef.current = null;
    }

    if (errorLine && errorLine > 0 && errorLine <= model.getLineCount()) {
      // Set squiggly underline marker
      if (monaco) {
        monaco.editor.setModelMarkers(model, 'python-error', [
          {
            startLineNumber: errorLine,
            startColumn: 1,
            endLineNumber: errorLine,
            endColumn: model.getLineMaxColumn(errorLine),
            message: errorMessage || 'Error on this line',
            severity: monaco.MarkerSeverity.Error,
          },
        ]);
      }

      // Highlight the line background
      decorationsRef.current = ed.createDecorationsCollection([
        {
          range: {
            startLineNumber: errorLine,
            startColumn: 1,
            endLineNumber: errorLine,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'error-line-highlight',
            glyphMarginClassName: 'error-glyph-margin',
          },
        },
      ]);

      // Scroll to the error line
      ed.revealLineInCenter(errorLine);
    }
  }, [errorLine, errorMessage]);

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-border">
      <Editor
        height="100%"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || '')}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          minimap: { enabled: false },
          padding: { top: 16 },
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          bracketPairColorization: { enabled: true },
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          glyphMargin: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
