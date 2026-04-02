import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import type { JournalsIndex } from "./types/journal";

const readJournalNamesFromIndex = () => {
  console.log("called");
  const TERMILOG_DIR = join(homedir(), ".termilog");
  const JOURNAL_INDEX_PATH = join(TERMILOG_DIR, "journals.json");
  try {
    if (existsSync(JOURNAL_INDEX_PATH)) {
      const journalMetadata = readFileSync(JOURNAL_INDEX_PATH, "utf-8");
      const journalFileNames: JournalsIndex[] = JSON.parse(journalMetadata);
      console.log(journalFileNames);
    }
  } catch {}
};

// export const fileSearch = (fileName: string): string[] => {
//   return [];
// };
readJournalNamesFromIndex();
