import { TextareaHTMLAttributes } from "react";

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full border border-black/15 bg-[#f5f5f6] px-3 py-2 text-sm text-black placeholder:text-black/40 outline-none focus:border-brand ${className}`}
      {...props}
    />
  );
}
