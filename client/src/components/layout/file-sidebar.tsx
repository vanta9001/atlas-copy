import { useState } from 'react';
import { cn } from '../../lib/utils';
import FileTree from '../sidebar/FileTree';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';

interface FileSidebarProps {
  width?: number;
  className?: string;
  files?: any[];
  onFileSelect?: (file: any) => void;
  selectedFileId?: number | null;
}

export function FileSidebar({ 
  width = 256, 
  className,
  files = [],
  onFileSelect,
  selectedFileId
}: FileSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      style={{ width }}
      className={cn(
        "bg-[#252526] border-r border-[#3C3C3C] flex flex-col",
        className
      )}
    >
      <div className="p-2 border-b border-[#3C3C3C]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-start text-[#CCCCCC] hover:bg-[#3C3C3C]"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-1" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1" />
          )}
          <span className="text-xs uppercase tracking-wide">Explorer</span>
        </Button>
      </div>

      {isExpanded && (
        <div className="flex-1 overflow-auto">
          <FileTree
            files={files}
            onFileSelect={onFileSelect}
            selectedFileId={selectedFileId}
          />
        </div>
      )}
    </div>
  );
}