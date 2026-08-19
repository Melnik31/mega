"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center gap-5">
      {links.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`border-b-2 pb-0.5 text-sm transition-colors ${
              active
                ? "border-brand text-brand"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
