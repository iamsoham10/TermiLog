import { join } from "node:path";
import path from "path";
import { storage } from "./journalStorage";
import { statSync } from "fs";
import { existsSync, readdirSync } from "node:fs";
import { TERMILOG_DIR } from "./utils/pathUtils";
import type { Store } from "./store/store";

export type ReconcileResult =
  | { success: true }
  | { success: false; message: string };

export async function reconcileOnStartup(store: Store): Promise<ReconcileResult> {
  console.log("[IndexSync] Starting reconcilation...");

  try {
    const index = await storage.readIndex();
    const journalDirExists = existsSync(TERMILOG_DIR);

    if (index.journals.length > 0 && !journalDirExists) {
      const message =
        "Journal folder not found. Your index was not modified.";
      console.error("[IndexSync]", message);
      return { success: false, message };
    }

    const validJournals = index.journals.filter((journal) => {
      const filePath = join(TERMILOG_DIR, `${journal.title}.md`);
      const exists = existsSync(filePath);
      if (!exists) {
        console.log(`[IndexSync] Journal deleted externally: ${journal.title}`);
      }
      return exists;
    });

    for (const journal of validJournals) {
      const filePath = join(TERMILOG_DIR, `${journal.title}.md`);
      try {
        const fileStat = statSync(filePath);
        const fileModTime = fileStat.mtime.getTime();
        const indexModTime = new Date(journal.updatedAt).getTime();

        if (fileModTime > indexModTime) {
          console.log(`[IndexSync] Journal modified externally: ${journal.title}`);
          journal.updatedAt = new Date(fileModTime).toISOString();
        }
      } catch (err) {
        console.warn(`[IndexSync] Error checking file: ${filePath}`, err);
      }
    }

    if (journalDirExists) {
      const existingTitles = new Set(validJournals.map((j) => j.title));
      const mdFiles = readdirSync(TERMILOG_DIR, { withFileTypes: true })
        .filter(
          (file) => file.isFile() && path.extname(file.name).toLowerCase() === ".md",
        )
        .map((file) => file.name.slice(0, -3));

      for (const fileName of mdFiles) {
        if (!existingTitles.has(fileName)) {
          console.log(`[IndexSync] New journal file found: ${fileName}`);
          validJournals.push({
            journalId: crypto.randomUUID(),
            title: fileName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    const indexChanged =
      validJournals.length !== index.journals.length ||
      validJournals.some((journal, i) => {
        const previous = index.journals[i];
        return (
          !previous ||
          previous.journalId !== journal.journalId ||
          previous.updatedAt !== journal.updatedAt ||
          previous.title !== journal.title
        );
      });

    if (indexChanged) {
      const updatedIndex = { journals: validJournals };
      await storage.writeIndex(updatedIndex);
      console.log(`[IndexSync] Index updated with ${validJournals.length} journals`);
    } else {
      console.log(`[IndexSync] Index unchanged (${validJournals.length} journals)`);
    }

    store.dispatch("JOURNALS_RELOADED", validJournals);
    console.log("[IndexSync] Reconciliation complete");
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Index reconciliation failed";
    console.error("[IndexSync] Reconciliation failed:", message);
    return { success: false, message };
  }
}
