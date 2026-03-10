import {
  Box,
  Input,
  instantiate,
  Text,
  type RenderContext,
} from "@opentui/core";

export function journalSaveDialogComponent(renderer: RenderContext) {
  const saveDialog = instantiate(
    renderer,
    Box(
      {
        position: "absolute",
        width: "40%",
        height: "30%",
        // justifyContent: "center",
        // alignItems: "center",
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
          // backgroundColor: "#F5F527",
        },
        Text({
          content: "Save Journal",
        }),
      ),
      Box(
        {
          marginTop: 2,
          justifyContent: "flex-start",
          // backgroundColor: "#27C2F2",
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
        Input({
          textColor: "#FFFFFF",
        }),
      ),
    ),
  );
  return {
    id: "save journal dialog",
    renderable: saveDialog,
  };
}
