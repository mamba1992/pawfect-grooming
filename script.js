/* ─────────────────────────────────────────────
   script.js – Pawfect Grooming Studio
   Loads content from data/site-config.json,
   builds the page, and wires up interactions.
───────────────────────────────────────────── */

(async function () {
  /* ── 1. Load config ── */
  let cfg;
  try {
    const res = await fetch("data/site-config.json");
    if (!res.ok) throw new Error("fetch failed");
    const json = await res.json();
    cfg = json.business;
  } catch (err) {
    console.error("Could not load site-config.json:", err);
    hideLoader();
    document.body.innerHTML =
      `<div style="font-family:sans-serif;padding:3rem;text-align:center;color:#c9607a">
        <h2>⚠️ Could not load site content</h2>
        <p style="margin-top:1rem;color:#888">
          If you're viewing this locally via <strong>file://</strong>,
          please serve the project with a local server:<br><br>
          <code>npx serve .</code> &nbsp;or&nbsp; <code>python3 -m http.server</code>
        </p>
      </div>`;
    return;
  }

  /* ── 2. Build each section ── */
  buildNavbar(cfg);
  buildHero(cfg);
  buildAbout(cfg);
  buildServices(cfg);
  buildWhyUs(cfg);
  buildContact(cfg);
  buildFooter(cfg);

  /* ── 3. Wire interactions ── */
  initNavScroll();
  initHamburger();
  initFadeIn();
  initScrollTop();
  initBookingForm(cfg.contact);

  /* ── 4. Hide loader ── */
  hideLoader();
})();

/* ═══════════════════════════════════════════
   BUILD FUNCTIONS
═══════════════════════════════════════════ */

function buildNavbar(cfg) {
  const logo = qs("#nav-logo");
  logo.innerHTML = `<span class="logo-emoji">${cfg.logo_emoji}</span> ${cfg.name.split(" ")[0]}`;
  logo.href = "#hero";

  const links = qs("#nav-links");
  links.innerHTML = `
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#why">Why Us</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#contact" class="nav-cta">${cfg.hero.cta_primary}</a></li>
  `;

  const mob = qs("#mobile-menu");
  mob.innerHTML = `
    <a href="#about"    class="mobile-link">About</a>
    <a href="#services" class="mobile-link">Services</a>
    <a href="#why"      class="mobile-link">Why Us</a>
    <a href="#contact"  class="mobile-link">Contact</a>
    <a href="#contact"  class="mobile-link">📅 ${cfg.hero.cta_primary}</a>
  `;
}

function buildHero(cfg) {
  const h = cfg.hero;
  const section = qs("#hero");

  // Background image with overlay
  section.style.backgroundImage =
    `linear-gradient(rgba(30,10,20,0.52),rgba(30,10,20,0.52)), url('${cfg.background_image_url}')`;
  section.style.backgroundSize     = "cover";
  section.style.backgroundPosition = "center";

  // Title: wrap last word in .accent
  const words = h.heading.split(" ");
  const lastWord = words.pop();
  const headingHtml = `${words.join(" ")} <span class="accent">${lastWord}</span>`;

  const statsHtml = h.stats
    .map(s => `<div class="stat"><span class="stat-num">${s.number}</span><span class="stat-label">${s.label}</span></div>`)
    .join("");

  qs("#hero-content").innerHTML = `
    <div class="hero-badge">${cfg.logo_emoji} ${cfg.tagline}</div>
    <h1 class="hero-title">${headingHtml}</h1>
    <p class="hero-sub">${h.subheading}</p>
    <div class="hero-btns">
      <a href="#contact" class="btn-primary">📅 ${h.cta_primary}</a>
      <a href="#services" class="btn-outline">${h.cta_secondary}</a>
    </div>
    <div class="hero-stats">${statsHtml}</div>
  `;
}

function buildAbout(cfg) {
  const a = cfg.about;

  const featuresHtml = a.features
    .map(f => `<li><span class="feat-icon">${f.icon}</span>${f.text}</li>`)
    .join("");

  qs("#about-content").innerHTML = `
    <div class="about-img-wrap fade-in">
      <img
        src="${a.image_url}"
        alt="Cute dog being groomed"
        loading="lazy"
        onerror="this.style.background='linear-gradient(135deg,#fce4f3,#ffeedd)';this.removeAttribute('src')"
      />
      <div class="about-img-badge">
        <span class="badge-emoji">${a.image_badge_emoji}</span>
        <div>
          <strong style="display:block;font-size:0.97rem;">${a.image_badge_title}</strong>
          <span style="font-size:0.76rem;color:#888;font-weight:600;">${a.image_badge_subtitle}</span>
        </div>
      </div>
    </div>
    <div class="fade-in">
      <div class="section-tag">About Us</div>
      <h2 class="section-title">${a.heading}</h2>
      <p style="color:#777;line-height:1.75;margin-bottom:0.9rem;">${a.description_1}</p>
      <p style="color:#777;line-height:1.75;">${a.description_2}</p>
      <ul class="about-features">${featuresHtml}</ul>
      <a href="#contact" class="btn-primary">${a.cta}</a>
    </div>
  `;
}

function buildServices(cfg) {
  const colorClasses = ["color-0", "color-1", "color-2", "color-3"];
  const cardsHtml = cfg.services
    .map((s, i) => `
      <div class="service-card fade-in">
        <div class="service-icon ${colorClasses[i % colorClasses.length]}">${s.icon}</div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <div class="service-price">${s.price} <span>${s.unit}</span></div>
      </div>
    `)
    .join("");

  qs("#services-grid").innerHTML = cardsHtml;
}

function buildWhyUs(cfg) {
  const cardsHtml = cfg.why_us
    .map(w => `
      <div class="why-card fade-in">
        <span class="why-emoji">${w.emoji}</span>
        <h3>${w.title}</h3>
        <p>${w.description}</p>
      </div>
    `)
    .join("");

  qs("#why-grid").innerHTML = cardsHtml;
}

function buildContact(cfg) {
  const c = cfg.contact;

  const timeSlotsHtml = c.time_slots
    .map(t => `<option>${t}</option>`)
    .join("");

  // Build service options from services list
  const serviceOptions = cfg.services
    .map(s => `<option>${s.title} — ${s.price}</option>`)
    .join("");

  qs("#contact-info").innerHTML = `
    <div class="section-tag">Get in Touch</div>
    <h2 class="section-title">${c.heading}</h2>
    <p>${c.subheading}</p>
    <div class="contact-detail">
      <div class="contact-detail-icon">📍</div>
      <div class="contact-detail-text">
        <strong>Address</strong><span>${c.address}</span>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-detail-icon">📞</div>
      <div class="contact-detail-text">
        <strong>Phone</strong><span>${c.phone}</span>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-detail-icon">✉️</div>
      <div class="contact-detail-text">
        <strong>Email</strong><span>${c.email}</span>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-detail-icon">🕐</div>
      <div class="contact-detail-text">
        <strong>Hours</strong><span>${c.hours}</span>
      </div>
    </div>
  `;

  qs("#contact-form-wrap").innerHTML = `
    <div class="contact-form fade-in">
      <h3>${cfg.logo_emoji} Let's Get Your Pup Booked!</h3>
      <form id="booking-form" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label for="ownerName">Your Name</label>
            <input type="text" id="ownerName" placeholder="Jane Smith" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" placeholder="(555) 000-0000" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="dogName">Dog's Name</label>
            <input type="text" id="dogName" placeholder="Buddy" required />
          </div>
          <div class="form-group">
            <label for="breed">Breed</label>
            <input type="text" id="breed" placeholder="Golden Retriever" />
          </div>
        </div>
        <div class="form-group">
          <label for="service">Service</label>
          <select id="service" required>
            <option value="" disabled selected>Select a service…</option>
            ${serviceOptions}
            <option>Full Grooming Package (All Services)</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="date">Preferred Date</label>
            <input type="date" id="date" required />
          </div>
          <div class="form-group">
            <label for="time">Preferred Time</label>
            <select id="time">
              <option value="" disabled selected>Pick a time…</option>
              ${timeSlotsHtml}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="notes">Special Notes (optional)</label>
          <textarea id="notes" placeholder="Allergies, special needs, or extra info…"></textarea>
        </div>
        <button type="submit" class="btn-submit">${cfg.logo_emoji} ${c.form_cta}</button>
      </form>
    </div>
  `;

  // Set min date on the date input
  requestAnimationFrame(() => {
    const dateInput = document.getElementById("date");
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  });
}

function buildFooter(cfg) {
  qs("#footer-logo").textContent = `${cfg.logo_emoji} ${cfg.name}`;
  qs("#footer-year").textContent = new Date().getFullYear();
  qs("#footer-name").textContent = cfg.name;
}

/* ═══════════════════════════════════════════
   INTERACTION FUNCTIONS
═══════════════════════════════════════════ */

function initNavScroll() {
  const navbar = qs("#navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });
}

function initHamburger() {
  const btn  = qs("#hamburger");
  const menu = qs("#mobile-menu");

  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    menu.classList.toggle("open");
  });

  // Close on link click (delegated)
  menu.addEventListener("click", e => {
    if (e.target.tagName === "A") {
      btn.classList.remove("open");
      menu.classList.remove("open");
    }
  });
}

function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.1 });

  // Observe .fade-in elements once DOM is fully populated
  requestAnimationFrame(() => {
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
  });
}

function initScrollTop() {
  const btn = qs("#scroll-top");
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 420);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initBookingForm() {
  // Form might not be in DOM yet; use event delegation on #contact
  qs("#contact").addEventListener("submit", e => {
    if (e.target.id !== "booking-form") return;
    e.preventDefault();

    const required = ["ownerName", "phone", "dogName", "service", "date"];
    let valid = true;

    required.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        el && el.classList.add("error");
        setTimeout(() => el && el.classList.remove("error"), 2500);
        valid = false;
      }
    });

    if (!valid) return;

    showToast("🐾 Booking request sent! We'll confirm soon.");
    e.target.reset();
  });
}

/* ═══════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════ */

function qs(selector) {
  return document.querySelector(selector);
}

function hideLoader() {
  const overlay = qs("#loading-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    setTimeout(() => overlay.remove(), 450);
  }
}

function showToast(msg) {
  let toast = qs("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}
