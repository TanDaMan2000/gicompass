import { BrandBadge } from "@/components/brand-badge";
import { SymptomForm } from "@/components/symptom-form";
import { gastroCompassLinks } from "@/lib/assessment-config";

export default function HomePage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1560px]">
        <header className="glass-panel mb-8 flex flex-col gap-5 rounded-[32px] px-6 py-5 shadow-[0_20px_50px_rgba(21,53,74,0.08)] lg:flex-row lg:items-center lg:justify-between">
          <BrandBadge title="GastroLens" subtitle="Interactive assessment tool" />
          <div className="flex flex-wrap gap-3">
            <a
              href={gastroCompassLinks.home}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[linear-gradient(135deg,#0f6d88,#0f9bb3)] px-5 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              Back to GastroCompass
            </a>
            <a
              href={gastroCompassLinks.research}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-white/80 px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
            >
              Learn more about the research
            </a>
          </div>
        </header>

        <section className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <aside className="space-y-5">
            <div className="animate-fade-up rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">
                GastroCompass ecosystem
              </p>
              <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-ink">
                GastroLens
              </h1>
              <p className="mt-4 text-sm leading-7 text-muted">
                The interactive GastroCompass product surface for structured intake, explainable scoring,
                and polished research-mode results.
              </p>
              <div className="mt-5 space-y-3">
                <div className="rounded-[22px] border border-line bg-[rgba(244,251,253,0.72)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">What lives here</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Intake, scoring, demo scenarios, results, and optional Judge / Research Mode.
                  </p>
                </div>
                <div className="rounded-[22px] border border-line bg-[rgba(244,251,253,0.72)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">What stays on the site</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Full research background, founder story, FAQ, waitlist, and broader project explanation.
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-up rounded-[32px] border border-white/70 bg-white/76 p-6 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">
                Safety framing
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                This tool is for informational and research-demo purposes only. It does not provide
                medical diagnosis, treatment, or emergency guidance.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                If symptoms are persistent, worsening, severe, or urgent, seek care from a licensed
                clinician.
              </p>
            </div>

            <div className="animate-fade-up rounded-[32px] border border-white/70 bg-white/76 p-6 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">
                Demo notes
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[20px] border border-line bg-white/80 p-4">
                  <p className="text-sm font-semibold text-ink">4-step flow</p>
                  <p className="mt-1 text-sm leading-6 text-muted">Core symptoms, additional pattern, risk context, then review and generate.</p>
                </div>
                <div className="rounded-[20px] border border-line bg-white/80 p-4">
                  <p className="text-sm font-semibold text-ink">Deterministic logic</p>
                  <p className="mt-1 text-sm leading-6 text-muted">Transparent weighted scoring with interaction bonuses and dampeners.</p>
                </div>
                <div className="rounded-[20px] border border-line bg-white/80 p-4">
                  <p className="text-sm font-semibold text-ink">Judge / Research Mode</p>
                  <p className="mt-1 text-sm leading-6 text-muted">Reveal raw scoring logic, validation notes, and section-level contributors for demos.</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="relative z-30 min-w-0 isolate">
            <div className="pointer-events-none absolute inset-x-6 top-8 h-40 rounded-full bg-[radial-gradient(circle,rgba(105,213,210,0.22),transparent_68%)] blur-3xl" />
            <div className="pointer-events-auto relative z-20">
              <SymptomForm />
            </div>
          </div>
        </section>

        <footer className="glass-panel mt-8 rounded-[28px] px-6 py-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-dark">
                GastroCompass ecosystem
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                GastroCompass is the public-facing hub. GastroLens is the interactive assessment tool.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={gastroCompassLinks.home}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
              >
                gastrocompass.org
              </a>
              <a
                href={gastroCompassLinks.research}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
              >
                Research page / paper page
              </a>
              <a
                href={gastroCompassLinks.overview}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
              >
                Product overview
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
