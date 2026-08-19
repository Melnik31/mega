"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { preCheckinSchema, postCheckinSchema } from "@/lib/validation/schemas";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";
import type { ActionState } from "@/lib/actions/auth";

export async function startPracticeSession(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = preCheckinSchema.safeParse({
    energy: formData.get("energy"),
    confidence: formData.get("confidence"),
    focus: formData.get("focus"),
    body: formData.get("body"),
    mentalReadiness: formData.get("mentalReadiness"),
    focusArea: formData.get("focusArea"),
    oneThing: formData.get("oneThing"),
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
    return { error: "Only goalies can check in." };
  }

  const season = await getActiveSeason(supabase, membership.team_id);
  if (!season) {
    return { error: "No active season found for your team." };
  }

  const { error } = await supabase.from("practice_sessions").insert({
    season_id: season.id,
    goalie_id: user.id,
    status: "pre_only",
    pre_energy: data.energy,
    pre_confidence: data.confidence,
    pre_focus: data.focus,
    pre_body: data.body,
    pre_mental_readiness: data.mentalReadiness,
    pre_focus_area: data.focusArea,
    pre_one_thing: data.oneThing,
    pre_submitted_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function submitPostCheckin(
  sessionId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = postCheckinSchema.safeParse({
    tracking: formData.get("tracking"),
    skatingEdges: formData.get("skatingEdges"),
    movementControl: formData.get("movementControl"),
    positioning: formData.get("positioning"),
    reboundControl: formData.get("reboundControl"),
    hands: formData.get("hands"),
    stick: formData.get("stick"),
    focus: formData.get("focus"),
    confidence: formData.get("confidence"),
    compete: formData.get("compete"),
    reads: formData.get("reads"),
    decisionMaking: formData.get("decisionMaking"),
    focusHit: formData.get("focusHit"),
    note: formData.get("note"),
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

  const { error } = await supabase
    .from("practice_sessions")
    .update({
      status: "completed",
      post_tracking: data.tracking,
      post_skating_edges: data.skatingEdges,
      post_movement_control: data.movementControl,
      post_positioning: data.positioning,
      post_rebound_control: data.reboundControl,
      post_hands: data.hands,
      post_stick: data.stick,
      post_focus: data.focus,
      post_confidence: data.confidence,
      post_compete: data.compete,
      post_reads: data.reads,
      post_decision_making: data.decisionMaking,
      post_focus_hit: data.focusHit,
      post_note: data.note || null,
      post_submitted_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("goalie_id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
