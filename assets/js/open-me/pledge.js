const pledgeForm = document.getElementById("pledge-form");
const pledgeCount = document.getElementById("pledge-count");
const pledgeConfirmation = document.getElementById("pledge-confirmation");
const pledgeShareButton = document.getElementById("pledge-share-button");
const pledgeShareMessage = document.getElementById("pledge-share-message");
const supabaseClient = window.GI_COMPASS_SUPABASE_CLIENT;

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
