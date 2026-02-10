import {
  Box,
  instantiate,
  Text,
  TextAttributes,
  type RenderContext,
} from "@opentui/core";
import type { Page } from "../types/page";

export function sidebarComponent(renderer: RenderContext): Page {
  const sidebar = instantiate(
    renderer,
    Box(
      {
        id: "sidebar-container",
        border: true,
        borderColor: "#524F4F",
        height: "100%",
        width: 35,
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      },
      Text({
        id: "sidebar-heading",
        justifyContent: "center",
        content: "Journal Enteries",
        attributes: TextAttributes.ITALIC,
      }),
    ),
  );
  return {
    id: "sidebar",
    renderable: sidebar,
  };
}
