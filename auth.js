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

// Header styles for the login / logout area
(function () {
  const css = `
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .auth-area { display: flex; align-items: center; gap: 10px; }
  .auth-name { color: #fff; font-size: 14px; font-weight: 500; }
  .auth-btn { color: #fff; background: transparent; border: 2px solid #3a4250; border-radius: 4px; padding: 9px 14px;
    font: 600 14px 'Work Sans', sans-serif; text-decoration: none; cursor: pointer; transition: border-color .2s; }
  .auth-btn:hover { border-color: #ffd60a; }
  @media (max-width: 640px) { .auth-name { display: none; } }`;
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
})();

async function renderAuthArea() {
  const el = document.getElementById("authArea");
  if (!el) return;
  const u = await currentUser();
  if (u) {
    const name = (u.user_metadata && u.user_metadata.full_name) || (u.email || "").split("@")[0];
    el.innerHTML = `<span class="auth-name">Hi, ${escapeHtml(name)}</span><button class="auth-btn" id="logoutBtn">Log out</button>`;
    document.getElementById("logoutBtn").onclick = async () => { await sb.auth.signOut(); location.reload(); };
  } else {
    el.innerHTML = `<a class="auth-btn" href="login.html">Log in</a>`;
  }
}

sb.auth.onAuthStateChange(() => { renderAuthArea(); });
renderAuthArea();
