import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";

const TERMILOG_DIR = join(homedir(), ".termilog");

const ensureDirectoryExists = (): void => {
  if (!existsSync(TERMILOG_DIR)) {
    mkdirSync(TERMILOG_DIR, { recursive: true });
  }
};

const saveJournalFile = async (journalContent: string, journalName: string) => {
  ensureDirectoryExists();
  const filePath = join(TERMILOG_DIR, `${journalName}.md`);
  try {
    /* const now = new Date();
    const dateAndTime = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(now);
    const journalName = "Mindful Sufffering";
    const mood = "happy";
    const markdownFormatMetadata =
      `Date: ${dateAndTime}\n` +
      `Title: ${journalName}\n` +
      `Mood: ${mood}\n` +
      `\n\n`; */
    const finalJournalContents = journalContent;
    await writeFile(filePath, finalJournalContents, "utf-8");
  } catch (err) {
    console.error("Failed to save: ", err);
  }
};

export default saveJournalFile;
