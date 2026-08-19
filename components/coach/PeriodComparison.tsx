"use client";

import { useState } from "react";
import type { CategoryAverage } from "@/lib/goalieTrends";
import { RATING_CATEGORY_LABELS } from "@/lib/validation/schemas";

const GAP_THRESHOLD = 1.5;

export interface PeriodData {
  key: string;
  label: string;
  averages: CategoryAverage[];
}

export function PeriodComparison({
  periods,
  coachRatings,
}: {
  periods: PeriodData[];
  coachRatings: Partial<Record<string, number>>;
}) {
  const [selectedKey, setSelectedKey] = useState(periods[0]?.key);
  const selected = periods.find((p) => p.key === selectedKey) ?? periods[0];

  const ratedCategories = Object.entries(coachRatings).filter(
    (entry): entry is [string, number] => entry[1] != null,
  );

  if (!selected || ratedCategories.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 border border-black/10 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-brand">
        Comparison
      </p>

      <div className="flex flex-wrap gap-1">
        {periods.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setSelectedKey(p.key)}
            className={`px-3 py-1 text-xs font-medium transition-colors ${
              p.key === selected.key
                ? "bg-brand text-white"
                : "bg-black/5 text-black/60 hover:bg-black/10"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-black/10">
        {ratedCategories.map(([category, coachScore]) => {
          const periodAvg = selected.averages.find((a) => a.category === category);
          const label = RATING_CATEGORY_LABELS[category as keyof typeof RATING_CATEGORY_LABELS];
          const gap = periodAvg ? Math.abs(coachScore - periodAvg.average) : null;
          const isGap = gap != null && gap >= GAP_THRESHOLD;

          return (
            <div key={category} className="flex items-center justify-between py-2 text-sm">
              <span className="text-black/70">{label}</span>
              <div className="flex items-center gap-3">
                <span className="text-black/50">
                  Goalie: {periodAvg ? periodAvg.average.toFixed(1) : "—"}
                </span>
                <span className="text-black/50">Coach: {coachScore}</span>
                {gap != null && (
                  <span
                    className={`px-2 py-0.5 text-xs font-medium ${
                      isGap ? "border border-amber-500 text-amber-700" : "text-black/30"
                    }`}
                  >
                    gap {gap.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
