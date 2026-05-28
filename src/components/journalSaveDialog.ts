import {
  Box,
  BoxRenderable,
  InputRenderable,
  InputRenderableEvents,
  instantiate,
  KeyEvent,
  KeyHandler,
  SelectRenderable,
  SelectRenderableEvents,
  Text,
  type RenderContext,
} from "@opentui/core";

export function journalSaveDialogComponent(
  renderer: RenderContext,
  callback: {
    onSave: (journalName: string, mood: string) => void;
  },
) {
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

  journalNameInput.on(InputRenderableEvents.ENTER, (journalName: string) => {
    if (!journalName || journalName.trim() === "") {
      journalNameInput.placeholder = "required...";
      journalNameInput.placeholderColor = "#F54927";
      return;
    }
    callback.onSave(journalName, getSelectedMood());
  });

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
  function closeDialog() {
    saveDialog.visible = false;
    // saveDialog.blurInput();
    // fileSaverDialog.resetInput();
  }
  return {
    id: "save journal dialog",
    renderable: saveDialog,
    keyHandlers: new Map([
      [
        "ctrl+s",
        (key: KeyEvent) => {
          saveDialog.visible = true;
          journalNameInput.focus();
          return true;
        },
      ],
      [
        "escape",
        (key: KeyEvent) => {
          saveDialog.visible = false;
          journalNameInput.blur();
          journalNameInput.value = "";
          journalNameInput.placeholder = "journal name...";
          journalNameInput.placeholderColor = "#6E6E6E";
          return true;
        },
      ],
      [
        "m",
        (key: KeyEvent) => {
          if (journalNameInput.focused) {
            moodSelector.focus();
          } else {
            queueMicrotask(() => journalNameInput.focus());
          }
          return true;
        },
      ],
    ]),
    getInputContent: () => journalNameInput.plainText,
    getSelectedMood,
    focusInput: () => journalNameInput.focus(),
    focusMoods: () => moodSelector.focus(),
    blurInput: () => journalNameInput.blur(),
    resetInput: () => {
      journalNameInput.value = "";
      journalNameInput.placeholder = "journal name...";
      journalNameInput.placeholderColor = "#6E6E6E";
    },
    isInputFocused: () => journalNameInput.focused,
    // isMoodsFocused: () => moodSelector.focused,
  };
}
