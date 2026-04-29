import {
  Box,
  BoxRenderable,
  instantiate,
  KeyEvent,
  RGBA,
  TextareaRenderable,
  type RenderContext,
} from "@opentui/core";
import type { footerComponent } from "./footer";
import { journalInfoComponent } from "./journalInfo";

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

export function editorComponent(
  renderer: RenderContext,
  footer: ReturnType<typeof footerComponent>,
) {
  const journalInfoBar = journalInfoComponent(renderer).renderable;
  const textEditor = new TextareaRenderable(renderer, {
    id: "editor-container",
    width: "100%",
    height: "100%",
    placeholder: currentPlaceholder,
    cursorColor: "#00FF88",
    textColor: "#e6e6e6",
  });

  const editorBox = Box(
    {
      paddingTop: 2,
      paddingLeft: 3,
      paddingRight: 3,
    },
    textEditor,
  );

  const editorContainer = instantiate(
    renderer,
    Box(
      {
        id: "main-content-container",
        title: "Editor",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        flexGrow: 1,
        paddingTop: 1,
        border: true,
        borderColor: "#696969",
        backgroundColor: "#1a1a1a",
      },
      journalInfoBar,
      editorBox,
    ),
  ) as BoxRenderable;

  return {
    id: "editor",
    renderable: editorContainer,
    textEditor,
    isTextEditorFocused: () => textEditor.focused,
    blurEditor: () => {
      textEditor.blur();
      editorContainer.borderColor = RGBA.fromHex("#696969");
      footer.setEditorMode(false);
    },
    onKeypress: (key: KeyEvent) => {
      if (key.name == "i") {
        queueMicrotask(() => textEditor.focus());
        editorContainer.borderColor = RGBA.fromHex("#FF6600");
        footer.setEditorMode(true);
        return true;
      }
      if (textEditor.focused) {
        if (key.name == "escape") {
          textEditor.blur();
          editorContainer.borderColor = RGBA.fromHex("#696969");
          footer.setEditorMode(false);
          return true;
        }
        return true;
      }
      return false;
    },
    getEditorContent: () => textEditor.plainText,
  };
}
