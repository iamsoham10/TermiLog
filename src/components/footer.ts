import { BoxRenderable, Text, type RenderContext } from "@opentui/core";

export function footerComponent(renderer: RenderContext) {
  const defaultFooter = new BoxRenderable(renderer, {
    id: "deafult-footer",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    backgroundColor: "#1a1a1a",
  });

  defaultFooter.add(
    Text({
      content: "[J] Journal",
      fg: "#999999",
    }),
  );
  defaultFooter.add(
    Text({
      content: "[H] Home",
      fg: "#999999",
    }),
  );
  defaultFooter.add(
    Text({
      content: "[Q] Quit",
      fg: "#999999",
    }),
  );

  const editorFooter = new BoxRenderable(renderer, {
    id: "editor-footer",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    backgroundColor: "#1a1a1a",
  });

  editorFooter.add(
    Text({
      content: "[Q] Quit",
      fg: "#999999",
    }),
  );

  editorFooter.visible = false;

  const container = new BoxRenderable(renderer, {
    id: "footer-container",
    width: "100%",
  });
  container.add(defaultFooter);
  container.add(editorFooter);

  // return Box(
  //   {
  //     id: "footer",
  //     width: "100%",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     flexDirection: "row",
  //     gap: 2,
  //     backgroundColor: "#1a1a1a",
  //   },
  //   Text({
  //     content: "[J] Journal",
  //     fg: "#999999",
  //   }),
  //   Text({
  //     content: "[H] Home",
  //     fg: "#999999",
  //   }),
  //   Text({
  //     content: "[Q] Quit",
  //     fg: "#999999",
  //   }),
  // );
  return {
    renderable: container,
    setEditorMode(enabled: boolean) {
      defaultFooter.visible = !enabled;
      editorFooter.visible = enabled;
    },
  };
}
