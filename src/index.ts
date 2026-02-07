import {
  ASCIIFont,
  Box,
  createCliRenderer,
  Text,
  TextAttributes,
} from "@opentui/core";

const renderer = await createCliRenderer({ exitOnCtrlC: true });

renderer.root.add(
  Box(
    {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
      border: true,
      borderColor: "#FFFFFF",
      borderStyle: "rounded",
      backgroundColor: "#262521",
    },
    Box(
      { justifyContent: "center", alignItems: "center", gap: 2 },
      ASCIIFont({ font: "tiny", text: "TermiLog" }),
      Text({
        justifyContent: "center",
        alignItems: "center",
        content: "Write your thoughts in 🐚!",
        attributes: TextAttributes.ITALIC,
      }),
    ),
  ),
);
