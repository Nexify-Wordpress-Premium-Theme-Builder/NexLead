const TREND_DAYS = 14;

export function getTrendDayKeys(days = TREND_DAYS): string[] {
  const keys: string[] = [];
  const now = new Date();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    keys.push(date.toISOString().slice(0, 10));
  }

  return keys;
}

export function countRecordsByDay(
  records: Array<{ created_at: string }>,
  days = TREND_DAYS,
): number[] {
  const keys = getTrendDayKeys(days);
  const counts = new Map(keys.map((key) => [key, 0]));

  for (const record of records) {
    const day = record.created_at.slice(0, 10);

    if (counts.has(day)) {
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
  }

  return keys.map((key) => counts.get(key) ?? 0);
}

export function formatTrendLabel(dayKey: string): string {
  const date = new Date(`${dayKey}T12:00:00`);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export function hasTrendData(values: number[]): boolean {
  return values.some((value) => value > 0);
}

export function averageRounded(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return Math.round(sum / values.length);
}
