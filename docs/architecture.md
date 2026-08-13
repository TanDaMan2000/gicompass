# Repository architecture

GI Compass is deployed as a static GitHub Pages site from the repository root.

## Public site

The root HTML files are public routes and must remain in place:

- `/` is served by `index.html`.
- `/about.html` is served by `about.html`.
- `/founder.html` is served by `founder.html`.
- `/open-me.html` is served by `open-me.html`.
- `/gastrolens.html` redirects to `/gastrolens/`.

Shared browser assets live in `assets/`. The research paper remains in
`research/` so its public URL stays
`/research/gastrolens-nhanes-analysis.pdf`. `research/index.html` preserves the
public `/research/` route by redirecting to that paper.

## GastroLens

`apps/gastrolens/` is the only editable GastroLens source directory.

`gastrolens/` is generated deployment output from the Next.js static export. Do
not edit its HTML, JavaScript, CSS, or hashed assets manually. Regenerate it from
the source application instead.

## Infrastructure

Supabase schema files live under `supabase/migrations/`. Browser-side Supabase
configuration and initialization live under `assets/js/` because GitHub Pages
serves a fully static site.

## Reference files

Non-production visual references and archived artifacts live under
`docs/references/`. They are not loaded by the website.
