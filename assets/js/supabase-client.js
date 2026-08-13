const supabaseConfig = window.GI_COMPASS_SUPABASE;
const cleanConfigValue = (value) =>
  String(value || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();

const supabaseUrl = cleanConfigValue(supabaseConfig?.url);
const supabaseKey = cleanConfigValue(supabaseConfig?.publishableKey);

window.GI_COMPASS_SUPABASE_CLIENT =
  supabaseConfig &&
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes("YOUR_SUPABASE_PROJECT_URL") &&
  !supabaseKey.includes("YOUR_SUPABASE_PUBLISHABLE_KEY")
    ? window.supabase.createClient(supabaseUrl, supabaseKey)
    : null;
