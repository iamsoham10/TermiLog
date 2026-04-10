export interface JournalMetadata {
  journalId: string;
  title: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalsIndex {
  journals: JournalMetadata[];
}
