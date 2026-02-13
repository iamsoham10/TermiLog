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
import { editorComponent } from "../components/editor";

export function createJournalPage(renderer: RenderContext): Page {
  const footer = footerComponent(renderer).renderable;
  const sidebar = sidebarComponent(renderer).renderable;
  const editor = editorComponent(renderer);

  const scrollBox = ScrollBox({
    width: "100%",
    height: "100%",
  });

  scrollBox.add(editor);

  const page = instantiate(
    renderer,
    Box(
      {
        id: "journal-containrer",
        width: "100%",
        height: "100%",
        flexGrow: 1,
        backgroundColor: "#262521",
        flexDirection: "column",
      },
      Box(
        {
          id: "title-container",
          width: "100%",
          flexDirection: "row",
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

  editor.focus();

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
