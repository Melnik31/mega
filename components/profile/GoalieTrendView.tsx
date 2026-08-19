import { classifyTrend, type CategoryTrend } from "@/lib/trends";
import type { GoalieTrendData } from "@/lib/goalieTrends";
import { Sparkline } from "@/components/charts/Sparkline";

export function GoalieTrendView({
  data,
  showBeforeIce = true,
  practicePerformanceSeries,
  insightsOverride,
}: {
  data: GoalieTrendData;
  showBeforeIce?: boolean;
  /** Overrides data.postCategorySeries for the "Practice performance" section. */
  practicePerformanceSeries?: CategoryTrend[];
  /** Overrides data.insights/hasEnoughData for the "Insights" section. */
  insightsOverride?: { insights: string[]; hasEnoughData: boolean };
}) {
  const { preSeries, postCategorySeries } = data;
  const { insights, hasEnoughData } = insightsOverride ?? data;
  const visiblePreSeries = showBeforeIce ? preSeries : [];
  const visiblePracticeSeries = practicePerformanceSeries ?? postCategorySeries;
  const hasAnySeries = visiblePreSeries.length > 0 || visiblePracticeSeries.length > 0;
  const showTwoColumns = visiblePreSeries.length > 0 && visiblePracticeSeries.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand-100">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand"
              aria-hidden="true"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-black">Insights Summary</p>
        </div>
        {hasEnoughData ? (
          <ul className="flex flex-col gap-2">
            {insights.map((sentence, i) => (
              <li key={i} className="flex gap-2 text-sm text-black/70">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                {sentence}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-black/50">
            Log a few more check-ins to start seeing trends here.
          </p>
        )}
      </div>

      {hasAnySeries && (
        <div className={`grid grid-cols-1 gap-8 ${showTwoColumns ? "lg:grid-cols-2" : ""}`}>
          {visiblePreSeries.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-lg font-semibold text-black">Before Ice Trends</p>
              <div className="flex flex-col gap-3">
                {visiblePreSeries.map((s) => (
                  <Sparkline
                    key={s.label}
                    label={s.label}
                    scores={s.scores}
                    direction={classifyTrend(s.scores)}
                  />
                ))}
              </div>
            </div>
          )}

          {visiblePracticeSeries.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-lg font-semibold text-black">Practice Performance</p>
              <div className="flex flex-col gap-3">
                {visiblePracticeSeries.map((s) => (
                  <Sparkline
                    key={s.label}
                    label={s.label}
                    scores={s.scores}
                    direction={classifyTrend(s.scores)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
