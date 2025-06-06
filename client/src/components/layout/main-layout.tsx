import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TopNavigation } from './top-navigation';
import { FileSidebar } from './file-sidebar';
import { EditorArea } from './editor-area';
import { StatusBar } from './status-bar';
import { Terminal } from '../ui/terminal';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [terminalHeight, setTerminalHeight] = useState(192);

  const toggleTerminal = () => {
    setIsTerminalOpen(!isTerminalOpen);
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightPanel = () => {
    setIsRightPanelOpen(!isRightPanelOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-[#1E1E1E] text-[#CCCCCC] font-ui overflow-auto">
      {/* Top Navigation */}
      <TopNavigation 
        onToggleLeftSidebar={toggleLeftSidebar}
        onToggleRightPanel={toggleRightPanel}
        onToggleTerminal={toggleTerminal}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-auto">
        {/* Left Sidebar */}
        {isLeftSidebarOpen && (
          <>
            <FileSidebar 
              width={sidebarWidth}
              className="flex-shrink-0"
            />
            {/* Resize Handle */}
            <div
              className="w-1 bg-[#3C3C3C] cursor-col-resize hover:bg-[#007ACC] transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startWidth = sidebarWidth;

                const handleMouseMove = (e: MouseEvent) => {
                  const newWidth = Math.max(200, Math.min(600, startWidth + e.clientX - startX));
                  setSidebarWidth(newWidth);
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div 
            className={cn(
              'flex-1 overflow-hidden',
              isTerminalOpen ? 'border-b border-[#3C3C3C]' : ''
            )}
          >
            <EditorArea />
          </div>

          {/* Terminal */}
          {isTerminalOpen && (
            <>
              {/* Terminal Resize Handle */}
              <div
                className="h-1 bg-[#3C3C3C] cursor-row-resize hover:bg-[#007ACC] transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startY = e.clientY;
                  const startHeight = terminalHeight;

                  const handleMouseMove = (e: MouseEvent) => {
                    const newHeight = Math.max(100, Math.min(400, startHeight - (e.clientY - startY)));
                    setTerminalHeight(newHeight);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
              <div style={{ height: terminalHeight }} className="flex-shrink-0">
                <Terminal 
                  className="h-full"
                  isActive={true}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Panel */}
        {isRightPanelOpen && (
          <>
            {/* Resize Handle */}
            <div
              className="w-1 bg-[#3C3C3C] cursor-col-resize hover:bg-[#007ACC] transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startWidth = rightPanelWidth;

                const handleMouseMove = (e: MouseEvent) => {
                  const newWidth = Math.max(250, Math.min(500, startWidth - (e.clientX - startX)));
                  setRightPanelWidth(newWidth);
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
            <div 
              style={{ width: rightPanelWidth }}
              className="flex-shrink-0 bg-[#252526] border-l border-[#3C3C3C]"
            >
              {/* Right panel content would go here */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-4">Collaboration Panel</h3>
                <p className="text-xs text-[#6A6A6A]">
                  Collaboration features will be displayed here.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}

// Layout context for sharing layout state across components
import { createContext, useContext } from 'react';

interface LayoutContextType {
  isTerminalOpen: boolean;
  isLeftSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  toggleTerminal: () => void;
  toggleLeftSidebar: () => void;
  toggleRightPanel: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen);
  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const toggleRightPanel = () => setIsRightPanelOpen(!isRightPanelOpen);

  return (
    <LayoutContext.Provider value={{
      isTerminalOpen,
      isLeftSidebarOpen,
      isRightPanelOpen,
      toggleTerminal,
      toggleLeftSidebar,
      toggleRightPanel,
    }}>
      {children}
    </LayoutContext.Provider>
  );
}
