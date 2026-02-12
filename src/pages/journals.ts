import {
  Box,
  instantiate,
  parseColor,
  ScrollBox,
  TextareaRenderable,
  type RenderContext,
} from "@opentui/core";
import type { Page } from "../types/page";
import { footerComponent } from "../components/footer";
import { sidebarComponent } from "../components/sidebar";

export function createJournalPage(renderer: RenderContext): Page {
  const footer = footerComponent(renderer).renderable;
  const sidebar = sidebarComponent(renderer).renderable;

  const scrollBox = ScrollBox({
    width: "100%",
    height: "100%",
  });

  const textEditor = new TextareaRenderable(renderer, {
    id: "editor",
    width: "100%",
    height: 40,
    placeholder: "How was your day?...",
    backgroundColor: "#4C5E7D",
    cursorColor: "#00FF88",
  });

  scrollBox.add(textEditor);

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
        padding: 1,
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
            title: "Editor",
            width: "100%",
            height: "100%",
            flexGrow: 1,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: 3,
            border: true,
          },
          scrollBox,
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

  textEditor.focus();

  function toggleSidebar() {
    sidebar.visible = !sidebar.visible;
  }

  renderer.keyInput.on("keypress", (key) => {
    if (key.ctrl && key.name === "b") {
      toggleSidebar();
    }
  });

  return {
    id: "journal",
    renderable: page,
    onEnter() {},
    onLeave() {},
  };
}
