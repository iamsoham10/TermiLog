import { existsSync, readFileSync } from "node:fs";
import type { JournalsIndex } from "./types/journal";
import { writeFile } from "node:fs/promises";
import { journalEvents, JournalEventType } from "./events/journalEvents";
import { JOURNAL_INDEX_PATH } from "./utils/pathUtils";

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
  /*
  This function is called twice in reconcile strategy or design puroposes
  To avoid the event emission twice this check is implemented
  */
  try {
    let shouldWrite = true;
    if (existsSync(JOURNAL_INDEX_PATH)) {
      const existing = readFileSync(JOURNAL_INDEX_PATH, "utf-8");
      if (existing === JSON.stringify(index, null, 2)) {
        shouldWrite = false;
      }
    }
    if (!shouldWrite) {
      console.log("journal index unchanged - no write or event emitted");
      return;
    }
    await writeFile(
      JOURNAL_INDEX_PATH,
      JSON.stringify(index, null, 2),
      "utf-8",
    );
    journalEvents.emit(JournalEventType.INDEX_UPDATED, index);
    console.log("Journal index added and event emitted");
  } catch (err) {
    console.error("Failed to write journals index", err);
  }
};
