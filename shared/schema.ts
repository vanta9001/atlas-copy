import { z } from "zod";

// User type and schema
export const insertUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Project type and schema
export const insertProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  template: z.string().default("blank"),
  userId: z.number(),
});

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  template: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// File type and schema
export const insertFileSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  content: z.string().optional(),
  type: z.string(),
  projectId: z.number(),
  parentId: z.number().optional(),
});

export interface File {
  id: number;
  name: string;
  path: string;
  content?: string;
  type: string;
  projectId: number;
  parentId?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Collaborator type and schema
export const insertCollaboratorSchema = z.object({
  projectId: z.number(),
  userId: z.number(),
  role: z.string().default("viewer"),
});

export interface Collaborator {
  id: number;
  projectId: number;
  userId: number;
  role: string;
  createdAt: Date;
}

// ChatMessage type and schema
export const insertChatMessageSchema = z.object({
  projectId: z.number(),
  userId: z.number(),
  message: z.string().min(1),
});

export interface ChatMessage {
  id: number;
  projectId: number;
  userId: number;
  message: string;
  createdAt: Date;
}

// Type aliases for insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type InsertCollaborator = z.infer<typeof insertCollaboratorSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
