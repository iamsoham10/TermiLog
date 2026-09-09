import type { JournalMetadata } from "./types/journal";
import {
  addDays,
  addDaysToKey,
  nextDay,
  prevDay,
  startOfWeekSunday,
  toLocalDateKey,
} from "./utils/dateUtils";
import { getDayLabel, getMoodEmoji, getMoodScore, WEEK_DAY_LABELS } from "./utils/moodUtils";

export type DashboardStats = {
  streak: number;
  activity: ActivityGrid;
  mood: MoodChart;
};

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export type ActivityCell = {
  dateKey: string;
  count: number;
  level: ActivityLevel;
};

export type ActivityGrid = {
  weeks: number;
  columns: ActivityCell[][];
};

export type MoodChartPoint = {
  dateKey: string;
  label: string;
  score: number | null;
  emoji: string | null;
};

export type MoodChart = {
  days: number;
  points: MoodChartPoint[];
};

export type MoodRangeDays = 7 | 30;

const DEFAULT_WEEKS = 12;

export function computeStreak(journals: JournalMetadata[]): number {
  const days = new Set(journals.map((j) => toLocalDateKey(j.createdAt)));
  if (days.size === 0) return 0;

  const today = toLocalDateKey(new Date());
  const yesterday = toLocalDateKey(addDays(new Date(), -1));

  let cursor: string | null = days.has(today)
    ? today
    : days.has(yesterday)
      ? yesterday
      : null;
  if (!cursor) return 0;

  let count = 0;
  while (days.has(cursor)) {
    count++;
    cursor = prevDay(cursor);
  }
  return count;
}

function getJournalActiveDays(journal: JournalMetadata): string[] {
  const created = toLocalDateKey(journal.createdAt);
  const updated = toLocalDateKey(journal.updatedAt);
  if (created === updated) return [created];
  return [created, updated];
}

export function computeDailyActivity(
  journals: JournalMetadata[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const journal of journals) {
    for (const day of getJournalActiveDays(journal)) {
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
  }
  return counts;
}

function getLatestMoodByDay(
  journals: JournalMetadata[],
): Map<string, { mood?: string; updatedAt: string }> {
  const byDay = new Map<string, { mood?: string; updatedAt: string }>();
  for (const journal of journals) {
    const day = toLocalDateKey(journal.updatedAt);
    const existing = byDay.get(day);
    if (!existing || journal.updatedAt > existing.updatedAt) {
      byDay.set(day, { mood: journal.mood, updatedAt: journal.updatedAt });
    }
  }
  return byDay;
}

export function activityLevel(count: number): ActivityLevel {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export function getActivityGrid(
  journals: JournalMetadata[],
  weeks: number = DEFAULT_WEEKS,
): ActivityGrid {
  const dailyActivity = computeDailyActivity(journals);
  const today = new Date();
  const todayKey = toLocalDateKey(today);
  const firstWeekStart = startOfWeekSunday(
    addDays(today, -7 * (weeks - 1)),
  );

  const columns: ActivityCell[][] = [];

  for (let col = 0; col < weeks; col++) {
    const weekStart = addDays(firstWeekStart, col * 7);
    const column: ActivityCell[] = [];

    for (let row = 0; row < 7; row++) {
      const cellDate = addDays(weekStart, row);
      const dateKey = toLocalDateKey(cellDate);
      const isFuture = dateKey > todayKey;
      const count = isFuture ? 0 : (dailyActivity.get(dateKey) ?? 0);

      column.push({
        dateKey,
        count,
        level: activityLevel(count),
      });
    }

    columns.push(column);
  }

  return { weeks, columns };
}

export function getMoodChart(
  journals: JournalMetadata[],
  days: MoodRangeDays = 7,
): MoodChart {
  const moodByDay = getLatestMoodByDay(journals);
  const today = new Date();
  const todayKey = toLocalDateKey(today);
  const points: MoodChartPoint[] = [];

  if (days === 7) {
    const weekStart = startOfWeekSunday(today);

    for (let i = 0; i < 7; i++) {
      const dateKey = toLocalDateKey(addDays(weekStart, i));
      const isFuture = dateKey > todayKey;

      let score: number | null = null;
      let emoji: string | null = null;
      if (!isFuture) {
        const moodEntry = moodByDay.get(dateKey);
        emoji = getMoodEmoji(moodEntry?.mood) ?? null;
        score = getMoodScore(moodEntry?.mood);
      }

      points.push({
        dateKey,
        label: WEEK_DAY_LABELS[i] ?? "?",
        score,
        emoji,
      });
    }
  } else {
    const firstDayKey = addDaysToKey(todayKey, -(days - 1));
    let cursor = firstDayKey;

    while (cursor <= todayKey) {
      const moodEntry = moodByDay.get(cursor);
      const emoji = getMoodEmoji(moodEntry?.mood) ?? null;
      const score = getMoodScore(moodEntry?.mood);

      points.push({
        dateKey: cursor,
        label: getDayLabel(cursor, "month"),
        score,
        emoji,
      });

      cursor = nextDay(cursor);
    }
  }

  return { days, points };
}

export function getDashboardStats(
  journals: JournalMetadata[],
  weeks: number = DEFAULT_WEEKS,
  moodDays: MoodRangeDays = 7,
): DashboardStats {
  return {
    streak: computeStreak(journals),
    activity: getActivityGrid(journals, weeks),
    mood: getMoodChart(journals, moodDays),
  };
}
