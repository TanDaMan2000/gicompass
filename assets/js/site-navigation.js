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

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();
}
