import {
  BoxRenderable,
  TextRenderable,
  type RenderContext,
} from "@opentui/core";
import type { Store } from "../store/store";
import type { ComponentDefinition } from "../focusManager";

type Shortcut = {
  key: string;
  label: string;
};
type ShortcutNode = {
  id: string;
  node: TextRenderable;
};

export function footerComponent(renderer: RenderContext, store: Store): ComponentDefinition {

  let unsubscribers: Array<() => void> = [];
  let currentChildren: ShortcutNode[] = [];

  const shortcutContainer = new BoxRenderable(renderer, {
    id: "default-footer",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    backgroundColor: "#1a1a1a",
  });

  function createShortcutText(shortcut: Shortcut, index: number): ShortcutNode {
    const id = `footer-shortcut-${index}`;
    return {
      id,
      node: new TextRenderable(renderer, {
        content: `[${shortcut.key}] ${shortcut.label}`,
        fg: "#999999",
      }),
    };
  }

  function setShortcuts(shortcuts: Shortcut[]): void {
    if (currentChildren.length != 0) {
      for (const child of currentChildren) {
        shortcutContainer.remove(child.id);  //clear old shortcuts
        child.node.destroy();
      }
    }
    currentChildren = shortcuts.map((shortcut, index) =>
      createShortcutText(shortcut, index),
    );
    for (const child of currentChildren) {
      shortcutContainer.add(child.node);  //add new shortcuts
    }
  }

  function updateShortcutsForFocus(focusedId: string | null): void {
    switch (focusedId) {
      case "editor":
        setShortcuts(editorShortcuts);
        break;
      case "sidebar":
        setShortcuts(sidebarShortcuts);
        break;
      case "save-dialog":
        setShortcuts(dialogShortcuts);
        break;
      default:
        setShortcuts(defaultShortcuts);
    }
  }

  const defaultShortcuts = [
    { key: "J", label: "Journal" },
    { key: "I", label: "Edit" },
    { key: "Q", label: "Quit" },
    { key: "Tab", label: "Sidebar" },
    { key: "Ctrl+b", label: "Toggle Sidebar" },
  ];

  const editorShortcuts = [
    { key: "Esc", label: "Exit editor mode" }
  ];

  const sidebarShortcuts = [
    { key: "↑↓", label: "Navigate" },
    { key: "Enter", label: "Open journal" }
  ];

  const dialogShortcuts = [
    { key: "Tab", label: "Switch field" },
    { key: "Esc", label: "Cancel" },
    { key: "Enter", label: "Save" },
  ];

  setShortcuts(defaultShortcuts);

  return {
    id: "footer",
    renderable: shortcutContainer,
    onEnter: () => {
      console.log("[Footer] Entered (setting up subscriptions)");
      const unsubFocus = store.subscribe("FOCUS_CHANGED", (focusedId) => {
        console.log("[Footer] focus changed to:", focusedId);
        updateShortcutsForFocus(focusedId);
      });
      unsubscribers = [unsubFocus];
    },
    onLeave: () => {
      console.log("[footer] leaving (cleaning up subscriptions)");
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
    }
  };
}
