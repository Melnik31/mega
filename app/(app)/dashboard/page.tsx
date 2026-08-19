import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/supabase/queries";
import {
  getOverallTrendDirection,
  getLatestSessionStatus,
  getPracticeHistory,
} from "@/lib/goalieTrends";
import { TrendDot } from "@/components/ui/TrendDot";
import { IncompleteCheckinBadge } from "@/components/ui/IncompleteCheckinBadge";
import { PracticeHistory } from "@/components/dashboard/PracticeHistory";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const membership = user ? await getMembership(supabase, user.id) : null;

  if (!user || !membership) {
    return (
      <div>
        <h1 className="text-3xl">Dashboard</h1>
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
        <h1 className="text-3xl">Dashboard</h1>

        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand">
            Goalies
          </p>
          {rows.length === 0 ? (
            <p className="text-sm text-black/50">No goalies on your team yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <Link
                  key={row.id}
                  href={`/coach/goalies/${row.id}`}
                  className="flex items-center justify-between border border-black/10 bg-white p-4 hover:border-brand/50"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-black">{row.fullName}</span>
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

  const sessions = await getPracticeHistory(supabase, user.id);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Ready for the Ice?</h1>
          <p className="mt-1 max-w-xl text-sm text-black/60">
            Log your focus area, set your &quot;one thing&quot; objective, and complete your rapid
            readiness check-in before you step onto the rink.
          </p>
        </div>
        <Link
          href="/checkin/pre"
          className="inline-flex flex-none items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="m9 16 2 2 4-4" />
          </svg>
          Before Ice Check-In
        </Link>
      </div>

      <PracticeHistory sessions={sessions} />
    </div>
  );
}
