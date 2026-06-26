import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";

const SITE_URL = "https://nishanlabs.tech";
const DOCS_URL = SITE_URL + "/docs";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "PY Play Documentation — How to Use the Python Notebook" },
      {
        name: "description",
        content:
          "Learn how to use PY Play: cells, keyboard shortcuts, installing Python packages, AI autocomplete, sharing notebooks, and offline storage.",
      },
      { property: "og:title", content: "PY Play Documentation — How to Use the Python Notebook" },
      {
        property: "og:description",
        content:
          "Docs for PY Play: cells, shortcuts, packages, AI autocomplete, sharing, and offline notebooks.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: DOCS_URL },
      { property: "og:image", content: SITE_URL + "/logo.png" },
      { name: "twitter:title", content: "PY Play Documentation" },
      {
        name: "twitter:description",
        content: "How to use the PY Play Python notebook in your browser.",
      },
    ],
    links: [{ rel: "canonical", href: DOCS_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "PY Play Documentation",
          description:
            "How to use PY Play — cells, shortcuts, packages, AI autocomplete, and offline notebooks.",
          url: DOCS_URL,
          image: SITE_URL + "/logo.png",
          author: { "@type": "Person", name: "Nishan Rahman", url: "https://nishanrahman.me/" },
          publisher: { "@type": "Organization", name: "Nishan Labs", url: SITE_URL },
          proficiencyLevel: "Beginner",
          about: "Browser-based Python notebook",
        }),
      },
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
          <h1>PY Play Documentation</h1>
          <p className="text-muted-foreground">
            Everything you need to use PY Play — a free browser-based Python notebook.
          </p>
          <AdSlot slot="3333333333" className="my-4" />

          <h2>Cells</h2>
          <p>
            Press <strong>+ Code</strong> to add a Python cell, <strong>+ Text</strong> for a
            markdown cell. Double-click a rendered text cell to edit it.
          </p>

          <h2>Running code</h2>
          <p>
            Click <strong>▶</strong> on a cell or press <strong>Shift+Enter</strong>. Use{" "}
            <strong>Run All</strong> to execute every code cell from top to bottom. Hit{" "}
            <strong>Stop</strong> if a cell is stuck — it restarts the Python worker.
          </p>

          <h2>AI suggestions</h2>
          <p>
            Toggle the <strong>AI</strong> button in the header. While typing in a code cell,
            ghost-text completions appear. Press <strong>Tab</strong> to accept,{" "}
            <strong>Esc</strong> to dismiss.
          </p>

          <h2>Notebooks &amp; storage</h2>
          <p>
            Notebooks auto-save to your browser. Open the folder icon in the toolbar to switch,
            rename, export, or delete.
          </p>

          <h2 id="packages">Installing &amp; importing Python packages</h2>
          <p>
            PY Play runs Python in your browser through Pyodide, so you can install most pure-Python
            packages and the major scientific stack <em>without leaving the page</em>.
          </p>
          <h3>Using the Packages panel</h3>
          <ol>
            <li>
              Click <strong>Packages</strong> in the toolbar.
            </li>
            <li>
              Type a package name (e.g. <code>numpy</code>, <code>pandas</code>,{" "}
              <code>matplotlib</code>, <code>scipy</code>, <code>requests</code>,{" "}
              <code>scikit-learn</code>) and press <strong>Install</strong>.
            </li>
            <li>
              Wait for the success toast, then <code>import</code> it from any code cell.
            </li>
          </ol>
          <h3>Importing modules in your code</h3>
          <p>Once installed, use a normal Python import:</p>
          <pre>
{`import numpy as np
import pandas as pd

df = pd.DataFrame({"x": np.arange(5), "y": np.arange(5) ** 2})
print(df)`}
          </pre>
          <h3>What works (and what doesn't)</h3>
          <ul>
            <li>
              ✅ <strong>Pre-built scientific packages</strong> shipped with Pyodide: numpy, pandas,
              scipy, scikit-learn, matplotlib, sympy, networkx, and more.
            </li>
            <li>
              ✅ <strong>Pure-Python wheels</strong> from PyPI — most utility libraries install
              directly via the Packages panel (powered by <code>micropip</code> under the hood).
            </li>
            <li>
              ⚠️ <strong>Packages with C extensions</strong> that aren't pre-compiled for WebAssembly
              won't install. There's no system <code>pip</code> or compiler in the browser.
            </li>
            <li>
              ⚠️ <strong>Anything that needs the OS</strong> (subprocesses, raw sockets, GPU,
              filesystem outside the virtual FS) is unavailable.
            </li>
          </ul>
          <p>
            Packages persist for the current notebook session. Reloading the page reinstalls them
            on next use — usually a few seconds because Pyodide caches the wheels.
          </p>

          <p>
            <Link to="/" className="text-primary underline">
              ← Back to notebook
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
