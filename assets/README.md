# Assets

Drop these in before the "Download Resume" button and project screenshots work:

- `resume.pdf` — your resume, referenced by the nav "Download Resume" buttons.
- `projects/instacart/*.png` (or .jpg) — Instacart Analytics Platform screenshots.
- `projects/wildfire/*.png` — Wildfire Cause Prediction screenshots.
- `projects/foodlens/*.png` — FoodLens ELT Pipeline screenshots.

Once added, update the `images` array for each project in [`js/data.js`](../js/data.js) with the relative paths, e.g.:

```js
images: ["assets/projects/instacart/dashboard.png", "assets/projects/instacart/schema.png"]
```
