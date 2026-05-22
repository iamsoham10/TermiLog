// read journal markdown file by title
import { readFile } from "node:fs/promises";
import { TERMILOG_DIR } from "./pathUtils";
import { join } from "node:path";

export async function readJournalFile(journalTitle: string): Promise<string> {
  const journalFilePath = join(TERMILOG_DIR, `${journalTitle}.md`);
  try {
    const journalFileContents = await readFile(journalFilePath, "utf-8");
    return journalFileContents;
  } catch (err) {
    console.error("file reading error", err);
    throw err;
  }
}
