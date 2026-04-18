import { Box, instantiate, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { sidebarComponent } from "../components/sidebar";
import { editorComponent } from "../components/editor";
import { BaseLayout } from "../components/layout";
import { journalSaveDialogComponent } from "../components/journalSaveDialog";
import { journalInfoComponent } from "../components/journalInfo.ts";
import saveJournalFile from "../saveJournal";
import { toast } from "@opentui-ui/toast";
import { footerComponent } from "../components/footer";

export function createJournalPage(renderer: RenderContext): Page {
  const footer = footerComponent(renderer);
  const sidebar = sidebarComponent(renderer);
  const sidebarSelector = sidebar.renderable;
  const journalSelectorComponent = sidebar.selectComponent;
  // const selectedJournal = sidebar.getSelectorIndex();
  const editor = editorComponent(renderer, footer);
  const journalInfoBar = journalInfoComponent(renderer).renderable;
  const editorRenderable = editor.renderable;
  const fileSaverDialog = journalSaveDialogComponent(renderer, {
    onSave: (journalName, mood) => {
      saveJournalFile(
        editor.getEditorContent(),
        fileSaverDialog.getInputContent(),
        mood,
      );
      toast.success(`Journal ${journalName} saved`);
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
    sidebarSelector,
    Box(
      {
        id: "main-content-container",
        title: "Editor",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        flexGrow: 1,
        paddingTop: 1,
        border: true,
        borderColor: "#696969",
        backgroundColor: "#1a1a1a",
      },
      journalInfoBar,
      Box(
        {
          paddingTop: 2,
          paddingLeft: 3,
          paddingRight: 3,
        },
        editorRenderable,
      ),
    ),
    fileSaverDialog.renderable,
  );
  const page = instantiate(
    renderer,
    BaseLayout(content, footer.renderable, { border: false }),
  );

  // editorRenderable.focus();
  function toggleSidebar() {
    sidebarSelector.visible = !sidebarSelector.visible;
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
        if (key.name === "tab") {
          if (fileSaverDialog.isInputFocused()) {
            fileSaverDialog.focusMoods();
          } else {
            fileSaverDialog.focusInput();
          }
        }
        return true;
      }
      if (key.name === "tab") {
        if (journalSelectorComponent.focused) {
          journalSelectorComponent.blur();
          footer.setSidebarMode(false);
        } else {
          journalSelectorComponent.focus();
          footer.setSidebarMode(true);
        }
      }
      if (sidebarSelector.focused && sidebar.onKeypress?.(key)) return true;
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
