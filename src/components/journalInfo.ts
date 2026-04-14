import { Box, Text, instantiate, type RenderContext } from "@opentui/core";

/*
  accept journal metadata as parameter
  handle empty/missing mood or other properties
  manage error & loading state
  manage how state updated when the new journal is opened in editor
*/
export function journalInfoComponent(renderer: RenderContext) {
  const mood = "Happy";
  const date = "Apr 13, 2026 10:42 PM";
  const lastEdited = "3m ago";
  const journalInfoBar = instantiate(
    renderer,
    Box(
      {
        id: "info-bar",
        height: 1,
        width: "auto",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 2,
        paddingRight: 2,
      },
      Text({
        content: `Mood: ${mood}`,
        fg: "#F5C527",
      }),
      Text({
        content: `Written: ${date}`,
        fg: "#F5C527",
      }),
      Text({
        content: `Edited: ${lastEdited}`,
        fg: "#F5C527",
      }),
    ),
  );
  return {
    id: "info-bar",
    renderable: journalInfoBar,
  };
}
