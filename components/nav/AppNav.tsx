import Image from "next/image";
import { signOut } from "@/lib/actions/auth";
import { NavLinks } from "@/components/nav/NavLinks";
import { MobileMenu } from "@/components/nav/MobileMenu";

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

function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function AppNav({
  fullName,
  role,
}: {
  fullName: string;
  role: "goalie" | "coach";
}) {
  const links = role === "goalie" ? GOALIE_LINKS : COACH_LINKS;
  const isCoach = role === "coach";

  return (
    <header className="border-b border-black/10 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="MEGA Goaltending" width={36} height={35} className="h-9 w-auto" />
            <span className="font-heading text-[17px] font-semibold uppercase tracking-[0.06em] text-black">
              Goalie Development
              {isCoach && <span className="text-brand"> · Coach</span>}
            </span>
          </div>
          <div className="hidden sm:block">
            <NavLinks links={links} />
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
            {initials(fullName)}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-black">{fullName}</span>
            <span className="text-xs font-bold uppercase tracking-wide text-brand">{role}</span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="ml-2 inline-flex items-center gap-1.5 text-sm font-medium text-black/50 hover:text-black"
            >
              Sign out
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </form>
        </div>

        <MobileMenu links={links} fullName={fullName} role={role} initialsText={initials(fullName)} />
      </div>
    </header>
  );
}
