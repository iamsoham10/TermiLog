import {
  ASCIIFont,
  Box,
  instantiate,
  Text,
  TextAttributes,
  type RenderContext,
} from "@opentui/core";
import type { Page } from "../types/page";
import { BaseLayout } from "../components/layout";

export function createHomePage(renderer: RenderContext): Page {
  const content = Box(
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
  );

  const page = instantiate(
    renderer,
    BaseLayout(content, { border: true, borderStyle: "rounded" }),
  );

  return {
    id: "home",
    renderable: page,
    onEnter() {},
    onLeave() {},
  };
}
