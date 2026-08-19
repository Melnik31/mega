"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { seasonGoalSchema } from "@/lib/validation/schemas";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";
import type { ActionState } from "@/lib/actions/auth";

export async function upsertSeasonGoal(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = seasonGoalSchema.safeParse({
    trackingScore: formData.get("trackingScore"),
    skatingScore: formData.get("skatingScore"),
    edgeControlScore: formData.get("edgeControlScore"),
    movementControlScore: formData.get("movementControlScore"),
    positioningScore: formData.get("positioningScore"),
    reboundControlScore: formData.get("reboundControlScore"),
    handsScore: formData.get("handsScore"),
    stickScore: formData.get("stickScore"),
    readsScore: formData.get("readsScore"),
    recoveryScore: formData.get("recoveryScore"),
    competeScore: formData.get("competeScore"),
    confidenceScore: formData.get("confidenceScore"),
    hockeyIqScore: formData.get("hockeyIqScore"),
    holdingBack1: formData.get("holdingBack1"),
    holdingBack2: formData.get("holdingBack2"),
    holdingBack3: formData.get("holdingBack3"),
    strength1: formData.get("strength1"),
    strength2: formData.get("strength2"),
    strength3: formData.get("strength3"),
    becomeStatement: formData.get("becomeStatement"),
    biggestGoal: formData.get("biggestGoal"),
    seasonTarget: formData.get("seasonTarget"),
    priority1: formData.get("priority1"),
    priority2: formData.get("priority2"),
    priority3: formData.get("priority3"),
    prioritiesReason: formData.get("prioritiesReason"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in." };
  }

  const membership = await getMembership(supabase, user.id);
  if (!membership || membership.role !== "goalie") {
    return { error: "Only goalies can set a season goal." };
  }

  const season = await getActiveSeason(supabase, membership.team_id);
  if (!season) {
    return { error: "No active season found for your team." };
  }

  const holdingBack = [data.holdingBack1, data.holdingBack2, data.holdingBack3].filter(
    (p): p is string => !!p,
  );
  const strengths = [data.strength1, data.strength2, data.strength3].filter(
    (p): p is string => !!p,
  );
  const topPriorities = [data.priority1, data.priority2, data.priority3].filter(
    (p): p is string => !!p,
  );

  const { error } = await supabase.from("season_goals").upsert(
    {
      season_id: season.id,
      goalie_id: user.id,
      tracking_score: data.trackingScore,
      skating_score: data.skatingScore,
      edge_control_score: data.edgeControlScore,
      movement_control_score: data.movementControlScore,
      positioning_score: data.positioningScore,
      rebound_control_score: data.reboundControlScore,
      hands_score: data.handsScore,
      stick_score: data.stickScore,
      reads_score: data.readsScore,
      recovery_score: data.recoveryScore,
      compete_score: data.competeScore,
      confidence_score: data.confidenceScore,
      hockey_iq_score: data.hockeyIqScore,
      holding_back: holdingBack,
      strengths: strengths,
      become_statement: data.becomeStatement,
      biggest_goal: data.biggestGoal,
      season_target: data.seasonTarget,
      top_priorities: topPriorities,
      priorities_reason: data.prioritiesReason || null,
    },
    { onConflict: "season_id,goalie_id" },
  );

  if (error) {
    return { error: error.message };
  }

  redirect("/goal");
}
