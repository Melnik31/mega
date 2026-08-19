import { classifyTrend } from "@/lib/trends";
import type { GoalieTrendData } from "@/lib/goalieTrends";
import { Sparkline } from "@/components/charts/Sparkline";

export function GoalieTrendView({ data }: { data: GoalieTrendData }) {
  const { insights, hasEnoughData, preSeries, postCategorySeries } = data;
  const hasAnySeries = preSeries.length > 0 || postCategorySeries.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <p className="mb-3 text-sm font-medium text-zinc-500">Insights</p>
        {hasEnoughData ? (
          <ul className="flex flex-col gap-2">
            {insights.map((sentence, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-800">
                <span aria-hidden="true" className="text-zinc-400">
                  •
                </span>
                {sentence}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">
            Log a few more check-ins to start seeing trends here.
          </p>
        )}
      </div>

      {hasAnySeries && (
        <div className="flex flex-col gap-4">
          {preSeries.length > 0 && (
            <>
              <p className="text-sm font-medium text-zinc-500">Before ice</p>
              <div className="flex flex-col gap-3">
                {preSeries.map((s) => (
                  <Sparkline
                    key={s.label}
                    label={s.label}
                    scores={s.scores}
                    direction={classifyTrend(s.scores)}
                  />
                ))}
              </div>
            </>
          )}

          {postCategorySeries.length > 0 && (
            <>
              <p className="text-sm font-medium text-zinc-500">Practice performance</p>
              <div className="flex flex-col gap-3">
                {postCategorySeries.map((s) => (
                  <Sparkline
                    key={s.label}
                    label={s.label}
                    scores={s.scores}
                    direction={classifyTrend(s.scores)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
