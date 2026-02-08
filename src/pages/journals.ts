import {
  Box,
  instantiate,
  Text,
  TextAttributes,
  type RenderContext,
} from "@opentui/core";
import type { Page } from "./home";

export function createJournalPage(renderer: RenderContext): Page {
  const page = instantiate(
    renderer,
    Box(
      {
        id: "journal-containrer",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        border: true,
        borderColor: "#FFFFFF",
        borderStyle: "rounded",
        backgroundColor: "#262521",
      },
      Box(
        {
          id: "title-container",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        },
        Text({
          justifyContent: "center",
          alignItems: "center",
          content: "Write your thoughts in 🐚!",
          attributes: TextAttributes.ITALIC,
        }),
      ),
    ),
  );

  return {
    id: "journal",
    renderable: page,
    onEnter() {},
    onLeave() {},
  };
}
