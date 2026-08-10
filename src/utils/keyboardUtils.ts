import {
  KeyEvent,
  TextareaRenderable,
  type RenderContext,
} from "@opentui/core";

export function isTextInputFocused(renderer: RenderContext): boolean {
  const focused = renderer.currentFocusedRenderable;
  return focused instanceof TextareaRenderable && focused.focused;
}

export function shouldDeferToTextInput(
  renderer: RenderContext,
  key: KeyEvent,
): boolean {
  if (!isTextInputFocused(renderer)) return false;
  if (key.ctrl || key.meta || key.option) return false;
  if (key.name === "escape") return false;
  return true;
}
