document.querySelectorAll("[data-interactive-dashboard]").forEach((dashboard) => {
  const tabs = dashboard.querySelectorAll("[data-dashboard-tab]");
  const panels = dashboard.querySelectorAll("[data-dashboard-panel]");

  const setDashboardView = (view) => {
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.dashboardTab === view);
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.dashboardPanel === view);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setDashboardView(tab.dataset.dashboardTab);
    });
  });
});
