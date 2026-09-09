import type { Journal, JournalMetadata } from "../types/journal";

interface AppState {
  journals: JournalMetadata[];
  currentJournal: JournalMetadata | null;
  editorContent: string;
  isSaving: boolean;
  lastError: { message: string; action: string } | null;
  focusedComponent: "editor" | "sidebar" | "save-dialog" | null;
  dialogOpen: boolean;
  sidebarVisible: boolean;
}

type ActionType =
  | "JOURNAL_SELECTED"
  | "JOURNAL_SAVED"
  | "JOURNAL_LOADED"
  | "JOURNAL_DELETED"
  | "EDITOR_CONTENT_CHANGED"
  | "SAVE_ERROR"
  | "FOCUS_CHANGED"
  | "DIALOG_OPENED"
  | "DIALOG_CLOSED"
  | "JOURNALS_RELOADED"
  | "SIDEBAR_VISIBILITY_CHANGED"
  | "JOURNAL_NEW"

type ActionPayloads = {
  JOURNAL_SELECTED: string;
  JOURNAL_SAVED: JournalMetadata;
  JOURNAL_LOADED: Journal;
  JOURNAL_DELETED: string;
  EDITOR_CONTENT_CHANGED: string;
  SAVE_ERROR: string;
  FOCUS_CHANGED: "editor" | "sidebar" | "save-dialog" | null;
  DIALOG_OPENED: void;
  DIALOG_CLOSED: void;
  JOURNALS_RELOADED: JournalMetadata[];
  SIDEBAR_VISIBILITY_CHANGED: boolean;
  JOURNAL_NEW: void;
};

type UnsubscribeFn = () => void;

export function createStore() {
  let state: AppState = {
    journals: [],
    currentJournal: null,
    editorContent: "",
    isSaving: false,
    lastError: null,
    focusedComponent: null,
    dialogOpen: false,
    sidebarVisible: true
  };

  // listener map to store listener functions for each action type
  const listeners = new Map<ActionType, Set<Function>>();

  function getListeners(action: ActionType): Set<Function> {
    if (!listeners.has(action)) {
      listeners.set(action, new Set());
    }
    return listeners.get(action)!;
  }

  // state update function update the state based on action
  function updateState(action: ActionType, payload: any): AppState {
    const newState = { ...state }; // make copy of the state

    // update state based on action
    switch (action) {
      case "JOURNAL_SELECTED":
        newState.currentJournal = state.journals.find((journal) => journal.title === payload) ?? null;
        break;

      case "JOURNAL_SAVED":
        newState.currentJournal = payload;
        newState.isSaving = false;
        newState.lastError = null;
        break;

      case "JOURNAL_LOADED":
        newState.currentJournal = payload;
        newState.editorContent = payload.content;
        break;

      case "JOURNAL_DELETED":
        newState.currentJournal = null;
        newState.editorContent = "";
        break;

      case "EDITOR_CONTENT_CHANGED":
        newState.editorContent = payload; // payload is string
        break;

      case "SAVE_ERROR":
        newState.lastError = {
          message: payload,
          action: "save",
        };
        newState.isSaving = false;
        break;

      case "FOCUS_CHANGED":
        newState.focusedComponent = payload; // payload is 'editor' | 'sidebar' ...
        break;

      case "DIALOG_OPENED":
        newState.dialogOpen = true;
        break;

      case "DIALOG_CLOSED":
        newState.dialogOpen = false;
        break;

      case "JOURNALS_RELOADED":
        newState.journals = payload;
        break;

      case "SIDEBAR_VISIBILITY_CHANGED":
        newState.sidebarVisible = payload;
        break;

      case "JOURNAL_NEW":
        newState.currentJournal = null;
        newState.editorContent = "";
        break;

      default:
        const _exhaustive: never = action;
        return _exhaustive;
    }
    return newState;
  }

  // return the public API
  // this is what components will interact with
  return {
    // dispatch an event
    dispatch<T extends ActionType>(
      action: T,
      ...payload: ActionPayloads[T] extends void ? [] : [ActionPayloads[T]]
    ): void {
      const actualPayload = payload[0] as ActionPayloads[T];
      console.log(`[Store] Dispatching ${action}`);

      // update the state
      state = updateState(action, actualPayload);

      // get all the handlers
      const handlers = getListeners(action);
      handlers.forEach((handler) => {
        handler(actualPayload);
      });
    },

    // subscribe to action and return unsubscribe function
    subscribe<T extends ActionType>(
      action: T,
      handler: (payload: ActionPayloads[T]) => void,
    ): UnsubscribeFn {
      // add handler function to listeners
      const handlers = getListeners(action);
      if (!handlers.has(handler)) {
        handlers.add(handler);
      }

      return () => {
        handlers.delete(handler);
        console.log(`[Store] Unsubscribing from: ${action}`);
      };
    },

    // get current state
    getState(): AppState {
      return { ...state };
    },
  };
}

export type Store = ReturnType<typeof createStore>;
