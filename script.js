const data = window.PORTFOLIO || {};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const safe = value => String(value ?? "");
const setText = (selector, value) => $$(selector).forEach(el => el.textContent = safe(value));
setText("[data-name]", data.name || "Your Name");
setText("[data-role]", `${data.role || "Software Developer"} / ${data.qualification || "MCA Graduate"}`);
setText("[data-tagline]", data.tagline);
setText("[data-about]", data.about);
setText("[data-location]", data.location || "India");
setText("[data-email]", data.email || "your.email@example.com");
setText("[data-phone]", data.phoneDisplay || "+91 XXXXX XXXXX");

const emailLink = $("#emailLink");
emailLink.href = `mailto:${data.email || "your.email@example.com"}`;
const phoneLink = $("#phoneLink");
phoneLink.href = `tel:${data.phoneLink || ""}`;

$$("[data-social]").forEach(link => {
  const key = link.dataset.social;
  if (key === "portfolio") { link.href = data.links?.portfolio || "#home"; return; }
  const url = data.links?.[key] || "";
  if (url && !url.includes("YOUR-")) link.href = url;
  else { link.href = "#contact"; link.title = `Add your ${key} URL in config.js`; }
});

const skillRoot = $("#skillGroups");
(data.skills || []).forEach(group => {
  const card = document.createElement("article");
  card.className = "skill-group reveal";
  const title = document.createElement("h3"); title.textContent = group.title || "Skills";
  const list = document.createElement("div"); list.className = "skill-list";
  (group.items || []).forEach(item => { const chip = document.createElement("span"); chip.className = "skill-chip"; chip.textContent = item; list.append(chip); });
  card.append(title, list); skillRoot.append(card);
});

const projectRoot = $("#projectsGrid");
(data.projects || []).forEach(project => {
  const card = document.createElement("article"); card.className = "project-card reveal";
  const art = document.createElement("div"); art.className = "project-art";
  const mark = document.createElement("span"); mark.textContent = project.mark || "DEV"; art.append(mark);
  const body = document.createElement("div"); body.className = "project-body";
  const title = document.createElement("h3"); title.textContent = project.title || "Project";
  const desc = document.createElement("p"); desc.textContent = project.description || "";
  const tags = document.createElement("div"); tags.className = "project-tags";
  (project.stack || []).forEach(item => { const tag = document.createElement("span"); tag.textContent = item; tags.append(tag); });
  const actions = document.createElement("div"); actions.className = "project-actions";
  const addLink = (label, url) => { if (!url || url.includes("YOUR-")) return; const a = document.createElement("a"); a.href = url; a.textContent = label; a.target = "_blank"; a.rel = "noreferrer"; actions.append(a); };
  addLink("Live demo ↗", project.demo); addLink("GitHub ↗", project.github);
  if (!actions.children.length) { const hint = document.createElement("span"); hint.className = "project-note"; hint.textContent = "Add demo/repository links in config.js"; actions.append(hint); }
  body.append(title, desc, tags, actions); card.append(art, body); projectRoot.append(card);
});

function renderTimeline(rootId, items) {
  const root = document.getElementById(rootId);
  (items || []).forEach(item => {
    const entry = document.createElement("article"); entry.className = "timeline-item reveal";
    const title = document.createElement("h4"); title.textContent = item.title || "";
    const meta = document.createElement("p"); meta.className = "meta"; meta.textContent = [item.place, item.date].filter(Boolean).join(" · ");
    const detail = document.createElement("p"); detail.textContent = item.detail || "";
    entry.append(title, meta, detail); root.append(entry);
  });
}
renderTimeline("educationList", data.education);
renderTimeline("experienceList", data.experience);

$("#year").textContent = new Date().getFullYear();
$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const subject = encodeURIComponent(`Portfolio contact from ${$("#senderName").value.trim()}`);
  const body = encodeURIComponent(`Name: ${$("#senderName").value.trim()}\nEmail: ${$("#senderEmail").value.trim()}\n\n${$("#senderMessage").value.trim()}`);
  window.location.href = `mailto:${data.email || "your.email@example.com"}?subject=${subject}&body=${body}`;
});

const menuToggle = $("#menuToggle"), nav = $("#nav");
menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
$$('#nav a').forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); }));

const back = $("#backToTop"), progress = $("#scrollProgress");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  back.classList.toggle("visible", scrollY > 400);
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();
back.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
$$(".reveal").forEach(el => observer.observe(el));
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    $$("#nav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  }
}), { rootMargin: "-35% 0px -55% 0px" });
$$("main section[id]").forEach(section => sectionObserver.observe(section));

// Existing Projects rendering code
// Keep this code unchanged


// Render Achievements
const achievementsContainer = document.getElementById("achievements-container");

if (achievementsContainer && PORTFOLIO.achievements) {
    achievementsContainer.innerHTML = PORTFOLIO.achievements.map(item => `
        <div class="achievement-card">
            <h3>${item.title}</h3>

            <p>${item.description}</p>

            ${item.link ? `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                    ${item.link.toLowerCase().endsWith(".pdf")
                        ? "View Rank Card →"
                        : "View Profile →"}
                </a>
            ` : ""}
        </div>
    `).join("");
}

// Initialize EmailJS
emailjs.init({
    publicKey: "CNmQ0TIUHreAKUXZN"
});

// Handle Contact Form
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        contactStatus.textContent = "Sending message...";

        emailjs.sendForm(
            "service_f7eo3qf",
            "template_8tf1mjd",
            contactForm
        )
        .then(function() {
            contactStatus.textContent = "Message sent successfully!";
            contactForm.reset();
        })
        .catch(function(error) {
            console.error("EmailJS Error:", error);
            contactStatus.textContent = "Message could not be sent. Please try again.";
        });
    });
}