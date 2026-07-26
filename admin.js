(function () {
  const $ = (sel) => document.querySelector(sel);
  let state = window.Store.getData();

  // ---------------- LOGIN GATE ----------------
  const gate = $("#gate");
  const panel = $("#panel");

  async function initGate() {
    const hasPass = await window.Store.hasPassword();
    $("#gateTitle").textContent = hasPass ? "Admin Login" : "Set Admin Password";
    $("#gateHint").textContent = hasPass
      ? "Enter your password to manage site content."
      : "First time here — choose a password to protect this panel.";
    $("#gateSubmit").textContent = hasPass ? "Log in" : "Set password & continue";
  }
  initGate();

  $("#gateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pw = $("#gatePassword").value.trim();
    if (!pw) return;
    const hasPass = await window.Store.hasPassword();
    if (!hasPass) {
      await window.Store.setPassword(pw);
      openPanel();
    } else {
      const ok = await window.Store.checkPassword(pw);
      if (ok) openPanel();
      else $("#gateError").textContent = "Wrong password. Try again.";
    }
  });

  function openPanel() {
    gate.style.display = "none";
    panel.style.display = "block";
    renderAll();
  }

  // ---------------- TOAST ----------------
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  // ---------------- SAVE ----------------
  function save(msg) {
    window.Store.setData(state);
    toast(msg || "Saved");
  }

  // ---------------- PROFILE ----------------
  function renderProfile() {
    const p = state.profile;
    $("#profileForm").innerHTML = `
      <div class="field-row">
        <div class="field"><label>Full name</label><input data-bind="profile.name" value="${attr(p.name)}"></div>
        <div class="field"><label>Role / title</label><input data-bind="profile.role" value="${attr(p.role)}"></div>
      </div>
      <div class="field"><label>Tagline (one line, shown under your name)</label><input data-bind="profile.tagline" value="${attr(p.tagline)}"></div>
      <div class="field"><label>Bio</label><textarea data-bind="profile.bio">${p.bio}</textarea></div>
      <div class="field-row">
        <div class="field"><label>Location</label><input data-bind="profile.location" value="${attr(p.location)}"></div>
        <div class="field"><label>Email</label><input data-bind="profile.email" value="${attr(p.email)}"></div>
      </div>
      <div class="field"><label>Avatar image URL</label><input data-bind="profile.avatar" value="${attr(p.avatar)}"></div>
      <div class="field-row">
        <div class="field"><label>GitHub URL</label><input data-bind="profile.socials.github" value="${attr(p.socials.github)}"></div>
        <div class="field"><label>Telegram URL</label><input data-bind="profile.socials.telegram" value="${attr(p.socials.telegram)}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Facebook URL</label><input data-bind="profile.socials.facebook" value="${attr(p.socials.facebook)}"></div>
        <div class="field"><label>LinkedIn URL</label><input data-bind="profile.socials.linkedin" value="${attr(p.socials.linkedin)}"></div>
      </div>
      <div class="field"><label>YouTube URL</label><input data-bind="profile.socials.youtube" value="${attr(p.socials.youtube)}"></div>
      <div class="field-row">
        <div class="field"><label>Site title (browser tab)</label><input data-bind="meta.siteTitle" value="${attr(state.meta.siteTitle)}"></div>
        <div class="field"><label>Accent color (hex)</label><input data-bind="meta.accent" value="${attr(state.meta.accent)}"></div>
      </div>
    `;
    bindInputs($("#profileForm"));
  }

  // ---------------- generic list editor ----------------
  function renderList(containerId, arrKey, fields, emptyTemplate) {
    const container = $(containerId);
    const arr = getPath(state, arrKey);
    container.innerHTML = arr.map((item, i) => `
      <div class="list-item">
        <button type="button" class="remove-btn" data-remove="${arrKey}:${i}">remove</button>
        ${fields.map(f => `
          <div class="field">
            <label>${f.label}</label>
            ${f.type === "textarea"
              ? `<textarea data-bind="${arrKey}.${i}.${f.key}">${item[f.key] || ""}</textarea>`
              : `<input data-bind="${arrKey}.${i}.${f.key}" value="${attr(item[f.key])}">`}
          </div>
        `).join("")}
      </div>
    `).join("") + `<button type="button" class="btn-add" data-add="${arrKey}">+ add ${emptyTemplate ? "item" : ""}</button>`;
    bindInputs(container);
    container.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const [key, idx] = btn.dataset.remove.split(":");
        getPath(state, key).splice(Number(idx), 1);
        renderAll();
        save("Removed");
      });
    });
    const addBtn = container.querySelector("[data-add]");
    addBtn.addEventListener("click", () => {
      getPath(state, arrKey).push(structuredClone(emptyTemplate));
      renderAll();
    });
  }

  function renderStack() {
    renderList("#stackList", "stack",
      [{ key: "name", label: "Skill name" }, { key: "tag", label: "Category (e.g. Web, Android)" }],
      { name: "New skill", tag: "Category" });
  }

  function renderServices() {
    renderList("#servicesList", "services",
      [{ key: "title", label: "Title" }, { key: "file", label: "Label (shown like a filename, e.g. android.kt)" }, { key: "desc", label: "Description", type: "textarea" }],
      { title: "New service", file: "service.ext", desc: "Describe what you offer." });
  }

  function renderProjects() {
    renderList("#projectsList", "projects",
      [
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "date", label: "Date / year" },
        { key: "desc", label: "Description", type: "textarea" },
        { key: "image", label: "Image URL (optional)" },
        { key: "link", label: "Project link (optional)" }
      ],
      { title: "New project", category: "Web", date: "2026", desc: "Describe the project.", image: "", link: "" });
  }

  function renderTestimonials() {
    renderList("#testimonialsList", "testimonials",
      [
        { key: "name", label: "Client name" },
        { key: "role", label: "Role / company" },
        { key: "text", label: "Review text", type: "textarea" },
        { key: "avatar", label: "Avatar image URL (optional)" }
      ],
      { name: "Client name", role: "Role", text: "What they said.", avatar: "" });
  }

  // ---------------- bind + path helpers ----------------
  function bindInputs(root) {
    root.querySelectorAll("[data-bind]").forEach(el => {
      el.addEventListener("input", () => {
        setPath(state, el.dataset.bind, el.value);
      });
    });
  }
  function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function setPath(obj, path, value) {
    const keys = path.split(".");
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
    cur[keys[keys.length - 1]] = value;
  }
  function attr(v) { return String(v ?? "").replace(/"/g, "&quot;"); }

  function renderAll() {
    renderProfile();
    renderStack();
    renderServices();
    renderProjects();
    renderTestimonials();
  }

  // ---------------- top actions ----------------
  $("#saveBtn").addEventListener("click", () => save("Saved ✓"));

  $("#viewSiteBtn").addEventListener("click", () => window.open("index.html", "_blank"));

  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "portfolio-data.json"; a.click();
    URL.revokeObjectURL(url);
  });

  $("#importInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state = JSON.parse(reader.result);
        window.Store.setData(state);
        renderAll();
        toast("Imported ✓");
      } catch {
        toast("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  });
  $("#importBtn").addEventListener("click", () => $("#importInput").click());

  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all content back to the default template? This cannot be undone.")) return;
    window.Store.resetData();
    state = window.Store.getData();
    renderAll();
    toast("Reset to defaults");
  });
})();
