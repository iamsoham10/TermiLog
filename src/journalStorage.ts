import { existsSync, mkdirSync, readFileSync } from "node:fs";
import type { JournalsIndex } from "./types/journal";
import { writeFile, rm } from "node:fs/promises";
import { JOURNAL_INDEX_PATH, TERMILOG_DIR } from "./utils/pathUtils";
import path from "node:path";

/*
 Pure I/O storage layer
 This module will only handle file operations
 It knows nothing aboout the business logic
*/

export const storage = {
  // read the journal file and throw any errors
  async readFile(path: string): Promise<string> {
    try {
      return readFileSync(path, "utf-8");
    } catch (err) {
      throw new Error(`Failed to read file at ${path}; ${err}`);
    }
  },

  // write the journal file and throw any errors
  async writeFile(path: string, content: string): Promise<void> {
    try {
      return writeFile(path, content, "utf-8");
    } catch (err) {
      throw new Error(`Failed to write file at ${path}: ${err}`);
    }
  },

  // read and parse the journal index file, return empty index if file doesn't exist, throw any errors
  async readIndex(): Promise<JournalsIndex> {
    try {
      if (!existsSync(JOURNAL_INDEX_PATH)) {
        return { journals: [] };
      }
      const content = readFileSync(JOURNAL_INDEX_PATH, "utf-8");
      return JSON.parse(content) as JournalsIndex;
    } catch (err) {
      throw new Error(`Failed to read index: ${err}`);
    }
  },

  // write journal index file as JSON, throw any errors
  async writeIndex(index: JournalsIndex): Promise<void> {
    try {
      const dir = path.dirname(JOURNAL_INDEX_PATH);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      await writeFile(
        JOURNAL_INDEX_PATH,
        JSON.stringify(index, null, 2),
        "utf-8",
      );
    } catch (err) {
      throw new Error(`Failed to write index: ${err}`);
    }
  },

  // check if file exists or not
  fileExists(path: string): boolean {
    return existsSync(path);
  },

  async deleteFile(path: string): Promise<void> {
    try {
      if (existsSync(path)) {
        await rm(path);
      }
    } catch (err) {
      throw new Error(`Failed to delete file at ${path}: ${err}`);
    }
  },

  // ensure journal directory exists
  ensureDirectorExists(): void {
    if (!existsSync(TERMILOG_DIR)) {
      mkdirSync(TERMILOG_DIR, { recursive: true });
    }
  },
};

export type Storage = typeof storage;

