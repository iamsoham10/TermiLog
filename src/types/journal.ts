export interface JournalMetadata {
  filename: string;
  title: string;
  mood: string;
  createdAt: string;
}

export interface JournalsIndex {
  journals: JournalMetadata[];
}
