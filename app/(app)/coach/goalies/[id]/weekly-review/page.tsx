import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";
import {
  getWeekStart,
  getWeeklyCategoryAverages,
  getCoachRatingsForWeek,
  getPreviousReviewWeekStart,
  getRangeCategoryAverages,
} from "@/lib/goalieTrends";
import { WeeklyRatingForm } from "@/components/forms/WeeklyRatingForm";
import { PeriodComparison, type PeriodData } from "@/components/coach/PeriodComparison";

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default async function WeeklyReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: goalieId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const membership = await getMembership(supabase, user.id);
  if (!membership || membership.role !== "coach") {
    redirect("/dashboard");
  }

  const { data: goalieMembership } = await supabase
    .from("team_memberships")
    .select("profile_id, profiles(full_name)")
    .eq("team_id", membership.team_id)
    .eq("profile_id", goalieId)
    .eq("role", "goalie")
    .maybeSingle();

  if (!goalieMembership) {
    redirect("/dashboard");
  }

  const weekStart = getWeekStart(new Date());
  const today = new Date().toISOString().slice(0, 10);

  const [averages, coachRatings, previousReviewWeekStart, season] = await Promise.all([
    getWeeklyCategoryAverages(supabase, goalieId, weekStart),
    getCoachRatingsForWeek(supabase, goalieId, weekStart),
    getPreviousReviewWeekStart(supabase, goalieId, weekStart),
    getActiveSeason(supabase, membership.team_id),
  ]);

  const hasRatingsThisWeek = Object.keys(coachRatings).length > 0;

  let periods: PeriodData[] = [];
  if (hasRatingsThisWeek) {
    const [sinceLastReview, last7, last30, seasonToDate] = await Promise.all([
      previousReviewWeekStart
        ? getRangeCategoryAverages(supabase, goalieId, previousReviewWeekStart, today)
        : Promise.resolve(null),
      getRangeCategoryAverages(supabase, goalieId, addDays(today, -6), today),
      getRangeCategoryAverages(supabase, goalieId, addDays(today, -29), today),
      season
        ? getRangeCategoryAverages(supabase, goalieId, season.starts_on, today)
        : Promise.resolve(null),
    ]);

    if (sinceLastReview) {
      periods.push({ key: "since_last_review", label: "Since last review", averages: sinceLastReview });
    }
    periods.push({ key: "last_7_days", label: "Last 7 days", averages: last7 });
    periods.push({ key: "last_30_days", label: "Last 30 days", averages: last30 });
    if (seasonToDate) {
      periods.push({ key: "season_to_date", label: "Season to date", averages: seasonToDate });
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div>
        <Link
          href={`/coach/goalies/${goalieId}`}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          ← {goalieMembership?.profiles?.full_name ?? "Goalie"}
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-zinc-900">Weekly review</h1>
        <p className="text-sm text-zinc-500">Week of {weekStart}</p>
      </div>

      {averages.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No practices logged by this goalie this week yet.
        </p>
      ) : (
        <WeeklyRatingForm
          goalieId={goalieId}
          weekStart={weekStart}
          averages={averages}
          existingRatings={coachRatings}
        />
      )}

      {periods.length > 0 && (
        <PeriodComparison periods={periods} coachRatings={coachRatings} />
      )}
    </div>
  );
}
