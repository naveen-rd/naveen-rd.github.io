document.documentElement.classList.add("js");

const topbar = document.querySelector("[data-topbar]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const links = [...nav.querySelectorAll("a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
  topbar.classList.toggle("menu-open", open);
};

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

for (const link of links) {
  link.addEventListener("click", () => setMenu(false));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

let frame = 0;

const update = () => {
  frame = 0;
  topbar.classList.toggle("is-scrolled", window.scrollY > 24);

  const marker = window.scrollY + Math.min(200, window.innerHeight * 0.3);
  let current = "";
  for (const section of sections) {
    const top = section.getBoundingClientRect().top + window.scrollY;
    if (top <= marker) current = section.id;
  }
  for (const link of links) {
    link.classList.toggle("is-active", current !== "" && link.getAttribute("href") === `#${current}`);
  }
};

const requestUpdate = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
update();

const revealables = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  for (const el of revealables) observer.observe(el);
} else {
  for (const el of revealables) el.classList.add("is-visible");
}
