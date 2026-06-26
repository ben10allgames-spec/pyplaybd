# Restore PyPlay + Add AdSense

## 1. Import the project
Replace the current starter scaffold with your PyPlay codebase from `pyplay2-main.zip`:
- Copy `src/` (components, routes: `/`, `/docs`, `/lessons`, hooks, lib), `public/`, `components.json`, `wrangler.jsonc`.
- Merge `package.json` dependencies (Monaco editor, Pyodide-related deps, idb-keyval, recharts, vaul, etc.) into the current project and run install.
- Keep the existing TanStack Start router bootstrap (`src/router.tsx`, `__root.tsx` shell) and reconcile your `__root.tsx` meta/SEO into it — including the Sonner `<Toaster />`.
- Preserve `src/lib/lovable-error-reporting.ts` integration in the root error boundary.

## 2. Feature audit & fixes
Walk through each surface and fix anything broken on the current stack:
- **Notebook**: cell add/run/delete, Monaco editor + Python syntax/autocomplete/auto-indent, inline AI completions.
- **Pyodide runtime**: `usePyodide` + `usePyodideWorker` boot, stdout/stderr in `OutputPanel`, error parsing, package installer (`micropip`).
- **Persistence**: notebook storage via `idb-keyval`, run history, share / save / download.
- **AI Fix**: `useAIFix` + `ai.functions.ts` — confirm it's wired to the Lovable AI Gateway (enable Lovable Cloud if not already) and that `LOVABLE_API_KEY` is available server-side.
- **Routes**: `/` (notebook), `/lessons`, `/docs` render with correct per-page SEO meta.
- **UI shell**: Header, Footer, StatusBar, FileTabs, ProjectTemplates, HistoryPanel, NotebookSidebar.

Capture any runtime errors via the console/network tools and patch them.

## 3. Google AdSense integration
- Add the AdSense loader `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX" crossorigin="anonymous">` plus `<meta name="google-adsense-account" content="ca-pub-XXXX">` to the root route `head()` (so it loads on every page, required for site verification).
- Create a reusable `<AdSlot slot="..." format="auto" />` React component that renders the `<ins class="adsbygoogle">` block and pushes `(adsbygoogle = window.adsbygoogle || []).push({})` on mount (guarded for SSR — only run in `useEffect`).
- Place ad slots in non-intrusive locations that don't break the notebook UX:
  - A leaderboard/responsive slot under the Header on `/lessons` and `/docs`.
  - An in-content slot between lesson sections on `/lessons`.
  - Optionally a sidebar slot on `/docs`.
  - Keep the main editor view (`/`) clean or only a small footer slot, so ads don't interfere with code execution.
- Add an `ads.txt` file in `public/` (`google.com, pub-XXXX, DIRECT, f08c47fec0942fa0`).
- Respect AdSense policy: no ads on error/404 pages, no ads behind auth-only flows.

## What I need from you
- Your **AdSense publisher ID** (`ca-pub-XXXXXXXXXXXXXXXX`) and any specific **ad slot IDs** you've already created in your AdSense dashboard. If you haven't created slots yet, I'll wire up `format="auto"` responsive units using your publisher ID and you can swap slot IDs in later.
- Confirmation to **enable Lovable Cloud** if needed for the AI Fix server function (gateway-backed, no external account).

## Technical notes
- Stack stays TanStack Start v1 + React 19 + Tailwind v4 (matches your zip).
- AdSense script is added via the root route's `head().scripts` (TanStack Start supports script tags through `HeadContent`), not by editing an `index.html`.
- `AdSlot` component must `useEffect`-push and key on `pathname` so route changes re-request an ad fill.
- The publisher ID will be stored as `VITE_ADSENSE_CLIENT` in env (publishable, safe in client code) so it's easy to swap.
