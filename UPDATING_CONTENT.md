# Updating Your Portfolio Content

All portfolio content lives in `src/data/`. **Never touch component files** — just edit the JSON and the site updates automatically.

---

## Quick Reference

| To update... | Edit this file |
|---|---|
| Name, title, email, social links, summary | `src/data/profile.json` |
| Work experience | `src/data/experience.json` |
| Projects | `src/data/projects.json` |
| Skills & technologies | `src/data/skills.json` |
| Certifications & achievements | `src/data/achievements.json` |
| Education details | `src/data/education.json` |

---

## Adding a New Project

Open `src/data/projects.json` and add a new object to the array:

```json
{
  "id": "proj-7",
  "title": "My New Project",
  "description": "One-line summary shown on the card.",
  "longDescription": "Longer description shown in the expanded view.",
  "category": "AI/LLM",
  "techStack": ["Python", "FastAPI", "Redis"],
  "bullets": [
    "Key achievement or technical detail",
    "Another highlight"
  ],
  "github": "https://github.com/yourname/repo",
  "demo": "",
  "featured": false,
  "status": "Completed"
}
```

**Valid `category` values** (controls filter tabs): `AI/LLM`, `Backend`, `Full-Stack`, `DevTools`, `Mobile`
**Valid `status` values**: `Completed`, `In Progress`

---

## Adding Work Experience

Open `src/data/experience.json` and prepend a new entry (most recent first):

```json
{
  "id": "exp-3",
  "company": "Company Name",
  "role": "Software Engineering Intern",
  "type": "Internship",
  "startDate": "Jun 2025",
  "endDate": "Aug 2025",
  "current": false,
  "location": "Remote",
  "description": "Brief overview sentence.",
  "bullets": [
    "What you built and the measurable impact",
    "Another bullet"
  ],
  "techStack": ["Python", "Docker", "AWS"]
}
```

Set `"current": true` and omit `endDate` if it's your current role.

---

## Adding a Skill Category

Open `src/data/skills.json` and add a new object:

```json
{
  "category": "New Category",
  "icon": "🔧",
  "color": "cyan",
  "items": ["Tool A", "Tool B", "Tool C"]
}
```

**Valid `color` values**: `cyan`, `purple`, `green`

---

## Adding an Achievement / Certification

Open `src/data/achievements.json` and add:

```json
{
  "id": "ach-6",
  "title": "Certification Name",
  "description": "What it covers and why it matters.",
  "date": "2025-03",
  "issuingBody": "Issuing Organization",
  "type": "Certification",
  "credentialUrl": "https://link-to-credential.com",
  "badgeColor": "cyan"
}
```

**Valid `type` values**: `Certification`, `Hackathon`, `Achievement`
**Valid `badgeColor` values**: `cyan`, `purple`, `green`

---

## Updating Profile Info

Edit `src/data/profile.json`:

- **Resume PDF**: Place your resume at `public/resume.pdf`. The `resumeUrl` field is already set to `/resume.pdf`.
- **Social links**: Leave a field as `""` to hide that icon.
- **Taglines**: The hero typing effect cycles through `taglines[]` — edit or add strings.

---

## Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import repo at vercel.com — it auto-detects Vite
3. Done. Auto-deploys on every push to `main`.

### GitHub Pages
1. In repo Settings → Pages → Source: **GitHub Actions**
2. Push to `main` — the workflow at `.github/workflows/deploy.yml` builds and deploys automatically.
3. If using a custom domain, set `base` in `vite.config.js` to `'/'`. Otherwise set it to `'/repo-name/'`.
