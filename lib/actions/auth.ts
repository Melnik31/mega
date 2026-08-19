"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  signUpCoachSchema,
  signUpGoalieSchema,
  loginSchema,
} from "@/lib/validation/schemas";
import { createTeamWithCoach, joinTeamByInviteCode } from "@/lib/actions/team";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function signUpCoach(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpCoachSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    teamName: formData.get("teamName"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { fullName, email, password, teamName } = parsed.data;

  const supabase = await createClient();
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "coach" } },
  });
  if (signUpError) {
    return { error: signUpError.message };
  }

  try {
    await createTeamWithCoach(teamName);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create team",
    };
  }

  redirect("/dashboard");
}

export async function signUpGoalie(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpGoalieSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    inviteCode: formData.get("inviteCode"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { fullName, email, password, inviteCode } = parsed.data;

  const supabase = await createClient();
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "goalie" } },
  });
  if (signUpError) {
    return { error: signUpError.message };
  }

  try {
    await joinTeamByInviteCode(inviteCode);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Invalid invite code",
    };
  }

  redirect("/goal/edit");
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { email, password } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error.message };
  }

  const membership = await getMembership(supabase, data.user.id);

  if (!membership) {
    return { error: "Your account isn't linked to a team yet." };
  }

  if (membership.role === "coach") {
    redirect("/dashboard");
  }

  const season = await getActiveSeason(supabase, membership.team_id);

  const { data: goal } = season
    ? await supabase
        .from("season_goals")
        .select("id")
        .eq("season_id", season.id)
        .eq("goalie_id", data.user.id)
        .maybeSingle()
    : { data: null };

  redirect(goal ? "/dashboard" : "/goal/edit");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
