"use client";

import { useActionState, useState } from "react";
import { submitWeeklyRatings } from "@/lib/actions/coachRatings";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { ScoreSlider } from "@/components/ui/ScoreSlider";
import type { CategoryAverage } from "@/lib/goalieTrends";

const initialState: ActionState = {};

export function WeeklyRatingForm({
  goalieId,
  weekStart,
  averages,
  existingRatings,
}: {
  goalieId: string;
  weekStart: string;
  averages: CategoryAverage[];
  existingRatings: Partial<Record<string, number>>;
}) {
  const action = submitWeeklyRatings.bind(null, goalieId, weekStart);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [included, setIncluded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(averages.map(({ category }) => [category, category in existingRatings])),
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {averages.map(({ category, label, average, count }) => (
        <div key={category} className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-900">{label}</p>
              <p className="text-xs text-zinc-500">
                Goalie&apos;s self-score: {average.toFixed(1)} ({count} session
                {count === 1 ? "" : "s"} this week)
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={included[category] ?? false}
                onChange={(e) =>
                  setIncluded((prev) => ({ ...prev, [category]: e.target.checked }))
                }
              />
              Rate this
            </label>
          </div>
          {included[category] && (
            <div className="mt-3">
              <ScoreSlider
                name={`score_${category}`}
                label="Your rating"
                defaultValue={existingRatings[category] ?? 5}
              />
            </div>
          )}
        </div>
      ))}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Save ratings"}
      </Button>
    </form>
  );
}
