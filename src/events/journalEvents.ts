import createEventBus from "./eventBus";

export const JournalEventType = {
  INDEX_UPDATED: "journal:index-updated",
  JOURNAL_SAVED: "journal:saved",
  JOURNAL_DELETED: "journal:deleted",
  JOURNAL_SELECTED: "journal:selected",
} as const;

export const journalEvents = createEventBus();
