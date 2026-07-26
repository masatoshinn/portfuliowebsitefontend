(function () {
  const data = window.Store.getData();
  const $ = (sel) => document.querySelector(sel);

  document.title = data.meta.siteTitle || data.profile.name;
  document.documentElement.style.setProperty("--accent", data.meta.accent || "#E8A33D");

  // ---- nav / brand ----
  $("#brandInitial").textContent = data.profile.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  // ---- hero ----
  $("#heroName").textContent = data.profile.name;
  $("#heroRole").textContent = data.profile.role;
  $("#heroTagline").textContent = data.profile.tagline;
  $("#terminalWho").textContent = data.profile.name.toLowerCase().replace(/\s+/g, "");

  // ---- about ----
  $("#aboutAvatar").src = data.profile.avatar;
  $("#aboutBio").textContent = data.profile.bio;
  $("#aboutLocation").textContent = data.profile.location;
  $("#aboutEmail").textContent = data.profile.email;

  // ---- stack ----
  const stackEl = $("#stackGrid");
  stackEl.innerHTML = data.stack.map(s => `<div class="chip">${escapeHtml(s.name)} <span>· ${escapeHtml(s.tag)}</span></div>`).join("");

  // ---- services ----
  const servicesEl = $("#servicesGrid");
  servicesEl.innerHTML = data.services.map(s => `
    <div class="card">
      <div class="card-file">${escapeHtml(s.file || "service")}</div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.desc)}</p>
    </div>
  `).join("");

  // ---- projects ----
  const projectsEl = $("#projectsGrid");
  projectsEl.innerHTML = data.projects.map(p => `
    <div class="project-card">
      <div class="project-thumb">
        ${p.image ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}">` : `no_preview.png`}
      </div>
      <div class="project-body">
        <div class="project-top">
          <h3>${escapeHtml(p.title)}</h3>
          <span class="project-cat">${escapeHtml(p.category)}</span>
        </div>
        <p>${escapeHtml(p.desc)}</p>
        ${p.link ? `<a class="project-link" href="${escapeAttr(p.link)}" target="_blank" rel="noopener">open project →</a>` : ""}
      </div>
    </div>
  `).join("");

  // ---- testimonials ----
  const testiEl = $("#testimonialsGrid");
  const testiSection = $("#testimonialsSection");
  if (!data.testimonials || data.testimonials.length === 0) {
    testiEl.innerHTML = `<p class="empty-note">// no reviews yet — add some from the admin panel</p>`;
  } else {
    testiEl.innerHTML = data.testimonials.map(t => `
      <div class="testi-card">
        <p>"${escapeHtml(t.text)}"</p>
        <div class="testi-who">
          <img src="${escapeAttr(t.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + encodeURIComponent(t.name))}" alt="">
          <div><b>${escapeHtml(t.name)}</b><span>${escapeHtml(t.role || "")}</span></div>
        </div>
      </div>
    `).join("");
  }

  // ---- contact ----
  $("#contactEmail").textContent = data.profile.email;
  $("#contactEmail").href = "mailto:" + data.profile.email;
  $("#contactLocation").textContent = data.profile.location;
  const socialRow = $("#socialRow");
  const socialLabels = { github: "GitHub", telegram: "Telegram", linkedin: "LinkedIn", facebook: "Facebook", youtube: "YouTube" };
  socialRow.innerHTML = Object.entries(data.profile.socials || {})
    .filter(([, url]) => url)
    .map(([key, url]) => `<a class="btn btn-ghost" href="${escapeAttr(url)}" target="_blank" rel="noopener">${socialLabels[key] || key}</a>`)
    .join("");

  $("#year").textContent = new Date().getFullYear();

  // ---- active tab on scroll ----
  const tabs = document.querySelectorAll(".tab[data-section]");
  const sections = [...tabs].map(t => document.querySelector(t.getAttribute("href")));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tabs.forEach(t => t.classList.remove("active"));
        const match = document.querySelector(`.tab[href="#${entry.target.id}"]`);
        if (match) match.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(s => s && io.observe(s));

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }
})();
