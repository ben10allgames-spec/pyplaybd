import { useState } from 'react';
import { Package, Loader2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PackageInstallerProps {
  onInstall: (pkg: string) => Promise<{ success: boolean; error: string | null }>;
  installing: boolean;
}

const POPULAR_PACKAGES = [
  'numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn',
  'sympy', 'networkx', 'pillow', 'regex', 'pyyaml',
];

const PackageInstaller = ({ onInstall, installing }: PackageInstallerProps) => {
  const [packageName, setPackageName] = useState('');
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleInstall = async (pkg: string) => {
    const name = pkg || packageName;
    if (!name.trim()) return;
    setStatus(null);
    const result = await onInstall(name.trim());
    if (result.success) {
      setStatus({ msg: `✅ ${name} installed successfully!`, ok: true });
      setPackageName('');
    } else {
      setStatus({ msg: `❌ Failed: ${result.error}`, ok: false });
    }
  };

  return (
    <div className="border-b border-border bg-card/80 p-3 backdrop-blur">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        <Package className="h-4 w-4 text-primary" />
        <span className="font-sans text-sm font-semibold text-foreground">📦 Package Manager</span>
        {expanded ? <ChevronUp className="h-3 w-3 ml-auto text-muted-foreground" /> : <ChevronDown className="h-3 w-3 ml-auto text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Browser Python works best with analytics packages like numpy, pandas, matplotlib, scipy, and scikit-learn. Server or native packages such as streamlit, django, flask, tensorflow, and torch are not supported here.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="Package name (e.g., numpy)"
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              onKeyDown={(e) => e.key === 'Enter' && handleInstall(packageName)}
            />
            <Button
              onClick={() => handleInstall(packageName)}
              disabled={installing || !packageName.trim()}
              size="sm"
              className="gap-1.5"
            >
              {installing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Package className="h-3.5 w-3.5" />}
              Install
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_PACKAGES.map(pkg => (
              <button
                key={pkg}
                onClick={() => handleInstall(pkg)}
                disabled={installing}
                className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs text-secondary-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {pkg}
              </button>
            ))}
          </div>

          {status && (
            <div className={`flex items-start gap-1.5 break-words text-xs ${status.ok ? 'text-success' : 'text-destructive'}`}>
              {status.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {status.msg}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageInstaller;
