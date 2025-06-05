import { useState, useCallback, useRef, useEffect } from 'react';
import { debounce } from '@/lib/utils';
import { useUpdateFile } from './use-files';
import type { EditorTab, FileTreeItem } from '@/types/ide';

export function useEditor() {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const updateFile = useUpdateFile();
  const autoSaveTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const openFile = useCallback((file: FileTreeItem) => {
    if (file.isDirectory) return;

    // Check if file is already open
    const existingTab = tabs.find(tab => tab.id === file.id);
    if (existingTab) {
      setActiveTabId(file.id);
      return;
    }

    // Create new tab
    const newTab: EditorTab = {
      id: file.id,
      name: file.name,
      path: file.path,
      content: file.content || '',
      language: getLanguageFromExtension(file.name),
      isModified: false,
      isActive: true,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(file.id);
  }, [tabs]);

  const closeTab = useCallback((tabId: number) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      // If closing active tab, switch to another tab
      if (tabId === activeTabId) {
        if (newTabs.length > 0) {
          const activeIndex = prev.findIndex(tab => tab.id === tabId);
          const nextTab = newTabs[activeIndex] || newTabs[activeIndex - 1] || newTabs[0];
          setActiveTabId(nextTab.id);
        } else {
          setActiveTabId(null);
        }
      }
      
      return newTabs;
    });

    // Clear auto-save timeout
    const timeout = autoSaveTimeouts.current.get(tabId);
    if (timeout) {
      clearTimeout(timeout);
      autoSaveTimeouts.current.delete(tabId);
    }
  }, [activeTabId]);

  const updateTabContent = useCallback((tabId: number, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, isModified: true }
        : tab
    ));

    // Auto-save after 2 seconds of inactivity
    const existingTimeout = autoSaveTimeouts.current.get(tabId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      const tab = tabs.find(t => t.id === tabId);
      if (tab) {
        updateFile.mutate(
          { id: tabId, updates: { content } },
          {
            onSuccess: () => {
              setTabs(prev => prev.map(t => 
                t.id === tabId ? { ...t, isModified: false } : t
              ));
            }
          }
        );
      }
      autoSaveTimeouts.current.delete(tabId);
    }, 2000);

    autoSaveTimeouts.current.set(tabId, timeout);
  }, [tabs, updateFile]);

  const saveTab = useCallback((tabId: number) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab || !tab.isModified) return;

    updateFile.mutate(
      { id: tabId, updates: { content: tab.content } },
      {
        onSuccess: () => {
          setTabs(prev => prev.map(t => 
            t.id === tabId ? { ...t, isModified: false } : t
          ));
        }
      }
    );

    // Clear auto-save timeout
    const timeout = autoSaveTimeouts.current.get(tabId);
    if (timeout) {
      clearTimeout(timeout);
      autoSaveTimeouts.current.delete(tabId);
    }
  }, [tabs, updateFile]);

  const saveAllTabs = useCallback(() => {
    tabs.filter(tab => tab.isModified).forEach(tab => {
      saveTab(tab.id);
    });
  }, [tabs, saveTab]);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: Save current tab
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTabId) {
          saveTab(activeTabId);
        }
      }

      // Ctrl/Cmd + Shift + S: Save all tabs
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        saveAllTabs();
      }

      // Ctrl/Cmd + W: Close current tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, saveTab, saveAllTabs, closeTab]);

  return {
    tabs,
    activeTab,
    activeTabId,
    cursorPosition,
    openFile,
    closeTab,
    setActiveTabId,
    updateTabContent,
    saveTab,
    saveAllTabs,
    setCursorPosition,
    isSaving: updateFile.isPending,
  };
}

function getLanguageFromExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
    case 'scss':
    case 'sass':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'php':
      return 'php';
    case 'xml':
      return 'xml';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'sql':
      return 'sql';
    case 'sh':
      return 'shell';
    default:
      return 'plaintext';
  }
}
