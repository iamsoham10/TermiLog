import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import type { JournalMetadata } from "./types/journal";
import { readJournalsIndex, writeJournalsIndex } from "./journalStorage";
import { TERMILOG_DIR } from "./utils/pathUtils";

const ensureDirectoryExists = (): void => {
  if (!existsSync(TERMILOG_DIR)) {
    mkdirSync(TERMILOG_DIR, { recursive: true });
  }
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
      (journal) => journal.title === journalName,
    );

    // make the metadata
    const metadata: JournalMetadata = {
      journalId: crypto.randomUUID(),
      title: journalName,
      mood,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // if exists just update the mood
    if (existingEntry >= 0) {
      const existingIndex = indexFile.journals[existingEntry];
      if (existingIndex) {
        existingIndex.mood = mood;
        existingIndex.updatedAt = new Date().toISOString();
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
