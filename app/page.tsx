import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    redirect(profile?.role === "coach" ? "/team" : "/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-4 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">Goalie Development</h1>
      <p className="max-w-md text-zinc-600">
        Turn daily practice into structured, measurable growth.
      </p>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Sign up
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:border-zinc-500"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
