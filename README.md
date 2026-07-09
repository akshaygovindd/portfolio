# Akshay Govind — Portfolio

Personal portfolio site for Akshay Govind, Data Analyst & BI Engineer.

Single-file static site (`index.html`), no build step, no dependencies.

## Live site
- Vercel: _(add link once deployed)_
- Domain: akshaygovind.com _(pending)_

## Deploy on Vercel

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Other** (no build command needed — it's static HTML).
4. Deploy. You'll get a `*.vercel.app` URL immediately.

### Connect a custom domain later
1. Buy `akshaygovind.com` from any registrar (Namecheap, Google Domains, etc).
2. In the Vercel project → **Settings → Domains** → add `akshaygovind.com`.
3. Vercel will show you the DNS records to add (usually an `A` record or `CNAME`) — add those at your registrar.
4. Wait for DNS propagation (usually minutes to a few hours), then the domain goes live automatically with SSL.

## Push to GitHub

```bash
cd akshay-portfolio
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/akshaygovindd/portfolio.git
git push -u origin main
```

(Create the empty repo first at github.com/new, name it `portfolio` or whatever you prefer, then swap the remote URL above if different.)

## Structure

```
.
├── index.html   # entire site — HTML, CSS, and JS in one file
└── README.md
```
