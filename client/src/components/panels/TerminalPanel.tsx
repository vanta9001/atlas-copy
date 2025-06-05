
import { useState, useRef, useEffect } from "react";
import { X, Minus, Plus, Terminal as TerminalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TerminalPanelProps {
  height: number;
  onHeightChange: (height: number) => void;
  onClose: () => void;
}

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export default function TerminalPanel({ height, onHeightChange, onClose }: TerminalPanelProps) {
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to CodeForge Terminal! Type "help" for available commands.',
      timestamp: new Date()
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState('/workspace');
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    // Add command line to output
    const commandLine: TerminalLine = {
      id: Date.now().toString() + '-cmd',
      type: 'command',
      content: `${currentDir}$ ${trimmedCommand}`,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, commandLine]);

    // Simulate command execution
    let output = '';
    let isError = false;

    try {
      output = await simulateCommand(trimmedCommand, currentDir);
    } catch (error) {
      output = `Command not found: ${trimmedCommand}`;
      isError = true;
    }

    // Add output to history
    const outputLine: TerminalLine = {
      id: Date.now().toString() + '-out',
      type: isError ? 'error' : 'output',
      content: output,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, outputLine]);
    setCurrentInput("");
  };

  const simulateCommand = async (command: string, dir: string): Promise<string> => {
    const [cmd, ...args] = command.split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'help':
        return `Available commands:
  help         - Show this help message
  ls           - List directory contents
  pwd          - Show current directory
  cd <dir>     - Change directory
  mkdir <dir>  - Create directory
  touch <file> - Create file
  cat <file>   - Show file contents
  echo <text>  - Print text
  clear        - Clear terminal
  node -v      - Show Node.js version
  npm -v       - Show npm version
  git status   - Show git status
  npm install  - Install dependencies
  npm start    - Start the application
  npm run dev  - Start development server`;

      case 'ls':
        return `index.js    package.json    node_modules/    src/
README.md   public/         .gitignore       dist/`;

      case 'pwd':
        return dir;

      case 'cd':
        const newDir = args[0] || '/workspace';
        setCurrentDir(newDir.startsWith('/') ? newDir : `${dir}/${newDir}`);
        return '';

      case 'mkdir':
        return args[0] ? `Directory '${args[0]}' created` : 'mkdir: missing operand';

      case 'touch':
        return args[0] ? `File '${args[0]}' created` : 'touch: missing operand';

      case 'cat':
        if (!args[0]) return 'cat: missing operand';
        if (args[0] === 'package.json') {
          return `{
  "name": "codeforge-project",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}`;
        }
        return `cat: ${args[0]}: No such file or directory`;

      case 'echo':
        return args.join(' ');

      case 'clear':
        setHistory([]);
        return '';

      case 'node':
        if (args[0] === '-v') return 'v18.17.0';
        return 'Node.js JavaScript runtime';

      case 'npm':
        if (args[0] === '-v') return '9.6.7';
        if (args[0] === 'install') return 'npm install completed successfully\n✓ Dependencies installed';
        if (args[0] === 'start') return 'Starting application...\n> Server running on http://localhost:3000';
        if (args[0] === 'run' && args[1] === 'dev') return 'Starting development server...\n> Dev server running on http://localhost:3000';
        return 'npm <command>';

      case 'git':
        if (args[0] === 'status') return 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean';
        return 'git version 2.34.1';

      case 'python':
      case 'python3':
        if (args[0] === '--version') return 'Python 3.9.7';
        return 'Python 3.9.7 (default, Oct 13 2021, 06:44:56)';

      case 'java':
        if (args[0] === '-version') return 'openjdk version "11.0.16" 2022-07-19';
        return 'Usage: java [-options] class [args...]';

      case 'whoami':
        return 'codeforge-user';

      case 'date':
        return new Date().toString();

      case 'uptime':
        return 'up 2 days, 14:32, 1 user, load average: 0.15, 0.05, 0.01';

      default:
        throw new Error(`Command not found: ${cmd}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div 
      className="bg-black text-green-400 border-t border-gray-700 flex flex-col font-mono text-sm"
      style={{ height }}
    >
      <div className="flex items-center justify-between px-3 py-1 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-xs font-medium">Terminal</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onHeightChange(Math.max(150, height - 50))}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onHeightChange(Math.min(400, height + 50))}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div ref={outputRef} className="flex-1 overflow-auto p-2 space-y-1">
        {history.map((line) => (
          <div key={line.id} className={`whitespace-pre-wrap ${
            line.type === 'command' ? 'text-blue-400' : 
            line.type === 'error' ? 'text-red-400' : 'text-green-400'
          }`}>
            {line.content}
          </div>
        ))}
      </div>
      
      <div className="flex items-center px-2 py-1 border-t border-gray-700">
        <span className="text-blue-400 mr-2">{currentDir}$</span>
        <Input
          ref={inputRef}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 h-auto font-mono"
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
}
