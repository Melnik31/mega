import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { BUTTON_VARIANTS } from "@/components/ui/Button";

export function ButtonLink({
  className = "",
  variant = "primary",
  children,
  ...props
}: LinkProps & {
  variant?: keyof typeof BUTTON_VARIANTS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold transition-colors ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
