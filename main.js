// === ACTIVE NAV LINK ===
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".header-list a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// === SMOOTH SCROLL FOR HASH LINKS ===
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#") {
      e.preventDefault();
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// === CONTACT FORM -> TELEGRAM BOT ===
// 1. Create a bot with @BotFather on Telegram and copy the token.
// 2. Send any message to your bot, then open
//    https://api.telegram.org/bot<TOKEN>/getUpdates and copy the chat id.
// NOTE: this token is visible in the page source. Anyone could send messages
// to your bot with it. For a portfolio it is usually acceptable; if your bot
// becomes a spam target, move this call into a small serverless function.
const TELEGRAM_BOT_TOKEN = "9204827242:AAH5Aew7XCspaTtxIQLoT6OyQcOfldpGy4Q";
const TELEGRAM_CHAT_ID = "7861093002";

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button");
    const originalText = btn.textContent;
    const data = new FormData(contactForm);
    const text =
      "New message from your portfolio\n\n" +
      `Name: ${data.get("name")}\n` +
      `Email: ${data.get("email")}\n` +
      `Subject: ${data.get("subject")}\n\n` +
      `Message:\n${data.get("message")}`;

    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
        }
      );
      const result = await res.json();
      if (!result.ok) {
        throw new Error(result.description || "Telegram error");
      }
      alert("Thank you! Your message has been sent.");
      contactForm.reset();
    } catch (err) {
      console.error(err);
      alert(
        "Sorry, the message could not be sent. Please try again or email me directly."
      );
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

// === FADE-IN ON PAGE LOAD (also resets state restored from back/forward cache) ===
window.addEventListener("pageshow", () => {
  document.body.classList.remove("page-fade-out");
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".fade-in-element").forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("visible");
    }, i * 150);
  });

  document.querySelectorAll("a.fade-link[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      document.body.classList.add("page-fade-out");
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });
});

// === MOBILE SLIDE MENU ===
const menuToggle = document.getElementById("menu-toggle");
const slideMenu = document.getElementById("slide-menu");
const menuOverlay = document.getElementById("menu-overlay");
const menuClose = document.getElementById("menu-close");

function setMenu(open) {
  slideMenu.classList.toggle("active", open);
  menuOverlay.classList.toggle("active", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", () => {
  setMenu(!slideMenu.classList.contains("active"));
});
menuToggle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    setMenu(!slideMenu.classList.contains("active"));
  }
});
menuClose.addEventListener("click", () => setMenu(false));
menuOverlay.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setMenu(false);
  }
});
