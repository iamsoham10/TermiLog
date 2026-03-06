import { TextareaRenderable, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { join } from "node:path";
import { homedir } from "node:os";
import { writeFile } from "node:fs/promises";

export function editorComponent(renderer: RenderContext): Page {
  const textEditor = new TextareaRenderable(renderer, {
    id: "editor-container",
    width: "100%",
    height: "100%",
    placeholder: "How was your day?...",
    cursorColor: "#00FF88",
    keyBindings: [
      {
        name: "s",
        ctrl: true,
        action: "submit",
      },
    ],
    onSubmit: () => {
      console.log(textEditor.plainText);
      saveJournalFile();
    },
  });

  const saveJournalFile = async () => {
    try {
      const journalContent = textEditor.plainText;
      const TERMILOG_DIR = join(homedir(), ".termilog");
      const filePath = join(TERMILOG_DIR, "journal2.md");
      const date = new Date().toISOString();
      const journalName = "Mindful Sufffering";
      const mood = "happy";
      const markdownFormatMetadata =
        `Date: ${date}\n` +
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

/*
  select the home directory and create a new directory for the termilog files to be stored
  before saving the file check if the directory exists, if not create it
  save the contents from the text area in the file. for now we are working on plain text (txt) format
*/
