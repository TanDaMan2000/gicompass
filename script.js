const revealItems = document.querySelectorAll(".reveal");
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const mobileNavPanel = document.getElementById("mobile-nav");

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

const waitlistForm = document.getElementById("waitlist-form");
const formMessage = document.getElementById("form-message");
const waitlistButton = waitlistForm?.querySelector('button[type="submit"]');
const pledgeForm = document.getElementById("pledge-form");
const pledgeCount = document.getElementById("pledge-count");
const pledgeConfirmation = document.getElementById("pledge-confirmation");
const pledgeShareButton = document.getElementById("pledge-share-button");
const pledgeShareMessage = document.getElementById("pledge-share-message");

const OPEN_ME_PLEDGE_KEY = "openme_pledge_count";
const OPEN_ME_PLEDGE_TABLE = "open_me_pledges";

const getPledgeCount = () => {
  const storedValue = Number.parseInt(localStorage.getItem(OPEN_ME_PLEDGE_KEY) || "1", 10);
  return Number.isFinite(storedValue) && storedValue > 0 ? storedValue : 1;
};

const updatePledgeCountLabel = (count) => {
  if (!pledgeCount) {
    return;
  }

  pledgeCount.textContent = `Join ${count} others who have pledged.`;
};

if (pledgeCount) {
  updatePledgeCountLabel(getPledgeCount());
}

if (pledgeConfirmation) {
  pledgeConfirmation.hidden = true;
}

if (pledgeForm) {
  pledgeForm.hidden = false;
}

pledgeShareButton?.addEventListener("click", async () => {
  const shareText = "Learn about colorectal cancer screening — gastrocompass.org/open-me.html";
  const shareUrl = "https://gastrocompass.org/open-me.html";

  try {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    if (pledgeShareMessage) {
      pledgeShareMessage.textContent = "Link copied. Share it with someone who should see it.";
    }
  } catch {
    if (pledgeShareMessage) {
      pledgeShareMessage.textContent = "Copy failed on this browser. Share gastrocompass.org/open-me.html manually.";
    }
  }
});

const supabaseConfig = window.GI_COMPASS_SUPABASE;
const cleanConfigValue = (value) =>
  String(value || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();

const supabaseUrl = cleanConfigValue(supabaseConfig?.url);
const supabaseKey = cleanConfigValue(supabaseConfig?.publishableKey);

const supabaseClient =
  supabaseConfig &&
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes("YOUR_SUPABASE_PROJECT_URL") &&
  !supabaseKey.includes("YOUR_SUPABASE_PUBLISHABLE_KEY")
    ? window.supabase.createClient(supabaseUrl, supabaseKey)
    : null;

const setPledgeCount = (count) => {
  const normalizedCount = Number.isFinite(count) && count > 0 ? count : 1;
  localStorage.setItem(OPEN_ME_PLEDGE_KEY, String(normalizedCount));
  updatePledgeCountLabel(normalizedCount);
};

const fetchSupabasePledgeCount = async () => {
  if (!supabaseClient || !pledgeCount) {
    return null;
  }

  const { count, error } = await supabaseClient
    .from(OPEN_ME_PLEDGE_TABLE)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Supabase pledge count fetch failed:", error);
    return null;
  }

  const resolvedCount = Math.max(Number(count) || 0, 1);
  setPledgeCount(resolvedCount);
  return resolvedCount;
};

void fetchSupabasePledgeCount();

waitlistForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  formMessage.classList.remove("is-error", "is-success");

  if (!supabaseClient) {
    formMessage.classList.add("is-error");
    formMessage.textContent =
      "Waitlist backend is not configured yet. Add your Supabase URL and publishable key in supabase-config.js.";
    return;
  }

  const formData = new FormData(waitlistForm);
  const firstName = String(formData.get("firstName") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") || "").trim();

  formMessage.textContent = "Submitting...";
  if (waitlistButton) {
    waitlistButton.disabled = true;
  }

  const { error } = await supabaseClient.from("waitlist_submissions").insert({
    first_name: firstName,
    email,
    role: role || null,
    source: "landing_page",
    notes: null,
  });

  if (waitlistButton) {
    waitlistButton.disabled = false;
  }

  if (error) {
    console.error("Supabase waitlist insert failed:", error);

    if (error.code === "23505") {
      formMessage.classList.add("is-error");
      formMessage.textContent =
        "Oops, this email is already registered for the waitlist.";
      return;
    }

    formMessage.classList.add("is-error");
    formMessage.textContent = `Submission failed: ${error.message || "Unknown error"}`;
    return;
  }

  formMessage.classList.add("is-success");
  formMessage.textContent = `Thanks${firstName ? `, ${firstName}` : ""}. You are on the GastroLens updates list.`;
  waitlistForm.reset();
});

pledgeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(pledgeForm);
  const firstName = String(formData.get("firstName") || "").trim();
  const zipCode = String(formData.get("zipCode") || "").trim();
  const hasCommitment = formData.get("pledgeCommitment") === "on";

  if (!firstName || !zipCode || !hasCommitment) {
    return;
  }

  let nextCount = getPledgeCount() + 1;

  if (supabaseClient) {
    const { error } = await supabaseClient.from(OPEN_ME_PLEDGE_TABLE).insert({
      first_name: firstName,
      zip_code: zipCode,
      commitment: true,
      source: "open_me_campaign",
    });

    if (error) {
      console.error("Supabase pledge insert failed:", error);
    } else {
      const syncedCount = await fetchSupabasePledgeCount();
      nextCount = syncedCount ?? nextCount;
    }
  }

  setPledgeCount(nextCount);

  pledgeForm.hidden = true;
  if (pledgeConfirmation) {
    pledgeConfirmation.hidden = false;
  }
});
