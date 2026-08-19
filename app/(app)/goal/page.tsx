import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/ButtonLink";

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
        <p className="mb-4 text-sm text-black/60">
          You haven&apos;t completed your season onboarding yet.
        </p>
        <ButtonLink href="/goal/edit">Get started</ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">My Year</h1>
        <Link href="/goal/edit" className="text-sm font-medium text-brand hover:underline">
          Edit
        </Link>
      </div>

      <Card kicker="Development profile">
        <div className="flex flex-col gap-3">
          {SKILLS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3 text-sm">
              <span className="w-36 flex-none text-black/70">{label}</span>
              <div className="h-2 flex-1 border border-black/10">
                <div
                  className="h-full bg-brand"
                  style={{ width: `${(goal[key] / 10) * 100}%` }}
                />
              </div>
              <span className="w-10 flex-none text-right font-semibold text-black">
                {goal[key]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card kicker="Reflection">
        <p className="mb-2 text-sm font-medium text-black/50">Holding your game back</p>
        <ul className="mb-4 list-disc pl-5 text-black">
          {goal.holding_back.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <p className="mb-2 text-sm font-medium text-black/50">Biggest strengths</p>
        <ul className="list-disc pl-5 text-black">
          {goal.strengths.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Card>

      <Card kicker="This season">
        <p className="text-xs font-medium text-black/50">This year I want to become</p>
        <p className="mb-3 text-black">{goal.become_statement}</p>

        <p className="text-xs font-medium text-black/50">My biggest hockey goal is</p>
        <p className="mb-3 text-black">{goal.biggest_goal}</p>

        <p className="text-xs font-medium text-black/50">By the end of the season</p>
        <p className="mb-3 text-black">{goal.season_target}</p>

        <p className="mb-2 text-xs font-medium text-black/50">Top 3 development priorities</p>
        <ul className="list-disc pl-5 text-black">
          {goal.top_priorities.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        {goal.priorities_reason && (
          <>
            <p className="mt-3 text-xs font-medium text-black/50">Why</p>
            <p className="text-black">{goal.priorities_reason}</p>
          </>
        )}
      </Card>
    </div>
  );
}
