"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/supabase/queries";
import { RATING_CATEGORIES } from "@/lib/validation/schemas";
import type { ActionState } from "@/lib/actions/auth";

export async function submitWeeklyRatings(
  goalieId: string,
  weekStart: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in." };
  }

  const membership = await getMembership(supabase, user.id);
  if (!membership || membership.role !== "coach") {
    return { error: "Only coaches can submit weekly ratings." };
  }

  const { data: goalieMembership } = await supabase
    .from("team_memberships")
    .select("profile_id")
    .eq("team_id", membership.team_id)
    .eq("profile_id", goalieId)
    .eq("role", "goalie")
    .maybeSingle();
  if (!goalieMembership) {
    return { error: "Goalie not found on your team." };
  }

  const rows: { category_id: (typeof RATING_CATEGORIES)[number]; score: number }[] = [];
  for (const category of RATING_CATEGORIES) {
    const raw = formData.get(`score_${category}`);
    if (raw === null || raw === "") continue;

    const score = Number(raw);
    if (!Number.isInteger(score) || score < 1 || score > 10) {
      return { error: `Invalid score for one of the rated categories.` };
    }
    rows.push({ category_id: category, score });
  }

  if (rows.length > 0) {
    const { error } = await supabase.from("coach_weekly_ratings").upsert(
      rows.map((r) => ({
        coach_id: user.id,
        goalie_id: goalieId,
        week_start: weekStart,
        category_id: r.category_id,
        score: r.score,
      })),
      { onConflict: "goalie_id,week_start,category_id" },
    );
    if (error) {
      return { error: error.message };
    }
  }

  redirect(`/coach/goalies/${goalieId}/weekly-review`);
}
