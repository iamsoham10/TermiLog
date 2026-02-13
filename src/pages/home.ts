import {
  ASCIIFont,
  Box,
  instantiate,
  Text,
  TextAttributes,
  type RenderContext,
} from "@opentui/core";
import type { Page } from "../types/page";
import { footerComponent } from "../components/footer";

export function createHomePage(renderer: RenderContext): Page {
  const footer = footerComponent(renderer).renderable;
  const page = instantiate(
    renderer,
    Box(
      {
        id: "home-containrer",
        width: "100%",
        height: "100%",
        overflow: "hidden",
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
          flexGrow: 1,
        },
        ASCIIFont({ id: "asciiTitle", font: "tiny", text: "TermiLog" }),
        Text({
          justifyContent: "center",
          alignItems: "center",
          content: "Write your thoughts in 🐚!",
          attributes: TextAttributes.ITALIC,
        }),
      ),
      Box(
        {
          id: "footerComponent-container",
          height: 1,
          width: "100%",
        },
        footer,
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
