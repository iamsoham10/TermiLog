const MIN_WEEKS = 10;
const MAX_WEEKS = 30;
const DAY_LABEL_WIDTH = 2;
const GRID_PADDING = 6;

export function computeVisibleWeeks(
  terminalWidth: number,
  cardPadding = 8,
): number {
  const available = terminalWidth - DAY_LABEL_WIDTH - cardPadding - GRID_PADDING;
  const weeks = Math.floor(available);
  return Math.max(MIN_WEEKS, Math.min(MAX_WEEKS, weeks));
}
