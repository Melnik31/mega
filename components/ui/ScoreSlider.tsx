"use client";

import { useState } from "react";

export function ScoreSlider({
  name,
  label,
  description,
  defaultValue = 5,
}: {
  name: string;
  label: string;
  description?: string;
  defaultValue?: number;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label htmlFor={name} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
        <span className="text-sm font-semibold text-zinc-900">{value}</span>
      </div>
      {description && <p className="text-xs text-zinc-500">{description}</p>}
      <input
        id={name}
        name={name}
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-1 w-full accent-zinc-900"
      />
    </div>
  );
}
