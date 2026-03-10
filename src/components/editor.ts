import { TextareaRenderable, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { join } from "node:path";
import { homedir } from "node:os";
import { writeFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";

export function editorComponent(renderer: RenderContext): Page {
  const textEditor = new TextareaRenderable(renderer, {
    id: "editor-container",
    width: "100%",
    height: "100%",
    placeholder: "How was your day?...",
    cursorColor: "#00FF88",
    textColor: "#e6e6e6",
    // keyBindings: [
    //   {
    //     name: "s",
    //     ctrl: true,
    //     action: "submit",
    //   },
    // ],
    // onSubmit: () => {
    //   console.log(textEditor.plainText);
    //   saveJournalFile();
    // },
  });

  const TERMILOG_DIR = join(homedir(), ".termilog");
  const filePath = join(TERMILOG_DIR, "journal.md");

  const ensureDirectoryExists = (): void => {
    if (!existsSync(TERMILOG_DIR)) {
      mkdirSync(TERMILOG_DIR, { recursive: true });
    }
  };

  const saveJournalFile = async () => {
    ensureDirectoryExists();
    try {
      const journalContent = textEditor.plainText;
      const now = new Date();
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
        `\n\n`;
      const finalJournalContents = markdownFormatMetadata + journalContent;
      await writeFile(filePath, finalJournalContents, "utf-8");
    } catch (err) {
      console.error("Failed to save: ", err);
    }
  };
  return {
    id: "editor",
    renderable: textEditor,
    onKeypress: (key) => {
      if (key.name == "i") {
        queueMicrotask(() => textEditor.focus());
        return true;
      }
      if (textEditor.focused) {
        if (key.name == "escape") {
          textEditor.blur();
          return true;
        }
        return true;
      }
    },
  };
}
