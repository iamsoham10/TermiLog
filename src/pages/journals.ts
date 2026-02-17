import { Box, instantiate, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { footerComponent } from "../components/footer";
import { sidebarComponent } from "../components/sidebar";
import { editorComponent } from "../components/editor";

export function createJournalPage(renderer: RenderContext): Page {
  const footer = footerComponent(renderer).renderable;
  const sidebar = sidebarComponent(renderer).renderable;
  const editor = editorComponent(renderer);
  const editorRenderable = editor.renderable;

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
          editorRenderable,
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

  // editorRenderable.focus();

  function toggleSidebar() {
    sidebar.visible = !sidebar.visible;
  }

  return {
    id: "journal",
    renderable: page,
    onEnter() {},
    onLeave() {},
    onKeypress: (key) => {
      if (editor?.onKeypress?.(key)) return true;
      if (key.ctrl && key.name === "b") {
        toggleSidebar();
        return true;
      }
      return false;
    },
  };
}
