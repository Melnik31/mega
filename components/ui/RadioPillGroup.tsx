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
          <span className="inline-flex items-center justify-center border border-black/15 bg-white px-4 py-1.5 text-sm text-black transition-colors hover:bg-black/5 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2">
            {label}
          </span>
        </label>
      ))}
    </div>
  );
}
