import { join } from "node:path";
import {
  readJournalsIndex,
  TERMILOG_DIR,
  writeJournalsIndex,
} from "./journalStorage";
import { statSync } from "fs";
import { existsSync } from "node:fs";

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
  // remove entries of files that failed stat
  journalIndex.journals = journalIndex.journals.filter((file) => {
    const filePath = join(TERMILOG_DIR, `${file.title}.md`);
    return existsSync(filePath);
  });
  await writeJournalsIndex(journalIndex);
};
