import {
  Box,
  InputRenderable,
  InputRenderableEvents,
  instantiate,
  Select,
  SelectRenderable,
  Text,
  type RenderContext,
} from "@opentui/core";

export function journalSaveDialogComponent(
  renderer: RenderContext,
  callback: {
    onSave: (journalName: string) => void;
  },
) {
  const journalNameInput = new InputRenderable(renderer, {
    textColor: "#FFFFFF",
    placeholder: "journal name...",
    overflow: "hidden",
    marginLeft: 1,
  });

  journalNameInput.on(InputRenderableEvents.ENTER, (journalName) => {
    if (!journalName || journalName.trim() === "") {
      journalNameInput.placeholder = "required...";
      journalNameInput.placeholderColor = "#F54927";
      return;
    }
    callback.onSave(journalName);
  });

  const moodSelector = new SelectRenderable(renderer, {
    showDescription: false,
    height: 5,
    focusedBackgroundColor: "#202020",
    options: [
      { name: "😊 Happy", description: "" },
      { name: "🙂 Good", description: "" },
      { name: "😐 Neutral", description: "" },
      { name: "😔 Sad", description: "" },
      { name: "😡 Angry", description: "" },
    ],
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
  return {
    id: "save journal dialog",
    renderable: saveDialog,
    getInputContent: () => journalNameInput.plainText,
    focusInput: () => journalNameInput.focus(),
    focusMoods: () => moodSelector.focus(),
    blurInput: () => journalNameInput.blur(),
    resetInput: () => {
      journalNameInput.value = "";
      journalNameInput.placeholder = "journal name...";
      journalNameInput.placeholderColor = "#6E6E6E";
    },
    isInputFocused: () => journalNameInput.focused,
    isMoodsFocused: () => journalNameInput.focused,
  };
}
