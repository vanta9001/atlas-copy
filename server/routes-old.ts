import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, insertFileSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

// Helper functions for IDE functionality
function simulateCommand(command: string): string {
  const responses: Record<string, string> = {
    'ls': 'index.js  package.json  node_modules  README.md',
    'pwd': '/workspace/project',
    'whoami': 'codeforge-user',
    'node --version': 'v18.17.0',
    'npm --version': '9.6.7',
    'git status': 'On branch main\nnothing to commit, working tree clean',
    'npm install': 'added 57 packages, and audited 58 packages in 3s\n\n✓ Installation complete',
    'npm start': 'Server running on http://localhost:3000',
    'npm run dev': 'Development server started on port 3000',
    'npm test': 'All tests passed! ✅'
  };
  
  const lowerCommand = command.toLowerCase().trim();
  return responses[lowerCommand] || `Command output: ${command}`;
}

function analyzeCode(content: string, language: string): any {
  const issues: any[] = [];
  const lines = content.split('\n');
  
  if (language === 'javascript' || language === 'typescript') {
    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        issues.push({
          line: index + 1,
          type: 'warning',
          message: 'Consider removing console.log statements in production'
        });
      }
      if (line.includes('var ')) {
        issues.push({
          line: index + 1,
          type: 'info',
          message: 'Consider using let or const instead of var'
        });
      }
    });
  }
  
  return {
    issues,
    metrics: {
      lines: lines.length,
      complexity: Math.min(10, Math.floor(lines.length / 10)),
      maintainability: Math.max(1, 10 - issues.length)
    }
  };
}

function simulateGitOperation(operation: string, data: any): any {
  switch (operation) {
    case 'status':
      return {
        branch: 'main',
        modified: ['src/index.js', 'package.json'],
        untracked: ['temp.txt'],
        staged: []
      };
    case 'add':
      return { message: `Added ${data.files?.join(', ') || 'files'} to staging area` };
    case 'commit':
      return { 
        hash: '1a2b3c4d',
        message: data.message || 'Commit message',
        timestamp: new Date().toISOString()
      };
    case 'push':
      return { message: 'Successfully pushed to origin/main' };
    case 'pull':
      return { message: 'Already up to date' };
    case 'log':
      return {
        commits: [
          { hash: '1a2b3c4d', message: 'Initial commit', author: 'User', date: new Date().toISOString() }
        ]
      };
    default:
      return { message: `Git ${operation} completed` };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware (simplified for MVP)
  const getCurrentUser = async (req: any) => {
    // In production, this would validate JWT token or session
    const userId = req.headers['x-user-id'] || 1;
    return await storage.getUser(Number(userId));
  };

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const projects = await storage.getProjectsByUserId(user.id);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const project = await storage.createProject(projectData);
      
      // Create default files based on template
      if (projectData.template && projectData.template !== "blank") {
        const defaultFiles = getTemplateFiles(projectData.template, project.id);
        for (const file of defaultFiles) {
          await storage.createFile(file);
        }
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(Number(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // File routes
  app.get("/api/projects/:projectId/files", async (req, res) => {
    try {
      const files = await storage.getFilesByProjectId(Number(req.params.projectId));
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.post("/api/projects/:projectId/files", async (req, res) => {
    try {
      const fileData = insertFileSchema.parse({
        ...req.body,
        projectId: Number(req.params.projectId)
      });
      
      const file = await storage.createFile(fileData);
      
      // Broadcast file creation to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'file_created',
            data: file
          }));
        }
      });
      
      res.json(file);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid file data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create file" });
    }
  });

  // Enhanced file operations
  app.post("/api/projects/:projectId/files/batch", async (req, res) => {
    try {
      const { operations } = req.body;
      const results = [];
      
      for (const operation of operations) {
        switch (operation.type) {
          case 'create':
            const fileData = insertFileSchema.parse({
              ...operation.data,
              projectId: Number(req.params.projectId)
            });
            const file = await storage.createFile(fileData);
            results.push({ type: 'created', file });
            break;
          case 'update':
            const updated = await storage.updateFile(operation.id, operation.data);
            results.push({ type: 'updated', file: updated });
            break;
          case 'delete':
            await storage.deleteFile(operation.id);
            results.push({ type: 'deleted', id: operation.id });
            break;
        }
      }
      
      // Broadcast batch operations
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'file_batch_operation',
            data: results
          }));
        }
      });
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to execute batch operations" });
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(Number(req.params.id));
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch file" });
    }
  });

  app.put("/api/files/:id", async (req, res) => {
    try {
      const updates = req.body;
      const file = await storage.updateFile(Number(req.params.id), updates);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to update file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const success = await storage.deleteFile(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Chat routes
  app.get("/api/projects/:projectId/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(Number(req.params.projectId));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/projects/:projectId/chat", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        projectId: Number(req.params.projectId),
        userId: user.id
      });
      
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Terminal execution routes
  app.post("/api/projects/:projectId/terminal/execute", async (req, res) => {
    try {
      const { command, workingDirectory } = req.body;
      const projectId = Number(req.params.projectId);
      
      // Simulate command execution (in production, you'd use child_process)
      const simulatedOutput = simulateCommand(command);
      
      // Broadcast terminal output to connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'terminal_output',
            projectId,
            data: {
              command,
              output: simulatedOutput,
              timestamp: new Date().toISOString()
            }
          }));
        }
      });
      
      res.json({ output: simulatedOutput });
    } catch (error) {
      res.status(500).json({ message: "Failed to execute command" });
    }
  });

  // Code analysis and linting
  app.post("/api/projects/:projectId/analyze", async (req, res) => {
    try {
      const { fileId, language } = req.body;
      const file = await storage.getFile(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      const analysis = analyzeCode(file.content || "", language);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze code" });
    }
  });

  // Git operations
  app.post("/api/projects/:projectId/git/:operation", async (req, res) => {
    try {
      const { operation } = req.params;
      const projectId = Number(req.params.projectId);
      
      // Simulate git operations
      const result = simulateGitOperation(operation, req.body);
      
      // Broadcast git operation to connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'git_operation',
            projectId,
            data: { operation, result }
          }));
        }
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: `Failed to execute git ${req.params.operation}` });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time collaboration
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Handle different message types
        switch (message.type) {
          case 'cursor_position':
            // Broadcast cursor position to other clients
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'cursor_update',
                  userId: message.userId,
                  position: message.position,
                  fileId: message.fileId
                }));
              }
            });
            break;
          case 'file_edit':
            // Broadcast file edits in real-time
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'file_change',
                  fileId: message.fileId,
                  changes: message.changes,
                  userId: message.userId
                }));
              }
            });
            break;
          case 'chat_message':
            // Broadcast chat messages
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
              }
            });
            break;
          default:
            // Broadcast unknown messages
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
              }
            });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}



// Helper function to create template files
function getTemplateFiles(template: string, projectId: number) {
  const templates: Record<string, any[]> = {
    nodejs: [
      {
        name: "index.js",
        path: "/index.js",
        content: `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,
        type: "file",
        projectId
      },
      {
        name: "package.json",
        path: "/package.json",
        content: `{
  "name": "nodejs-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`,
        type: "file",
        projectId
      }
    ],
    react: [
      {
        name: "index.html",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
    <script src="index.js"></script>
</body>
</html>`,
        type: "file",
        projectId
      },
      {
        name: "index.js",
        path: "/index.js",
        content: `import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <h1>Hello React!</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));`,
        type: "file",
        projectId
      }
    ]
  };

  return templates[template] || [];
}
