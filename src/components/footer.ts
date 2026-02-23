import { Box, Text } from "@opentui/core";

export function footerComponent() {
  return Box(
    {
      id: "footer",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      // flexGrow: 1,
      flexDirection: "row",
      gap: 2,
      // backgroundColor: "#296DCC",
    },
    Text({
      content: "[J] Journal",
      fg: "#00FF00",
    }),
    Text({
      content: "[Q] Quit",
      fg: "#00FF00",
    }),
  );
}
