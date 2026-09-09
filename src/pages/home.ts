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
import type { Store } from "../store/store";

export function createHomePage(renderer: RenderContext, store: Store): Page {
  const footer = footerComponent(renderer, store, { mode: "home" });
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
    BaseLayout(content, footer.renderable, {
      border: true,
      borderStyle: "rounded",
    }),
  );

  return {
    id: "home",
    renderable: page,
    onEnter() {
      footer.onEnter?.();
    },
    onLeave() {
      footer.onLeave?.();
    },
  };
}
