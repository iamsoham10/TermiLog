import {
  KeyEvent,
  TextareaRenderable,
  type RenderContext,
} from "@opentui/core";

const placeholders = [
  "How was your day?...",
  "What’s on your mind right now?",
  "Take a moment… what are you feeling?",
  "What stood out today?",
  "Let it out…",
  "What are you carrying today?",
  "Write whatever comes to mind.",
  "What did today teach you?",
  "Pause. Reflect. Write.",
];

const currentPlaceholder =
  placeholders[Math.floor(Math.random() * placeholders.length)];

export function editorComponent(renderer: RenderContext) {
  const textEditor = new TextareaRenderable(renderer, {
    id: "editor-container",
    width: "100%",
    height: "100%",
    placeholder: currentPlaceholder,
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
