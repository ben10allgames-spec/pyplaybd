import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — PY Play" },
      { name: "description", content: "How to use PY Play: cells, shortcuts, packages, AI." },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6 prose-md">
          <h1>PY Play Docs</h1>
          <h2>Cells</h2>
          <p>Press <strong>+ Code</strong> to add a Python cell, <strong>+ Text</strong> for a markdown cell. Double-click a rendered text cell to edit it.</p>
          <h2>Running code</h2>
          <p>Click <strong>▶</strong> on a cell or press <strong>Shift+Enter</strong>. Use <strong>Run All</strong> to execute every code cell from top to bottom. Hit <strong>Stop</strong> if a cell is stuck — it restarts the Python worker.</p>
          <h2>AI suggestions</h2>
          <p>Toggle the <strong>AI</strong> button in the header. While typing in a code cell, ghost-text completions appear. Press <strong>Tab</strong> to accept, <strong>Esc</strong> to dismiss.</p>
          <h2>Notebooks &amp; storage</h2>
          <p>Notebooks auto-save to your browser. Open the folder icon in the toolbar to switch, rename, export, or delete.</p>
          <h2>Packages</h2>
          <p>Click <strong>Packages</strong> to install pure-Python packages from PyPI (numpy, pandas, matplotlib, scipy, requests, and more).</p>
          <p><Link to="/" className="text-primary underline">← Back to notebook</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
