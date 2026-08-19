import { createClient } from "@/lib/supabase/server";

export async function createTeamWithCoach(teamName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_team_with_coach", {
    team_name: teamName,
  });
  if (error) throw error;
  return data;
}

export async function joinTeamByInviteCode(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("join_team_by_invite_code", {
    code,
  });
  if (error) throw error;
  return data;
}
