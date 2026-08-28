(() => {
  const chapters = Array.from(document.querySelectorAll("[data-chapter]"));
  const rail = document.querySelector("[data-journey-rail]");
  const railTrack = document.querySelector("[data-journey-track]");
  const railFill = document.querySelector("[data-journey-fill]");
  const railLabel = document.querySelector("[data-journey-label]");
  const progressFill = document.querySelector("[data-journey-progress-fill]");
  const root = document.documentElement;

  if (!chapters.length) {
    return;
  }

  let nodes = [];
  let activeChapter = "";

  const buildNodes = () => {
    if (!railTrack) {
      return;
    }
    railTrack.querySelectorAll(".journey-rail-node").forEach((n) => n.remove());
    nodes = chapters.map((chapter) => {
      const node = document.createElement("span");
      node.className = "journey-rail-node";
      node.dataset.chapter = chapter.dataset.chapter || "";
      railTrack.appendChild(node);
      return node;
    });
  };

  buildNodes();

  const setLabel = (name) => {
    if (!railLabel || !name) {
      return;
    }
    if (name !== activeChapter) {
      activeChapter = name;
      railLabel.textContent = name;
    }
    railLabel.classList.add("is-active");
  };

  if (rail) {
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

    if (railFill) {
      railFill.style.height = `${progress * 100}%`;
    }

    const totalNodes = Math.max(chapters.length - 1, 1);
    nodes.forEach((node, index) => {
      const nodeFraction = index / totalNodes;
      node.style.top = `${nodeFraction * 100}%`;
      const isPassed = progress >= nodeFraction - 0.02;
      node.classList.toggle("is-passed", isPassed);
      node.classList.toggle("is-active", chapters[index].dataset.chapter === activeChapter);
    });

    if (progressFill) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pageProgress = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
      progressFill.style.width = `${pageProgress * 100}%`;
    }

    root.style.setProperty("--scroll-progress", progress.toFixed(4));
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updatePositions);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    buildNodes();
    onScroll();
  });
  updatePositions();
})();
