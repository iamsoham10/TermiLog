import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import type { JournalsIndex, JournalMetadata } from "./types/journal";

const TERMILOG_DIR = join(homedir(), ".termilog");
const JOURNALS_INDEX_PATH = join(TERMILOG_DIR, "journals.json");

const ensureDirectoryExists = (): void => {
  if (!existsSync(TERMILOG_DIR)) {
    mkdirSync(TERMILOG_DIR, { recursive: true });
  }
};

const readJournalsIndex = (): JournalsIndex => {
  try {
    if (existsSync(JOURNALS_INDEX_PATH)) {
      const content = readFileSync(JOURNALS_INDEX_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // If file is corrupted, start fresh
  }
  return { journals: [] };
};

const writeJournalsIndex = async (index: JournalsIndex): Promise<void> => {
  await writeFile(JOURNALS_INDEX_PATH, JSON.stringify(index, null, 2), "utf-8");
};

const saveJournalFile = async (
  journalContent: string,
  journalName: string,
  mood: string,
) => {
  ensureDirectoryExists();
  const filename = `${journalName}.md`;
  const filePath = join(TERMILOG_DIR, filename);

  try {
    // save the journal
    await writeFile(filePath, journalContent, "utf-8");

    // read the index file
    const indexFile = readJournalsIndex();

    // check if index entry already exists
    const existingEntry = indexFile.journals.findIndex(
      (journal) => journal.filename === filename,
    );

    // make the metadata
    const metadata: JournalMetadata = {
      filename,
      title: journalName,
      mood,
      createdAt: new Date().toISOString(),
    };

    // if exists just update the mood
    if (existingEntry >= 0) {
      const existingIndex = indexFile.journals[existingEntry];
      if (existingIndex) {
        existingIndex.mood = mood;
      }
    } else {
      // else push entire metadata
      indexFile.journals.push(metadata);
    }

    // write journal index file
    await writeJournalsIndex(indexFile);
  } catch (err) {
    console.error("Failed to save: ", err);
  }
};

export default saveJournalFile;
