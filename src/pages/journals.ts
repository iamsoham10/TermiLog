import {
  Box,
  instantiate,
  Text,
  TextAttributes,
  type RenderContext,
} from "@opentui/core";
import type { Page } from "../types/page";
import { footerComponent } from "../components/footer";
import { sidebarComponent } from "../components/sidebar";

export function createJournalPage(renderer: RenderContext): Page {
  const footer = footerComponent(renderer).renderable;
  const sidebar = sidebarComponent(renderer).renderable;
  const page = instantiate(
    renderer,
    Box(
      {
        id: "journal-containrer",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        border: true,
        borderColor: "#FFFFFF",
        borderStyle: "rounded",
        backgroundColor: "#262521",
        padding: 0,
      },
      Box(
        {
          id: "title-container",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexDirection: "row",
          flexGrow: 1,
          margin: 0,
        },
        sidebar,
        Box(
          {
            id: "main-content-container",
            width: "100%",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          },
          Text({
            justifyContent: "center",
            alignItems: "center",
            content: "Write your thoughts in 🐚!",
            attributes: TextAttributes.ITALIC,
          }),
        ),
      ),
      Box(
        {
          id: "footerComponent-container",
          height: 1,
          width: "100%",
        },
        footer,
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
