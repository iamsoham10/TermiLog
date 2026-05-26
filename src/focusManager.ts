import { KeyEvent } from "@opentui/core";

/*
FocusManager - Keyboard Routing

Manages:
- which component is focused
- routing keypress events to focused component
- tab/shift-tab navigation between components

Component register themselves and declare their keyHandlers map
*/

export interface ComponentDefintion {
  id: string;
  keyHandlers: Map<string, (key: KeyEvent) => boolean>;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function createFocusManager() {
  let focusedComponentId: string = "editor";
  const components = new Map<string, ComponentDefintion>();
  let focusOrder: string[] = [];

  // register component - called during page creation
  function registerComponent(component: ComponentDefintion): void {
    components.set(component.id, component);

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
  function getFocusedComponentDef(): ComponentDefintion | undefined {
    return components.get(focusedComponentId);
  }

  // focus next component - rotate through focus order
  function focusNext(): void {
    if (focusOrder.length === 0) return;
    const currentIndex = focusOrder.indexOf(focusedComponentId);
    const nextIndex = (currentIndex + 1) % focusOrder.length;
    setFocusedComponent(focusOrder[nextIndex]!);
  }

  /**
   * Focus previous component (Shift+Tab key)
   * Rotates backwards through focusOrder array circularly
   */
  function focusPrevious(): void {
    if (focusOrder.length === 0) return;
    const currentIndex = focusOrder.indexOf(focusedComponentId);

    // If not found or at start, wrap to end
    // (currentIndex - 1 + length) ensures we get positive number
    const prevIndex =
      (currentIndex - 1 + focusOrder.length) % focusOrder.length;

    setFocusedComponent(focusOrder[prevIndex]!);
  }
}
