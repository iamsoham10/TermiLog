import { Box, Text } from "@opentui/core";

export function footerComponent() {
  return Box(
    {
      id: "footer",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 2,
      backgroundColor: "#1a1a1a",
    },
    Text({
      content: "[J] Journal",
      fg: "#999999",
    }),
    Text({
      content: "[H] Home",
      fg: "#999999",
    }),
    Text({
      content: "[Q] Quit",
      fg: "#999999",
    }),
  );
}
