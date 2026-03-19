import {
  Box,
  type BorderStyle,
  type Renderable,
  type VNode,
} from "@opentui/core";

export function BaseLayout(
  content: VNode | Renderable,
  footerRenderable?: Renderable,
  options?: {
    border?: boolean;
    borderColor?: string;
    borderStyle?: BorderStyle;
  },
): VNode {
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
    footerRenderable,
  );
}
