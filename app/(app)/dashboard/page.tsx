import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/supabase/queries";
import { FOCUS_AREA_LABELS } from "@/lib/validation/schemas";
import { getOverallTrendDirection, getLatestSessionStatus } from "@/lib/goalieTrends";
import { TrendDot } from "@/components/ui/TrendDot";
import { IncompleteCheckinBadge } from "@/components/ui/IncompleteCheckinBadge";

const PRE_RATINGS = [
  { key: "pre_energy", label: "Energy" },
  { key: "pre_confidence", label: "Confidence" },
  { key: "pre_focus", label: "Focus" },
  { key: "pre_body", label: "Body" },
  { key: "pre_mental_readiness", label: "Mental readiness" },
] as const;

const POST_RATING_GROUPS = [
  {
    title: "Technical",
    fields: [
      { key: "post_tracking", label: "Tracking" },
      { key: "post_skating_edges", label: "Skating / edges" },
      { key: "post_movement_control", label: "Movement / control" },
      { key: "post_positioning", label: "Positioning" },
      { key: "post_rebound_control", label: "Rebound control" },
      { key: "post_hands", label: "Hands" },
      { key: "post_stick", label: "Stick" },
    ],
  },
  {
    title: "Mental",
    fields: [
      { key: "post_focus", label: "Focus" },
      { key: "post_confidence", label: "Confidence" },
      { key: "post_compete", label: "Compete" },
    ],
  },
  {
    title: "IQ",
    fields: [
      { key: "post_reads", label: "Reads / recognition" },
      { key: "post_decision_making", label: "Decision making" },
    ],
  },
] as const;

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const membership = user ? await getMembership(supabase, user.id) : null;

  if (!user || !membership) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
      </div>
    );
  }

  if (membership.role === "coach") {
    const { data: memberships } = await supabase
      .from("team_memberships")
      .select("profile_id, profiles(full_name)")
      .eq("team_id", membership.team_id)
      .eq("role", "goalie");

    const goalies = memberships ?? [];

    const rows = await Promise.all(
      goalies.map(async (g) => {
        const [direction, latest] = await Promise.all([
          getOverallTrendDirection(supabase, g.profile_id),
          getLatestSessionStatus(supabase, g.profile_id),
        ]);
        return {
          id: g.profile_id,
          fullName: g.profiles?.full_name ?? "Unknown",
          direction,
          incomplete: latest?.status === "pre_only",
        };
      }),
    );

    return (
      <div className="flex w-full max-w-lg flex-col gap-6">
        <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-zinc-500">Goalies</p>
          {rows.length === 0 ? (
            <p className="text-sm text-zinc-500">No goalies on your team yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <Link
                  key={row.id}
                  href={`/coach/goalies/${row.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:bg-zinc-50"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-900">{row.fullName}</span>
                      {row.incomplete && <IncompleteCheckinBadge />}
                    </div>
                    <TrendDot direction={row.direction} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const { data: sessions } = await supabase
    .from("practice_sessions")
    .select(
      "id, practice_date, created_at, status, pre_energy, pre_confidence, pre_focus, pre_body, pre_mental_readiness, pre_focus_area, pre_one_thing, post_tracking, post_skating_edges, post_movement_control, post_positioning, post_rebound_control, post_hands, post_stick, post_focus, post_confidence, post_compete, post_reads, post_decision_making, post_focus_hit, post_note",
    )
    .eq("goalie_id", user.id)
    .order("practice_date", { ascending: false })
    .order("created_at", { ascending: false });

  const grouped: { date: string; entries: NonNullable<typeof sessions> }[] = [];
  for (const session of sessions ?? []) {
    const group = grouped.find((g) => g.date === session.practice_date);
    if (group) {
      group.entries.push(session);
    } else {
      grouped.push({ date: session.practice_date, entries: [session] });
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <p className="mb-1 text-sm font-medium text-zinc-500">Before ice</p>
        <p className="mb-4 text-zinc-900">Log how you&apos;re feeling before practice.</p>
        <Link
          href="/checkin/pre"
          className="inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Check in
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-zinc-500">History</p>
        {grouped.length === 0 && (
          <p className="text-sm text-zinc-500">No check-ins logged yet.</p>
        )}
        {grouped.map(({ date, entries }) => (
          <div key={date} className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-900">{formatDate(date)}</p>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">
                    {formatTime(entry.created_at)}
                  </span>
                  {entry.status === "completed" ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Completed
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Before ice only
                    </span>
                  )}
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Before ice
                  </p>
                  <p className="text-sm text-zinc-700">
                    Focus:{" "}
                    <span className="font-medium text-zinc-900">
                      {FOCUS_AREA_LABELS[
                        entry.pre_focus_area as keyof typeof FOCUS_AREA_LABELS
                      ] ?? entry.pre_focus_area}
                    </span>
                  </p>
                  <p className="text-sm text-zinc-700">
                    One thing:{" "}
                    <span className="font-medium text-zinc-900">{entry.pre_one_thing}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                    {PRE_RATINGS.map(({ key, label }) => (
                      <span key={key}>
                        {label}: <span className="font-medium text-zinc-700">{entry[key]}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {entry.status === "pre_only" ? (
                  <Link
                    href={`/checkin/post?session=${entry.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                  >
                    Log after practice
                  </Link>
                ) : (
                  <div className="mt-4 border-t border-zinc-100 pt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      After practice
                    </p>
                    <div className="flex flex-col gap-2">
                      {POST_RATING_GROUPS.map((group) => (
                        <div key={group.title} className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                          <span className="font-semibold text-zinc-600">{group.title}:</span>
                          {group.fields.map(({ key, label }) => (
                            <span key={key}>
                              {label}:{" "}
                              <span className="font-medium text-zinc-700">{entry[key]}</span>
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-zinc-700">
                      Hit one thing:{" "}
                      <span className="font-medium text-zinc-900">
                        {entry.post_focus_hit ? "Yes" : "No"}
                      </span>
                    </p>
                    {entry.post_note && (
                      <p className="mt-1 text-sm text-zinc-700">
                        Note: <span className="text-zinc-900">{entry.post_note}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
