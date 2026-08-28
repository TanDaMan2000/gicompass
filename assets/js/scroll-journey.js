(() => {
  const chapters = Array.from(document.querySelectorAll("[data-chapter]"));
  const rail = document.querySelector("[data-journey-rail]");
  const railFill = document.querySelector("[data-journey-fill]");
  const railMarker = document.querySelector("[data-journey-marker]");
  const railLabel = document.querySelector("[data-journey-label]");
  const progressFill = document.querySelector("[data-journey-progress-fill]");

  if (!chapters.length) {
    return;
  }

  let activeChapter = "";

  const setLabel = (name) => {
    if (!railLabel || !name || name === activeChapter) {
      return;
    }
    activeChapter = name;
    railLabel.textContent = name;
    railLabel.classList.add("is-active");
  };

  if (rail && railFill && railMarker) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLabel(entry.target.dataset.chapter || "");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    chapters.forEach((chapter) => observer.observe(chapter));
  }

  let ticking = false;

  const updatePositions = () => {
    ticking = false;

    const first = chapters[0];
    const last = chapters[chapters.length - 1];
    const start = first.offsetTop;
    const end = last.offsetTop + last.offsetHeight;
    const total = Math.max(end - start, 1);
    const scrolled = Math.min(Math.max(window.scrollY + window.innerHeight * 0.5 - start, 0), total);
    const progress = Math.min(Math.max(scrolled / total, 0), 1);

    if (railFill && railMarker) {
      railFill.style.height = `${progress * 100}%`;
      railMarker.style.top = `${progress * 100}%`;
    }

    if (progressFill) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pageProgress = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
      progressFill.style.width = `${pageProgress * 100}%`;
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updatePositions);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updatePositions();
})();
