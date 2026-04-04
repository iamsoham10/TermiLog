import { readJournalNamesFromIndex } from "./journalStorage";

export const fileSearch = (fileName: string): string[] => {
  const journalNames = readJournalNamesFromIndex();
  const results = journalNames.filter((files) => files.includes(fileName));
  return results;
};
