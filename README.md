# VisionVT Entertainment

This repository contains a simple single-page site that lists social links for VisionVT.

Files added:
- `index.html` — Landing page titled **VisionVT Entertainment** with links.
- `styles.css` — Simple responsive styling.

Deployment / GitHub Pages
- To get the GitHub Pages URL `https://visionvt.github.io` you must create a repository named `visionvt.github.io` in the GitHub account `visionvt`. Push this site to the repository's `main` (or `gh-pages`) branch and enable Pages in repository settings.
- Alternatively, enable GitHub Pages from this repository and use the provided `username.github.io/repo` URL, or add a custom domain via the Pages settings (create a `CNAME` file with your domain if needed).

Editing links
- `index.html` contains placeholder profile URLs (e.g. `https://twitter.com/visionvt`). Replace those with your exact profile URLs.

If you'd like, I can:
- Rename this repo (locally) and prepare instructions to create the `visionvt.github.io` repository.
- Add a `CNAME` file for a custom domain.

# VisionVT Entertainment

This repository contains a simple single-page site that lists social links for VisionVT.

Files added:
- `index.html` — Landing page titled **VisionVT Entertainment** with links.
- `styles.css` — Simple responsive styling.

Deployment / GitHub Pages
- To get the GitHub Pages URL `https://visionvt.github.io` you must create a repository named `visionvt.github.io` in the GitHub account `visionvt`. Push this site to the repository's `main` (or `gh-pages`) branch and enable Pages in repository settings.
- Alternatively, enable GitHub Pages from this repository and use the provided `username.github.io/repo` URL, or add a custom domain via the Pages settings (create a `CNAME` file with your domain if needed).

Editing links
- `index.html` contains placeholder profile URLs (e.g. `https://twitter.com/visionvt`). Replace those with your exact profile URLs.

If you'd like, I can:
- Rename this repo (locally) and prepare instructions to create the `visionvt.github.io` repository.
- Add a `CNAME` file for a custom domain.

Quick publish script
- **Script path:** `publish_to_user_pages.sh`
- **Purpose:** Creates a GitHub repository named `visionvt.github.io` (via `gh` if available) and pushes this repository so the site is available at `https://visionvt.github.io`.
- **How to run (zsh / macOS):**
```
chmod +x publish_to_user_pages.sh
./publish_to_user_pages.sh
```
- **Manual commands (if you don't use the script):**
```
# 1. Create a repo on GitHub named: visionvt.github.io (web UI or `gh repo create`)
# 2. Add remote (example using SSH):
git remote add origin git@github.com:visionvt/visionvt.github.io.git
# 3. Push to the new repo's main branch:
git push -u origin main
# 4. Confirm Pages in the repo Settings → Pages. The site will be at https://visionvt.github.io
```

