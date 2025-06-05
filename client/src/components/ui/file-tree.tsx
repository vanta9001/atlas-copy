import { useState } from 'react';
import { cn, getFileIcon, getFileColor } from '@/lib/utils';
import type { FileTreeItem } from '@/types/ide';

interface FileTreeProps {
  items: FileTreeItem[];
  onFileSelect?: (file: FileTreeItem) => void;
  onFileContextMenu?: (file: FileTreeItem, event: React.MouseEvent) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  selectedPath?: string;
  className?: string;
}

export function FileTree({
  items,
  onFileSelect,
  onFileContextMenu,
  expandedFolders,
  onToggleFolder,
  selectedPath,
  className,
}: FileTreeProps) {
  return (
    <div className={cn('select-none', className)}>
      {items.map((item) => (
        <FileTreeNode
          key={item.path}
          item={item}
          level={0}
          onFileSelect={onFileSelect}
          onFileContextMenu={onFileContextMenu}
          expandedFolders={expandedFolders}
          onToggleFolder={onToggleFolder}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
}

interface FileTreeNodeProps {
  item: FileTreeItem;
  level: number;
  onFileSelect?: (file: FileTreeItem) => void;
  onFileContextMenu?: (file: FileTreeItem, event: React.MouseEvent) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  selectedPath?: string;
}

function FileTreeNode({
  item,
  level,
  onFileSelect,
  onFileContextMenu,
  expandedFolders,
  onToggleFolder,
  selectedPath,
}: FileTreeNodeProps) {
  const isExpanded = expandedFolders.has(item.path);
  const isSelected = selectedPath === item.path;
  const paddingLeft = level * 16 + 8;

  const handleClick = () => {
    if (item.isDirectory) {
      onToggleFolder(item.path);
    } else {
      onFileSelect?.(item);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onFileContextMenu?.(item, e);
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center py-1 px-2 hover:bg-[#2A2D2E] rounded cursor-pointer transition-colors',
          isSelected && 'bg-[#094771]'
        )}
        style={{ paddingLeft }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {item.isDirectory && (
          <i
            className={cn(
              'text-xs mr-1 text-[#6A6A6A] transition-transform',
              'fas',
              isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'
            )}
          />
        )}
        {!item.isDirectory && <span className="w-3 mr-1" />}
        
        <i
          className={cn(
            'mr-2 text-sm',
            getFileIcon(item.name, item.isDirectory),
            getFileColor(item.name, item.isDirectory)
          )}
        />
        
        <span className="text-sm truncate flex-1">{item.name}</span>
      </div>

      {item.isDirectory && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeNode
              key={child.path}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              onFileContextMenu={onFileContextMenu}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface FileTreeSkeletonProps {
  className?: string;
}

export function FileTreeSkeleton({ className }: FileTreeSkeletonProps) {
  return (
    <div className={cn('space-y-1 p-2', className)}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2 px-2 py-1">
          <div className="w-4 h-4 bg-[#3C3C3C] rounded animate-pulse" />
          <div className="w-16 h-4 bg-[#3C3C3C] rounded animate-pulse" />
          <div 
            className="h-4 bg-[#3C3C3C] rounded animate-pulse"
            style={{ width: `${Math.random() * 60 + 40}px` }}
          />
        </div>
      ))}
    </div>
  );
}

interface CreateFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, isDirectory: boolean) => void;
  parentPath: string;
  isDirectory?: boolean;
}

export function CreateFileDialog({
  isOpen,
  onClose,
  onConfirm,
  parentPath,
  isDirectory = false,
}: CreateFileDialogProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim(), isDirectory);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252526] border border-[#3C3C3C] rounded-lg w-96 max-w-[90vw]">
        <div className="px-6 py-4 border-b border-[#3C3C3C]">
          <h2 className="text-lg font-semibold text-[#CCCCCC]">
            Create {isDirectory ? 'Folder' : 'File'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#CCCCCC]">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#3C3C3C] rounded px-3 py-2 text-[#CCCCCC] focus:outline-none focus:border-[#007ACC]"
              placeholder={isDirectory ? 'folder-name' : 'file-name.ext'}
              autoFocus
            />
            <p className="text-xs text-[#6A6A6A] mt-1">
              Path: {parentPath === '/' ? '/' : parentPath + '/'}{name}
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[#3C3C3C] rounded hover:bg-[#2A2D2E] transition-colors text-[#CCCCCC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm bg-[#007ACC] rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
