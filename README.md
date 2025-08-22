# Atlas - Free Cloud IDE Platform

A comprehensive cloud-based Integrated Development Environment that rivals Replit and GitHub Codespaces, built with React, Express, and modern web technologies.

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

### Advanced Features
- **Batch File Operations** for efficient workspace management
- **Real-time File Synchronization** across all connected clients
- **Project Sharing** and collaboration management
- **Persistent Storage** using GitHub repository
- **Extensible Architecture** for custom plugins and features

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

### Storage
- **GitHub Repository** for all user, project, and file data (no external database required)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- GitHub account and personal access token (for storage)

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables for GitHub storage:
   ```env
   GITHUB_TOKEN=your_github_token
   GITHUB_USERNAME=your_github_username
   GITHUB_REPOSITORY=your_repo_name
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5000 in your browser

## Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

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
│   ├── storage.ts         # GitHub storage operations
│   └── migrations.ts      # Database schema migrations
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── deployment files      # Configuration for hosting platforms
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
- `POST /api/projects/:id/git/:operation` - Git operations

### Collaboration
- `GET /api/projects/:id/chat` - Get chat messages
- `POST /api/projects/:id/chat` - Send chat message
- WebSocket `/ws` - Real-time collaboration events

## Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use existing component patterns
3. Maintain responsive design principles
4. Write self-documenting code
5. Test WebSocket functionality thoroughly

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Implement proper error handling
- Document complex logic with comments

## Architecture Decisions

### Why These Technologies?
- **Monaco Editor**: Industry-standard code editor with VS Code features
- **WebSocket**: Low-latency real-time collaboration
- **Drizzle ORM**: Type-safe database operations
- **Supabase**: Managed PostgreSQL with real-time features
- **Render**: Simple deployment with automatic scaling

### Performance Optimizations
- **Connection pooling** for database efficiency
- **WebSocket message batching** for reduced network overhead
- **Lazy loading** for large file operations
- **Optimistic updates** for responsive UI

## Security Considerations

### Current Implementation
- Input validation with Zod schemas
- SQL injection prevention via ORM
- WebSocket message validation
- Environment variable protection

### Production Recommendations
- Implement proper authentication
- Add rate limiting for API endpoints
- Use HTTPS for all connections
- Regular security audits

## License

MIT License - see LICENSE file for details

## Support

For deployment issues, check the troubleshooting section in [DEPLOYMENT.md](./DEPLOYMENT.md).

For feature requests or bug reports, please create an issue in the repository.

---

**Atlas** - Making cloud development accessible to everyone, completely free.
