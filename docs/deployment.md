# Deployment

The repository is configured for GitHub Pages deployment from the branch root.
Keep `CNAME` and `.nojekyll` in the repository root.

## Build GastroLens

From `apps/gastrolens/`:

```powershell
npm ci
npm run lint
npm run build
```

The Next.js configuration uses `output: "export"`, `basePath: "/gastrolens"`,
and `trailingSlash: true`. A successful build writes the static export to
`apps/gastrolens/out/`.

Replace the root `gastrolens/` directory with the contents of that `out/`
directory before publishing. The root directory is intentionally committed so
GitHub Pages can serve `/gastrolens/` directly.

## Static-site validation

Serve the repository root with the dependency-free local utility:

```powershell
node scripts/serve-static.mjs . 4173
```

Then verify:

- `/`
- `/about.html`
- `/founder.html`
- `/open-me.html`
- `/gastrolens.html`
- `/gastrolens/`
- `/research/gastrolens-nhanes-analysis.pdf`

The home-page waitlist and Open Me pledge use Supabase from browser JavaScript.
Their publishable configuration is in `assets/js/supabase-config.js`.
