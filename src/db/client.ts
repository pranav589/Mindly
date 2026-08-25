import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// Open SQLite database
export const expoDb = openDatabaseSync("mindly.db");

// Initialize Drizzle ORM client
export const db = drizzle(expoDb, { schema });

/**
 * Initializes local database tables if they do not already exist.
 * This guarantees the schema is ready on app startup without Metro bundling complications.
 */
export async function initializeDatabase() {
  try {
    await expoDb.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS offline_notebooks (
        notebook_id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        cached_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS offline_flashcards (
        id TEXT PRIMARY KEY NOT NULL,
        notebook_id TEXT NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        interval INTEGER NOT NULL DEFAULT 0,
        ease REAL NOT NULL DEFAULT 2.5,
        due_date INTEGER,
        repetitions INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS offline_quizzes (
        id TEXT PRIMARY KEY NOT NULL,
        notebook_id TEXT NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        explanation TEXT
      );

      CREATE TABLE IF NOT EXISTS offline_roadmap (
        notebook_id TEXT PRIMARY KEY NOT NULL,
        content TEXT NOT NULL,
        cached_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS offline_messages (
        id TEXT PRIMARY KEY NOT NULL,
        notebook_id TEXT NOT NULL,
        role TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS offline_podcasts (
        notebook_id TEXT PRIMARY KEY NOT NULL,
        local_uri TEXT NOT NULL,
        script TEXT,
        cached_at INTEGER NOT NULL
      );
    `);
    console.log("[SQLite] Database initialized successfully.");
  } catch (error) {
    console.error("[SQLite] Database initialization failed:", error);
    throw error;
  }
}
