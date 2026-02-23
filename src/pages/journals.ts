import { Box, instantiate, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { sidebarComponent } from "../components/sidebar";
import { editorComponent } from "../components/editor";
import { BaseLayout } from "../components/layout";

export function createJournalPage(renderer: RenderContext): Page {
  const sidebar = sidebarComponent(renderer).renderable;
  const editor = editorComponent(renderer);
  const editorRenderable = editor.renderable;

  const content = Box(
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
  );
  const page = instantiate(renderer, BaseLayout(content, { border: false }));

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
