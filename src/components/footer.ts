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

type FooterMode = "home" | "default" | "dashboard";

export function footerComponent(
  renderer: RenderContext,
  store: Store,
  options?: { mode?: FooterMode },
): ComponentDefinition {
  const mode = options?.mode ?? "default";

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
      default:
        setShortcuts(journalUnfocusedShortcuts);
    }
  }

  const homeShortcuts = [
    { key: "J", label: "Journal" },
    { key: "D", label: "Dashboard" },
    { key: "Q", label: "Quit" },
  ];

  const journalUnfocusedShortcuts = [
    { key: "I", label: "Edit" },
    { key: "Tab", label: "Sidebar" },
    { key: "Ctrl+b", label: "Toggle Sidebar" },
    { key: "D", label: "Dashboard" },
    { key: "N", label: "New journal" },
  ];

  const editorShortcuts = [
    { key: "Esc", label: "Exit editor mode" },
    { key: "Ctrl+s", label: "Save" },
    { key: "Ctrl+b", label: "Toggle Sidebar" },
  ];

  const sidebarShortcuts = [
    { key: "↑↓", label: "Navigate" },
    { key: "Enter", label: "Open journal" },
    { key: "Tab", label: "Editor" },
  ];

  const dashboardShortcuts = [
    { key: "J", label: "Journal" },
    { key: "W", label: "Week" },
    { key: "M", label: "Month" },
    { key: "R", label: "Refresh" },
    { key: "Q", label: "Quit" },
  ];

  setShortcuts(
    mode === "dashboard"
      ? dashboardShortcuts
      : mode === "home"
        ? homeShortcuts
        : editorShortcuts,
  );

  return {
    id: "footer",
    renderable: shortcutContainer,
    onEnter: (initialFocusId?: string) => {
      console.log("[Footer] Entered (setting up subscriptions)");
      if (mode === "home") {
        setShortcuts(homeShortcuts);
        return;
      }
      if (mode === "dashboard") {
        setShortcuts(dashboardShortcuts);
        return;
      }
      const unsubFocus = store.subscribe("FOCUS_CHANGED", (focusedId) => {
        console.log("[Footer] focus changed to:", focusedId);
        updateShortcutsForFocus(focusedId);
      });
      unsubscribers = [unsubFocus];
      if (initialFocusId) {
        updateShortcutsForFocus(initialFocusId);
      }
    },
    onLeave: () => {
      console.log("[footer] leaving (cleaning up subscriptions)");
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
    }
  };
}
