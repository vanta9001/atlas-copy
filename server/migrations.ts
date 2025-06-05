import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, projects, files, collaborators, chatMessages } from "@shared/schema";

export async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL found, skipping migrations");
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log("Running database migrations...");

    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        template TEXT NOT NULL DEFAULT 'blank',
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
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
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS collaborators (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(project_id, user_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_files_parent_id ON files(parent_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_collaborators_project_id ON collaborators(project_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);`;

    // Create default user if none exists
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users;`;
    if (existingUsers[0].count === '0') {
      await sql`
        INSERT INTO users (username, email, password) 
        VALUES ('admin', 'admin@codeforge.app', 'password123');
      `;
      console.log("Created default admin user");
    }

    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Failed to run migrations:", error);
    throw error;
  }
}