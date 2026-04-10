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
  const fileNames = readJournalsIndex();
  // remove the records of files which are not present
  fileNames.journals = fileNames.journals.filter((file) => {
    const filePath = join(TERMILOG_DIR, `${file.title}.md`);
    return existsSync(filePath);
  });

  for (const file of fileNames.journals) {
    const filePath = join(TERMILOG_DIR, `${file.title}.md`);
    const fileStat = statSync(filePath);
    const mtime = fileStat.mtime.toISOString();

    if (mtime > file.updatedAt) {
      // file is modified externally. Update the index here
      file.updatedAt = new Date(mtime).toISOString();
    }
  }
  await writeJournalsIndex(fileNames);
};
