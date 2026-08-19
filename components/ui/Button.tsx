import { ButtonHTMLAttributes } from "react";

export const BUTTON_VARIANTS = {
  primary:
    "bg-brand text-white border border-brand hover:bg-brand-600 uppercase tracking-wider font-heading",
  secondary: "bg-white text-black border border-black/15 hover:bg-black/5 uppercase tracking-wider font-heading",
};
const VARIANTS = BUTTON_VARIANTS;

export function Button({
  className = "",
  variant = "primary",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof VARIANTS }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
