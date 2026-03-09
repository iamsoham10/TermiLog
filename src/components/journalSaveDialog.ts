import { Box, Text, TextAttributes } from "@opentui/core";

export function journalSaveDialogComponent() {
  return Box(
    {
      position: "absolute",
      width: "40%",
      height: "30%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      zIndex: 1000,
      backgroundColor: "#F54927",
    },
    Text({
      content: "Journal Save Dialogue",
      attributes: TextAttributes.BLINK,
    }),
  );
}
