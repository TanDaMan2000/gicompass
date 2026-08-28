const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const mobileNavPanel = document.getElementById("mobile-nav");

const setMobileNavState = (isOpen) => {
  if (!mobileNavToggle || !mobileNavPanel) {
    return;
  }

  mobileNavToggle.classList.toggle("is-open", isOpen);
  mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
  mobileNavPanel.hidden = !isOpen;
  mobileNavPanel.classList.toggle("is-open", isOpen);
};

mobileNavToggle?.addEventListener("click", () => {
  const isOpen = mobileNavToggle.getAttribute("aria-expanded") === "true";
  setMobileNavState(!isOpen);
});

mobileNavPanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileNavState(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) {
    setMobileNavState(false);
  }
});

/* Header scroll state is owned by motion.js on pages that load it.
   This fallback covers pages that don't. */
const siteHeader = document.querySelector(".site-header");

if (siteHeader && !document.querySelector('script[src*="motion.js"]')) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();
}
