import { cn } from '../../lib/utils';

interface StatusBarProps {
  className?: string;
  currentFile?: string;
  line?: number;
  column?: number;
  language?: string;
}

export function StatusBar({ 
  className,
  currentFile,
  line = 1,
  column = 1,
  language = "javascript"
}: StatusBarProps) {
  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-1 bg-[#007ACC] text-white text-xs",
      className
    )}>
      <div className="flex items-center space-x-4">
        {currentFile && (
          <span className="text-white/90">
            {currentFile}
          </span>
        )}
        <span className="text-white/80">
          Ln {line}, Col {column}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-white/80 capitalize">
          {language}
        </span>
        <span className="text-white/80">
          UTF-8
        </span>
      </div>
    </div>
  );
}