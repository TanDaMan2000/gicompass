import { ReactNode } from "react";

type FormSectionProps = {
  step: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function FormSection({ step, title, description, children }: FormSectionProps) {
  return (
    <section className="animate-fade-up rounded-[32px] border border-line bg-white/70 p-6 shadow-[0_12px_40px_rgba(21,53,74,0.06)] sm:p-7">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-dark text-sm font-bold text-white">
          {step}
        </div>
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-extrabold text-ink">{title}</h2>
          <p className="max-w-xl text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
