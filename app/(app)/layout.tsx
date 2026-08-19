import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/nav/AppNav";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <AppNav fullName={profile.full_name} role={profile.role} />
      <main className="flex flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
