import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostCheckinForm } from "@/components/forms/PostCheckinForm";

export default async function PostCheckinPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionId } = await searchParams;
  if (!sessionId) redirect("/dashboard");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("practice_sessions")
    .select("id, status, pre_one_thing")
    .eq("id", sessionId)
    .eq("goalie_id", user.id)
    .maybeSingle();

  if (!session || session.status === "completed") {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-lg">
      <h1 className="mb-1 text-3xl">How was the practice?</h1>
      <p className="mb-6 text-sm text-black/60">Rate yourself 1–10 in each area.</p>
      <PostCheckinForm sessionId={session.id} oneThing={session.pre_one_thing} />
    </div>
  );
}
