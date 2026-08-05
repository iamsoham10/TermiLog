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

export function createJournalPage(
  renderer: RenderContext,
  store: Store,
  service: JournalService,
): Page {
  console.log("[JournalPage] Creating with store and service");

  const focusManager = createFocusManager();
  let unsubscribers: Array<() => void> = [];

  const sidebar = sidebarComponent(renderer, store, service);
  const editor = editorComponent(renderer, store);
  const fileSaverDialog = journalSaveDialogComponent(renderer, store, service);
  const footer = footerComponent(renderer, store);

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

        focusManager.setFocusedComponent(focusId);
      });

      const unsubDialogOpen = store.subscribe("DIALOG_OPENED", () => {
        focusManager.setFocusedComponent("save-dialog");
        store.dispatch("FOCUS_CHANGED", "save-dialog");
      });

      const unsubDialogClosed = store.subscribe("DIALOG_CLOSED", () => {
        focusManager.setFocusedComponent("editor");
        queueMicrotask(() => { editor.textArea?.focus() });
      });

      unsubscribers = [unsubFocusChanged, unsubDialogOpen, unsubDialogClosed];
      focusManager.setFocusedComponent("editor");
      // store.dispatch("FOCUS_CHANGED", "editor");
    },
    onLeave() {
      console.log("[JournalPage] Left (components clean up automatically)");
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
    },
    onKeypress: (key) => {
      if (key.ctrl && key.name === "b" && !store.getState().dialogOpen) {
        const nextVisible = !store.getState().sidebarVisible;

        if (!nextVisible && focusManager.getFocusedComponent() === "sidebar") {
          store.dispatch("FOCUS_CHANGED", "editor");
        }

        sidebar.renderable.visible = nextVisible;
        store.dispatch("SIDEBAR_VISIBILITY_CHANGED", nextVisible);
        return true;
      }
      return focusManager.routeKeypress(key);
    },
  };
}
