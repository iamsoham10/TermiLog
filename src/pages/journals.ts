import { Box, instantiate, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { sidebarComponent } from "../components/sidebar";
import { editorComponent } from "../components/editor";
import { BaseLayout } from "../components/layout";
import { journalSaveDialogComponent } from "../components/journalSaveDialog";
import saveJournalFile from "../saveJournal";
import { toast } from "@opentui-ui/toast";
import { footerComponent } from "../components/footer";
import { journalEvents, JournalEventType } from "../events/journalEvents";
import { createFocusManager } from "../focusManager";

export function createJournalPage(renderer: RenderContext): Page {
  const focusManager = createFocusManager();
  const footer = footerComponent(renderer);
  const sidebar = sidebarComponent(renderer);
  const sidebarSelector = sidebar.renderable;
  const journalSelectorComponent = sidebar.selectComponent;
  const editor = editorComponent(renderer, footer);
  const editorRenderable = editor.renderable;
  let unsubscribeEditor: (() => void) | null = null;

  focusManager.registerComponent(editor);

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
  focusManager.registerComponent(fileSaverDialog);

  const content = Box(
    {
      id: "title-container",
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    sidebarSelector,
    editorRenderable,
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

  // journal-editor content load subscription
  const editorSubscription = () => {
    if (unsubscribeEditor) return;
    unsubscribeEditor = journalEvents.subscribe(
      JournalEventType.JOURNAL_SELECTED,
      ({ title, contents }) => {
        editor.setEditorContent(contents);
        console.log("Journal loaded:", title);
      },
    );
  };

  return {
    id: "journal",
    renderable: page,
    onEnter() {
      console.log("journal page onEnter called - sidebar subscribing");
      sidebar.setupSubscription?.();
      editorSubscription();
    },
    onLeave() {
      console.log("journal page onLeave called - unsubscribing sidebar");
      sidebar.tearDownSubscription?.();
      unsubscribeEditor?.();
      unsubscribeEditor = null;
    },
    onKeypress: (key) => {
      // when the dialog is visible
      // if (fileSaverDialog.renderable.visible) {
      //   if (key.name === "escape") {
      //     closeDialog();
      //     return true;
      //   }
      //   if (key.name === "tab") {
      //     if (fileSaverDialog.isInputFocused()) {
      //       fileSaverDialog.focusMoods();
      //     } else {
      //       fileSaverDialog.focusInput();
      //     }
      //   }
      //   return true;
      // }
      // if (key.name === "tab") {
      //   if (editor.isTextEditorFocused()) {
      //     // if editor is focused, blur it
      //     editor.blurEditor();
      //     journalSelectorComponent.focus();
      //     sidebar.updateBorderColor(true);
      //     footer.setSidebarMode(true);
      //     return true;
      //   }
      //   // if sidebar is focused, blur it
      //   if (journalSelectorComponent.focused) {
      //     journalSelectorComponent.blur();
      //     sidebar.updateBorderColor(false);
      //     footer.setSidebarMode(false);
      //     return true;
      //   }
      //   // if neither is focused, focus sidebar
      //   journalSelectorComponent.focus();
      //   sidebar.updateBorderColor(true);
      //   footer.setSidebarMode(true);
      //   return true;
      // }
      if (sidebarSelector.focused && sidebar.onKeypress?.(key)) return true;
      if (key.name === "i" && journalSelectorComponent.focused) {
        journalSelectorComponent.blur();
        sidebar.updateBorderColor(false);
      }
      // if (key.ctrl && key.name === "s") {
      //   fileSaverDialog.renderable.visible = true;
      //   fileSaverDialog.focusInput();
      //   return true;
      // }
      if (key.ctrl && key.name === "b") {
        toggleSidebar();
        return true;
      }
      return focusManager.routeKeypress(key);
    },
  };
}
