# 🐾 Pawfect Grooming Studio

A clean, responsive, single-page dog grooming website — built with plain HTML, CSS, and JavaScript.  
All business content lives in one JSON file. Zero build tools. Free to host on GitHub Pages.

---

## 📁 Project Structure

```
pawfect-grooming/
├── index.html                  # Page shell (do not edit for content changes)
├── styles.css                  # All styling
├── script.js                   # Loads JSON, builds the page, handles interactions
├── data/
│   └── site-config.json        # ← Edit this file to update all site content
├── .github/
│   └── workflows/
│       └── deploy.yml          # Auto-deploy to GitHub Pages on every push to main
└── README.md
```

---

## ✏️ How to Edit Site Content

All text, images, services, and contact info live in **`data/site-config.json`**.  
You never need to touch `index.html` or `script.js` for routine updates.

### Common edits:

| What to change              | Key in `site-config.json`                        |
|-----------------------------|--------------------------------------------------|
| Business name               | `business.name`                                  |
| Hero heading / subheading   | `business.hero.heading` / `business.hero.subheading` |
| Background image            | `business.background_image_url`                  |
| CTA button text             | `business.hero.cta_primary` / `cta_secondary`    |
| Phone / email / address     | `business.contact.phone` / `.email` / `.address` |
| Opening hours               | `business.contact.hours`                         |
| Services (title/price/desc) | `business.services[]`                            |
| Why-us cards                | `business.why_us[]`                              |
| About section               | `business.about.*`                               |
| Stats (hero section)        | `business.hero.stats[]`                          |

### Example — change the phone number:
```json
"contact": {
  "phone": "(555) 987-6543",
  ...
}
```

### Example — add a new service:
```json
{
  "icon":        "💅",
  "title":       "Paw Spa Treatment",
  "description": "Luxurious paw soak and massage for ultimate relaxation.",
  "price":       "$22",
  "unit":        "/ session"
}
```

---

## 🚀 Deploying to GitHub Pages (Free)

### Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repo (e.g. `pawfect-grooming`)
3. Set visibility to **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Step 2 — Push the project

```bash
cd pawfect-grooming
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

The included `.github/workflows/deploy.yml` will automatically deploy on every push to `main`.

### Step 4 — Your site is live! 🎉

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

---

## 🔄 How CI/CD Works

Every time you push a commit to the `main` branch:

1. GitHub Actions triggers `.github/workflows/deploy.yml`
2. The workflow checks out your code
3. It uploads the static files as a Pages artifact
4. GitHub deploys the artifact to your Pages URL automatically

You can monitor deployments in the **Actions** tab of your repository.

---

## 🖥️ Local Development

Since the site uses `fetch()` to load JSON, you need a local HTTP server (not `file://`):

```bash
# Option 1 — Node.js (if installed)
npx serve .

# Option 2 — Python 3
python3 -m http.server 8080

# Option 3 — VS Code
# Install the "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8080` in your browser.

---

## 🎨 Customising the Design

- **Colors** — edit the CSS variables at the top of `styles.css` (`:root { --pink: ...; }`)
- **Fonts** — swap the Google Fonts `<link>` in `index.html`
- **Layout** — all layout is in `styles.css`; look for section comments like `/* ─── Services ─── */`

---

## 📄 License

MIT — free to use for personal and commercial projects.
