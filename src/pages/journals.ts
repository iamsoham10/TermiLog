import { Box, instantiate, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { sidebarComponent } from "../components/sidebar";
import { editorComponent } from "../components/editor";
import { BaseLayout } from "../components/layout";
import { journalSaveDialogComponent } from "../components/journalSaveDialog";
import saveJournalFile from "../saveJournal";

export function createJournalPage(renderer: RenderContext): Page {
  const sidebar = sidebarComponent(renderer).renderable;
  const editor = editorComponent(renderer);
  const editorRenderable = editor.renderable;
  const fileSaverDialog = journalSaveDialogComponent(renderer, {
    onSave: (journalName) => {
      console.log(`Saving journal ${journalName}`);
      saveJournalFile(
        editor.getEditorContent(),
        fileSaverDialog.getInputContent(),
      );
      closeDialog();
    },
  });
  function closeDialog() {
    fileSaverDialog.renderable.visible = false;
    fileSaverDialog.blurInput();
    fileSaverDialog.resetInput();
  }
  fileSaverDialog.renderable.visible = false;

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
    fileSaverDialog.renderable,
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
      // when the dialog is visible
      if (fileSaverDialog.renderable.visible) {
        if (key.name === "escape") {
          closeDialog();
          return true;
        }
        return true;
      }
      if (editor?.onKeypress?.(key)) return true;
      if (key.ctrl && key.name === "s") {
        fileSaverDialog.renderable.visible = true;
        fileSaverDialog.focusInput();
        return true;
      }
      if (key.ctrl && key.name === "b") {
        toggleSidebar();
        return true;
      }
      return false;
    },
  };
}
