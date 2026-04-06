import { FieldOption } from "@/lib/types";

type RadioGroupFieldProps = {
  label: string;
  name: string;
  value?: string;
  options: FieldOption[];
  onChange: (value: string) => void;
};

export function RadioGroupField({
  label,
  value,
  options,
  onChange,
}: RadioGroupFieldProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-ink">{label}</legend>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`text-left rounded-[20px] border px-4 py-4 transition ${
                isSelected
                  ? "border-primary-dark bg-[rgba(15,155,179,0.12)] shadow-[0_14px_28px_rgba(15,109,136,0.14)]"
                  : "border-line bg-white/75 hover:border-primary/40 hover:bg-white hover:shadow-[0_12px_24px_rgba(21,53,74,0.06)]"
              }`}
            >
              <span className="block text-[15px] font-semibold text-ink">{option.label}</span>
              {option.hint ? (
                <span className="mt-1 block text-xs leading-5 text-muted">{option.hint}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
