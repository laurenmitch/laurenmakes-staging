# Studio Mood — interior design inspiration site

A static, dependency-free site. Pick a mood board on the home page, click in, and
scroll a full room plan: the style, paint colors, what to thrift / DIY / splurge on / buy.
Built to host **free on GitHub Pages** with a custom domain.

## Files

```
index.html            Home — collage gallery of the 5 mood boards
style.html            The reusable style-flow template (all 6 sections)
assets/css/main.css   All styling + design tokens (edit :root to re-theme)
assets/js/main.js     Scroll-reveal, tilt-on-hover, marquee (no libraries)
assets/img/*.svg      Placeholder tiles — replace with your real photos
```

## How to edit

- **Swap an image:** drop your photo in `assets/img/` and point the `<img src="…">` at it.
- **Re-theme colors/fonts:** edit the `:root` variables at the top of `main.css`.
- **Rename a mood board:** edit its `.board__title` / `.board__tags` in `index.html`.
- **Add affiliate links:** replace `href="#"` on any `.pick__link` with your ShopMy URL.
- **Add a 2nd style page:** copy `style.html` to e.g. `warm-minimalist.html`, edit the
  content, and point that board's link at it in `index.html`.

## Preview locally

```bash
cd design-inspo && python3 -m http.server 8000
```
Then open http://localhost:8000

## Deploy to GitHub Pages

1. Create a new repo, push these files.
2. Repo **Settings → Pages →** deploy from `main` / root.
3. For a custom domain: add a `CNAME` file containing your domain, and point the
   domain's DNS at GitHub Pages.

## Notes

- Fonts load from Google Fonts (client-side). Self-host later if you want zero external calls.
- `prefers-reduced-motion` is respected — animations turn off for those users.
