
import { useState, useEffect } from "react";
import { Circle, GitBranch, AlertCircle, CheckCircle } from "lucide-react";

interface StatusBarProps {
  activeFile?: {
    id: number;
    name: string;
    path: string;
    content: string;
    isActive: boolean;
    isDirty: boolean;
  } | null;
  project?: {
    id: number;
    name: string;
  } | null;
}

export default function StatusBar({ activeFile, project }: StatusBarProps) {
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [encoding] = useState("UTF-8");
  const [lineEnding] = useState("LF");
  const [indentation] = useState("2 spaces");

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'JavaScript',
      'jsx': 'JavaScript React',
      'ts': 'TypeScript',
      'tsx': 'TypeScript React',
      'py': 'Python',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'json': 'JSON',
      'md': 'Markdown',
      'xml': 'XML',
      'yaml': 'YAML',
      'yml': 'YAML',
      'sql': 'SQL',
      'php': 'PHP',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'cs': 'C#',
      'go': 'Go',
      'rs': 'Rust',
      'rb': 'Ruby',
      'sh': 'Shell',
      'txt': 'Plain Text'
    };
    return languageMap[ext || ''] || 'Plain Text';
  };

  const getFileStats = () => {
    if (!activeFile) return { lines: 0, characters: 0, words: 0 };
    
    const lines = activeFile.content.split('\n').length;
    const characters = activeFile.content.length;
    const words = activeFile.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    return { lines, characters, words };
  };

  const stats = getFileStats();

  return (
    <div className="bg-blue-600 text-white px-4 py-1 flex items-center justify-between text-xs font-medium">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
          <Circle className="w-2 h-2 fill-current" />
          <span>0</span>
        </div>
        
        {activeFile && (
          <div className="flex items-center space-x-2">
            {activeFile.isDirty ? (
              <AlertCircle className="w-3 h-3 text-yellow-300" />
            ) : (
              <CheckCircle className="w-3 h-3 text-green-300" />
            )}
            <span className="font-medium">{activeFile.name}</span>
            {activeFile.isDirty && <span className="text-yellow-300">●</span>}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {activeFile && (
          <>
            <span>
              {stats.lines} lines, {stats.characters} chars, {stats.words} words
            </span>
            <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
            <span>{getLanguageFromFileName(activeFile.name)}</span>
            <span>{encoding}</span>
            <span>{lineEnding}</span>
            <span>{indentation}</span>
          </>
        )}
        
        <div className="flex items-center space-x-1">
          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
          <span>CodeForge</span>
        </div>
      </div>
    </div>
  );
}
