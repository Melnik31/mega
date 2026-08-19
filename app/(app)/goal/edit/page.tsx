import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";
import { OnboardingWizard } from "@/components/forms/OnboardingWizard";

export default async function EditGoalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const membership = await getMembership(supabase, user.id);
  if (!membership || membership.role !== "goalie") {
    redirect("/dashboard");
  }

  const season = await getActiveSeason(supabase, membership.team_id);
  if (!season) {
    return <p className="text-sm text-black/60">No active season found for your team.</p>;
  }

  const { data: existingGoal } = await supabase
    .from("season_goals")
    .select("*")
    .eq("season_id", season.id)
    .eq("goalie_id", user.id)
    .maybeSingle();

  return (
    <div className="w-full max-w-lg">
      <h1 className="mb-6 text-3xl">Season onboarding</h1>
      <OnboardingWizard
        defaultValues={
          existingGoal
            ? {
                trackingScore: existingGoal.tracking_score,
                skatingScore: existingGoal.skating_score,
                edgeControlScore: existingGoal.edge_control_score,
                movementControlScore: existingGoal.movement_control_score,
                positioningScore: existingGoal.positioning_score,
                reboundControlScore: existingGoal.rebound_control_score,
                handsScore: existingGoal.hands_score,
                stickScore: existingGoal.stick_score,
                readsScore: existingGoal.reads_score,
                recoveryScore: existingGoal.recovery_score,
                competeScore: existingGoal.compete_score,
                confidenceScore: existingGoal.confidence_score,
                hockeyIqScore: existingGoal.hockey_iq_score,
                holdingBack: existingGoal.holding_back,
                strengths: existingGoal.strengths,
                becomeStatement: existingGoal.become_statement,
                biggestGoal: existingGoal.biggest_goal,
                seasonTarget: existingGoal.season_target,
                priorities: existingGoal.top_priorities,
                prioritiesReason: existingGoal.priorities_reason,
              }
            : undefined
        }
      />
    </div>
  );
}
