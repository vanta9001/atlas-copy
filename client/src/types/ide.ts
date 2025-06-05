export interface FileTreeItem {
  id: number;
  name: string;
  path: string;
  isDirectory: boolean;
  parentPath: string | null;
  children?: FileTreeItem[];
  isExpanded?: boolean;
  content?: string;
}

export interface EditorTab {
  id: number;
  name: string;
  path: string;
  content: string;
  language: string;
  isModified: boolean;
  isActive: boolean;
}

export interface Terminal {
  id: string;
  name: string;
  isActive: boolean;
  output: string[];
  input: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface OnlineUser extends User {
  status: 'online' | 'away' | 'busy';
  cursor?: {
    line: number;
    column: number;
  };
}

export interface ChatMessage {
  id: string;
  userId: number;
  username: string;
  message: string;
  timestamp: Date;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  template: string;
  ownerId: number;
  isPublic: boolean;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollaborationState {
  onlineUsers: OnlineUser[];
  chatMessages: ChatMessage[];
  isConnected: boolean;
}

export interface EditorState {
  tabs: EditorTab[];
  activeTabId: number | null;
  cursorPosition: {
    line: number;
    column: number;
  };
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  files: {
    path: string;
    content: string;
  }[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start with an empty project',
    files: [
      {
        path: '/README.md',
        content: '# New Project\n\nWelcome to your new project!'
      }
    ]
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Basic Node.js application',
    files: [
      {
        path: '/index.js',
        content: `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});`
      },
      {
        path: '/package.json',
        content: `{
  "name": "nodejs-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}`
      }
    ]
  },
  {
    id: 'react',
    name: 'React',
    description: 'React application with Vite',
    files: [
      {
        path: '/src/App.jsx',
        content: `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Hello React!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App`
      },
      {
        path: '/src/main.jsx',
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
      },
      {
        path: '/index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
      }
    ]
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Basic Python application',
    files: [
      {
        path: '/main.py',
        content: `def hello_world():
    print("Hello, World!")
    
def main():
    hello_world()
    
if __name__ == "__main__":
    main()`
      },
      {
        path: '/requirements.txt',
        content: '# Add your Python dependencies here'
      }
    ]
  }
];
