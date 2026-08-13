const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item, index) => {
  if (item.getBoundingClientRect().top < window.innerHeight * 0.92) {
    item.classList.add("visible");
  }

  item.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
  revealObserver.observe(item);
});
