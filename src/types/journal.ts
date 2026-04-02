export interface JournalMetadata {
  title: string;
  mood: string;
  createdAt: string;
}

export interface JournalsIndex {
  journals: JournalMetadata[];
}
