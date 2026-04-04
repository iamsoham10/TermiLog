import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { JournalsIndex } from "./types/journal";
import { writeFile } from "node:fs/promises";

export const TERMILOG_DIR = join(homedir(), ".termilog");
const JOURNAL_INDEX_PATH = join(TERMILOG_DIR, "journals.json");

export const readJournalNamesFromIndex = (): string[] => {
  try {
    if (existsSync(JOURNAL_INDEX_PATH)) {
      const journalMetadata = readFileSync(JOURNAL_INDEX_PATH, "utf-8");
      const journalIndexData = JSON.parse(journalMetadata) as JournalsIndex;
      const journalFileNames = journalIndexData.journals.map(
        (fileItem) => fileItem.title,
      );
      return journalFileNames;
    }
  } catch {
    console.error("Index file parsing failed");
    return [];
  }
  return [];
};

export const readJournalsIndex = (): JournalsIndex => {
  try {
    if (existsSync(JOURNAL_INDEX_PATH)) {
      const content = readFileSync(JOURNAL_INDEX_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    console.error("Index file reading failed");
  }
  return { journals: [] };
};

export const writeJournalsIndex = async (
  index: JournalsIndex,
): Promise<void> => {
  await writeFile(JOURNAL_INDEX_PATH, JSON.stringify(index, null, 2), "utf-8");
};
