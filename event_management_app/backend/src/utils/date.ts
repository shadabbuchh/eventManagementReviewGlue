// src/utils/date.ts
// Return the current time as an ISO‑8601 string.
export const isoNow = () => new Date().toISOString();

// Calculate whole‑day distance between two dates (UTC).
export function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.round(ms / 86_400_000); // 86 400 000 ms in a day
}
