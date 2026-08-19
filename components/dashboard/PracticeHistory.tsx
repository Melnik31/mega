"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FOCUS_AREA_LABELS } from "@/lib/validation/schemas";
import type { PracticeSessionRow } from "@/lib/goalieTrends";

export type { PracticeSessionRow };

const PRE_RATINGS = [
  { key: "pre_energy", label: "Energy" },
  { key: "pre_confidence", label: "Confidence" },
  { key: "pre_focus", label: "Focus" },
  { key: "pre_body", label: "Body" },
  { key: "pre_mental_readiness", label: "Mental readiness" },
] as const;

const POST_RATING_GROUPS = [
  {
    title: "Technical",
    fields: [
      { key: "post_tracking", label: "Tracking" },
      { key: "post_skating_edges", label: "Skating/Edges" },
      { key: "post_movement_control", label: "Movement/Control" },
      { key: "post_positioning", label: "Positioning" },
      { key: "post_rebound_control", label: "Rebound Control" },
      { key: "post_hands", label: "Hands" },
      { key: "post_stick", label: "Stick" },
    ],
  },
  {
    title: "Mental",
    fields: [
      { key: "post_focus", label: "Focus" },
      { key: "post_confidence", label: "Confidence" },
      { key: "post_compete", label: "Compete" },
    ],
  },
  {
    title: "IQ",
    fields: [
      { key: "post_reads", label: "Reads/Recognition" },
      { key: "post_decision_making", label: "Decision Making" },
    ],
  },
] as const;

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function PracticeHistory({ sessions }: { sessions: PracticeSessionRow[] }) {
  const [selectedDate, setSelectedDate] = useState("");

  const filtered = useMemo(() => {
    if (!selectedDate) return sessions;
    return sessions.filter((s) => s.practice_date === selectedDate);
  }, [sessions, selectedDate]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-black">Practice History &amp; Logs</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Filter practice history by date"
              className="rounded-full border border-black/15 bg-white py-2 pl-9 pr-4 text-sm text-black outline-none focus:border-brand"
            />
          </div>
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className="text-sm font-medium text-black/50 hover:text-black"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-black/50">
          {sessions.length === 0
            ? "No check-ins logged yet."
            : "No sessions logged on that date."}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {filtered.map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-black">
                  {formatDate(entry.practice_date)}
                </p>
                <p className="text-sm text-black/50">Logged at {formatTime(entry.created_at)}</p>
              </div>
              {entry.status === "completed" ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Completed
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Awaiting evaluation
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 border-t border-black/10 pt-4 sm:grid-cols-2 sm:divide-x sm:divide-black/10">
              <div className="flex flex-col gap-3 sm:pr-6">
                <p className="text-xs font-bold uppercase tracking-wide text-brand">
                  Before Ice Check-In
                </p>
                <div>
                  <p className="text-xs text-black/40">Primary Focus Area</p>
                  <p className="text-sm font-semibold text-black">
                    {FOCUS_AREA_LABELS[entry.pre_focus_area as keyof typeof FOCUS_AREA_LABELS] ??
                      entry.pre_focus_area}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-black/40">&quot;One Thing&quot; Objective</p>
                  <p className="text-sm font-semibold text-black">{entry.pre_one_thing}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-black/40">Readiness Ratings</p>
                  <div className="flex flex-wrap gap-2">
                    {PRE_RATINGS.map(({ key, label }) => (
                      <span
                        key={key}
                        className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/70"
                      >
                        {label}: <span className="font-semibold text-black">{entry[key]}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:pl-6">
                {entry.status === "completed" ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-wide text-black">
                      After Practice Evaluation
                    </p>
                    <div className="flex flex-col gap-2">
                      {POST_RATING_GROUPS.map((group) => (
                        <div key={group.title}>
                          <p className="text-sm font-semibold text-black">{group.title}</p>
                          <p className="text-xs text-black/60">
                            {group.fields
                              .map(({ key, label }) => `${label}: ${entry[key]}`)
                              .join(" · ")}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-emerald-700">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      Hit &quot;one thing&quot;:{" "}
                      <span className="font-semibold">{entry.post_focus_hit ? "Yes" : "No"}</span>
                    </div>
                    {entry.post_note && (
                      <p className="text-sm text-black/70">
                        Note: <span className="text-black">{entry.post_note}</span>
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-start justify-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-black/40">
                      After Practice Evaluation
                    </p>
                    <p className="text-sm text-black/50">Not logged yet.</p>
                    <Link
                      href={`/checkin/post?session=${entry.id}`}
                      className="mt-1 inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-black/5"
                    >
                      Log after practice
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
