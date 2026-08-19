import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, getActiveSeason } from "@/lib/supabase/queries";
import { PreCheckinForm } from "@/components/forms/PreCheckinForm";

export default async function PreCheckinPage() {
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
  if (!season) {
    return <p className="text-sm text-black/60">No active season found for your team.</p>;
  }

  return (
    <div className="w-full max-w-lg">
      <h1 className="mb-1 text-3xl">Before ice</h1>
      <p className="mb-6 text-sm text-black/60">Quick check-in before practice.</p>
      <PreCheckinForm />
    </div>
  );
}
