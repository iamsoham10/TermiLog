import {
  Box,
  InputRenderable,
  instantiate,
  KeyEvent,
  SelectRenderable,
  SelectRenderableEvents,
  Text,
  type RenderContext,
} from "@opentui/core";
import type { Store } from "../store/store";
import type { JournalService } from "../journalService";
import type { ComponentDefinition } from "../focusManager";
import { toast } from "@opentui-ui/toast";


export function journalSaveDialogComponent(
  renderer: RenderContext,
  store: Store,
  service: JournalService
): ComponentDefinition {

  let unsubscribers: Array<() => void> = [];
  let isInputFocused = true;

  const journalNameInput = new InputRenderable(renderer, {
    textColor: "#FFFFFF",
    placeholder: "journal name...",
    overflow: "hidden",
    marginLeft: 1,
  });

  const moodOptions = [
    { name: "😊 Happy", description: "", value: "Happy" },
    { name: "🙂 Good", description: "", value: "Good" },
    { name: "😐 Neutral", description: "", value: "Neutral" },
    { name: "😔 Sad", description: "", value: "Sad" },
    { name: "😡 Angry", description: "", value: "Angry" },
  ];

  let currentMoodIndex = 0;

  const moodSelector = new SelectRenderable(renderer, {
    showDescription: false,
    height: 5,
    focusedBackgroundColor: "#202020",
    options: moodOptions,
    selectedIndex: 0,
  });

  moodSelector.on(SelectRenderableEvents.SELECTION_CHANGED, (index: number) => {
    currentMoodIndex = index;
  });

  const getSelectedMood = () => {
    return moodOptions[currentMoodIndex]?.value ?? "neutral";
  };

  function resetInput(): void {
    journalNameInput.value = "";
    journalNameInput.placeholder = "journal name...";
    journalNameInput.placeholderColor = "#6E6E6E";
    currentMoodIndex = 0;
    moodSelector.selectedIndex = 0;
  }

  function closeDialog() {
    saveDialog.visible = false;
    journalNameInput.blur();
    moodSelector.blur();
    resetInput();
    store.dispatch("DIALOG_CLOSED");
  }

  function showErrorMessage(message: string): void {
    journalNameInput.placeholder = message;
    journalNameInput.placeholderColor = "#F54927";
  }

  function toggleFocus(): void {
    if (isInputFocused) {
      journalNameInput.blur();
      moodSelector.focus();
      isInputFocused = false;
    } else {
      moodSelector.blur();
      journalNameInput.focus();
      isInputFocused = true;
    }
  }

  async function saveJournal(): Promise<void> {
    const name = journalNameInput.value;
    const mood = getSelectedMood();

    const state = store.getState();
    const content = state.editorContent;

    if (!name || name.trim() == '') {
      showErrorMessage("Title required...");
      return;
    }

    console.log("[Dialog] Saving journal:", name);

    const result = await service.saveJournal(name, content, mood);

    if (result.success) {
      console.log("[Dialog] Save successful");
      toast.success(`Journal "${name}" saved successfully`);
      closeDialog();
    } else {
      console.error("[Dialog] Save failed:", result.message);
    }
  }

  const saveDialog = instantiate(
    renderer,
    Box(
      {
        position: "absolute",
        width: "40%",
        height: "auto",
        flexDirection: "column",
        zIndex: 1000,
        backgroundColor: "#202020",
        border: true,
        borderStyle: "double",
        borderColor: "#333333",
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 1,
      },
      Box(
        {
          justifyContent: "center",
          alignItems: "center",
        },
        Text({
          content: "Save Journal",
        }),
      ),
      Box(
        {
          marginTop: 2,
          justifyContent: "flex-start",
        },
        Text({
          content: "Enter name for the journal:",
        }),
      ),
      Box(
        {
          marginTop: 1,
          border: true,
          borderStyle: "single",
        },
        journalNameInput,
      ),
      Box(
        {
          marginTop: 1,
          justifyContent: "flex-start",
        },
        Text({
          content: "Select mood:",
        }),
      ),
      Box(
        {
          marginTop: 1,
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 1,
        },
        moodSelector,
      ),
      Box(
        {
          marginTop: 2,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 4,
        },
        Box(
          {
            flexDirection: "row",
            gap: 1,
          },
          Text({
            content: "enter",
            fg: "#FFFFFF",
          }),
          Text({
            content: "Save",
            fg: "#6E6E6E",
          }),
        ),
        Box(
          {
            flexDirection: "row",
            gap: 1,
          },
          Text({
            content: "esc",
            fg: "#FFFFFF",
          }),
          Text({
            content: "Close",
            fg: "#6E6E6E",
          }),
        ),
      ),
    ),
  );

  saveDialog.visible = false;

  return {
    id: "save-dialog",
    renderable: saveDialog,
    keyHandlers: new Map<string, (key: KeyEvent) => boolean | Promise<boolean>>([
      // [
      //   "ctrl+s",
      //   (key: KeyEvent) => {
      //     saveDialog.visible = true;
      //     journalNameInput.focus();
      //     return true;
      //   },
      // ],
      [
        "escape",
        (key: KeyEvent) => {
          closeDialog();
          return true;
        },
      ],
      [
        "enter",
        async (key: KeyEvent) => {
          await saveJournal();
          return true;
        }
      ],
      [
        "m",
        (key: KeyEvent) => {
          toggleFocus();
          return true;
        },
      ],
    ]),
    onEnter: () => {
      console.log("[Dialog] entered (setting up subscriptions)");
      // subscribe to save errors
      const unsubError = store.subscribe("SAVE_ERROR", (errorMessage) => {
        console.log("[Dialog] save error:", errorMessage);
        showErrorMessage(`Error: ${errorMessage}`);
      });

      // subscribe to successful saves
      const unsubSave = store.subscribe("JOURNAL_SAVED", () => {
        console.log("[Dialog] jorunal saved, closing dialog");
        closeDialog();
      });
      unsubscribers = [unsubError, unsubSave];
    },
    onLeave: () => {
      console.log("[Dialog] leaving (cleaning up subscriptions)");
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
      if (saveDialog.visible) {
        closeDialog();
      }
    }
  }
}
