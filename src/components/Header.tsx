import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Home, FileText, Sparkles } from "lucide-react";

interface HeaderProps {
  aiEnabled?: boolean;
  onToggleAi?: () => void;
}

const Header = ({ aiEnabled, onToggleAi }: HeaderProps) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const linkCls = (active: boolean) =>
    `flex items-center gap-1 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm transition-colors ${
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-3 sm:px-6 py-2.5">
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <img src="/favicon.png" alt="PY Play" className="h-8 w-8 rounded-lg" />
        <div>
          <h1 className="font-sans text-lg font-bold text-foreground leading-tight">PY Play</h1>
          <p className="text-[10px] text-muted-foreground hidden sm:block">
            Python notebook in your browser
          </p>
        </div>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-2">
        <Link to="/" className={linkCls(pathname === "/")}>
          <Home className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Notebook</span>
        </Link>
        <Link to="/lessons" className={linkCls(pathname.startsWith("/lessons"))}>
          <BookOpen className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Lessons</span>
        </Link>
        <Link to="/docs" className={linkCls(pathname === "/docs")}>
          <FileText className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Docs</span>
        </Link>
        {onToggleAi && (
          <button
            onClick={onToggleAi}
            title={aiEnabled ? "AI suggestions on" : "AI suggestions off"}
            className={linkCls(!!aiEnabled)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI</span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
