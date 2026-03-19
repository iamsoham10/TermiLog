import { BoxRenderable, Text, type RenderContext } from "@opentui/core";

export function footerComponent(renderer: RenderContext) {
  const defaultShortcuts = [
    {
      key: "J",
      label: "Journal",
    },
    {
      key: "H",
      label: "Home",
    },
    {
      key: "I",
      label: "Edit",
    },
    {
      key: "Q",
      label: "Quit",
    },
  ];

  const editorShortcuts = [
    {
      key: "Esc",
      label: "Exit editor mode",
    },
  ];

  const defaultFooter = new BoxRenderable(renderer, {
    id: "default-footer",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    backgroundColor: "#1a1a1a",
  });

  defaultShortcuts.forEach((shortcut) => {
    defaultFooter.add(
      Text({
        content: `[${shortcut.key}] ${shortcut.label}`,
        fg: "#999999",
      }),
    );
  });

  const editorFooter = new BoxRenderable(renderer, {
    id: "editor-footer",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    backgroundColor: "#1a1a1a",
  });

  editorShortcuts.forEach((shortcut) => {
    editorFooter.add(
      Text({
        content: `[${shortcut.key}] ${shortcut.label}`,
        fg: "#999999",
      }),
    );
  });

  editorFooter.visible = false;

  const container = new BoxRenderable(renderer, {
    id: "footer-container",
    width: "100%",
  });
  container.add(defaultFooter);
  container.add(editorFooter);

  return {
    renderable: container,
    setEditorMode(enabled: boolean) {
      defaultFooter.visible = !enabled;
      editorFooter.visible = enabled;
    },
  };
}
