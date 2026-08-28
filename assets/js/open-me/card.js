document.querySelectorAll("[data-card-experience]").forEach((experience) => {
  const cardShell = experience.querySelector("[data-card-shell]");
  const toggles = experience.querySelectorAll("[data-card-toggle]");
  const instruction = experience.querySelector("[data-card-instruction]");

  if (!cardShell || toggles.length === 0) {
    return;
  }

  const syncCardState = (isOpen) => {
    cardShell.dataset.open = String(isOpen);

    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Close the example material preview" : "Preview the example material"
      );
    });

    if (instruction) {
      instruction.textContent = isOpen
        ? "Click to close the preview."
        : "Click to preview.";
    }
  };

  syncCardState(false);

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isOpen = cardShell.dataset.open === "true";
      syncCardState(!isOpen);
    });
  });
});
