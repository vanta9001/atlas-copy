import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import { users, projects, files, collaborators, chatMessages, type User, type InsertUser, type Project, type InsertProject, type File, type InsertFile, type Collaborator, type InsertCollaborator, type ChatMessage, type InsertChatMessage } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // File operations
  getFile(id: number): Promise<File | undefined>;
  getFilesByProjectId(projectId: number): Promise<File[]>;
  getFileByPath(projectId: number, path: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, updates: Partial<File>): Promise<File | undefined>;
  deleteFile(id: number): Promise<boolean>;

  // Collaborator operations
  getCollaboratorsByProjectId(projectId: number): Promise<Collaborator[]>;
  addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator>;
  removeCollaborator(projectId: number, userId: number): Promise<boolean>;

  // Chat operations
  getChatMessages(projectId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private files: Map<number, File>;
  private collaborators: Map<number, Collaborator>;
  private chatMessages: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentFileId: number;
  private currentCollaboratorId: number;
  private currentChatMessageId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.files = new Map();
    this.collaborators = new Map();
    this.chatMessages = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentFileId = 1;
    this.currentCollaboratorId = 1;
    this.currentChatMessageId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = { 
      id,
      name: insertProject.name,
      description: insertProject.description || null,
      template: insertProject.template || "blank",
      userId: insertProject.userId,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updated = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // File operations
  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFilesByProjectId(projectId: number): Promise<File[]> {
    return Array.from(this.files.values()).filter(file => file.projectId === projectId);
  }

  async getFileByPath(projectId: number, path: string): Promise<File | undefined> {
    return Array.from(this.files.values()).find(file => 
      file.projectId === projectId && file.path === path
    );
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.currentFileId++;
    const now = new Date();
    const file: File = { 
      ...insertFile, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: number, updates: Partial<File>): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;

    const updated = { ...file, ...updates, updatedAt: new Date() };
    this.files.set(id, updated);
    return updated;
  }

  async deleteFile(id: number): Promise<boolean> {
    return this.files.delete(id);
  }

  // Collaborator operations
  async getCollaboratorsByProjectId(projectId: number): Promise<Collaborator[]> {
    return Array.from(this.collaborators.values()).filter(collab => collab.projectId === projectId);
  }

  async addCollaborator(insertCollaborator: InsertCollaborator): Promise<Collaborator> {
    const id = this.currentCollaboratorId++;
    const collaborator: Collaborator = { 
      id,
      projectId: insertCollaborator.projectId,
      userId: insertCollaborator.userId,
      role: insertCollaborator.role || "viewer",
      createdAt: new Date() 
    };
    this.collaborators.set(id, collaborator);
    return collaborator;
  }

  async removeCollaborator(projectId: number, userId: number): Promise<boolean> {
    const collaborator = Array.from(this.collaborators.values()).find(
      collab => collab.projectId === projectId && collab.userId === userId
    );
    if (!collaborator) return false;
    return this.collaborators.delete(collaborator.id);
  }

  // Chat operations
  async getChatMessages(projectId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.projectId === projectId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

// Database storage implementation
class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await this.db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await this.db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const result = await this.db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await this.db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }

  async getFile(id: number): Promise<File | undefined> {
    const result = await this.db.select().from(files).where(eq(files.id, id));
    return result[0];
  }

  async getFilesByProjectId(projectId: number): Promise<File[]> {
    return await this.db.select().from(files).where(eq(files.projectId, projectId));
  }

  async getFileByPath(projectId: number, path: string): Promise<File | undefined> {
    const result = await this.db.select().from(files).where(
      and(eq(files.projectId, projectId), eq(files.path, path))
    );
    return result[0];
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const result = await this.db.insert(files).values(insertFile).returning();
    return result[0];
  }

  async updateFile(id: number, updates: Partial<File>): Promise<File | undefined> {
    const result = await this.db.update(files).set(updates).where(eq(files.id, id)).returning();
    return result[0];
  }

  async deleteFile(id: number): Promise<boolean> {
    const result = await this.db.delete(files).where(eq(files.id, id));
    return result.rowCount > 0;
  }

  async getCollaboratorsByProjectId(projectId: number): Promise<Collaborator[]> {
    return await this.db.select().from(collaborators).where(eq(collaborators.projectId, projectId));
  }

  async addCollaborator(insertCollaborator: InsertCollaborator): Promise<Collaborator> {
    const result = await this.db.insert(collaborators).values(insertCollaborator).returning();
    return result[0];
  }

  async removeCollaborator(projectId: number, userId: number): Promise<boolean> {
    const result = await this.db.delete(collaborators).where(
      and(eq(collaborators.projectId, projectId), eq(collaborators.userId, userId))
    );
    return result.rowCount > 0;
  }

  async getChatMessages(projectId: number): Promise<ChatMessage[]> {
    return await this.db.select().from(chatMessages).where(eq(chatMessages.projectId, projectId));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const result = await this.db.insert(chatMessages).values(insertMessage).returning();
    return result[0];
  }

  async getUserByEmail(email: string) {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
}

// Use database storage if DATABASE_URL is available, otherwise use memory storage
import { GitHubStorage } from "./github-storage.js";

// Use GitHub storage if credentials are available, otherwise fall back to memory storage
export const storage = (process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME && process.env.GITHUB_REPOSITORY) 
  ? new GitHubStorage({
      token: process.env.GITHUB_TOKEN,
      username: process.env.GITHUB_USERNAME,
      repositoryName: process.env.GITHUB_REPOSITORY
    })
  : new MemStorage();