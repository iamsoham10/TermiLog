import { Box, instantiate, type RenderContext } from "@opentui/core";

export function sidebarComponent(renderer: RenderContext) {
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
  return {
    id: "sidebar",
    renderable: sidebar,
  };
}
