import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Project, InsertProject } from '@shared/schema';

export function useProjects(userId?: number) {
  return useQuery({
    queryKey: ['/api/projects', userId],
    enabled: !!userId,
  });
}

export function useProject(projectId?: number) {
  return useQuery({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: InsertProject): Promise<Project> => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertProject> }): Promise<Project> => {
      const response = await apiRequest('PUT', `/api/projects/${id}`, updates);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', data.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectId: number): Promise<void> => {
      await apiRequest('DELETE', `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useCurrentProject() {
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  
  const projectQuery = useProject(currentProjectId || undefined);
  
  return {
    currentProject: projectQuery.data,
    currentProjectId,
    setCurrentProjectId,
    isLoading: projectQuery.isLoading,
    error: projectQuery.error,
  };
}
