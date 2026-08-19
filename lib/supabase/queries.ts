import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export async function getMembership(supabase: Client, profileId: string) {
  const { data } = await supabase
    .from("team_memberships")
    .select("team_id, role")
    .eq("profile_id", profileId)
    .maybeSingle();
  return data;
}

export async function getActiveSeason(supabase: Client, teamId: string) {
  const { data } = await supabase
    .from("seasons")
    .select("id, name, starts_on")
    .eq("team_id", teamId)
    .eq("is_active", true)
    .maybeSingle();
  return data;
}
