const waitlistForm = document.getElementById("waitlist-form");
const formMessage = document.getElementById("form-message");
const waitlistButton = waitlistForm?.querySelector('button[type="submit"]');
const supabaseClient = window.GI_COMPASS_SUPABASE_CLIENT;

waitlistForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  formMessage.classList.remove("is-error", "is-success");

  if (!supabaseClient) {
    formMessage.classList.add("is-error");
    formMessage.textContent =
      "Waitlist backend is not configured yet. Add your Supabase URL and publishable key in assets/js/supabase-config.js.";
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
