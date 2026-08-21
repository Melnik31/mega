import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MyYearView } from "@/components/profile/MyYearView";

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
    <div className="w-full max-w-lg">
      <MyYearView goal={goal} editHref="/goal/edit" />
    </div>
  );
}
