import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import type { JournalsIndex } from "./types/journal";

const readJournalNamesFromIndex = (): string[] => {
  const TERMILOG_DIR = join(homedir(), ".termilog");
  const JOURNAL_INDEX_PATH = join(TERMILOG_DIR, "journals.json");
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

export const fileSearch = (fileName: string): string[] => {
  const journalNames = readJournalNamesFromIndex();
  console.log(journalNames);
  const results = journalNames.filter((files) => files.includes(fileName));
  console.log(results);
  return results;
};

fileSearch("da");
