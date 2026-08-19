import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/supabase/queries";
import {
  getLatestSessionStatus,
  getIndividualSkillSeries,
  getPracticeHistory,
  generateInsights,
  SKILL_TREND_LABELS,
  type GoalieTrendData,
} from "@/lib/goalieTrends";
import { GoalieDetailView } from "@/components/coach/GoalieDetailView";
import { IncompleteCheckinBadge } from "@/components/ui/IncompleteCheckinBadge";

// GoalieTrendView requires a `data` prop, but this page overrides every
// field it would supply (before-ice is hidden, practice series and
// insights both come from the coach-specific skill list below) — so no
// need to fetch getGoalieTrendData just to discard its result.
const EMPTY_TREND_DATA: GoalieTrendData = {
  insights: [],
  hasEnoughData: false,
  preSeries: [],
  postCategorySeries: [],
};

export default async function CoachGoalieDetailPage({
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

  const [latest, individualSkills, sessions] = await Promise.all([
    getLatestSessionStatus(supabase, goalieId),
    getIndividualSkillSeries(supabase, goalieId),
    getPracticeHistory(supabase, goalieId),
  ]);

  const skillSeries = individualSkills.filter(
    (s) => SKILL_TREND_LABELS.has(s.label) && s.scores.length >= 2,
  );
  const insightsOverride = generateInsights(skillSeries);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div>
        <Link href="/dashboard" className="text-sm font-medium text-black/50 hover:text-black">
          ← Dashboard
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl">{goalieMembership.profiles?.full_name ?? "Goalie"}</h1>
            {latest?.status === "pre_only" && <IncompleteCheckinBadge />}
          </div>
          <Link
            href={`/coach/goalies/${goalieId}/weekly-review`}
            className="inline-flex items-center justify-center border border-black/15 bg-white px-3 py-1.5 text-sm font-medium uppercase tracking-wide text-black hover:bg-black/5"
          >
            Weekly review
          </Link>
        </div>
      </div>

      <GoalieDetailView
        data={EMPTY_TREND_DATA}
        showBeforeIce={false}
        practicePerformanceSeries={skillSeries}
        insightsOverride={insightsOverride}
        sessions={sessions}
      />
    </div>
  );
}
