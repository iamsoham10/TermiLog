import { TextareaRenderable, type RenderContext } from "@opentui/core";

export function editorComponent(renderer: RenderContext) {
  const textEditor = new TextareaRenderable(renderer, {
    id: "editor",
    width: "100%",
    height: 40,
    placeholder: "How was your day?...",
    backgroundColor: "#4C5E7D",
    cursorColor: "#00FF88",
  });

  return textEditor;
}
