export function RadioPillGroup({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label }) => (
        <label key={value} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={value}
            defaultChecked={defaultValue === value}
            className="peer sr-only"
          />
          <span className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-400 peer-focus-visible:ring-offset-2">
            {label}
          </span>
        </label>
      ))}
    </div>
  );
}
