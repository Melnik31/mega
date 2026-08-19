import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/supabase/queries";
import { getGoalieTrendData, getLatestSessionStatus } from "@/lib/goalieTrends";
import { GoalieTrendView } from "@/components/profile/GoalieTrendView";
import { IncompleteCheckinBadge } from "@/components/ui/IncompleteCheckinBadge";

export default async function CoachGoalieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: goalieId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const membership = await getMembership(supabase, user.id);
  if (!membership || membership.role !== "coach") {
    redirect("/dashboard");
  }

  const { data: goalieMembership } = await supabase
    .from("team_memberships")
    .select("profile_id, profiles(full_name)")
    .eq("team_id", membership.team_id)
    .eq("profile_id", goalieId)
    .eq("role", "goalie")
    .maybeSingle();

  if (!goalieMembership) {
    redirect("/dashboard");
  }

  const [data, latest] = await Promise.all([
    getGoalieTrendData(supabase, goalieId),
    getLatestSessionStatus(supabase, goalieId),
  ]);

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div>
        <Link href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">
          ← Dashboard
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-zinc-900">
              {goalieMembership.profiles?.full_name ?? "Goalie"}
            </h1>
            {latest?.status === "pre_only" && <IncompleteCheckinBadge />}
          </div>
          <Link
            href={`/coach/goalies/${goalieId}/weekly-review`}
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Weekly review
          </Link>
        </div>
      </div>

      <GoalieTrendView data={data} />
    </div>
  );
}
