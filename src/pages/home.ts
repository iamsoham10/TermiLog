import {
  ASCIIFont,
  bold,
  Box,
  instantiate,
  t,
  Text,
  TextAttributes,
  type KeyEvent,
  type Renderable,
  type RenderContext,
} from "@opentui/core";

export interface Page {
  id: string;
  renderable: Renderable;
  onEnter?: () => void;
  onLeave?: () => void;
  onKeypress?: (key: KeyEvent) => boolean;
}

export function createHomePage(renderer: RenderContext): Page {
  const page = instantiate(
    renderer,
    Box(
      {
        id: "home-containrer",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        border: true,
        borderColor: "#FFFFFF",
        borderStyle: "rounded",
        backgroundColor: "#262521",
      },
      Box(
        {
          id: "title-container",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        },
        ASCIIFont({ id: "asciiTitle", font: "tiny", text: "TermiLog" }),
        Text({
          justifyContent: "center",
          alignItems: "center",
          content: "Write your thoughts in 🐚!",
          attributes: TextAttributes.ITALIC,
        }),
      ),
    ),
  );

  return {
    id: "home",
    renderable: page,
    onEnter() {},
    onLeave() {},
  };
}
