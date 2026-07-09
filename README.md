# Akshay Govind — Portfolio

Personal portfolio site for Akshay Govind, Data Analyst / Data Engineer.

Plain HTML/CSS/JS, no build step, no dependencies beyond Google Fonts. Open `index.html` directly in a browser and it works.

## Live site
- Vercel (auto-deploys on push to `main`): https://portfolio-alpha-eight-hu2j5tmewh.vercel.app
- GitHub: https://github.com/akshaygovindd/portfolio

## Structure

```
.
├── index.html          # markup only — content is rendered in from js/data.js
├── css/style.css        # design system (CSS variables) + all styles
├── js/data.js            # edit this to update experience, skills, projects, contact info
├── js/main.js             # rendering, nav, hero animation, project modal, scroll reveal
├── assets/
│   ├── resume.pdf          # add your resume here (see assets/README.md)
│   └── projects/<slug>/    # screenshots per project, referenced from js/data.js
└── README.md
```

## Making changes

Almost all content edits happen in **`js/data.js`** — experience bullets, skills, project descriptions, metrics, and contact info are all plain JS objects/arrays there. No HTML editing needed for text changes.

Project detail modals (click a project card) pull from the same file's `longDesc`, `metrics`, `decisions`, and `images` fields.

## Deploy

Push to `main` — Vercel auto-deploys via its GitHub integration. No manual `vercel --prod` needed.

```bash
git add -A
git commit -m "describe your change"
git push
```

GitHub Pages is also enabled on this repo (Settings → Pages) as a secondary static host, serving directly from `main` with zero build config.

## Accent color

The teal accent (`#2dd496`) is a single CSS variable — `--accent` in `css/style.css` — swap it there to re-theme the whole site.
