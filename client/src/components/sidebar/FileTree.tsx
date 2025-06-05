import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, File as FileIcon, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFileIcon } from "@/lib/fileUtils";
import type { File } from "@shared/schema";

interface FileTreeProps {
  files: File[];
  onFileSelect: (file: File) => void;
}

interface TreeNode {
  file: File;
  children: TreeNode[];
  isExpanded: boolean;
}

export default function FileTree({ files, onFileSelect }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
  const [selectedFile, setSelectedFile] = useState<number | null>(null);

  // Build tree structure from flat file list
  const buildTree = (files: File[]): TreeNode[] => {
    const fileMap = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    // Create nodes for all files
    files.forEach(file => {
      fileMap.set(file.id, {
        file,
        children: [],
        isExpanded: expandedFolders.has(file.id)
      });
    });

    // Build tree structure
    files.forEach(file => {
      const node = fileMap.get(file.id)!;
      
      if (file.parentId && fileMap.has(file.parentId)) {
        fileMap.get(file.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    // Sort children: folders first, then files
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => {
        if (a.file.type !== b.file.type) {
          return a.file.type === 'folder' ? -1 : 1;
        }
        return a.file.name.localeCompare(b.file.name);
      });
      nodes.forEach(node => sortNodes(node.children));
    };

    sortNodes(roots);
    return roots;
  };

  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleFileClick = (file: File) => {
    if (file.type === 'folder') {
      toggleFolder(file.id);
    } else {
      setSelectedFile(file.id);
      onFileSelect(file);
    }
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const { file } = node;
    const isFolder = file.type === 'folder';
    const isExpanded = expandedFolders.has(file.id);
    const isSelected = selectedFile === file.id;

    return (
      <div key={file.id}>
        <Button
          variant="ghost"
          className={`w-full justify-start px-2 py-1 h-auto text-sm font-normal vscode-hover ${
            isSelected ? 'vscode-active' : ''
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => handleFileClick(file)}
        >
          {isFolder && (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 mr-1 vscode-muted" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1 vscode-muted" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-blue-400" />
              )}
            </>
          )}
          
          {!isFolder && (
            <div className="w-3 h-3 mr-1" />
          )}
          
          {!isFolder && getFileIcon(file.name)}
          
          <span className="truncate">{file.name}</span>
        </Button>
        
        {isFolder && isExpanded && node.children.map(child => 
          renderNode(child, depth + 1)
        )}
      </div>
    );
  };

  const tree = buildTree(files);

  return (
    <div className="py-2">
      {tree.map(node => renderNode(node))}
      {files.length === 0 && (
        <div className="px-4 py-8 text-center vscode-muted">
          <p className="text-sm">No files in this project</p>
        </div>
      )}
    </div>
  );
}
