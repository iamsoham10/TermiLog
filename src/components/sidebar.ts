import { Box, instantiate, Text, type RenderContext } from "@opentui/core";
import console from "node:console";
import { statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { homedir } from "node:os";
import path, { join } from "node:path";

const TERMILOG_DIR = join(homedir(), ".termilog");

const listJournalFile = async (): Promise<string[]> => {
  try {
    const journalFiles = await readdir(TERMILOG_DIR);
    const journalFileNames = journalFiles.filter((journalFile) => {
      (statSync(path.join(TERMILOG_DIR, journalFile)).isFile(),
        journalFile != "journals.json");
    });
    return journalFileNames;
  } catch (err) {
    console.error("Error reading directory:", err);
    return [];
  }
};

const journals = await listJournalFile();

export function sidebarComponent(renderer: RenderContext) {
  const sidebar = instantiate(
    renderer,
    Box(
      {
        id: "sidebar-container",
        title: "Journal Enteries",
        titleAlignment: "center",
        backgroundColor: "#1a1a1a",
        border: true,
        borderColor: "#696969",
        height: "100%",
        width: 30,
        flexDirection: "column",
        gap: 1,
        justifyContent: "flex-start",
        padding: 1,
      },
      Text({
        content: journals[0],
      }),
      Text({
        content: journals[1],
      }),
    ),
  );
  return {
    id: "sidebar",
    renderable: sidebar,
    refreshSidebar: listJournalFile(),
  };
}
