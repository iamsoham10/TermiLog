import { KeyEvent, Renderable } from "@opentui/core";

export interface Page {
  id: string;
  renderable: Renderable;
  onEnter?: () => void;
  onLeave?: () => void;
  onKeypress?: (key: KeyEvent) => boolean;
}
