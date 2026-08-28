/* ==========================================================
   Motion system
   - content rise on enter (IntersectionObserver)
   - scroll-driven GastroLens screen opening
   - header scroll state
   Lightweight: no libraries, all work batched into rAF.
   ========================================================== */

(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Content reveals ----
     [data-rise] is the current system; .reveal is the older one the
     secondary pages still use. Both are driven from here so no page
     can be left with permanently invisible content. */
  const risers = Array.from(document.querySelectorAll("[data-rise], .reveal"));
  const shownClass = (el) => (el.hasAttribute("data-rise") ? "is-in" : "visible");
  const show = (el) => el.classList.add(shownClass(el));

  if (reduced || typeof IntersectionObserver === "undefined") {
    // Never leave content hidden behind an effect we can't run.
    risers.forEach(show);
  } else if (risers.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );
    risers.forEach((el) => io.observe(el));

    // Safety net: on any scroll, reveal anything already inside or
    // above the viewport. The observer normally gets there first;
    // this guarantees content is never left blank if it doesn't.
    let sweeping = false;
    const sweep = () => {
      sweeping = false;
      const limit = window.innerHeight * 1.05;
      for (let i = risers.length - 1; i >= 0; i--) {
        if (risers[i].getBoundingClientRect().top < limit) {
          show(risers[i]);
          risers.splice(i, 1);
        }
      }
      if (!risers.length) window.removeEventListener("scroll", onSweep);
    };
    const onSweep = () => {
      if (!sweeping) {
        sweeping = true;
        window.requestAnimationFrame(sweep);
      }
    };
    window.addEventListener("scroll", onSweep, { passive: true });
    window.addEventListener("load", onSweep);
  }

  /* ---- GastroLens screen opening ----
     --open runs 0 → 1 across the approach to the frame, so the
     display finishes opening a little before it is centred and
     then simply sits there, crisp and still. */
  const glFrame = document.querySelector("[data-gl-frame]");
  const isPhone = window.matchMedia("(max-width: 720px)").matches;
  const runGl = glFrame && !reduced && !isPhone;

  let ticking = false;

  const update = () => {
    ticking = false;
    if (!runGl) return;

    const vh = window.innerHeight;
    const rect = glFrame.getBoundingClientRect();
    // 0 when the frame's top is a full viewport away, 1 once it has
    // risen to roughly a third up the screen.
    const start = vh * 0.95;
    const end = vh * 0.3;
    const raw = (start - rect.top) / (start - end);
    const open = Math.min(Math.max(raw, 0), 1);
    // ease-out so the last few degrees settle gently
    const eased = 1 - Math.pow(1 - open, 3);
    glFrame.style.setProperty("--open", eased.toFixed(4));
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  if (runGl) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---- Header state ---- */
  const header = document.querySelector(".site-header");
  if (header) {
    const setHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", setHeader, { passive: true });
    setHeader();
  }
})();
