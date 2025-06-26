import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FolderOpen, Download, RotateCcw, Sun, Moon, UploadIcon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface ComposerHeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => void;
  onLoadFromFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ComposerHeader: React.FC<ComposerHeaderProps> = ({
  onSave,
  onLoad,
  onReset,
  onExport,
  onLoadFromFile,
  fileInputRef,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="p-4 border-b flex justify-between items-center bg-card/80 backdrop-blur-sm z-10">
      <h1 className="text-2xl font-bold text-primary">Visual Hierarchy Composer</h1>
      <div className="flex gap-2">
        <Button onClick={onSave} variant="secondary">
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
        <div className="relative">
          <Button
            variant="outline"
            onClick={onLoad}
            className="mr-1"
          >
            <FolderOpen className="mr-2 h-4 w-4" /> Load
          </Button>
          <Button
            variant="ghost"
            onClick={() => fileInputRef?.current?.click()}
            title="Load from file"
          >
            <UploadIcon className="mr-2 h-4 w-4" /> From File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onLoadFromFile}
          />
        </div>
        <Button onClick={onReset} variant="ghost">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Button onClick={onExport}>
          <Download className="mr-2 h-4 w-4" /> Export JSON
        </Button>
        <Button
          onClick={toggleTheme}
          variant="ghost"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
};