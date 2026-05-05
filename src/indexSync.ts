import { join } from "node:path";
import path from "path";
import {
  readJournalsIndex,
  TERMILOG_DIR,
  writeJournalsIndex,
} from "./journalStorage";
import { statSync } from "fs";
import { existsSync, readdirSync } from "node:fs";
import type { JournalMetadata } from "./types/journal";

// sync the index file with existing journals and remove deleted journals
export const reconcileOnStartup = async () => {
  // read the index file
  const journalIndex = readJournalsIndex();
  // remove the records of files which are not present
  journalIndex.journals = journalIndex.journals.filter((file) => {
    const filePath = join(TERMILOG_DIR, `${file.title}.md`);
    return existsSync(filePath);
  });

  for (const file of journalIndex.journals) {
    const filePath = join(TERMILOG_DIR, `${file.title}.md`);
    try {
      const fileStat = statSync(filePath);
      const mtime = fileStat.mtime.getTime();
      const fileUpdatedAt = new Date(file.updatedAt).getTime();

      if (mtime > fileUpdatedAt) {
        // file is modified externally. Update the index here
        file.updatedAt = new Date(mtime).toISOString();
      }
    } catch (err) {
      console.warn("File deleted during reconcile", filePath);
      continue;
    }
  }
  await reconcileFileSystem();
  await writeJournalsIndex(journalIndex);
};

// if a journal file is created externally sync it with index
const reconcileFileSystem = async () => {
  const journalIndex = readJournalsIndex();
  const indexFile = new Set(journalIndex.journals.map((file) => file.title));

  const mdJournalFiles = readdirSync(TERMILOG_DIR, { withFileTypes: true })
    .filter(
      (journalFile) =>
        journalFile.isFile() &&
        path.extname(journalFile.name).toLowerCase() === ".md",
    )
    .map((mdFile) => mdFile.name.slice(0, -3));

  for (let file of mdJournalFiles) {
    if (!indexFile.has(file)) {
      journalIndex.journals.push({
        journalId: crypto.randomUUID(),
        title: file,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
};
