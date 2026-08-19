import { signOut } from "@/lib/actions/auth";
import { NavLinks } from "@/components/nav/NavLinks";

const GOALIE_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/goal", label: "My Year" },
  { href: "/profile", label: "Profile" },
  { href: "/team", label: "Team" },
];

const COACH_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/team", label: "Team" },
];

export function AppNav({
  fullName,
  role,
}: {
  fullName: string;
  role: "goalie" | "coach";
}) {
  const links = role === "goalie" ? GOALIE_LINKS : COACH_LINKS;

  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-zinc-900">Goalie Development</span>
          <NavLinks links={links} />
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-600 sm:inline">{fullName}</span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {role}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
