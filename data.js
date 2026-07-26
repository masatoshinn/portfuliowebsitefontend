// data.js — default seed content.
// Everything here is overridden by localStorage once you save changes from /admin.html
// This file is only the fallback shown on first load / private browsing / another device.
window.DEFAULT_DATA = {
  profile: {
    name: "Golam Mostofa Sadhin",
    role: "Founder & Developer",
    tagline: "Building the Bazil product family — one commit at a time.",
    bio: "I'm a developer and entrepreneur based in Dhaka, running Biytri Technology and building products under the Bazil brand. I handle product, design and code myself — from Android apps to open-source CSS frameworks to the odd anime bot at 2am.",
    location: "Dhaka, Bangladesh",
    email: "hello@bazil.co",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=sadhin",
    socials: {
      github: "https://github.com/biytritecnologist",
      telegram: "",
      linkedin: "",
      facebook: "",
      youtube: ""
    }
  },
  stack: [
    { name: "Kotlin", tag: "Android" },
    { name: "Jetpack Compose", tag: "Android" },
    { name: "JavaScript", tag: "Web" },
    { name: "Next.js", tag: "Web" },
    { name: "CSS", tag: "Web" },
    { name: "Python", tag: "Bots" },
    { name: "Supabase", tag: "Backend" },
    { name: "Git", tag: "Tools" }
  ],
  services: [
    {
      title: "Android Apps",
      desc: "MVVM + Clean Architecture apps built with Kotlin and Jetpack Compose, from PRD to Play Store.",
      file: "android.kt"
    },
    {
      title: "Web Products",
      desc: "Marketing sites and web apps with Next.js, Tailwind and Supabase — planned, built and shipped.",
      file: "web.tsx"
    },
    {
      title: "Design Systems",
      desc: "Component-based CSS frameworks and brand systems built for real teams, not just demos.",
      file: "system.css"
    },
    {
      title: "Automation & Bots",
      desc: "Telegram bots and backend scripts — webhook-based, hosted lean, built to survive shared hosting.",
      file: "bot.py"
    }
  ],
  projects: [
    {
      title: "SwiftSend",
      category: "Android",
      date: "2026",
      desc: "Cross-device file transfer over Wi-Fi Direct and Bluetooth. Part of the Bazil product family.",
      link: "",
      image: ""
    },
    {
      title: "Frin CSS",
      category: "Open Source",
      date: "2026",
      desc: "A component-based CSS framework with a coral/teal palette, BEM modifiers, and zero build step.",
      link: "https://biytritecnologist.github.io/frin/",
      image: ""
    },
    {
      title: "AniOpen",
      category: "Telegram Bot",
      date: "2026",
      desc: "A personal anime-tracking Telegram bot, running webhook-mode on shared cPanel hosting.",
      link: "",
      image: ""
    },
    {
      title: "Bazil",
      category: "Company Site",
      date: "2025",
      desc: "The parent brand site for the product family — built with Next.js, Tailwind, and Supabase.",
      link: "",
      image: ""
    }
  ],
  testimonials: [],
  meta: {
    siteTitle: "Golam Mostofa Sadhin — Developer & Founder",
    accent: "#E8A33D"
  }
};
