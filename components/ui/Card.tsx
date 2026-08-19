import { HTMLAttributes } from "react";

export function Card({
  kicker,
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { kicker?: string }) {
  return (
    <div className={`border border-black/10 bg-white p-4 ${className}`} {...props}>
      {kicker && (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-brand">
          {kicker}
        </p>
      )}
      {children}
    </div>
  );
}
