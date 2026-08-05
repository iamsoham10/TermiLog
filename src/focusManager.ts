import { KeyEvent, Renderable, TextareaRenderable } from "@opentui/core";

/*
FocusManager - Keyboard Routing

Manages:
- which component is focused
- routing keypress events to focused component
- tab/shift-tab navigation between components

Component register themselves and declare their keyHandlers map
*/

export interface ComponentDefinition {
  id: string;
  renderable: Renderable;
  textArea?: TextareaRenderable;
  keyHandlers?: Map<string, (key: KeyEvent) => boolean | Promise<boolean>>;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function createFocusManager() {
  let focusedComponentId: string = "";
  const components = new Map<string, ComponentDefinition>();
  let focusOrder: string[] = [];

  // register component - called during page creation
  function registerComponent(component: ComponentDefinition): void {
    if (!components.has(component.id)) {
      components.set(component.id, component);
    }

    if (!focusOrder.includes(component.id)) {
      focusOrder.push(component.id);
    }

    console.log(`[FocusManger] registered: ${component.id}`);
  }

  // set which component is focused - trigger onLeave and onEnter of respective components
  function setFocusedComponent(componentId: string): void {
    if (!components.has(componentId)) {
      console.warn(`[FocusManager] component not found: ${componentId}`);
      return;
    }

    const oldComponent = components.get(focusedComponentId);
    if (oldComponent?.onLeave) {
      oldComponent.onLeave();
    }

    focusedComponentId = componentId;

    const newComponent = components.get(componentId);
    if (newComponent?.onEnter) {
      newComponent.onEnter();
    }

    console.log(`[FocusManager] focus changed to: ${componentId}`);
  }

  // get currently focused component id
  function getFocusedComponent(): string {
    return focusedComponentId;
  }

  // get currently focused component definition
  function getFocusedComponentDef(): ComponentDefinition | undefined {
    return components.get(focusedComponentId);
  }

  // focus next component - rotate through focus order
  function focusNext(): void {
    if (focusOrder.length === 0) return;
    // const currentIndex = focusOrder.indexOf(focusedComponentId);
    // const nextIndex = (currentIndex + 1) % focusOrder.length;
    // setFocusedComponent(focusOrder[nextIndex]!);
    const start = (focusOrder.indexOf(focusedComponentId) + 1) % focusOrder.length;
    focusVisibleFrom(start, 1);
  }

  // Focus previous component (Shift+Tab key)
  // Rotates backwards through focusOrder array circularly
  function focusPrevious(): void {
    if (focusOrder.length === 0) return;
    // const currentIndex = focusOrder.indexOf(focusedComponentId);

    // If not found or at start, wrap to end
    // (currentIndex - 1 + length) ensures we get positive number
    // const prevIndex =
    //   (currentIndex - 1 + focusOrder.length) % focusOrder.length;

    // setFocusedComponent(focusOrder[prevIndex]!);
    if (focusOrder.length === 0) return;
    const start = (focusOrder.indexOf(focusedComponentId) - 1 + focusOrder.length) % focusOrder.length;
    focusVisibleFrom(start, -1);
  }

  // scan the focus order for the next visible component; direction = +1 or -1
  function focusVisibleFrom(startIndex: number, direction: 1 | -1): void {
    let i = startIndex;
    for (let count = 0; count < focusOrder.length; count++) {
      const candidate = components.get(focusOrder[i]!);
      if (candidate?.renderable.visible) {
        setFocusedComponent(candidate.id);
        return;
      }
      i = (i + direction + focusOrder.length) % focusOrder.length;
    }
  }

  // Route a keypress event
  /*
  check for tab/shift+tab navigation
  route to focused component's keyhandlers
  return whether key was handled
  */
  function routeKeypress(key: KeyEvent): Promise<boolean> | boolean {
    // handle special case
    if (key.name === "tab") {
      if (key.shift) {
        focusPrevious();
      } else {
        focusNext();
      }
      return false;
    }

    const component = getFocusedComponentDef();
    if (!component) {
      console.warn(`[FocusManager] no focused component`);
      return false;
    }

    const keyName = buildKeyName(key);

    console.log(`[FocusManager] focused component: ${component.id}`);
    console.log(`[FocusManager] routing key ${keyName} to ${component?.id}`);

    const handlers = component?.keyHandlers;
    if (handlers instanceof Map) {
      const handler = handlers.get(keyName);
      if (handler) {
        return handler(key);
      }
    }
    return false;
  }

  // Build a standardized key name from KeyEvent
  // ex. - {name: s, ctrl: true} - "ctrl+s"
  function buildKeyName(key: KeyEvent): string {
    const parts: string[] = [];

    if (key.ctrl) parts.push("ctrl");
    if (key.shift && key.name !== "tab") parts.push("shift");
    if (key.name === "alt") parts.push("alt");

    parts.push(key.name);

    return parts.join("+");
  }

  return {
    registerComponent,
    setFocusedComponent,
    getFocusedComponent,
    routeKeypress,
    focusNext,
    focusPrevious,
  };
}

export type FocusManager = ReturnType<typeof createFocusManager>;
