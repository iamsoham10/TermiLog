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
import { markdownRendererComponent } from "./markdownRenderer";
import { toast } from "@opentui-ui/toast";

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
  const markdown = markdownRendererComponent(renderer).renderable;
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
      width: "70%",
      height: "100%",
      overflow: "hidden",
      paddingTop: 1,
      paddingLeft: 1,
      paddingRight: 2,
      paddingBottom: 1,
      border: true,
      borderColor: "#696969",
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
      Box(
        {
          flexDirection: "row",
        },
        editorBox,
        markdown,
      ),
    ),
  ) as BoxRenderable;

  function clearEditorContent() {
    textEditor.clear();
  }

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
    keyHandlers: new Map([
      [
        "i",
        (key: KeyEvent) => {
          queueMicrotask(() => textEditor.focus());
          editorContainer.borderColor = RGBA.fromHex("#00FFFF");
          footer.setEditorMode(true);
          return true;
        },
      ],
      [
        "escape",
        (key) => {
          textEditor.blur();
          editorContainer.borderColor = RGBA.fromHex("#696969");
          footer.setEditorMode(false);
          return true;
        },
      ],
    ]),
    getEditorContent: () => textEditor.plainText,
    setEditorContent: (content: string) => {
      clearEditorContent();
      textEditor.setText(content);
      toast.info("Journal loaded");
    },
  };
}
