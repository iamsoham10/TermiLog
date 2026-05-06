import {
  MarkdownRenderable,
  SyntaxStyle,
  RGBA,
  type RenderContext,
  Box,
} from "@opentui/core";

const syntaxStyle = SyntaxStyle.fromStyles({
  "markup.heading.1": { fg: RGBA.fromHex("#58A6FF"), bold: true },
  "markup.list": { fg: RGBA.fromHex("#FF7B72") },
  "markup.raw": { fg: RGBA.fromHex("#A5D6FF") },
  default: { fg: RGBA.fromHex("#E6EDF3") },
});

export function markdownRendererComponent(renderer: RenderContext) {
  const markdown = new MarkdownRenderable(renderer, {
    id: "readme",
    // width: 60,
    content: "# Hello\n\n- One\n- Two\n\n```ts\nconst x = 1\n```",
    syntaxStyle,
  });

  const markdownRendererContainer = Box(
    {
      width: "50%",
      border: true,
      borderColor: "#FFFFFF",
      borderStyle: "single",
    },
    markdown,
  );
  return {
    id: "markdown-renderer",
    renderable: markdownRendererContainer,
  };
}
