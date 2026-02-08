export const TARGET = new Date("2026-05-21T05:00:00-03:00");

export function getDaysLeft(): number {
  const now = new Date();
  const diff = TARGET.getTime() - now.getTime();
  if (diff <= 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
