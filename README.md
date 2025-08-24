# CodeForge IDE - Professional Code Editor

A modern, collaborative web-based IDE built with React, TypeScript, and Express. Deploy instantly with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/codeforge-ide)

## Features

### Core IDE Functionality
- **Monaco Code Editor** with syntax highlighting for 20+ programming languages
- **File Explorer** with full CRUD operations (create, read, update, delete)
- **Multi-tab Editor** with unsaved changes tracking and smart tab management
- **Integrated Terminal** with command execution and output display
- **Project Templates** for quick setup (Node.js, React, Vue.js, Python, etc.)

### Real-time Collaboration
- **Live Cursor Tracking** showing collaborators' positions in real-time
- **Simultaneous Editing** with conflict resolution
- **Team Chat** integrated into the workspace
- **User Presence** indicators and status
- **WebSocket-based** real-time communication

### Development Tools
- **Git Integration** with status, commit, push, pull operations
- **Code Analysis** and linting with issue detection
- **Language Detection** and auto-configuration
- **File Type Icons** and syntax highlighting
- **Responsive Design** optimized for desktop and mobile

## Quick Deploy to Vercel

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Set environment variables (optional):
   - `GITHUB_TOKEN` - For GitHub integration
   - `GITHUB_USERNAME` - Your GitHub username  
   - `GITHUB_REPOSITORY` - Repository for storing projects
4. Deploy! Your IDE will be live in minutes.

## Technology Stack

### Frontend
- **React 18** with modern hooks and context
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** with custom VS Code-inspired theming
- **Monaco Editor** (VS Code's editor) for code editing
- **Radix UI** for accessible component primitives
- **Wouter** for lightweight routing
- **TanStack Query** for server state management

### Backend
- **Express.js** with TypeScript
- **WebSocket (ws)** for real-time communication
- **Zod** for runtime type validation
- **Node.js 18+** with ES modules

### Storage & Deployment
- **GitHub Repository** for all user, project, and file data
- **Vercel** for instant deployment and scaling
- **Serverless Functions** for API endpoints

## Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:8080 in your browser

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── types/          # TypeScript type definitions
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and WebSocket handling
│   └── storage.ts         # GitHub storage operations
├── api/                   # Vercel serverless functions
├── shared/                # Shared types and schemas
├── vercel.json            # Vercel deployment configuration
└── vite.config.ts         # Build configuration
```

## API Documentation

### Project Management
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### File Operations
- `GET /api/projects/:id/files` - List project files
- `POST /api/projects/:id/files` - Create new file
- `GET /api/files/:id` - Get file content
- `PUT /api/files/:id` - Update file content
- `DELETE /api/files/:id` - Delete file

### Development Tools
- `POST /api/projects/:id/terminal/execute` - Execute terminal command
- `POST /api/projects/:id/analyze` - Analyze code for issues

### Collaboration
- `GET /api/projects/:id/chat` - Get chat messages
- `POST /api/projects/:id/chat` - Send chat message
- WebSocket `/ws` - Real-time collaboration events

## Environment Variables (Optional)

For GitHub integration:
- `GITHUB_TOKEN` - Your GitHub personal access token
- `GITHUB_USERNAME` - Your GitHub username  
- `GITHUB_REPOSITORY` - Repository name for storing projects

## Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use existing component patterns
3. Maintain responsive design principles
4. Write self-documenting code
5. Test functionality thoroughly

## License

MIT License - see LICENSE file for details

---

**CodeForge IDE** - Professional code editing in the browser, deployed instantly with Vercel.
