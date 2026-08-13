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
        isOpen ? "Close the virtual Open Me card" : "Open the virtual Open Me card"
      );
    });

    if (instruction) {
      instruction.textContent = isOpen
        ? "Click again to fold the card closed."
        : "Click to open the folded card.";
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
