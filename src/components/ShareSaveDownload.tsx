import { useState } from 'react';
import { Share2, Save, Download, Upload, Check, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareSaveDownloadProps {
  code: string;
  fileName: string;
  onLoadCode: (code: string) => void;
}

const ShareSaveDownload = ({ code, fileName, onLoadCode }: ShareSaveDownloadProps) => {
  const [saved, setSaved] = useState(false);

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

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${fileName}`);
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
      <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1 h-7 px-2 text-xs" title="Download .py file">
        <Download className="h-3 w-3" />
        <span className="hidden sm:inline">Download</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleUpload} className="gap-1 h-7 px-2 text-xs" title="Upload .py file">
        <Upload className="h-3 w-3" />
        <span className="hidden sm:inline">Upload</span>
      </Button>
    </div>
  );
};

export default ShareSaveDownload;
