import { eq } from "drizzle-orm";
import { db } from "../db/client";
import {
  offlineNotebooks,
  offlineFlashcards,
  offlineQuizzes,
  offlineRoadmap,
  offlineMessages,
  offlinePodcasts,
} from "../db/schema";

export const offlineCache = {
  /**
   * Caches a notebook's meta information.
   */
  async cacheNotebook(notebookId: string, title: string) {
    try {
      await db
        .insert(offlineNotebooks)
        .values({
          notebookId,
          title,
          cachedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: offlineNotebooks.notebookId,
          set: {
            title,
            cachedAt: new Date(),
          },
        });
    } catch (err) {
      console.error("[offlineCache] Failed to cache notebook metadata:", err);
    }
  },

  /**
   * Gets all notebooks cached locally.
   */
  async getCachedNotebooks() {
    try {
      return await db.select().from(offlineNotebooks);
    } catch (err) {
      console.error("[offlineCache] Failed to get cached notebooks:", err);
      return [];
    }
  },

  /**
   * Caches flashcards for a specific notebook.
   */
  async cacheFlashcards(notebookId: string, cards: any[]) {
    try {
      // 1. Ensure the parent notebook metadata is cached
      // If we don't have it, we write a generic title that gets updated on next list sync
      await this.cacheNotebook(notebookId, "Notebook " + notebookId.substring(0, 4));

      // 2. Delete existing flashcards for this notebook
      await db.delete(offlineFlashcards).where(eq(offlineFlashcards.notebookId, notebookId));

      // 3. Bulk insert the new ones
      if (cards && cards.length > 0) {
        const valuesToInsert = cards.map((card) => ({
          id: card.id || Math.random().toString(),
          notebookId,
          front: card.front || "",
          back: card.back || "",
          interval: typeof card.interval === "number" ? card.interval : 0,
          ease: typeof card.ease === "number" ? card.ease : 2.5,
          dueDate: card.dueDate ? new Date(card.dueDate) : null,
          repetitions: typeof card.repetitions === "number" ? card.repetitions : 0,
        }));
        await db.insert(offlineFlashcards).values(valuesToInsert);
      }
      console.log(`[offlineCache] Cached ${cards.length} flashcards for notebook ${notebookId}`);
    } catch (err) {
      console.error("[offlineCache] Failed to cache flashcards:", err);
    }
  },

  /**
   * Retrieves locally cached flashcards for a notebook.
   */
  async getCachedFlashcards(notebookId: string) {
    try {
      return await db
        .select()
        .from(offlineFlashcards)
        .where(eq(offlineFlashcards.notebookId, notebookId));
    } catch (err) {
      console.error("[offlineCache] Failed to fetch cached flashcards:", err);
      return [];
    }
  },

  /**
   * Updates SM2 scheduling details for an individual flashcard.
   */
  async updateFlashcardSM2(
    id: string,
    interval: number,
    ease: number,
    repetitions: number,
    dueDate: Date | null,
  ) {
    try {
      await db
        .update(offlineFlashcards)
        .set({
          interval,
          ease,
          repetitions,
          dueDate,
        })
        .where(eq(offlineFlashcards.id, id));
      console.log(`[offlineCache] Updated SM2 parameters for card ${id} (due: ${dueDate})`);
    } catch (err) {
      console.error("[offlineCache] Failed to update card SM2 properties in SQLite:", err);
    }
  },

  /**
   * Caches quizzes for a specific notebook.
   */
  async cacheQuizzes(notebookId: string, quizzes: any[]) {
    try {
      await this.cacheNotebook(notebookId, "Notebook " + notebookId.substring(0, 4));
      await db.delete(offlineQuizzes).where(eq(offlineQuizzes.notebookId, notebookId));

      if (quizzes && quizzes.length > 0) {
        const valuesToInsert = quizzes.map((q) => ({
          id: q.id || Math.random().toString(),
          notebookId,
          question: q.question || "",
          options: JSON.stringify(q.options || []),
          correctAnswer: q.correctAnswer || "",
          explanation: q.explanation || "",
        }));
        await db.insert(offlineQuizzes).values(valuesToInsert);
      }
      console.log(`[offlineCache] Cached ${quizzes.length} quizzes for notebook ${notebookId}`);
    } catch (err) {
      console.error("[offlineCache] Failed to cache quizzes:", err);
    }
  },

  /**
   * Retrieves cached quizzes for a notebook.
   */
  async getCachedQuizzes(notebookId: string) {
    try {
      const results = await db
        .select()
        .from(offlineQuizzes)
        .where(eq(offlineQuizzes.notebookId, notebookId));

      return results.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      }));
    } catch (err) {
      console.error("[offlineCache] Failed to fetch cached quizzes:", err);
      return [];
    }
  },

  /**
   * Caches the generated study guide/roadmap for a notebook.
   */
  async cacheRoadmap(notebookId: string, content: any) {
    try {
      await this.cacheNotebook(notebookId, "Notebook " + notebookId.substring(0, 4));
      const contentStr = typeof content === "string" ? content : JSON.stringify(content);
      
      await db
        .insert(offlineRoadmap)
        .values({
          notebookId,
          content: contentStr,
          cachedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: offlineRoadmap.notebookId,
          set: {
            content: contentStr,
            cachedAt: new Date(),
          },
        });
      console.log(`[offlineCache] Cached study guide/roadmap for notebook ${notebookId}`);
    } catch (err) {
      console.error("[offlineCache] Failed to cache roadmap:", err);
    }
  },

  /**
   * Retrieves the cached roadmap for a notebook.
   */
  async getCachedRoadmap(notebookId: string) {
    try {
      const results = await db
        .select()
        .from(offlineRoadmap)
        .where(eq(offlineRoadmap.notebookId, notebookId))
        .limit(1);

      if (results.length > 0) {
        const item = results[0];
        try {
          return JSON.parse(item.content);
        } catch {
          return item.content;
        }
      }
      return null;
    } catch (err) {
      console.error("[offlineCache] Failed to fetch cached roadmap:", err);
      return null;
    }
  },

  /**
   * Caches chat history messages, saving up to the last 30 messages.
   */
  async cacheMessages(notebookId: string, messages: any[]) {
    try {
      await this.cacheNotebook(notebookId, "Notebook " + notebookId.substring(0, 4));
      await db.delete(offlineMessages).where(eq(offlineMessages.notebookId, notebookId));

      if (messages && messages.length > 0) {
        // Take last 30 messages
        const last30 = messages.slice(0, 30);
        const valuesToInsert = last30.map((msg, idx) => ({
          id: msg.id || `${notebookId}_msg_${idx}_${Date.now()}`,
          notebookId,
          role: msg.role || "user",
          text: msg.text || "",
          createdAt: typeof msg.createdAt === "number" ? msg.createdAt : Date.now() - idx * 1000,
        }));
        await db.insert(offlineMessages).values(valuesToInsert);
      }
      console.log(`[offlineCache] Cached last ${Math.min(messages.length, 30)} chat messages for notebook ${notebookId}`);
    } catch (err) {
      console.error("[offlineCache] Failed to cache messages:", err);
    }
  },

  /**
   * Retrieves cached chat history.
   */
  async getCachedMessages(notebookId: string) {
    try {
      return await db
        .select()
        .from(offlineMessages)
        .where(eq(offlineMessages.notebookId, notebookId));
    } catch (err) {
      console.error("[offlineCache] Failed to fetch cached messages:", err);
      return [];
    }
  },

  /**
   * Caches a local podcast file URI and its text script.
   */
  async cachePodcast(notebookId: string, localUri: string, script?: any[]) {
    try {
      const scriptStr = script ? JSON.stringify(script) : null;
      await db
        .insert(offlinePodcasts)
        .values({
          notebookId,
          localUri,
          script: scriptStr,
          cachedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: offlinePodcasts.notebookId,
          set: {
            localUri,
            script: scriptStr,
            cachedAt: new Date(),
          },
        });
      console.log(`[offlineCache] Capped offline podcast path for notebook ${notebookId}: ${localUri}`);
    } catch (err) {
      console.error("[offlineCache] Failed to cache podcast URI:", err);
    }
  },

  /**
   * Retrieves the cached podcast local path and script.
   */
  async getCachedPodcast(notebookId: string) {
    try {
      const results = await db
        .select()
        .from(offlinePodcasts)
        .where(eq(offlinePodcasts.notebookId, notebookId))
        .limit(1);

      if (results.length > 0) {
        const item = results[0];
        let parsedScript = [];
        if (item.script) {
          try {
            parsedScript = JSON.parse(item.script);
          } catch (e) {}
        }
        return {
          localUri: item.localUri,
          script: parsedScript,
        };
      }
      return null;
    } catch (err) {
      console.error("[offlineCache] Failed to fetch cached podcast:", err);
      return null;
    }
  },
};
