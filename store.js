// store.js — tiny local "database" built on localStorage.
// No server, no real DB — everything lives in this browser only.
// Use Export/Import in the admin panel to move data between devices.
window.Store = (function () {
  const KEY = "portfolio_data_v1";
  const PASS_KEY = "portfolio_admin_pass";

  function getData() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(window.DEFAULT_DATA);
      const saved = JSON.parse(raw);
      // shallow-merge so new default fields (from a data.js update) don't get lost
      return { ...structuredClone(window.DEFAULT_DATA), ...saved };
    } catch (e) {
      console.error("Store read failed", e);
      return structuredClone(window.DEFAULT_DATA);
    }
  }

  function setData(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function resetData() {
    localStorage.removeItem(KEY);
  }

  // --- simple local password gate (not real security, just keeps casual visitors out) ---
  async function hash(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function hasPassword() {
    return !!localStorage.getItem(PASS_KEY);
  }

  async function setPassword(pw) {
    localStorage.setItem(PASS_KEY, await hash(pw));
  }

  async function checkPassword(pw) {
    const saved = localStorage.getItem(PASS_KEY);
    if (!saved) return false;
    return (await hash(pw)) === saved;
  }

  return { getData, setData, resetData, hasPassword, setPassword, checkPassword };
})();
