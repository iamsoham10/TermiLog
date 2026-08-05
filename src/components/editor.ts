import {
  Box,
  BoxRenderable,
  instantiate,
  KeyEvent,
  RGBA,
  TextareaRenderable,
  type RenderContext,
} from "@opentui/core";
import { journalInfoComponent } from "./journalInfo";
import { markdownRendererComponent } from "./markdownRenderer";
import type { Store } from "../store/store";
import type { ComponentDefinition } from "../focusManager";

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
  store: Store,
): ComponentDefinition {
  let unsubscribers: Array<() => void> = [];

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
  textEditor.onContentChange = () => {
    store.dispatch('EDITOR_CONTENT_CHANGED', textEditor.plainText);
  }

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

  function updateBorderColor(isFocused: boolean): void {
    editorContainer.borderColor = isFocused
      ? RGBA.fromHex("#00FFFF")
      : RGBA.fromHex("#696969");
  }

  // subscribe to journal loads
  store.subscribe("JOURNAL_LOADED", (payload) => {
    console.log("[Editor] journal loaded, updating content");
    clearEditorContent();
    textEditor.setText(payload.content || "");
    textEditor.gotoBufferEnd();
    store.dispatch("FOCUS_CHANGED", 'editor');
  });

  return {
    id: "editor",
    renderable: editorContainer,
    textArea: textEditor,
    keyHandlers: new Map([
      [
        "ctrl+s",
        (key: KeyEvent) => {
          store.dispatch("DIALOG_OPENED");
          return true;
        },
      ],
      [
        "tab",
        (key: KeyEvent) => {
          store.dispatch("FOCUS_CHANGED", "sidebar");
          return true;
        },
      ],
      [
        "i",
        (key: KeyEvent) => {
          queueMicrotask(() => textEditor.focus());
          updateBorderColor(true);
          store.dispatch("FOCUS_CHANGED", "editor");
          return true;
        },
      ],
      [
        "escape",
        (key: KeyEvent) => {
          textEditor.blur();
          updateBorderColor(false);
          store.dispatch("FOCUS_CHANGED", null);
          return true;
        },
      ],
    ]),
    onEnter: () => {
      console.log("[Editor] entered (setting up subscriptions)");
      queueMicrotask(() => { textEditor.focus() });
      updateBorderColor(true);

      const unsubSave = store.subscribe("JOURNAL_SAVED", () => {
        console.log("[Editor] journal saved");
        textEditor.blur();
        updateBorderColor(false);
      });

      unsubscribers = [unsubSave];
    },
    onLeave: () => {
      // unsubcribe (cleanup)
      console.log("[Editor] leaving");
      textEditor.blur();
      updateBorderColor(false);
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
    },
  };
}
