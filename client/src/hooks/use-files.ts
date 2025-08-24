import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { File } from "@shared/schema";

export interface FileTreeItem extends File {
  children?: FileTreeItem[];
}

export interface CreateFileRequest {
  name: string;
  path: string;
  content: string | null;
  isDirectory: boolean;
  parentPath?: string;
}

export function useProjectFiles(projectId: number | null) {
  return useQuery<File[]>({
    queryKey: [`/api/projects/${projectId}/files`],
    enabled: !!projectId,
    select: (files) => buildFileTree(files),
  });
}

export function useFileOperations(projectId: number | null) {
  const queryClient = useQueryClient();

  const createFile = useMutation({
    mutationFn: async (fileData: CreateFileRequest) => {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fileData.name,
          path: fileData.path,
          content: fileData.content || "",
          isDirectory: fileData.isDirectory,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create file");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/projects/${projectId}/files`],
      });
    },
  });

  const updateFile = useMutation({
    mutationFn: async ({ fileId, content }: { fileId: number; content: string }) => {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update file");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/projects/${projectId}/files`],
      });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: number) => {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/projects/${projectId}/files`],
      });
    },
  });

  return {
    createFile: createFile.mutateAsync,
    updateFile: updateFile.mutateAsync,
    deleteFile: deleteFile.mutateAsync,
    isCreating: createFile.isPending,
    isUpdating: updateFile.isPending,
    isDeleting: deleteFile.isPending,
  };
}

export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<File> }) => {
      const response = await fetch(`/api/files/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update file");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects"],
      });
    },
  });
}

function buildFileTree(files: File[]): FileTreeItem[] {
  const fileMap = new Map<string, FileTreeItem>();
  const roots: FileTreeItem[] = [];

  // First pass: create all file objects
  files.forEach(file => {
    fileMap.set(file.path, { ...file, children: (file.isDirectory || file.type === 'directory') ? [] : undefined });
  });

  // Second pass: build the tree structure
  files.forEach(file => {
    const fileItem = fileMap.get(file.path)!;
    const parentPath = getParentPath(file.path);

    if (parentPath === '' || parentPath === '/') {
      roots.push(fileItem);
    } else {
      const parent = fileMap.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(fileItem);
      }
    }
  });

  return roots;
}

function getParentPath(path: string): string {
  if (path === '/' || path === '') return '';
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 1) return '/';
  return '/' + parts.slice(0, -1).join('/');
}