# Cross-client test results

**Date:** 2026-06-26  
**Automated validation:** `node emails/validate.mjs` — all checks passed

## Automated checks

| Check | footer.html | footer-signature.html |
|-------|-------------|----------------------|
| Table-based layout | ✓ | ✓ |
| Inline CSS only (no `<style>`) | ✓ | ✓ |
| HTTPS image URLs | ✓ | ✓ |
| Image width/height attributes | ✓ | ✓ |
| Decorative alt="" on wings | ✓ | ✓ |
| Black background `#000000` | ✓ | ✓ |
| Georgia font fallback | ✓ | ✓ |
| Contact + Impressum links | ✓ | ✓ |

## Asset hosting

- `GET /email/wing-left.png` → 200 OK (localhost:3000)
- `GET /email/wing-right.png` → 200 OK (localhost:3000)
- PNG dimensions: 200×197px @2x (display at 100px / 80px)

## Dark mode notes

- Wing PNGs are opaque RGBA on black — no transparent-over-white dependency.
- `preview.html` includes a dark-mode simulation section for local eyeball check.
- Apple Mail dark mode: re-test after deploy; some clients invert `#000000` backgrounds.

## Manual QA (post-deploy)

After deploying to `https://unrulytruly.eu`:

- [ ] Gmail web — paste signature, send test email to self
- [ ] Gmail mobile — verify wings load and layout holds
- [ ] Apple Mail light — signature paste test
- [ ] Apple Mail dark — confirm wings remain visible
- [ ] Outlook web — paste `footer.html` into test message

## Known limitations

- Legal address is `Munich, Germany` until full Impressum address is added to the site.
- Production image URLs require deploy; local preview uses `/email/*` paths.
