export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today ?? new Date().toISOString().slice(0, 10);

  // Deduplicate
  const unique = Array.from(new Set(completions));

  if (!unique.includes(todayDate)) return 0;

  // Sort descending
  const sorted = unique.slice().sort((a, b) => (a > b ? -1 : 1));

  let streak = 0;
  let current = todayDate;

  for (const date of sorted) {
    if (date === current) {
      streak++;
      // Move to previous day
      const d = new Date(current + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - 1);
      current = d.toISOString().slice(0, 10);
    } else if (date < current) {
      // Gap - stop
      break;
    }
  }

  return streak;
}