import { useState } from 'react';
import { Share2, Save, Download, Upload, Check, FileText, FileCode, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import type { CellData } from './NotebookCell';

interface ShareSaveDownloadProps {
  code: string;
  fileName: string;
  onLoadCode: (code: string) => void;
  cells?: CellData[];
  title?: string;
}

const ShareSaveDownload = ({ code, fileName, onLoadCode, cells, title }: ShareSaveDownloadProps) => {
  const [saved, setSaved] = useState(false);

  const baseName = (fileName || 'notebook').replace(/\.[^.]+$/, '');

  const handleShare = () => {
    const encoded = btoa(encodeURIComponent(code));
    const url = `${window.location.origin}?code=${encoded}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  const handleSave = () => {
    const saves = JSON.parse(localStorage.getItem('pyplay_saves') || '{}');
    saves[fileName] = { code, savedAt: new Date().toISOString() };
    localStorage.setItem('pyplay_saves', JSON.stringify(saves));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success(`Saved ${fileName}`);
  };

  const triggerBlobDownload = (content: BlobPart, mime: string, filename: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildNotebookText = () => {
    if (!cells || cells.length === 0) return code;
    return cells
      .map((c) => {
        if (c.type === 'markdown') return `# ${c.code}\n`;
        const out = c.output ? `\n# Output:\n# ${c.output.split('\n').join('\n# ')}` : '';
        return `# --- Code Cell ---\n${c.code}${out}\n`;
      })
      .join('\n');
  };

  const handleDownloadPy = () => {
    triggerBlobDownload(code, 'text/x-python', `${baseName}.py`);
    toast.success(`Downloaded ${baseName}.py`);
  };

  const handleDownloadTxt = () => {
    triggerBlobDownload(buildNotebookText(), 'text/plain', `${baseName}.txt`);
    toast.success(`Downloaded ${baseName}.txt`);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(title || baseName, margin, y);
    y += 24;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(new Date().toLocaleString(), margin, y);
    doc.setTextColor(0);
    y += 20;

    const items = cells && cells.length ? cells : [{ type: 'code', code, output: '', error: null } as any];

    for (const cell of items) {
      if (cell.type === 'markdown') {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(cell.code || '', maxWidth);
        for (const line of lines) {
          ensureSpace(16);
          doc.text(line, margin, y);
          y += 16;
        }
        y += 8;
      } else {
        doc.setFont('courier', 'normal');
        doc.setFontSize(10);
        doc.setFillColor(245, 245, 248);
        const codeLines = doc.splitTextToSize(cell.code || '', maxWidth - 12);
        const blockH = codeLines.length * 13 + 12;
        ensureSpace(blockH);
        doc.rect(margin, y, maxWidth, blockH, 'F');
        let cy = y + 14;
        for (const line of codeLines) {
          doc.text(line, margin + 6, cy);
          cy += 13;
        }
        y += blockH + 6;

        if (cell.output) {
          doc.setTextColor(60);
          const outLines = doc.splitTextToSize(cell.output, maxWidth - 12);
          for (const line of outLines) {
            ensureSpace(12);
            doc.text(line, margin + 6, y);
            y += 12;
          }
          doc.setTextColor(0);
          y += 8;
        }
        if (cell.error) {
          doc.setTextColor(200, 40, 40);
          const errLines = doc.splitTextToSize(cell.error, maxWidth - 12);
          for (const line of errLines) {
            ensureSpace(12);
            doc.text(line, margin + 6, y);
            y += 12;
          }
          doc.setTextColor(0);
          y += 8;
        }
      }
    }

    doc.save(`${baseName}.pdf`);
    toast.success(`Downloaded ${baseName}.pdf`);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.py,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          onLoadCode(content);
          toast.success(`Loaded ${file.name}`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1 h-7 px-2 text-xs" title="Share code link">
        <Share2 className="h-3 w-3" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSave} className="gap-1 h-7 px-2 text-xs" title="Save to browser">
        {saved ? <Check className="h-3 w-3 text-success" /> : <Save className="h-3 w-3" />}
        <span className="hidden sm:inline">Save</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" title="Download">
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs">Code only</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleDownloadPy}>
            <FileCode className="h-3.5 w-3.5 mr-2" /> Python (.py)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs">Full notebook</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleDownloadTxt}>
            <FileText className="h-3.5 w-3.5 mr-2" /> Text (.txt)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadPdf}>
            <FileType className="h-3.5 w-3.5 mr-2" /> PDF (.pdf)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="sm" onClick={handleUpload} className="gap-1 h-7 px-2 text-xs" title="Upload .py file">
        <Upload className="h-3 w-3" />
        <span className="hidden sm:inline">Upload</span>
      </Button>
    </div>
  );
};

export default ShareSaveDownload;
