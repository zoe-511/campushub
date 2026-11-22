# Campus Hub

Campus Hub is a responsive student-life platform concept for discovering campus events, finding clubs, and locating support services. The static demo includes an accessible tabbed browser and lets visitors save items locally in their browser.

**Website:** https://zoe-511.github.io/campushub/

## Preview locally

No build step or package installation is required. Serve the `dist` directory with any static file server, for example:

```powershell
python -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Project structure

- `dist/index.html` contains the page structure and content.
- `dist/styles.css` contains the responsive layout and visual design.
- `dist/campus.js` powers the interactive demo and saved items.
- `dist/assets` contains the image, icon, fonts, and font licenses.
- `.github/workflows/pages.yml` publishes `dist` with GitHub Pages.
- `.openai/hosting.json` configures the existing Sites deployment.

## Deployment

The GitHub Actions workflow deploys on changes to `dist` or the workflow itself. The repository's Pages source is configured as **GitHub Actions** under **Settings → Pages → Build and deployment**.

The static output is self-contained and uses relative asset paths, so it works both at the repository Pages path and on the existing Sites host.
