import { X, FileCode } from 'lucide-react';

export interface FileTab {
  id: string;
  name: string;
  code: string;
}

interface FileTabsProps {
  tabs: FileTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

const FileTabs = ({ tabs, activeId, onSelect, onClose }: FileTabsProps) => {
  return (
    <div className="flex items-center overflow-x-auto border-b border-border bg-card/30 scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`group flex items-center gap-1.5 border-r border-border px-3 py-1.5 text-xs transition-colors shrink-0 ${
            tab.id === activeId
              ? 'bg-card text-foreground border-b-2 border-b-primary'
              : 'bg-transparent text-muted-foreground hover:bg-muted/30'
          }`}
        >
          <FileCode className="h-3 w-3 text-primary/60" />
          <span className="font-mono">{tab.name}</span>
          {tabs.length > 1 && (
            <span
              onClick={e => { e.stopPropagation(); onClose(tab.id); }}
              className="ml-1 rounded p-0.5 text-muted-foreground/0 hover:bg-muted hover:text-foreground group-hover:text-muted-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FileTabs;
