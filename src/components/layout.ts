import {
  Box,
  type BorderStyle,
  type Renderable,
  type RenderContext,
  type VNode,
} from "@opentui/core";
import { footerComponent } from "./footer";

export function BaseLayout(
  renderer: RenderContext,
  content: VNode | Renderable,
  options?: {
    border?: boolean;
    borderColor?: string;
    borderStyle?: BorderStyle;
  },
): VNode {
  const footer = footerComponent(renderer).renderable;
  return Box(
    {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      flexGrow: 1,
      flexDirection: "column",
      backgroundColor: "#262521",
      border: options?.border ?? false,
      borderColor: options?.borderColor,
      borderStyle: options?.borderStyle,
    },
    Box({ id: "content-area", flexGrow: 1 }, content),
    footer,
  );
}
