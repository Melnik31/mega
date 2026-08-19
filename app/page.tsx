import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-white px-4 text-center">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="MEGA Goaltending" width={64} height={63} className="h-16 w-auto" />
        <h1 className="text-4xl">Goalie Development</h1>
      </div>
      <p className="max-w-md text-black/60">
        Turn daily practice into structured, measurable growth.
      </p>
      <div className="flex gap-3">
        <ButtonLink href="/signup">Sign up</ButtonLink>
        <ButtonLink href="/login" variant="secondary">
          Log in
        </ButtonLink>
      </div>
    </div>
  );
}
