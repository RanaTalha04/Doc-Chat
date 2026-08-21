const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < MIN) return 'just now';
  if (diff < HOUR) {
    const m = Math.round(diff / MIN);
    return `${m} min${m === 1 ? '' : 's'} ago`;
  }
  if (diff < DAY) {
    const h = Math.round(diff / HOUR);
    return `${h} hour${h === 1 ? '' : 's'} ago`;
  }
  if (diff < 7 * DAY) {
    const d = Math.round(diff / DAY);
    return `${d} day${d === 1 ? '' : 's'} ago`;
  }
  if (diff < 30 * DAY) {
    const w = Math.round(diff / (7 * DAY));
    return `${w} week${w === 1 ? '' : 's'} ago`;
  }
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
