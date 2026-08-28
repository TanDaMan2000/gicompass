/* ==========================================================
   Motion system
   - content rise on enter (IntersectionObserver)
   - scroll-driven GastroLens screen opening
   - header scroll state
   Lightweight: no libraries, all work batched into rAF.
   ========================================================== */

(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Marks that JS motion is available, so CSS can safely define
  // pre-animation states that would otherwise strand content.
  if (!reduced) document.documentElement.classList.add("js-motion");

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

  /* ---- OpenMe printed material: settle into place ---- */
  const omObjects = document.querySelector(".om-objects");
  if (omObjects) {
    if (reduced || typeof IntersectionObserver === "undefined") {
      omObjects.classList.add("is-settled");
    } else {
      const omIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              omObjects.classList.add("is-settled");
              omIo.disconnect();
            }
          });
        },
        { rootMargin: "0px 0px -18% 0px", threshold: 0.2 }
      );
      omIo.observe(omObjects);
      // Same guarantee as the content reveals: never stay hidden.
      window.addEventListener("load", () => {
        setTimeout(() => omObjects.classList.add("is-settled"), 2500);
      });
    }
  }

  /* ---- GastroLens screen opening ----
     --open runs 0 → 1 across the approach to the frame, so the
     display finishes opening a little before it is centred and
     then simply sits there, crisp and still. */
  const glFrame = document.querySelector("[data-gl-frame]");
  const isPhone = window.matchMedia("(max-width: 720px)").matches;
  const runGl = glFrame && !reduced && !isPhone;

  /* ---- Hero bearing: fades as the hero scrolls away ---- */
  const hero = document.querySelector(".hero");

  let ticking = false;

  const update = () => {
    ticking = false;

    if (hero) {
      // 0 at rest, 1 once the hero has scrolled fully past.
      const h = hero.offsetHeight || 1;
      const y = Math.min(Math.max(window.scrollY / h, 0), 1);
      document.documentElement.style.setProperty("--scroll-y", y.toFixed(3));
    }

    if (!runGl) return;

    const vh = window.innerHeight;
    const rect = glFrame.getBoundingClientRect();
    // Hold closed until the frame's top has crossed ~80% of the
    // viewport — by then enough of it is on screen to be worth
    // watching — and finish before it centres, so the reveal is
    // seen rather than completed off-screen. Short travel keeps it
    // legible to fast scrollers.
    const start = vh * 0.8;
    const end = vh * 0.34;
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

  if (runGl || hero) {
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
