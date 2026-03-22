# GI Compass Site

Static website for GI Compass.

## Files
- `index.html`
- `about.html`
- `founder.html`
- `styles.css`
- `script.js`
- `logo.svg`
- `favicon.svg`
- `founder-photo.jpg`

## Deploy To GitHub Pages
1. Create a GitHub repository named `gi-compass-site`.
2. Upload all files in this folder.
3. In GitHub, open `Settings` -> `Pages`.
4. Set `Source` to `Deploy from a branch`.
5. Set branch to `main` and folder to `/ (root)`.
6. Save and wait for the temporary GitHub Pages URL.
7. After you buy your domain, create a file named `CNAME` in the repo root.
8. Put your live domain on one line in that file.
   Example: `www.gicompass.ai`
9. In `Settings` -> `Pages`, add the same domain under `Custom domain`.
10. Point your GoDaddy DNS records to GitHub Pages.

## Notes
- `.nojekyll` is included so GitHub Pages serves the static files directly.
- Do not use a GoDaddy site builder for this project.
- The domain should be managed in your GoDaddy account.
- Future edits should be made in code and pushed to GitHub.
