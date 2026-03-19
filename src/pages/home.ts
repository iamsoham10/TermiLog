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
import { footerComponent } from "../components/footer";

export function createHomePage(renderer: RenderContext): Page {
  const footerShortcuts = footerComponent(renderer).renderable;
  const content = Box(
    {
      id: "title-container",
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      flexGrow: 1,
      backgroundColor: "#1a1a1a",
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
    BaseLayout(content, footerShortcuts, {
      border: true,
      borderStyle: "rounded",
    }),
  );

  return {
    id: "home",
    renderable: page,
    onEnter() {},
    onLeave() {},
  };
}
