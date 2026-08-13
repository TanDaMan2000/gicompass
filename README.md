# GI Compass

Static GitHub Pages website for GI Compass, including the GastroLens interactive
assessment and the Open Me campaign.

## Repository map

- Root `*.html` files are the public website routes.
- `assets/` contains shared styles, browser scripts, images, and downloads.
- `apps/gastrolens/` is the editable Next.js source for GastroLens.
- `gastrolens/` is generated static output committed for GitHub Pages.
- `research/` contains files served from the public `/research/` URL.
- `supabase/` contains checked-in database migrations and notes.
- `docs/` contains architecture, deployment, and non-production references.

See [docs/architecture.md](docs/architecture.md) for source/deployment boundaries
and [docs/deployment.md](docs/deployment.md) for the build and verification flow.

## GitHub Pages

The site deploys from the repository root. `CNAME` preserves the custom domain,
and `.nojekyll` allows the generated Next.js `_next` directory to be served
without Jekyll processing.

Do not move the root HTML routes, `research/`, or generated `gastrolens/`
directory without changing the deployment strategy and preserving their public
URLs.
