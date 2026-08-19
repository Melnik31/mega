"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { DIRECTION_ARROW, DIRECTION_COLOR, DIRECTION_LABEL, type TrendDirection } from "@/lib/trends";

export function Sparkline({
  label,
  scores,
  direction,
}: {
  label: string;
  scores: number[];
  direction: TrendDirection;
}) {
  const color = DIRECTION_COLOR[direction];
  const data = scores.map((value, index) => ({ index, value }));

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="w-32 flex-none">
        <p className="text-sm font-semibold text-black">{label}</p>
        <span className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
          <span aria-hidden="true">{DIRECTION_ARROW[direction]}</span>
          {DIRECTION_LABEL[direction]}
        </span>
      </div>
      <div className="h-16 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <YAxis domain={[1, 10]} hide />
            <Tooltip
              formatter={(value) => [typeof value === "number" ? value.toFixed(1) : value, label]}
              labelFormatter={() => ""}
              contentStyle={{ fontSize: 12, padding: "4px 8px" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
