export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="glass-panel max-w-xl rounded-[32px] p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">
          GastroLens
        </p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold text-ink">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          This route is not part of the current GastroLens research prototype.
        </p>
      </div>
    </main>
  );
}
