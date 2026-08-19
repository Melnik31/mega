import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";

const SKILLS = [
  { key: "tracking_score", label: "Tracking" },
  { key: "skating_score", label: "Skating" },
  { key: "edge_control_score", label: "Edge control" },
  { key: "movement_control_score", label: "Movement/control" },
  { key: "positioning_score", label: "Positioning" },
  { key: "rebound_control_score", label: "Rebound control" },
  { key: "hands_score", label: "Hands" },
  { key: "stick_score", label: "Stick" },
  { key: "reads_score", label: "Reads" },
  { key: "recovery_score", label: "Recovery" },
  { key: "compete_score", label: "Compete" },
  { key: "confidence_score", label: "Confidence" },
  { key: "hockey_iq_score", label: "Hockey IQ" },
] as const;

export default async function GoalPage() {
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
  const goal = season
    ? (
        await supabase
          .from("season_goals")
          .select("*")
          .eq("season_id", season.id)
          .eq("goalie_id", user.id)
          .maybeSingle()
      ).data
    : null;

  if (!goal) {
    return (
      <div className="w-full max-w-lg">
        <p className="mb-4 text-sm text-zinc-600">
          You haven&apos;t completed your season onboarding yet.
        </p>
        <Link
          href="/goal/edit"
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Get started
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">My Year</h1>
        <Link href="/goal/edit" className="text-sm font-medium text-zinc-600 underline">
          Edit
        </Link>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-zinc-500">Self-rating</p>
        <div className="flex flex-col gap-2">
          {SKILLS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-zinc-700">{label}</span>
              <span className="font-semibold text-zinc-900">{goal[key]}/10</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-zinc-500">Holding your game back</p>
        <ul className="mb-4 list-disc pl-5 text-zinc-900">
          {goal.holding_back.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <p className="mb-2 text-sm font-medium text-zinc-500">Biggest strengths</p>
        <ul className="list-disc pl-5 text-zinc-900">
          {goal.strengths.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <p className="mb-3 text-sm font-medium text-zinc-500">MY YEAR</p>

        <p className="text-xs font-medium text-zinc-500">This year I want to become</p>
        <p className="mb-3 text-zinc-900">{goal.become_statement}</p>

        <p className="text-xs font-medium text-zinc-500">My biggest hockey goal is</p>
        <p className="mb-3 text-zinc-900">{goal.biggest_goal}</p>

        <p className="text-xs font-medium text-zinc-500">By the end of the season</p>
        <p className="mb-3 text-zinc-900">{goal.season_target}</p>

        <p className="mb-2 text-xs font-medium text-zinc-500">Top 3 development priorities</p>
        <ul className="list-disc pl-5 text-zinc-900">
          {goal.top_priorities.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        {goal.priorities_reason && (
          <>
            <p className="mt-3 text-xs font-medium text-zinc-500">Why</p>
            <p className="text-zinc-900">{goal.priorities_reason}</p>
          </>
        )}
      </div>
    </div>
  );
}
