import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Monaco Editor will be loaded dynamically to avoid SSR issues
let monaco: any = null;

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
  onCursorChange?: (line: number, column: number) => void;
  className?: string;
  readOnly?: boolean;
  theme?: string;
}

export function MonacoEditor({
  value,
  language,
  onChange,
  onCursorChange,
  className,
  readOnly = false,
  theme = 'vs-dark',
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initMonaco() {
      try {
        if (!monaco) {
          // Load Monaco Editor from CDN
          await loadMonacoFromCDN();
        }

        if (containerRef.current && monaco) {
          // Dispose existing editor
          if (editorRef.current) {
            editorRef.current.dispose();
          }

          // Create new editor
          editorRef.current = monaco.editor.create(containerRef.current, {
            value,
            language,
            theme,
            readOnly,
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: 'Fira Code, Consolas, monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'mouseover',
            matchBrackets: 'always',
            glyphMargin: true,
            useTabStops: false,
            tabSize: 2,
            insertSpaces: true,
          });

          // Handle content changes
          editorRef.current.onDidChangeModelContent(() => {
            const newValue = editorRef.current.getValue();
            onChange?.(newValue);
          });

          // Handle cursor position changes
          editorRef.current.onDidChangeCursorPosition((e: any) => {
            onCursorChange?.(e.position.lineNumber, e.position.column);
          });

          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize Monaco Editor:', err);
        setError('Failed to load code editor');
        setIsLoading(false);
      }
    }

    initMonaco();

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  // Update editor language when prop changes
  useEffect(() => {
    if (editorRef.current && monaco) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  if (error) {
    return (
      <div className={cn('flex items-center justify-center bg-[#1E1E1E] text-[#CCCCCC]', className)}>
        <div className="text-center">
          <div className="text-red-400 mb-2">
            <i className="fas fa-exclamation-triangle text-2xl" />
          </div>
          <p className="text-sm">{error}</p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            Please check your internet connection and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center bg-[#1E1E1E] text-[#CCCCCC]', className)}>
        <div className="text-center">
          <div className="animate-spin text-[#007ACC] mb-2">
            <i className="fas fa-spinner text-2xl" />
          </div>
          <p className="text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={cn('w-full h-full', className)}
      style={{ minHeight: '200px' }}
    />
  );
}

// Load Monaco Editor from CDN
async function loadMonacoFromCDN(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Monaco Editor requires a browser environment'));
      return;
    }

    // Check if Monaco is already loaded
    if ((window as any).monaco) {
      monaco = (window as any).monaco;
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js';
    script.async = true;

    script.onload = () => {
      const require = (window as any).require;
      require.config({
        paths: {
          vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs'
        }
      });

      require(['vs/editor/editor.main'], () => {
        monaco = (window as any).monaco;

        // Configure Monaco themes
        monaco.editor.defineTheme('vs-dark-custom', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'comment', foreground: '#6A6A6A', fontStyle: 'italic' },
            { token: 'keyword', foreground: '#569CD6' },
            { token: 'string', foreground: '#CE9178' },
            { token: 'number', foreground: '#B5CEA8' },
            { token: 'type', foreground: '#4EC9B0' },
            { token: 'class', foreground: '#4EC9B0' },
            { token: 'function', foreground: '#DCDCAA' },
            { token: 'variable', foreground: '#9CDCFE' },
          ],
          colors: {
            'editor.background': '#1E1E1E',
            'editor.foreground': '#CCCCCC',
            'editor.lineHighlightBackground': '#2A2D2E',
            'editor.selectionBackground': '#094771',
            'editor.inactiveSelectionBackground': '#3A3D41',
            'editorCursor.foreground': '#AEAFAD',
            'editorWhitespace.foreground': '#404040',
            'editorLineNumber.foreground': '#858585',
            'editorLineNumber.activeForeground': '#CCCCCC',
          }
        });

        resolve();
      });
    };

    script.onerror = () => {
      reject(new Error('Failed to load Monaco Editor'));
    };

    document.head.appendChild(script);
  });
}

// Fallback code editor for when Monaco fails to load
export function FallbackCodeEditor({
  value,
  onChange,
  className,
  readOnly = false,
}: {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  readOnly?: boolean;
}) {
  return (
    <div className={cn('w-full h-full bg-[#1E1E1E] text-[#CCCCCC] font-mono', className)}>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className="w-full h-full bg-transparent border-none outline-none resize-none p-4 text-sm leading-6"
        placeholder="// Start coding..."
        spellCheck={false}
        style={{
          fontFamily: 'Fira Code, Consolas, monospace',
          tabSize: 2,
        }}
      />
    </div>
  );
}
