import { Box, instantiate, Text, type RenderContext } from "@opentui/core";
import { readJournalsIndex } from "../journalStorage";

const journals = readJournalsIndex();

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
        content: journals.journals[0]?.title,
      }),
      Text({
        content: journals.journals[1]?.title,
      }),
    ),
  );
  return {
    id: "sidebar",
    renderable: sidebar,
    // refreshSidebar: listJournalFile(),
  };
}
