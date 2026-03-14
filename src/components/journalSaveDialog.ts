import {
  Box,
  InputRenderable,
  InputRenderableEvents,
  instantiate,
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
    if (!journalName || journalName.trim() === "") return;
    callback.onSave(journalName);
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
    focusInput: () => journalNameInput.focus(),
    blurInput: () => journalNameInput.blur(),
  };
}
