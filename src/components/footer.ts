import {
  BoxRenderable,
  TextRenderable,
  type RenderContext,
} from "@opentui/core";

export function footerComponent(renderer: RenderContext) {
  type Shortcut = {
    key: string;
    label: string;
  };
  type ShortcutNode = {
    id: string;
    node: TextRenderable;
  };

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

  let currentChildren: ShortcutNode[] = [];

  function setShortcuts(shortcuts: Shortcut[]) {
    if (currentChildren.length != 0) {
      for (const child of currentChildren) {
        shortcutContainer.remove(child.id);
        child.node.destroy();
      }
    }
    currentChildren = shortcuts.map((shortcut, index) =>
      createShortcutText(shortcut, index),
    );
    for (const child of currentChildren) {
      shortcutContainer.add(child.node);
    }
  }

  const defaultShortcuts = [
    { key: "J", label: "Journal" },
    { key: "H", label: "Home" },
    { key: "I", label: "Edit" },
    { key: "Q", label: "Quit" },
  ];
  const editorShortcuts = [{ key: "Esc", label: "Exit editor mode" }];
  const sidebarShortcuts = [{ key: "↑↓", label: "Navigate journals" }];

  setShortcuts(defaultShortcuts);

  return {
    renderable: shortcutContainer,
    setEditorMode(enabled: boolean) {
      setShortcuts(enabled ? editorShortcuts : defaultShortcuts);
    },
    setSidebarMode(enabled: boolean) {
      setShortcuts(enabled ? sidebarShortcuts : defaultShortcuts);
    },
  };
}
