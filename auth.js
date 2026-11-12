// Shared Supabase client + login state for every Fitbro page.
// Load order on each page: supabase-js (CDN) -> auth.js -> page script.
const SUPABASE_URL = "https://iccsikyagmkdtivglzhp.supabase.co";
const SUPABASE_KEY = "sb_publishable_r9cG6p7zAZcyf2K7dm7-pQ_AT4xvHKl"; // publishable key: safe in the browser (Row Level Security protects the data)
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function currentUser() {
  const { data } = await sb.auth.getSession();
  return data.session ? data.session.user : null;
}

function escapeHtml(t) {
  return String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function renderAuthArea() {
  const el = document.getElementById("authArea");
  if (!el) return;
  const u = await currentUser();
  if (u) {
    const name = (u.user_metadata && u.user_metadata.full_name) || (u.email || "").split("@")[0];
    let adminLink = "";
    try {
      const { data } = await sb.from("admins").select("user_id").eq("user_id", u.id).maybeSingle();
      if (data) adminLink = `<a class="auth-btn" href="admin.html">Dashboard</a>`;
    } catch (e) {}
    el.innerHTML = `<span class="auth-name">Hi, ${escapeHtml(name)}</span>${adminLink}<button class="auth-btn" id="logoutBtn">Log out</button>`;
    document.getElementById("logoutBtn").onclick = async () => { await sb.auth.signOut(); location.reload(); };
  } else {
    el.innerHTML = `<a class="auth-btn" href="login.html">Log in</a>`;
  }
}

sb.auth.onAuthStateChange(() => { renderAuthArea(); });
renderAuthArea();
