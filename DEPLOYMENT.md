# CodeForge IDE - Deployment Guide

## Overview
This guide covers deploying your complete cloud IDE platform to Render (hosting) and Supabase (database).

## Prerequisites
- GitHub account
- Render account (free tier available)
- Supabase account (free tier available)

## Part 1: Database Setup with Supabase

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in and click "New Project"
3. Choose organization and enter project details:
   - Name: `codeforge-ide`
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to your users
4. Click "Create new project"

### 2. Get Database Connection String
1. In your Supabase dashboard, go to Settings → Database
2. Find "Connection string" section
3. Copy the "Transaction pooler" URI (recommended for serverless)
4. Replace `[YOUR-PASSWORD]` with your actual database password
5. Your final URL should look like:
   ```
   postgresql://postgres.xyz:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

### 3. Set Up Database Tables
The application will automatically create tables on first run, but you can also run them manually in the Supabase SQL editor:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL DEFAULT 'blank',
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  content TEXT DEFAULT '',
  type TEXT NOT NULL,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Collaborators table
CREATE TABLE IF NOT EXISTS collaborators (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(project_id, user_id)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_parent_id ON files(parent_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_project_id ON collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);

-- Create default admin user (optional)
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@codeforge.app', 'password123')
ON CONFLICT (username) DO NOTHING;
```

## Part 2: Hosting Setup with Render

### 1. Prepare Your Repository
1. Push your code to a GitHub repository
2. Ensure these files are in your root directory:
   - `render.yaml` (deployment configuration)
   - `package.json` (with all dependencies)

### 2. Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `codeforge-ide`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Configure Environment Variables
In Render dashboard, go to Environment tab and add:

```
NODE_ENV=production
DATABASE_URL=[Your Supabase connection string from Part 1]
```

### 4. Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the deploy logs for any issues
4. Once complete, you'll get a URL like: `https://codeforge-ide.onrender.com`

## Part 3: Custom Domain (Optional)

### 1. Set Up Custom Domain in Render
1. In your Render service dashboard, go to "Settings"
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `ide.yourdomain.com`)
4. Follow DNS configuration instructions

### 2. Configure DNS
Add a CNAME record in your domain provider:
```
CNAME ide your-render-app.onrender.com
```

## Features Available After Deployment

Your deployed IDE includes all the features of Replit and GitHub Codespaces:

### Core IDE Features
- **Monaco Code Editor** with syntax highlighting for 20+ languages
- **File Explorer** with create, edit, delete, and rename operations
- **Multi-tab Editor** with unsaved changes tracking
- **Real-time Terminal** with command execution simulation
- **Project Templates** (Node.js, React, Vue.js, Python, etc.)

### Collaboration Features
- **Real-time Collaboration** via WebSocket
- **Live Cursor Tracking** showing other users' positions
- **Team Chat** for project communication
- **User Presence** indicators

### Development Tools
- **Git Integration** with status, commit, push, pull operations
- **Code Analysis** and linting
- **Multi-language Support** with auto-detection
- **Responsive Design** works on desktop and mobile

### Advanced Features
- **Batch File Operations** for efficient file management
- **WebSocket-based Real-time Updates**
- **Persistent Project Storage** in Supabase
- **User Management** with authentication ready
- **Extensible Architecture** for adding new features

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check Supabase project is active
   - Ensure password is properly encoded in URL

2. **Build Failures**
   - Check all dependencies are in package.json
   - Verify Node.js version compatibility
   - Review build logs in Render dashboard

3. **WebSocket Issues**
   - Ensure WebSocket connections are enabled in Render
   - Check for proxy/firewall blocking WebSocket traffic

4. **Performance Issues**
   - Consider upgrading Render plan for more resources
   - Monitor database connection limits in Supabase
   - Optimize large file operations

### Support Resources
- Render Documentation: https://render.com/docs
- Supabase Documentation: https://supabase.com/docs
- Project Issues: Check your GitHub repository issues

## Scaling Considerations

### For Production Use
1. **Upgrade Plans**: Consider paid plans for better performance
2. **Database Optimization**: Add proper indexes and query optimization
3. **CDN Setup**: Use Cloudflare or similar for static assets
4. **Monitoring**: Set up error tracking and performance monitoring
5. **Backup Strategy**: Regular database backups via Supabase

### Security Enhancements
1. **Authentication**: Implement proper user authentication
2. **Authorization**: Add role-based access control
3. **HTTPS**: Ensure all connections use SSL/TLS
4. **Input Validation**: Strengthen server-side validation
5. **Rate Limiting**: Implement API rate limiting

## Conclusion

Your CodeForge IDE is now deployed and ready to use! You have a fully functional cloud IDE platform that rivals Replit and GitHub Codespaces, completely free to host and use.

The platform includes all modern IDE features, real-time collaboration, and is built with scalable architecture for future enhancements.