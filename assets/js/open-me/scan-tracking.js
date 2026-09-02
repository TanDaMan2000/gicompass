/* ==========================================================
   Flyer scan tracking

   Printed Open Me materials carry a QR code with a ?src tag
   naming where that material was placed, e.g.

     gastrocompass.org/open-me.html?src=library_ga_fulton

   Landing with one records a single row in flyer_scans so the
   campaign can tell which placements people actually scan.

   Background-only: no UI, nothing rendered, and every failure
   is swallowed. A tracking call must never be the reason the
   page or the pledge form misbehaves.
   ========================================================== */

(() => {
  const config = window.GI_COMPASS_SUPABASE;
  if (!config) {
    return;
  }

  const clean = (value) =>
    String(value || "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim();

  const url = clean(config.url);
  const key = clean(config.publishableKey);

  if (!url || !key || url.includes("YOUR_SUPABASE_PROJECT_URL")) {
    return;
  }

  let source = "";
  try {
    source = clean(new URLSearchParams(window.location.search).get("src"));
  } catch {
    return;
  }

  // No tag means the visitor did not come from a printed material.
  if (!source) {
    return;
  }

  // The source is a placement label we print ourselves; anything
  // longer than this is a malformed or hand-edited URL.
  if (source.length > 120) {
    source = source.slice(0, 120);
  }

  try {
    void fetch(`${url}/rest/v1/flyer_scans`, {
      method: "POST",
      headers: {
        apikey: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
      // The QR audience often taps straight through to the pledge,
      // so the request has to survive the page going away.
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* fail silently */
  }
})();
