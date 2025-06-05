
import { useEffect, useRef } from "react";
import * as monaco from 'monaco-editor';

interface MonacoProps {
  file?: {
    id: number;
    name: string;
    path: string;
    content: string;
    isActive: boolean;
    isDirty: boolean;
  } | null;
  onContentChange: (fileId: number, content: string) => void;
}

export default function Monaco({ file, onContentChange }: MonacoProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'sql': 'sql',
      'php': 'php',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'sh': 'shell',
      'txt': 'plaintext'
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Configure Monaco Editor
    monaco.editor.defineTheme('vs-code-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41'
      }
    });

    monaco.editor.setTheme('vs-code-dark');

    // Create editor
    const editor = monaco.editor.create(containerRef.current, {
      value: file?.content || '// Welcome to CodeForge!\n// Start typing to begin coding...',
      language: file ? getLanguageFromFileName(file.name) : 'javascript',
      theme: 'vs-code-dark',
      fontSize: 14,
      fontFamily: 'Fira Code, Monaco, Menlo, Ubuntu Mono, monospace',
      fontLigatures: true,
      lineNumbers: 'on',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      hover: { enabled: true },
      contextmenu: true,
      mouseWheelZoom: true,
      cursorBlinking: 'smooth',
      smoothScrolling: true,
      multiCursorModifier: 'ctrlCmd',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      }
    });

    editorRef.current = editor;

    // Listen for content changes
    const disposable = editor.onDidChangeModelContent(() => {
      if (file) {
        const content = editor.getValue();
        onContentChange(file.id, content);
      }
    });

    return () => {
      disposable.dispose();
      editor.dispose();
    };
  }, []);

  // Update editor when file changes
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    
    if (file) {
      const currentValue = editor.getValue();
      if (currentValue !== file.content) {
        editor.setValue(file.content);
      }
      
      const language = getLanguageFromFileName(file.name);
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    } else {
      editor.setValue('// Welcome to CodeForge!\n// Open a file to start coding...');
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, 'javascript');
      }
    }
  }, [file]);

  return (
    <div className="flex-1 relative">
      <div 
        ref={containerRef} 
        className="absolute inset-0"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
