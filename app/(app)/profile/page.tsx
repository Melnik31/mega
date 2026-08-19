import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/supabase/queries";
import { getGoalieTrendData } from "@/lib/goalieTrends";
import { GoalieTrendView } from "@/components/profile/GoalieTrendView";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const membership = await getMembership(supabase, user.id);
  if (!membership || membership.role !== "goalie") {
    redirect("/dashboard");
  }

  const data = await getGoalieTrendData(supabase, user.id);

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900">Profile</h1>
      <GoalieTrendView data={data} />
    </div>
  );
}
