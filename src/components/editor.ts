import { TextareaRenderable, type RenderContext } from "@opentui/core";
import type { Page } from "../types/page";

export function editorComponent(renderer: RenderContext): Page {
  const textEditor = new TextareaRenderable(renderer, {
    id: "editor-container",
    width: "100%",
    height: "100%",
    placeholder: "How was your day?...",
    cursorColor: "#00FF88",
  });

  return {
    id: "editor",
    renderable: textEditor,
    onKeypress: (key) => {
      if (key.name == "i") {
        queueMicrotask(() => textEditor.focus());
        return true;
      }
      if (textEditor.focused) {
        if (key.name == "escape") {
          textEditor.blur();
          return true;
        }
        return true;
      }
    },
  };
}
