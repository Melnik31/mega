"use client";

import { useState } from "react";
import { GoalieTrendView } from "@/components/profile/GoalieTrendView";
import { PracticeHistory } from "@/components/dashboard/PracticeHistory";
import { MyYearView, type SeasonGoal } from "@/components/profile/MyYearView";
import type { GoalieTrendData, PracticeSessionRow } from "@/lib/goalieTrends";
import type { CategoryTrend } from "@/lib/trends";

export function GoalieDetailView({
  data,
  showBeforeIce,
  practicePerformanceSeries,
  insightsOverride,
  sessions,
  seasonGoal,
}: {
  data: GoalieTrendData;
  showBeforeIce?: boolean;
  practicePerformanceSeries?: CategoryTrend[];
  insightsOverride?: { insights: string[]; hasEnoughData: boolean };
  sessions: PracticeSessionRow[];
  seasonGoal: SeasonGoal | null;
}) {
  const [view, setView] = useState<"insights" | "logs" | "my-year">("insights");

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit rounded-full border border-black/10 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setView("insights")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            view === "insights" ? "bg-brand text-white" : "text-black/60 hover:text-black"
          }`}
        >
          Insights
        </button>
        <button
          type="button"
          onClick={() => setView("logs")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            view === "logs" ? "bg-brand text-white" : "text-black/60 hover:text-black"
          }`}
        >
          Practice Logs
        </button>
        <button
          type="button"
          onClick={() => setView("my-year")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            view === "my-year" ? "bg-brand text-white" : "text-black/60 hover:text-black"
          }`}
        >
          My Year
        </button>
      </div>

      {view === "insights" && (
        <GoalieTrendView
          data={data}
          showBeforeIce={showBeforeIce}
          practicePerformanceSeries={practicePerformanceSeries}
          insightsOverride={insightsOverride}
        />
      )}
      {view === "logs" && <PracticeHistory sessions={sessions} />}
      {view === "my-year" &&
        (seasonGoal ? (
          <MyYearView goal={seasonGoal} />
        ) : (
          <p className="text-sm text-black/50">
            This goalie hasn&apos;t completed their season onboarding yet.
          </p>
        ))}
    </div>
  );
}
