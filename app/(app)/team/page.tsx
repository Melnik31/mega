import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    return <p className="text-sm text-zinc-600">You&apos;re not on a team yet.</p>;
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
        <h1 className="text-xl font-semibold text-zinc-900">{team?.name}</h1>
      </div>

      {membership.role === "coach" && team && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Invite code</p>
          <p className="mt-1 text-2xl font-mono font-semibold tracking-widest text-zinc-900">
            {team.invite_code}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Share this with your goalies so they can join the team.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-zinc-700">Team members</p>
        <ul className="flex flex-col gap-1">
          {members?.map((m, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-zinc-900">{m.profiles?.full_name}</span>
              <span className="capitalize text-zinc-500">{m.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
