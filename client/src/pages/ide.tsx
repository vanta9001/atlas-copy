import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import TopNavigation from "@/components/layout/TopNavigation";
import FileSidebar from "@/components/sidebar/FileSidebar";
import EditorTabs from "@/components/editor/EditorTabs";
import Monaco from "@/components/editor/Monaco";
import TerminalPanel from "@/components/panels/TerminalPanel";
import RightPanel from "@/components/panels/RightPanel";
import StatusBar from "@/components/layout/StatusBar";
import ProjectModal from "@/components/modals/ProjectModal";
import useWebSocket from "@/hooks/useWebSocket";
import type { File, Project } from "@shared/schema";

interface OpenFile extends File {
  isActive: boolean;
  isDirty: boolean;
}

export default function IDE() {
  const [match, params] = useRoute("/project/:id");
  const projectId = params?.id ? parseInt(params.id) : null;

  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [terminalHeight, setTerminalHeight] = useState(192);
  const [isRunning, setIsRunning] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // WebSocket for real-time collaboration
  const { socket, sendMessage } = useWebSocket();

  // Fetch current project
  const { data: project } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  // Fetch project files
  const { data: files = [] } = useQuery<File[]>({
    queryKey: [`/api/projects/${projectId}/files`],
    enabled: !!projectId,
  });

  const activeFile = openFiles.find(file => file.isActive);

  const openFile = (file: File) => {
    const existingFile = openFiles.find(f => f.id === file.id);

    if (existingFile) {
      // Switch to existing tab
      setOpenFiles(prev => prev.map(f => ({
        ...f,
        isActive: f.id === file.id
      })));
    } else {
      // Open new tab
      setOpenFiles(prev => [
        ...prev.map(f => ({ ...f, isActive: false })),
        { ...file, isActive: true, isDirty: false }
      ]);
    }
  };

  const closeFile = (fileId: number) => {
    const fileIndex = openFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    const wasActive = openFiles[fileIndex].isActive;
    const newOpenFiles = openFiles.filter(f => f.id !== fileId);

    if (wasActive && newOpenFiles.length > 0) {
      // Activate the next file or the previous one
      const newActiveIndex = Math.min(fileIndex, newOpenFiles.length - 1);
      newOpenFiles[newActiveIndex].isActive = true;
    }

    setOpenFiles(newOpenFiles);
  };

  const switchTab = (fileId: number) => {
    setOpenFiles(prev => prev.map(f => ({
      ...f,
      isActive: f.id === fileId
    })));
  };

  const updateFileContent = (fileId: number, content: string) => {
    setOpenFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, content, isDirty: f.content !== content }
        : f
    ));
  };

  const saveFile = async () => {
    const activeFile = openFiles.find(f => f.isActive);
    if (!activeFile || !activeFile.isDirty) return;

    try {
      const response = await fetch(`/api/files/${activeFile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: activeFile.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      setOpenFiles(prev => prev.map(f => 
        f.id === activeFile.id 
          ? { ...f, isDirty: false }
          : f
      ));

      console.log('File saved successfully!');
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  const saveAllFiles = async () => {
    const dirtyFiles = openFiles.filter(f => f.isDirty);

    for (const file of dirtyFiles) {
      try {
        const response = await fetch(`/api/files/${file.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: file.content,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${file.name}`);
        }
      } catch (error) {
        console.error('Failed to save file:', file.name, error);
      }
    }

    setOpenFiles(prev => prev.map(f => ({ ...f, isDirty: false })));
    console.log('All files saved successfully!');
  };

  const runCode = async () => {
    if (!projectId) return;

    setIsRunning(true);
    setIsTerminalOpen(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/run`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to run code');
      }

      const result = await response.json();
      console.log('Code execution started:', result);

      // Simulate running for a few seconds (in real app, this would be handled by WebSocket)
      setTimeout(() => {
        setIsRunning(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to run code:', error);
      setIsRunning(false);
    }
  };

  const stopExecution = async () => {
    if (!projectId) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/stop`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to stop execution');
      }

      setIsRunning(false);
      console.log('Code execution stopped');
    } catch (error) {
      console.error('Failed to stop execution:', error);
      setIsRunning(false);
    }
  };

  const createNewFile = () => {
    setIsCreatingFile(true);
  };

  const createNewFolder = () => {
    setIsCreatingFolder(true);
  };

  const handleNewFile = () => {
    createNewFile();
  };

  const handleNewFolder = () => {
    createNewFolder();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key === 's') {
          e.preventDefault();
          if (e.shiftKey) {
            saveAllFiles();
          } else {
            saveFile();
          }
        }
        if (e.key === 'n') {
          e.preventDefault();
          createNewFile();
        }
        if (e.key === '`') {
          e.preventDefault();
          setIsTerminalOpen(prev => !prev);
        }
        if (e.key === 'r') {
          e.preventDefault();
          if (isRunning) {
            stopExecution();
          } else {
            runCode();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isRunning, openFiles]);

  return (
    <div className="flex flex-col h-screen">
      <TopNavigation
        projectName={project?.name}
        projectId={projectId || undefined}
        onRun={runCode}
        onStop={stopExecution}
        onRestart={() => {}}
      />

      <div className="flex flex-1 overflow-hidden">
        <FileSidebar
          files={files.map(f => ({
            id: f.id,
            name: f.name,
            path: f.path,
            type: (f.isDirectory || f.type === 'directory') ? 'folder' as const : 'file' as const,
            content: f.content,
            children: []
          }))}
          onFileSelect={(file) => openFile(files.find(f => f.id === file.id)!)}
          width={sidebarWidth}
          onWidthChange={setSidebarWidth}
          projectId={projectId || 0}
        />

        <div className="flex-1 flex flex-col">
          <EditorTabs
            openFiles={openFiles.map(f => ({
              id: f.id,
              name: f.name,
              path: f.path,
              content: f.content || '',
              isActive: f.isActive,
              isDirty: f.isDirty
            }))}
            onSwitchTab={switchTab}
            onCloseTab={closeFile}
          />

          <div className="flex flex-1 overflow-hidden">
            <Monaco
              file={activeFile ? {
                id: activeFile.id,
                name: activeFile.name,
                path: activeFile.path,
                content: activeFile.content || '',
                isActive: activeFile.isActive,
                isDirty: activeFile.isDirty
              } : null}
              onContentChange={updateFileContent}
            />

            {isRightPanelOpen && (
              <RightPanel
                projectId={projectId}
                onClose={() => setIsRightPanelOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {isTerminalOpen && (
        <TerminalPanel
          height={terminalHeight}
          onHeightChange={setTerminalHeight}
          onClose={() => setIsTerminalOpen(false)}
        />
      )}

      <StatusBar
        activeFile={activeFile ? {
          id: activeFile.id,
          name: activeFile.name,
          path: activeFile.path,
          content: activeFile.content || '',
          isActive: activeFile.isActive,
          isDirty: activeFile.isDirty
        } : null}
        project={project}
      />

      {isProjectModalOpen && (
        <ProjectModal
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}
    </div>
  );
}