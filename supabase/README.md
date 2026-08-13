# Supabase

Database schema changes used by the static site live in `migrations/`.

- `open-me-pledges.sql` creates the Open Me pledge table, index, row-level
  security configuration, and anonymous insert/select policies.

The home-page waitlist also writes to `waitlist_submissions`. That table predates
the checked-in migrations and its original schema is not available in this
repository, so no speculative migration has been added during structural cleanup.
