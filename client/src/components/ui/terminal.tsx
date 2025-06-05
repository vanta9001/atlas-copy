import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TerminalProps {
  className?: string;
  isActive?: boolean;
  onCommand?: (command: string) => void;
}

export function Terminal({ className, isActive = true, onCommand }: TerminalProps) {
  const [output, setOutput] = useState<string[]>([
    'Welcome to CodeForge Terminal',
    'Type "help" for available commands',
    '',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Add command to output
    setOutput(prev => [...prev, `$ ${command}`]);
    setCurrentInput('');
    setIsProcessing(true);

    // Simulate command execution delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock command execution
    const result = await mockCommandExecution(command.trim());
    setOutput(prev => [...prev, ...result]);
    setIsProcessing(false);

    // Call external handler if provided
    onCommand?.(command);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Mock tab completion
      const completions = getCommandCompletions(currentInput);
      if (completions.length === 1) {
        setCurrentInput(completions[0]);
      } else if (completions.length > 1) {
        setOutput(prev => [...prev, `$ ${currentInput}`, ...completions]);
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setOutput(prev => [...prev, `$ ${currentInput}^C`]);
      setCurrentInput('');
      setIsProcessing(false);
    }
  };

  const clearTerminal = () => {
    setOutput(['Terminal cleared', '']);
  };

  return (
    <div className={cn('bg-[#1E1E1E] text-[#CCCCCC] font-mono text-sm flex flex-col', className)}>
      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
        onClick={() => inputRef.current?.focus()}
      >
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-words">
            {line}
          </div>
        ))}
        
        {/* Current Command Line */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">user@codeforge:</span>
          <span className="text-blue-400 mr-2">~/project$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[#CCCCCC]"
            disabled={isProcessing}
            autoFocus={isActive}
            spellCheck={false}
          />
          {isProcessing && (
            <span className="ml-2 animate-pulse">●</span>
          )}
        </div>
      </div>

      {/* Terminal Controls */}
      <div className="border-t border-[#3C3C3C] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <button
            onClick={clearTerminal}
            className="text-[#6A6A6A] hover:text-[#CCCCCC] transition-colors"
            title="Clear Terminal"
          >
            <i className="fas fa-trash mr-1" />
            Clear
          </button>
          <span className="text-[#6A6A6A]">
            Commands: {commandHistory.length}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[#6A6A6A]">
          <span>Bash</span>
          <span>•</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}

// Mock command execution for demonstration
async function mockCommandExecution(command: string): Promise<string[]> {
  const parts = command.split(' ');
  const cmd = parts[0].toLowerCase();

  switch (cmd) {
    case 'help':
      return [
        'Available commands:',
        '  help          Show this help message',
        '  ls            List files and directories',
        '  pwd           Show current directory',
        '  cat <file>    Show file contents',
        '  npm <args>    Run npm commands',
        '  node <file>   Run Node.js file',
        '  clear         Clear terminal',
        '  echo <text>   Print text',
        '',
      ];

    case 'ls':
      return [
        'index.js',
        'package.json',
        'README.md',
        'src/',
        'public/',
        '',
      ];

    case 'pwd':
      return ['/home/user/project', ''];

    case 'cat':
      if (parts[1]) {
        return [
          `Contents of ${parts[1]}:`,
          '// Sample file content',
          'console.log("Hello World!");',
          '',
        ];
      }
      return ['cat: missing file operand', ''];

    case 'npm':
      const npmCmd = parts.slice(1).join(' ');
      if (npmCmd.includes('install')) {
        return [
          `npm WARN deprecated package@1.0.0`,
          `added 42 packages in 2.1s`,
          '',
        ];
      } else if (npmCmd.includes('start')) {
        return [
          `> project@1.0.0 start`,
          `> node index.js`,
          '',
          'Server running on port 3000',
          '',
        ];
      }
      return [`npm ${npmCmd}`, 'Command completed', ''];

    case 'node':
      if (parts[1]) {
        return [
          `Running ${parts[1]}...`,
          'Hello World!',
          'Process finished',
          '',
        ];
      }
      return ['node: missing file argument', ''];

    case 'echo':
      return [parts.slice(1).join(' '), ''];

    case 'clear':
      return [];

    default:
      return [`Command not found: ${cmd}`, ''];
  }
}

// Mock tab completion
function getCommandCompletions(input: string): string[] {
  const commands = [
    'help', 'ls', 'pwd', 'cat', 'npm', 'node', 'clear', 'echo',
    'mkdir', 'rm', 'cp', 'mv', 'git', 'python', 'pip'
  ];

  if (!input.trim()) {
    return commands.slice(0, 10); // Show first 10 commands
  }

  const matches = commands.filter(cmd => cmd.startsWith(input.toLowerCase()));
  return matches.length > 10 ? matches.slice(0, 10) : matches;
}

interface TerminalTabsProps {
  terminals: Array<{ id: string; name: string; isActive: boolean }>;
  onSelectTerminal: (id: string) => void;
  onAddTerminal: () => void;
  onCloseTerminal: (id: string) => void;
  className?: string;
}

export function TerminalTabs({
  terminals,
  onSelectTerminal,
  onAddTerminal,
  onCloseTerminal,
  className,
}: TerminalTabsProps) {
  return (
    <div className={cn('flex items-center border-b border-[#3C3C3C]', className)}>
      {terminals.map((terminal) => (
        <div
          key={terminal.id}
          className={cn(
            'flex items-center px-3 py-2 border-r border-[#3C3C3C] cursor-pointer text-sm',
            terminal.isActive 
              ? 'bg-[#1E1E1E] text-[#CCCCCC]' 
              : 'bg-[#252526] text-[#6A6A6A] hover:bg-[#2A2D2E]'
          )}
          onClick={() => onSelectTerminal(terminal.id)}
        >
          <i className="fas fa-terminal mr-2 text-xs" />
          <span>{terminal.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseTerminal(terminal.id);
            }}
            className="ml-2 text-[#6A6A6A] hover:text-[#CCCCCC]"
          >
            <i className="fas fa-times text-xs" />
          </button>
        </div>
      ))}
      
      <button
        onClick={onAddTerminal}
        className="px-3 py-2 text-[#6A6A6A] hover:text-[#CCCCCC] hover:bg-[#2A2D2E] text-sm"
        title="Add Terminal"
      >
        <i className="fas fa-plus" />
      </button>
    </div>
  );
}
