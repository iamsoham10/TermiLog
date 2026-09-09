import { dateKeyToDate } from "./dateUtils";

export const MOOD_EMOJI: Record<string, string> = {
  Happy: "😊",
  Good: "🙂",
  Neutral: "😐",
  Sad: "😔",
  Angry: "😡",
};

export const MOOD_SCORE: Record<string, number> = {
  Angry: 1,
  Sad: 2,
  Neutral: 3,
  Good: 4,
  Happy: 5,
};

export const WEEK_DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function getMoodEmoji(mood: string | undefined): string | undefined {
  if (!mood) return undefined;
  return MOOD_EMOJI[mood];
}

export function getMoodScore(mood: string | undefined): number | null {
  if (!mood) return null;
  return MOOD_SCORE[mood] ?? null;
}

export function getDayLabel(
  dateKey: string,
  mode: "week" | "month",
): string {
  if (mode === "month") {
    return String(dateKeyToDate(dateKey).getDate());
  }
  const dayIndex = dateKeyToDate(dateKey).getDay();
  return WEEK_DAY_LABELS[dayIndex] ?? "?";
}
