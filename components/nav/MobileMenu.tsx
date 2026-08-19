"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

export function MobileMenu({
  links,
  fullName,
  role,
  initialsText,
}: {
  links: { href: string; label: string }[];
  fullName: string;
  role: "goalie" | "coach";
  initialsText: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center text-black"
      >
        {open ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-black/10 bg-white p-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    active ? "bg-brand-100 text-brand" : "text-black/70 hover:bg-black/5"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                {initialsText}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-black">{fullName}</span>
                <span className="text-xs font-bold uppercase tracking-wide text-brand">
                  {role}
                </span>
              </div>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm font-medium text-black/50 hover:text-black"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
