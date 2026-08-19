import { DIRECTION_COLOR, DIRECTION_LABEL, type TrendDirection } from "@/lib/trends";

export function TrendDot({ direction }: { direction: TrendDirection | null }) {
  if (!direction) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
        <span className="h-2.5 w-2.5 rounded-full border border-zinc-300" aria-hidden="true" />
        No data
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: DIRECTION_COLOR[direction] }}
        aria-hidden="true"
      />
      {DIRECTION_LABEL[direction]}
    </span>
  );
}
