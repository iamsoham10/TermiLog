/** Local calendar date key: YYYY-MM-DD */
export function toLocalDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateKeyToDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year!, month! - 1, day!);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addDaysToKey(dateKey: string, days: number): string {
  return toLocalDateKey(addDays(dateKeyToDate(dateKey), days));
}

export function prevDay(dateKey: string): string {
  return addDaysToKey(dateKey, -1);
}

export function nextDay(dateKey: string): string {
  return addDaysToKey(dateKey, 1);
}

export function startOfWeekSunday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}
