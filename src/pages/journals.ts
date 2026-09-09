import { Box, instantiate, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";
import { sidebarComponent } from "../components/sidebar";
import { editorComponent } from "../components/editor";
import { BaseLayout } from "../components/layout";
import { journalSaveDialogComponent } from "../components/journalSaveDialog";
import { footerComponent } from "../components/footer";
import { createFocusManager } from "../focusManager";
import type { Store } from "../store/store";
import type { JournalService } from "../journalService";
import { shouldDeferToTextInput } from "../utils/keyboardUtils.ts";
import { journalInfoComponent } from "../components/journalInfo.ts";

export function createJournalPage(
  renderer: RenderContext,
  store: Store,
  service: JournalService,
): Page {
  console.log("[JournalPage] Creating with store and service");

  const focusManager = createFocusManager(store);
  let unsubscribers: Array<() => void> = [];

  const sidebar = sidebarComponent(renderer, store, service);
  const fileSaverDialog = journalSaveDialogComponent(renderer, store, service);
  const footer = footerComponent(renderer, store);
  const infoBar = journalInfoComponent(renderer, store);
  const editor = editorComponent(renderer, store, infoBar.renderable);

  focusManager.registerComponent(editor);
  focusManager.registerComponent(sidebar);
  focusManager.registerComponent(fileSaverDialog);

  const content = Box(
    {
      id: "title-container",
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    sidebar.renderable,
    editor.renderable,
    fileSaverDialog.renderable,
  );

  const page = instantiate(
    renderer,
    BaseLayout(content, footer.renderable, { border: false }),
  );

  return {
    id: "journal",
    renderable: page,
    onEnter() {
      console.log(
        "[JournalPage] Entered (components handle their own subscriptions)",
      );
      const unsubFocusChanged = store.subscribe("FOCUS_CHANGED", (focusId) => {
        if (focusId === null) {
          return;
        }

        if (focusId === focusManager.getFocusedComponent()) {
          return;
        }

        focusManager.setFocusedComponent(focusId);
      });

      const unsubDialogOpen = store.subscribe("DIALOG_OPENED", () => {
        focusManager.setFocusedComponent("save-dialog");
      });

      const unsubDialogClosed = store.subscribe("DIALOG_CLOSED", () => {
        focusManager.setFocusedComponent("editor");
        queueMicrotask(() => { editor.textArea?.focus() });
      });

      unsubscribers = [unsubFocusChanged, unsubDialogOpen, unsubDialogClosed];
      footer.onEnter?.("editor");
      focusManager.setFocusedComponent("editor");
    },
    onLeave() {
      console.log("[JournalPage] Left (components clean up automatically)");
      footer.onLeave?.();
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
    },
    onKeypress: (key) => {
      const state = store.getState();
      if (
        state.focusedComponent === null &&
        !state.dialogOpen &&
        key.name === "n"
      ) {
        service.createNewJournal();
        return true;
      }
      if (key.ctrl && key.name === "b" && !store.getState().dialogOpen) {
        const nextVisible = !store.getState().sidebarVisible;

        if (!nextVisible && focusManager.getFocusedComponent() === "sidebar") {
          store.dispatch("FOCUS_CHANGED", "editor");
        }

        sidebar.renderable.visible = nextVisible;
        store.dispatch("SIDEBAR_VISIBILITY_CHANGED", nextVisible);
        return true;
      }
      const isDialogFieldNav =
        store.getState().dialogOpen &&
        key.name === "tab" &&
        focusManager.getFocusedComponent() === "save-dialog";

      if (!isDialogFieldNav && shouldDeferToTextInput(renderer, key)) return false;
      return focusManager.routeKeypress(key);
    },
  };
}
