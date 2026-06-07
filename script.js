/* ─────────────────────────────────────────────
   script.js – PAWSOME PETZ
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
  buildReviews(cfg);
  buildLocation(cfg);
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
  logo.innerHTML = `<span class="logo-emoji">${cfg.logo_emoji}</span> ${cfg.name}`;
  logo.href = "#hero";

  const links = qs("#nav-links");
  links.innerHTML = `
    <li><a href="#about">About</a></li>
    <li><a href="#services">Packages</a></li>
    <li><a href="#reviews">Reviews</a></li>
    <li><a href="#location">Location</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="${cfg.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="nav-cta nav-whatsapp">💬 WhatsApp</a></li>
  `;

  const mob = qs("#mobile-menu");
  mob.innerHTML = `
    <a href="#about"    class="mobile-link">About</a>
    <a href="#services" class="mobile-link">Packages</a>
    <a href="#reviews"  class="mobile-link">Reviews</a>
    <a href="#location" class="mobile-link">Location</a>
    <a href="#contact"  class="mobile-link">Contact</a>
    <a href="${cfg.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="mobile-link mobile-link-wa">💬 Book via WhatsApp</a>
    <a href="${cfg.phone_url}" class="mobile-link mobile-link-call">📞 Call ${cfg.phone_display}</a>
  `;
}

function buildHero(cfg) {
  const h = cfg.hero;
  const section = qs("#hero");

  section.style.backgroundImage =
    `linear-gradient(rgba(20,8,15,0.60),rgba(20,8,15,0.60)), url('${cfg.background_image_url}')`;
  section.style.backgroundSize     = "cover";
  section.style.backgroundPosition = "center";

  const statsHtml = h.stats
    .map(s => `<div class="stat"><span class="stat-num">${s.number}</span><span class="stat-label">${s.label}</span></div>`)
    .join("");

  qs("#hero-content").innerHTML = `
    <div class="hero-badge">${cfg.logo_emoji} ${cfg.tagline}</div>
    <h1 class="hero-title">${h.heading}</h1>
    <p class="hero-sub">${h.subheading}</p>
    <div class="hero-btns">
      <a href="${cfg.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">💬 ${h.cta_primary}</a>
      <a href="${cfg.phone_url}" class="btn-call">📞 ${h.cta_call}</a>
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
        alt="Professional pet grooming by PAWSOME PETZ"
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
      <div class="about-cta-group">
        <a href="${cfg.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">💬 Book via WhatsApp</a>
        <a href="${cfg.phone_url}" class="btn-call">📞 Call Now</a>
      </div>
    </div>
  `;
}

function buildServices(cfg) {
  const colorClasses = ["color-0", "color-1", "color-2", "color-3"];
  const cardsHtml = cfg.services
    .map((s, i) => {
      const includesHtml = s.includes
        .map(item => `<li><span class="include-check">✓</span>${item}</li>`)
        .join("");
      const featuredBadge = s.featured
        ? `<div class="service-popular-badge">⭐ Most Popular</div>`
        : "";
      const featuredClass = s.featured ? " service-card--featured" : "";
      return `
        <div class="service-card${featuredClass} fade-in">
          ${featuredBadge}
          <div class="service-icon ${colorClasses[i % colorClasses.length]}">${s.icon}</div>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
          <div class="service-price">${s.price} <span>${s.unit}</span></div>
          <ul class="service-includes">${includesHtml}</ul>
          <a href="${cfg.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="btn-book-package">💬 Book This Package</a>
        </div>
      `;
    })
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

function buildReviews(cfg) {
  const reviewsHtml = cfg.reviews
    .map(r => {
      const stars = "⭐".repeat(r.stars);
      const initials = r.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
      return `
        <div class="review-card fade-in">
          <div class="review-header">
            <div class="review-avatar">${initials}</div>
            <div class="review-meta">
              <strong class="review-name">${r.name}</strong>
              <span class="review-pet">🐾 ${r.pet}</span>
            </div>
            <div class="review-stars">${stars}</div>
          </div>
          <p class="review-text">"${r.text}"</p>
          <div class="review-source">
            <img src="https://www.google.com/favicon.ico" alt="Google" width="14" height="14" loading="lazy" />
            <span>Google Review</span>
          </div>
        </div>
      `;
    })
    .join("");

  qs("#reviews-grid").innerHTML = reviewsHtml;
}

function buildLocation(cfg) {
  qs("#location-content").innerHTML = `
    <div class="location-card fade-in">
      <div class="location-icon">🏠</div>
      <h3>Doorstep Grooming</h3>
      <p>We come to you! PAWSOME PETZ provides professional doorstep pet grooming across Bengaluru — no transportation stress for your pet.</p>
      <div class="location-detail">
        <span class="location-detail-icon">📍</span>
        <div>
          <strong>Service Area</strong>
          <span>Bengaluru, Karnataka</span>
        </div>
      </div>
      <div class="location-detail">
        <span class="location-detail-icon">🏠</span>
        <div>
          <strong>Based At</strong>
          <span>C Sector, Amruthnagar, Byatarayanapura, Bengaluru – 560024</span>
        </div>
      </div>
    </div>
    <div class="location-card fade-in">
      <div class="location-icon">🕐</div>
      <h3>Working Hours</h3>
      <div class="hours-grid">
        <div class="hours-row">
          <span class="hours-day">Monday – Sunday</span>
          <span class="hours-time">10:00 AM – 7:00 PM</span>
        </div>
        <div class="hours-status open">🟢 Open Today</div>
      </div>
      <a href="${cfg.maps_url}" target="_blank" rel="noopener noreferrer" class="btn-directions">
        📍 Get Directions on Google Maps
      </a>
    </div>
    <div class="location-card fade-in">
      <div class="location-icon">📞</div>
      <h3>Book an Appointment</h3>
      <p>Call or WhatsApp Santosh directly to schedule your pet's grooming session at a convenient time.</p>
      <div class="location-cta-group">
        <a href="${cfg.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">💬 WhatsApp Us</a>
        <a href="${cfg.phone_url}" class="btn-call">📞 ${cfg.phone_display}</a>
      </div>
    </div>
  `;
}

function buildContact(cfg) {
  const c = cfg.contact;

  const timeSlotsHtml = c.time_slots
    .map(t => `<option>${t}</option>`)
    .join("");

  const serviceOptions = cfg.services
    .map(s => `<option>${s.title} — ${s.price}</option>`)
    .join("");

  qs("#contact-info").innerHTML = `
    <div class="section-tag">Get in Touch</div>
    <h2 class="section-title">${c.heading}</h2>
    <p>${c.subheading}</p>

    <div class="contact-cta-group">
      <a href="${cfg.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp btn-contact-wa">
        💬 Book via WhatsApp
      </a>
      <a href="${cfg.phone_url}" class="btn-call btn-contact-call">
        📞 Call ${cfg.phone_display}
      </a>
    </div>

    <div class="contact-detail">
      <div class="contact-detail-icon">👤</div>
      <div class="contact-detail-text">
        <strong>Contact Person</strong><span>${c.contact_name}</span>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-detail-icon">📍</div>
      <div class="contact-detail-text">
        <strong>Address</strong><span>${c.address}</span>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-detail-icon">📞</div>
      <div class="contact-detail-text">
        <strong>Phone / WhatsApp</strong>
        <span><a href="${cfg.phone_url}" style="color:inherit;text-decoration:none;">${c.phone}</a></span>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-detail-icon">🕐</div>
      <div class="contact-detail-text">
        <strong>Hours</strong><span>${c.hours}</span>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-detail-icon">📍</div>
      <div class="contact-detail-text">
        <strong>Google Maps</strong>
        <span><a href="${cfg.maps_url}" target="_blank" rel="noopener noreferrer" style="color:var(--pink-dark);font-weight:700;">Open in Google Maps →</a></span>
      </div>
    </div>
  `;

  qs("#contact-form-wrap").innerHTML = `
    <div class="contact-form fade-in">
      <h3>${cfg.logo_emoji} Quick Booking Request</h3>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.2rem;">Or WhatsApp for instant response.</p>
      <form id="booking-form" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label for="ownerName">Your Name</label>
            <input type="text" id="ownerName" placeholder="Your name" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone / WhatsApp</label>
            <input type="tel" id="phone" placeholder="+91 XXXXX XXXXX" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="dogName">Pet's Name</label>
            <input type="text" id="dogName" placeholder="Your pet's name" required />
          </div>
          <div class="form-group">
            <label for="breed">Breed / Species</label>
            <input type="text" id="breed" placeholder="e.g. Shih Tzu, Persian Cat" />
          </div>
        </div>
        <div class="form-group">
          <label for="service">Service Package</label>
          <select id="service" required>
            <option value="" disabled selected>Select a package…</option>
            ${serviceOptions}
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
          <textarea id="notes" placeholder="Allergies, nervous pet, special needs…"></textarea>
        </div>
        <button type="submit" class="btn-submit">${cfg.logo_emoji} ${c.form_cta}</button>
      </form>
    </div>
  `;

  requestAnimationFrame(() => {
    const dateInput = document.getElementById("date");
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  });
}

function buildFooter(cfg) {
  qs("#footer-logo").textContent = `${cfg.logo_emoji} ${cfg.name}`;
  qs("#footer-year").textContent = new Date().getFullYear();
  qs("#footer-name").textContent = cfg.name;

  qs("#footer-details").innerHTML = `
    <div class="footer-business-info">
      <p><strong>📍</strong> ${cfg.contact.address}</p>
      <p><strong>📞</strong> <a href="${cfg.phone_url}" style="color:#ccc;">${cfg.phone_display}</a></p>
      <p><strong>🕐</strong> Monday – Sunday: 10:00 AM – 7:00 PM</p>
      <p class="footer-gstin">GSTIN: ${cfg.footer.gstin} | Trade Name: ${cfg.footer.trade_name} | Legal Name: ${cfg.footer.legal_name}</p>
    </div>
    <div class="footer-links-cta">
      <a href="${cfg.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="footer-cta-wa">💬 WhatsApp</a>
      <a href="${cfg.maps_url}" target="_blank" rel="noopener noreferrer" class="footer-cta-maps">📍 Google Maps</a>
    </div>
  `;
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

    showToast("🐾 Booking request sent! Santosh will confirm your slot soon.");
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
