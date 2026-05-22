import { join } from "node:path";
import { homedir } from "node:os";

type TermilogDirectory = {
  TERMILOG_DIR: string;
  JOURNAL_INDEX_PATH: string;
};

const getTermilogDirectoryPaths = (): TermilogDirectory => {
  const platform = process.platform;
  let TERMILOG_DIR = "";
  let JOURNAL_INDEX_PATH = "";

  if (platform == "win32") {
    ((TERMILOG_DIR = join(homedir(), "Termilog")),
      (JOURNAL_INDEX_PATH = join(
        homedir(),
        "AppData/Roaming",
        ".termilog",
        "index.json",
      )));
  } else if (platform == "linux") {
    ((TERMILOG_DIR = join(homedir(), "termilog")),
      (JOURNAL_INDEX_PATH = join(homedir(), ".config/termilog", "index.json")));
  }
  if (!TERMILOG_DIR || !JOURNAL_INDEX_PATH) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  return {
    TERMILOG_DIR,
    JOURNAL_INDEX_PATH,
  };
};

const paths = getTermilogDirectoryPaths();
export const TERMILOG_DIR = paths.TERMILOG_DIR;
export const JOURNAL_INDEX_PATH = paths.JOURNAL_INDEX_PATH;
