import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, File, Folder, Plus, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  id: number;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
}

interface FileSidebarProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  width: number;
  onWidthChange: (width: number) => void;
  projectId: number;
}

export default function FileSidebar({ files, onFileSelect, width, onWidthChange, projectId }: FileSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemParent, setNewItemParent] = useState('/');
  const { toast } = useToast();

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  const handleFileSelect = useCallback((file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFile(file.path);
      onFileSelect(file);
    } else {
      toggleFolder(file.path);
    }
  }, [onFileSelect, toggleFolder]);

  const createNewItem = async (type: 'file' | 'folder') => {
    if (!newItemName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the new item.',
        variant: 'destructive',
      });
      return;
    }

    if (!projectId) {
      toast({
        title: 'Error',
        description: 'No project selected. Please select a project first.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Creating item:', { type, name: newItemName, projectId });

    try {
      const path = newItemParent === '/' ? `/${newItemName}` : `${newItemParent}/${newItemName}`;

      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newItemName,
          path: path,
          content: type === 'file' ? '' : undefined,
          isDirectory: type === 'folder',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      const newItem = await response.json();

      toast({
        title: `${type === 'file' ? 'File' : 'Folder'} created`,
        description: `${newItemName} has been created successfully.`,
      });

      // Reset form
      setNewItemName('');
      setIsCreatingFile(false);
      setIsCreatingFolder(false);

      // Refresh files or update state here
      window.location.reload(); // Simple refresh for now

    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to create ${type}. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id || item.path}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
            selectedFile === item.path ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleFileSelect(item)}
        >
          {item.type === 'folder' ? (
            <>
              {expandedFolders.has(item.path) ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )}
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
            </>
          ) : (
            <>
              <div className="w-4 h-4 mr-1" />
              <File className="w-4 h-4 mr-2 text-gray-500" />
            </>
          )}
          <span className="text-sm truncate">{item.name}</span>
        </div>
        {item.type === 'folder' && expandedFolders.has(item.path) && item.children && (
          <div>
            {renderFileTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div 
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Files</h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsCreatingFile(true);
                setNewItemParent('/');
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* New File/Folder Form */}
      {(isCreatingFile || isCreatingFolder) && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <Input
            placeholder={`${isCreatingFile ? 'File' : 'Folder'} name`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                createNewItem(isCreatingFile ? 'file' : 'folder');
              } else if (e.key === 'Escape') {
                setIsCreatingFile(false);
                setIsCreatingFolder(false);
                setNewItemName('');
              }
            }}
            className="mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => createNewItem(isCreatingFile ? 'file' : 'folder')}
            >
              Create
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsCreatingFile(false);
                setIsCreatingFolder(false);
                setNewItemName('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* File Tree */}
      <div className="flex-1 overflow-auto">
        {renderFileTree(files)}
      </div>
    </div>
  );
}