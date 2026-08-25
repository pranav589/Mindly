import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Table to track which notebooks are fully or partially cached offline
export const offlineNotebooks = sqliteTable("offline_notebooks", {
  notebookId: text("notebook_id").primaryKey(),
  title: text("title").notNull(),
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});

// Flashcards table with interval, ease, repetitions, and SM2 review due dates
export const offlineFlashcards = sqliteTable("offline_flashcards", {
  id: text("id").primaryKey(),
  notebookId: text("notebook_id").notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  interval: integer("interval").notNull().default(0),
  ease: real("ease").notNull().default(2.5),
  dueDate: integer("due_date", { mode: "timestamp" }),
  repetitions: integer("repetitions").notNull().default(0),
});

// Quizzes table storing questions and JSON-stringified options array
export const offlineQuizzes = sqliteTable("offline_quizzes", {
  id: text("id").primaryKey(),
  notebookId: text("notebook_id").notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON string array
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
});

// Roadmap (Study Guide) table, one row per notebook, storing complete study plan details
export const offlineRoadmap = sqliteTable("offline_roadmap", {
  notebookId: text("notebook_id").primaryKey(),
  content: text("content").notNull(), // JSON blob
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});

// Last few messages for chat history per notebook
export const offlineMessages = sqliteTable("offline_messages", {
  id: text("id").primaryKey(),
  notebookId: text("notebook_id").notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  text: text("text").notNull(),
  createdAt: integer("created_at").notNull(), // timestamp integer
});

// Podcasts table storing local file URIs on device
export const offlinePodcasts = sqliteTable("offline_podcasts", {
  notebookId: text("notebook_id").primaryKey(),
  localUri: text("local_uri").notNull(),
  script: text("script"), // JSON string of turns array
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});
