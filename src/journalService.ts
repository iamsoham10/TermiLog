import type { Store } from "./store/store";
import type { Storage } from "./journalStorage.ts";
import type {
  Journal,
  JournalMetadata,
  JournalsIndex,
} from "./types/journal.ts";
import { join } from "node:path";
import { TERMILOG_DIR } from "./utils/pathUtils.ts";
import { rm } from "node:fs/promises";

/*
JournalService - Business Logic Layer

Orchestrates:
- Input validation
- File path generation
- Index management
- Storage layer calls
- Store dispatch (single source of truth)
*/

export interface JournalServiceConfig {
  store: Store;
  storage: Storage;
}

export function createJournalService(config: JournalServiceConfig) {
  const { store, storage } = config;

  // Helper - validate journal title
  // return true if valid, throw error if invalid
  function validateTitle(title: string): boolean {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error("Journal title cannot be empty");
    }
    if (trimmedTitle.length < 1 || trimmedTitle.length > 100) {
      throw new Error("Journal title is too small or too big");
    }
    return true;
  }

  // Helper - validate journal content
  function validateContent(content: string): boolean {
    // allow emtpy content, user might save blank journals
    return true;
  }

  // Helper - generate metdata for new/updated journal
  function generateMetadata(
    title: string,
    mood: string,
    existingId?: string,
  ): JournalMetadata {
    return {
      journalId: existingId || crypto.randomUUID(),
      title: title.trim(),
      mood: mood,
      createdAt: existingId
        ? new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Helper - get file path for a journal
  function getJournalPath(title: string): string {
    const journalPath = join(TERMILOG_DIR, `${title.trim()}.md`);
    return journalPath;
  }

  // Main - save a journal
  /*
  - validate input
  - ensure directory exists
  - write file to disk
  - update index
  - dispatch to store
  throw errors that components will catch to show toasts
  */
  async function saveJournal(
    title: string,
    content: string,
    mood: string,
  ): Promise<
    | { success: true; journal: JournalMetadata }
    | { success: false; message: string }
  > {
    try {
      // validate inputs
      validateTitle(title);
      validateContent(content);
      console.log("[JournalService] saving journal:", title);

      // ensure directory exists
      storage.ensureDirectorExists();

      // write file to disk
      const filePath = getJournalPath(title);
      await storage.writeFile(filePath, content);

      // find or create new metadata entry
      const index = await storage.readIndex();

      const existingIndex = index.journals.findIndex(
        (j) => j.title === title.trim(),
      );

      let metadata: JournalMetadata;

      if (existingIndex >= 0) {
        const existing = index.journals[existingIndex];
        metadata = generateMetadata(title, mood, existing?.journalId);
        metadata.createdAt = existing?.createdAt!;
        index.journals[existingIndex] = metadata;
      } else {
        // create new metadata
        metadata = generateMetadata(title, mood);
        index.journals.push(metadata);
      }

      // write index file
      await storage.writeIndex(index);

      // dispath to store - single source of truth
      store.dispatch("JOURNAL_SAVED", metadata);
      store.dispatch("JOURNALS_RELOADED", index.journals);

      console.log("[JournalService] journal saved successfully:", title);

      return { success: true, journal: metadata };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[JournalService] save failed:", errorMessage);
      store.dispatch("SAVE_ERROR", errorMessage);
      return { success: false, message: errorMessage };
    }
  }

  // Load journal by title, read file and dispatch to store
  async function loadJournal(
    title: string,
  ): Promise<
    { success: true; journal: Journal } | { success: false; message: string }
  > {
    try {
      const filePath = getJournalPath(title);

      if (!storage.fileExists(filePath)) {
        throw new Error(`Journal ${title} not found`);
      }

      const content = await storage.readFile(filePath);
      const index = await storage.readIndex();

      const metadata = index.journals.find((j) => j.title === title);

      if (!metadata) {
        throw new Error(`Metadata for ${title} not found in index`);
      }
      const journal = { ...metadata, content };

      store.dispatch("JOURNAL_LOADED", journal);

      return { success: true, journal };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[JournalService] load failed:", errorMessage);
      store.dispatch("SAVE_ERROR", errorMessage);
      return { success: false, message: errorMessage };
    }
  }

  // delete journal, update index and dispatch to store
  async function deleteJournal(
    title: string,
  ): Promise<{ success: true } | { success: false; message: string }> {
    try {
      const filePath = getJournalPath(title);
      if (storage.fileExists(filePath)) {
        await rm(filePath);
      }

      const index = await storage.readIndex();
      const filtered = index.journals.filter((j) => j.title !== title);
      const newIndex: JournalsIndex = { journals: filtered };

      await storage.writeIndex(newIndex);

      store.dispatch("JOURNAL_DELETED", title);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[JournalService] delete journal failed:", errorMessage);
      store.dispatch("SAVE_ERROR", errorMessage);
      return { success: false, message: errorMessage };
    }
  }

  // list all journals from index
  async function listJournals(): Promise<JournalMetadata[]> {
    try {
      const index = await storage.readIndex();
      return index.journals;
    } catch (err) {
      console.error("[JournalService] list failed:", err);
      return [];
    }
  }

  // get current journals from store
  function getJournalsFromStore(): JournalMetadata[] {
    const state = store.getState();
    return state.journals;
  }

  return {
    saveJournal,
    loadJournal,
    deleteJournal,
    listJournals,
    getJournalsFromStore,
  };
}

export type JournalService = ReturnType<typeof createJournalService>;
