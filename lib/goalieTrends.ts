import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import {
  classifyTrend,
  compareTrends,
  describeTrend,
  percentChange,
  type CategoryTrend,
  type TrendDirection,
} from "@/lib/trends";
import { RATING_CATEGORIES, RATING_CATEGORY_LABELS } from "@/lib/validation/schemas";

type Client = SupabaseClient<Database>;

export const PRE_METRICS = [
  { key: "pre_energy", label: "Energy" },
  { key: "pre_confidence", label: "Confidence" },
  { key: "pre_focus", label: "Focus" },
  { key: "pre_body", label: "Body" },
  { key: "pre_mental_readiness", label: "Mental readiness" },
] as const;

export const POST_CATEGORY_COLUMNS = {
  Technical: [
    "post_tracking",
    "post_skating_edges",
    "post_movement_control",
    "post_positioning",
    "post_rebound_control",
    "post_hands",
    "post_stick",
  ],
  Mental: ["post_focus", "post_confidence", "post_compete"],
  IQ: ["post_reads", "post_decision_making"],
} as const;

export const ALL_POST_RATING_COLUMNS = Object.values(POST_CATEGORY_COLUMNS).flat();

const TREND_SELECT_COLUMNS =
  "status, pre_energy, pre_confidence, pre_focus, pre_body, pre_mental_readiness, post_tracking, post_skating_edges, post_movement_control, post_positioning, post_rebound_control, post_hands, post_stick, post_focus, post_confidence, post_compete, post_reads, post_decision_making";

export interface GoalieTrendData {
  insights: string[];
  hasEnoughData: boolean;
  preSeries: CategoryTrend[];
  postCategorySeries: CategoryTrend[];
}

export async function getGoalieTrendData(
  supabase: Client,
  goalieId: string,
): Promise<GoalieTrendData> {
  const { data: sessions } = await supabase
    .from("practice_sessions")
    .select(TREND_SELECT_COLUMNS)
    .eq("goalie_id", goalieId)
    .order("practice_date", { ascending: true })
    .order("created_at", { ascending: true });

  const rows = sessions ?? [];

  const preSeries: CategoryTrend[] = PRE_METRICS.map(({ key, label }) => ({
    label,
    scores: rows.map((r) => r[key]).filter((v): v is number => v != null),
  }));

  const completed = rows.filter((r) => r.status === "completed");
  const postSeries: CategoryTrend[] = Object.entries(POST_CATEGORY_COLUMNS).map(
    ([label, columns]) => ({
      label,
      scores: completed
        .map((r) => {
          const values = columns.map((c) => r[c as keyof typeof r] as number | null);
          if (values.some((v) => v == null)) return null;
          const numbers = values as number[];
          return numbers.reduce((sum, v) => sum + v, 0) / numbers.length;
        })
        .filter((v): v is number => v != null),
    }),
  );

  const allSeries = [...preSeries, ...postSeries].filter((s) => s.scores.length >= 2);

  const rankedIndividual = [...allSeries].sort(
    (a, b) => Math.abs(percentChange(b.scores)) - Math.abs(percentChange(a.scores)),
  );

  const insights: string[] = rankedIndividual
    .slice(0, 3)
    .map((s) => describeTrend(s.label, classifyTrend(s.scores), s.scores.length));

  const comparableCategories = postSeries.filter((s) => s.scores.length >= 2);
  if (comparableCategories.length >= 2) {
    let bestPair: [CategoryTrend, CategoryTrend] | null = null;
    let bestDiff = -1;
    for (let i = 0; i < comparableCategories.length; i++) {
      for (let j = i + 1; j < comparableCategories.length; j++) {
        const diff = Math.abs(
          percentChange(comparableCategories[i].scores) -
            percentChange(comparableCategories[j].scores),
        );
        if (diff > bestDiff) {
          bestDiff = diff;
          bestPair = [comparableCategories[i], comparableCategories[j]];
        }
      }
    }
    if (bestPair) {
      insights.push(compareTrends(bestPair[0], bestPair[1]));
    }
  }

  return {
    insights,
    hasEnoughData: insights.length >= 2,
    preSeries: preSeries.filter((s) => s.scores.length >= 2),
    postCategorySeries: comparableCategories,
  };
}

/**
 * A single overall direction for a goalie, used for the roster-list trend
 * dot: the per-session average across all 12 post-practice rating columns,
 * classified. Returns null when there aren't at least 2 completed sessions
 * to compare.
 */
export async function getOverallTrendDirection(
  supabase: Client,
  goalieId: string,
): Promise<TrendDirection | null> {
  const { data: sessions } = await supabase
    .from("practice_sessions")
    .select(ALL_POST_RATING_COLUMNS.join(", "))
    .eq("goalie_id", goalieId)
    .eq("status", "completed")
    .order("practice_date", { ascending: true })
    .order("created_at", { ascending: true });

  const rows = (sessions ?? []) as unknown as Record<string, number | null>[];

  const scores = rows
    .map((r) => {
      const values = ALL_POST_RATING_COLUMNS.map((c) => r[c]);
      if (values.some((v) => v == null)) return null;
      const numbers = values as number[];
      return numbers.reduce((sum, v) => sum + v, 0) / numbers.length;
    })
    .filter((v): v is number => v != null);

  if (scores.length < 2) return null;
  return classifyTrend(scores);
}

export interface LatestSessionStatus {
  status: "completed" | "pre_only";
  practiceDate: string;
}

export async function getLatestSessionStatus(
  supabase: Client,
  goalieId: string,
): Promise<LatestSessionStatus | null> {
  const { data } = await supabase
    .from("practice_sessions")
    .select("status, practice_date")
    .eq("goalie_id", goalieId)
    .order("practice_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return { status: data.status, practiceDate: data.practice_date };
}

// ============================================================
// Coach weekly ratings
// ============================================================

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `date`, as an ISO YYYY-MM-DD string. */
export function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diffFromMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffFromMonday);
  return toISODate(d);
}

export interface CategoryAverage {
  category: (typeof RATING_CATEGORIES)[number];
  label: string;
  average: number;
  count: number;
}

/**
 * Averages each of the 12 post-practice rating columns across a goalie's
 * completed sessions within an inclusive date range. Only categories with
 * at least one data point are returned (post_* columns are all-or-nothing
 * per completed session, so in practice this is "all 12, or none").
 */
export async function getRangeCategoryAverages(
  supabase: Client,
  goalieId: string,
  startISO: string,
  endISO: string,
): Promise<CategoryAverage[]> {
  const columns = RATING_CATEGORIES.map((c) => `post_${c}`);
  const { data: sessions } = await supabase
    .from("practice_sessions")
    .select(columns.join(", "))
    .eq("goalie_id", goalieId)
    .eq("status", "completed")
    .gte("practice_date", startISO)
    .lte("practice_date", endISO);

  const rows = (sessions ?? []) as unknown as Record<string, number | null>[];
  if (rows.length === 0) return [];

  const results: CategoryAverage[] = [];
  for (const category of RATING_CATEGORIES) {
    const column = `post_${category}`;
    const values = rows.map((r) => r[column]).filter((v): v is number => v != null);
    if (values.length === 0) continue;
    results.push({
      category,
      label: RATING_CATEGORY_LABELS[category],
      average: values.reduce((sum, v) => sum + v, 0) / values.length,
      count: values.length,
    });
  }
  return results;
}

export async function getWeeklyCategoryAverages(
  supabase: Client,
  goalieId: string,
  weekStartISO: string,
): Promise<CategoryAverage[]> {
  const weekEnd = new Date(`${weekStartISO}T00:00:00`);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return getRangeCategoryAverages(supabase, goalieId, weekStartISO, toISODate(weekEnd));
}

/** Whatever the coach has already submitted for this goalie/week. */
export async function getCoachRatingsForWeek(
  supabase: Client,
  goalieId: string,
  weekStartISO: string,
): Promise<Partial<Record<(typeof RATING_CATEGORIES)[number], number>>> {
  const { data } = await supabase
    .from("coach_weekly_ratings")
    .select("category_id, score")
    .eq("goalie_id", goalieId)
    .eq("week_start", weekStartISO);

  const map: Partial<Record<(typeof RATING_CATEGORIES)[number], number>> = {};
  for (const row of data ?? []) {
    map[row.category_id] = row.score;
  }
  return map;
}

/** Most recent week_start with any coach rating, strictly before `beforeWeekStartISO`. */
export async function getPreviousReviewWeekStart(
  supabase: Client,
  goalieId: string,
  beforeWeekStartISO: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("coach_weekly_ratings")
    .select("week_start")
    .eq("goalie_id", goalieId)
    .lt("week_start", beforeWeekStartISO)
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.week_start ?? null;
}
