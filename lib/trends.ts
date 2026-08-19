export type TrendDirection = "up" | "down" | "flat";

export const TREND_THRESHOLD = 0.08; // 8%

export const DIRECTION_COLOR: Record<TrendDirection, string> = {
  up: "#0ca30c",
  down: "#ec835a",
  flat: "#8a8a86",
};

export const DIRECTION_ARROW: Record<TrendDirection, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

export const DIRECTION_LABEL: Record<TrendDirection, string> = {
  up: "Up",
  down: "Down",
  flat: "Flat",
};

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Percent change between the average of the first half and the average of
 * the second half of an ordered (oldest-first) array of scores. The first
 * half is the earlier floor(n/2) entries; the second half gets the
 * remainder, so an odd-length array is recency-weighted toward "second".
 */
export function percentChange(scores: number[]): number {
  if (scores.length < 2) return 0;

  const mid = Math.floor(scores.length / 2);
  const firstAvg = average(scores.slice(0, mid));
  const secondAvg = average(scores.slice(mid));

  if (firstAvg === 0) return secondAvg === 0 ? 0 : 1;
  return (secondAvg - firstAvg) / firstAvg;
}

export function classifyTrend(scores: number[]): TrendDirection {
  const change = percentChange(scores);
  if (change >= TREND_THRESHOLD) return "up";
  if (change <= -TREND_THRESHOLD) return "down";
  return "flat";
}

export function describeTrend(
  label: string,
  direction: TrendDirection,
  sampleSize: number,
): string {
  switch (direction) {
    case "up":
      return `${label} has been trending up over your last ${sampleSize} check-ins.`;
    case "down":
      return `${label} has been trending down over your last ${sampleSize} check-ins — worth a closer look.`;
    case "flat":
      return `${label} has stayed steady over your last ${sampleSize} check-ins.`;
  }
}

export interface CategoryTrend {
  label: string;
  scores: number[];
}

export function compareTrends(a: CategoryTrend, b: CategoryTrend): string {
  const dirA = classifyTrend(a.scores);
  const dirB = classifyTrend(b.scores);

  if (dirA === dirB) {
    if (dirA === "flat") {
      return `${a.label} and ${b.label} have both stayed steady recently.`;
    }
    return `${a.label} and ${b.label} are both trending ${dirA}.`;
  }

  if (dirA === "flat") {
    return `${b.label} is trending ${dirB} while ${a.label} has stayed steady.`;
  }
  if (dirB === "flat") {
    return `${a.label} is trending ${dirA} while ${b.label} has stayed steady.`;
  }

  // one up, one down
  const [up, down] = dirA === "up" ? [a, b] : [b, a];
  return `${up.label} is trending up while ${down.label} is trending down — worth exploring.`;
}
