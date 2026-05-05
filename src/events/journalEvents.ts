import { EventEmitter } from "./eventEmitter";

export const JournalEventType = {
  INDEX_UPDATED: "journal:index-updated",
  JOURNAL_SAVED: "journal:saved",
  JOURNAL_DELETED: "journal:deleted",
} as const;

export const journalEvents = new EventEmitter();
