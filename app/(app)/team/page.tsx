import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("team_memberships")
    .select("team_id, role")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!membership) {
    return <p className="text-sm text-black/60">You&apos;re not on a team yet.</p>;
  }

  const { data: team } = await supabase
    .from("teams")
    .select("name, invite_code")
    .eq("id", membership.team_id)
    .single();

  const { data: members } = await supabase
    .from("team_memberships")
    .select("role, profiles(full_name)")
    .eq("team_id", membership.team_id);

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-3xl">{team?.name}</h1>
      </div>

      {membership.role === "coach" && team && (
        <Card kicker="Invite code">
          <p className="font-heading text-2xl font-semibold tracking-widest text-black">
            {team.invite_code}
          </p>
          <p className="mt-2 text-sm text-black/50">
            Share this with your goalies so they can join the team.
          </p>
        </Card>
      )}

      <Card kicker="Team members">
        <ul className="flex flex-col gap-1">
          {members?.map((m, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-black">{m.profiles?.full_name}</span>
              <span className="capitalize text-black/50">{m.role}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
