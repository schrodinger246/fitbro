// Fitbro: dark-mode switch, animated background, scroll-reveal.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setTheme(t, save) {
    root.setAttribute("data-theme", t);
    if (save) { try { localStorage.setItem("fitbroTheme", t); } catch (e) {} }
    var b = document.getElementById("themeToggle");
    if (b) {
      b.setAttribute("aria-pressed", t === "dark");
      b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  // Animated glass backdrop
  var blobs = document.createElement("div");
  blobs.className = "blobs";
  blobs.setAttribute("aria-hidden", "true");
  blobs.innerHTML = "<i></i><i></i><i></i>";
  document.body.prepend(blobs);

  // Toggle button in the header
  var actions = document.querySelector(".nav-actions");
  if (!actions) {
    actions = document.createElement("div");
    actions.className = "nav-actions";
    var nav = document.querySelector(".nav");
    if (nav) nav.appendChild(actions);
  }
  var btn = document.createElement("button");
  btn.type = "button";
  btn.id = "themeToggle";
  btn.className = "icon-btn theme-toggle";
  btn.innerHTML =
    '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
    '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  actions.prepend(btn);
  setTheme(root.getAttribute("data-theme") || "light", false);

  btn.addEventListener("click", function () {
    root.classList.add("theme-anim");
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    btn.classList.remove("spin"); void btn.offsetWidth; btn.classList.add("spin");
    setTimeout(function () { root.classList.remove("theme-anim"); }, 500);
  });

  // Scroll reveal
  var io = null;
  if (!reduce && "IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  function scan() {
    if (!io) return;
    var els = document.querySelectorAll(".section-head, .cat, .feature, .banner .section, .about-text, .contact-text, .product");
    var i = 0;
    els.forEach(function (el) {
      if (el.dataset.rv) return;
      el.dataset.rv = "1";
      el.style.setProperty("--d", (i++ % 4) * 0.08 + "s");
      el.classList.add("reveal");
      io.observe(el);
    });
  }
  window.fitbroReveal = scan;
  scan();
})();
