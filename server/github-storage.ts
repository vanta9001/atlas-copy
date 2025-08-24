import { User, Project, File, InsertUser, InsertProject, InsertFile, Collaborator, ChatMessage, InsertCollaborator, InsertChatMessage } from '../shared/schema.js';
import { IStorage } from './storage.js';

export interface GitHubConfig {
  token: string;
  username: string;
  repositoryName: string;
}

export class GitHubStorage implements IStorage {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async getFileContent(path: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/repos/${this.config.username}/${this.config.repositoryName}/contents/${path}`);
      const content = Buffer.from(response.content, 'base64').toString('utf-8');
      return JSON.parse(content);
    } catch (error) {
      return {};
    }
  }

  private async saveFileContent(path: string, data: any, sha?: string): Promise<void> {
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    
    const body: any = {
      message: `Update ${path}`,
      content,
    };

    if (sha) {
      body.sha = sha;
    }

    await this.makeRequest(`/repos/${this.config.username}/${this.config.repositoryName}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  private async getFileSha(path: string): Promise<string | null> {
    try {
      const response = await this.makeRequest(`/repos/${this.config.username}/${this.config.repositoryName}/contents/${path}`);
      return response.sha;
    } catch (error) {
      return null;
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const users = await this.getFileContent('data/users.json') || {};
    return users[id];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.getFileContent('data/users.json') || {};
    return Object.values(users as Record<string, any>).find((user: any) => user.username === username) as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getFileContent('data/users.json') || {};
    return Object.values(users as Record<string, any>).find((user: any) => user.email === email) as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await this.getFileContent('data/users.json') || {};
    const id = Math.max(0, ...Object.keys(users).map(Number)) + 1;
    
    const user: User = {
      id,
      ...insertUser,
      createdAt: new Date(),
    };

    users[id] = user;
    const sha = await this.getFileSha('data/users.json');
    await this.saveFileContent('data/users.json', users, sha || undefined);
    
    return user;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const projects = await this.getFileContent('data/projects.json') || {};
    return projects[id];
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    const projects = await this.getFileContent('data/projects.json') || {};
    return Object.values(projects as Record<string, any>).filter((project: any) => project.userId === userId) as Project[];
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const projects = await this.getFileContent('data/projects.json') || {};
    const id = Math.max(0, ...Object.keys(projects).map(Number)) + 1;
    
    const project: Project = {
      id,
      ...insertProject,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projects[id] = project;
    const sha = await this.getFileSha('data/projects.json');
    await this.saveFileContent('data/projects.json', projects, sha || undefined);
    
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const projects = await this.getFileContent('data/projects.json') || {};
    const project = projects[id];
    
    if (!project) return undefined;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };

    projects[id] = updatedProject;
    const sha = await this.getFileSha('data/projects.json');
    await this.saveFileContent('data/projects.json', projects, sha || undefined);
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const projects = await this.getFileContent('data/projects.json') || {};
    
    if (!projects[id]) return false;

    delete projects[id];
    const sha = await this.getFileSha('data/projects.json');
    await this.saveFileContent('data/projects.json', projects, sha || undefined);
    
    return true;
  }

  // File operations
  async getFile(id: number): Promise<File | undefined> {
    const files = await this.getFileContent('data/files.json') || {};
    return files[id];
  }

  async getFilesByProjectId(projectId: number): Promise<File[]> {
    const files = await this.getFileContent('data/files.json') || {};
    return Object.values(files as Record<string, any>).filter((file: any) => file.projectId === projectId) as File[];
  }

  async getFileByPath(projectId: number, path: string): Promise<File | undefined> {
    const files = await this.getFileContent('data/files.json') || {};
    return Object.values(files as Record<string, any>).find((file: any) => 
      file.projectId === projectId && file.path === path
    ) as File | undefined;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const files = await this.getFileContent('data/files.json') || {};
    const id = Math.max(0, ...Object.keys(files).map(Number)) + 1;
    
    const file: File = {
      id,
      ...insertFile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    files[id] = file;
    const sha = await this.getFileSha('data/files.json');
    await this.saveFileContent('data/files.json', files, sha || undefined);
    
    return file;
  }

  async updateFile(id: number, updates: Partial<File>): Promise<File | undefined> {
    const files = await this.getFileContent('data/files.json') || {};
    const file = files[id];
    
    if (!file) return undefined;

    const updatedFile = {
      ...file,
      ...updates,
      updatedAt: new Date(),
    };

    files[id] = updatedFile;
    const sha = await this.getFileSha('data/files.json');
    await this.saveFileContent('data/files.json', files, sha || undefined);
    
    return updatedFile;
  }

  async deleteFile(id: number): Promise<boolean> {
    const files = await this.getFileContent('data/files.json') || {};
    
    if (!files[id]) return false;

    delete files[id];
    const sha = await this.getFileSha('data/files.json');
    await this.saveFileContent('data/files.json', files, sha || undefined);
    
    return true;
  }

  // Collaborator operations
  async getCollaboratorsByProjectId(projectId: number): Promise<Collaborator[]> {
    const collaborators = await this.getFileContent('data/collaborators.json') || {};
    return Object.values(collaborators as Record<string, any>).filter((collab: any) => collab.projectId === projectId) as Collaborator[];
  }

  async addCollaborator(insertCollaborator: InsertCollaborator): Promise<Collaborator> {
    const collaborators = await this.getFileContent('data/collaborators.json') || {};
    const id = Math.max(0, ...Object.keys(collaborators).map(Number)) + 1;
    
    const collaborator: Collaborator = {
      id,
      projectId: insertCollaborator.projectId,
      userId: insertCollaborator.userId,
      role: insertCollaborator.role || "viewer",
      createdAt: new Date(),
    };

    collaborators[id] = collaborator;
    const sha = await this.getFileSha('data/collaborators.json');
    await this.saveFileContent('data/collaborators.json', collaborators, sha || undefined);
    
    return collaborator;
  }

  async removeCollaborator(projectId: number, userId: number): Promise<boolean> {
    const collaborators = await this.getFileContent('data/collaborators.json') || {};
    const collaboratorEntry = Object.entries(collaborators).find(([_, collab]: [string, any]) => 
      collab.projectId === projectId && collab.userId === userId
    );
    
    if (!collaboratorEntry) return false;
    
    delete collaborators[collaboratorEntry[0]];
    const sha = await this.getFileSha('data/collaborators.json');
    await this.saveFileContent('data/collaborators.json', collaborators, sha || undefined);
    
    return true;
  }

  // Chat operations
  async getChatMessages(projectId: number): Promise<ChatMessage[]> {
    const messages = await this.getFileContent('data/messages.json') || {};
    return Object.values(messages as Record<string, any>).filter((msg: any) => msg.projectId === projectId)
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) as ChatMessage[];
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const messages = await this.getFileContent('data/messages.json') || {};
    const id = Math.max(0, ...Object.keys(messages).map(Number)) + 1;
    
    const message: ChatMessage = {
      id,
      projectId: insertMessage.projectId,
      userId: insertMessage.userId,
      message: insertMessage.message,
      createdAt: new Date(),
    };

    messages[id] = message;
    const sha = await this.getFileSha('data/messages.json');
    await this.saveFileContent('data/messages.json', messages, sha || undefined);
    
    return message;
  }

  // Initialize repository structure
  async initializeRepository(): Promise<void> {
    try {
      // Create initial data files if they don't exist
      const dataFiles = [
        { path: 'data/users.json', content: '{}' },
        { path: 'data/projects.json', content: '{}' },
        { path: 'data/files.json', content: '{}' },
        { path: 'data/collaborators.json', content: '{}' },
        { path: 'data/messages.json', content: '{}' },
        { path: 'README.md', content: '# Atlas IDE Data Repository\n\nThis repository stores Atlas IDE user data.' }
      ];

      for (const file of dataFiles) {
        try {
          await this.makeRequest(`/repos/${this.config.username}/${this.config.repositoryName}/contents/${file.path}`);
        } catch (error) {
          // File doesn't exist, create it
          await this.makeRequest(`/repos/${this.config.username}/${this.config.repositoryName}/contents/${file.path}`, {
            method: 'PUT',
            body: JSON.stringify({
              message: `Initialize ${file.path}`,
              content: Buffer.from(file.content).toString('base64'),
            }),
          });
        }
      }
    } catch (error) {
      console.error('Failed to initialize repository:', error);
    }
  }
}