import { Box, instantiate, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { sidebarComponent } from "../components/sidebar";
import { editorComponent } from "../components/editor";
import { BaseLayout } from "../components/layout";
import { journalSaveDialogComponent } from "../components/journalSaveDialog";

export function createJournalPage(renderer: RenderContext): Page {
  const sidebar = sidebarComponent(renderer).renderable;
  const editor = editorComponent(renderer);
  const editorRenderable = editor.renderable;
  const fileSaverDialog = journalSaveDialogComponent(renderer).renderable;
  fileSaverDialog.visible = false;

  const content = Box(
    {
      id: "title-container",
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
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
        borderColor: "#696969",
        backgroundColor: "#1a1a1a",
      },
      editorRenderable,
    ),
    fileSaverDialog,
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
      if (key.ctrl && key.name === "s") {
        console.log("called");
        fileSaverDialog.visible = true;
        return true;
      }
      if (editor?.onKeypress?.(key)) return true;
      if (key.ctrl && key.name === "b") {
        toggleSidebar();
        return true;
      }
      return false;
    },
  };
}
