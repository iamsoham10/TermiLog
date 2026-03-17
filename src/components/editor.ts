import {
  KeyEvent,
  TextareaRenderable,
  type RenderContext,
} from "@opentui/core";

export function editorComponent(renderer: RenderContext) {
  const textEditor = new TextareaRenderable(renderer, {
    id: "editor-container",
    width: "100%",
    height: "100%",
    placeholder: "How was your day?...",
    cursorColor: "#00FF88",
    textColor: "#e6e6e6",
  });

  return {
    id: "editor",
    renderable: textEditor,
    onKeypress: (key: KeyEvent) => {
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
    getEditorContent: () => textEditor.plainText,
  };
}
