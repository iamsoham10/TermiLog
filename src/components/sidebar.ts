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
    Box({
      id: "sidebar-container",
      title: "Journal Enteries",
      titleAlignment: "center",
      border: true,
      borderColor: "#524F4F",
      height: "100%",
      width: 30,
      flexDirection: "column",
      justifyContent: "flex-start",
    }),
  );
  renderer.on("resize", () => {
    (console.log(`Now: ${renderer.width}x${renderer.height}`),
      (sidebar.flexDirection = renderer.width > 100 ? "row" : "column"),
      (sidebar.width = renderer.width > 150 ? 30 : 5));
    renderer.requestRender();
  });
  return {
    id: "sidebar",
    renderable: sidebar,
  };
}
