# Truly Unruly — Email Footer

Reusable branded footer for personal signatures, newsletters, and transactional email. Matches the site aesthetic: black canvas, wing accents, lowercase name, uppercase tracked links.

## Files

| File | Use |
|------|-----|
| `footer.html` | Master snippet (600px) — Mailchimp, Brevo, Resend/SendGrid partials |
| `footer-signature.html` | Compact variant (480px) — Gmail, Apple Mail, Outlook signatures |
| `preview.html` | Local browser preview (open via dev server or file:// with caveats) |
| `DESIGN-SPEC.md` | Brand token audit and email translation |
| `assets/` | Source wing PNGs (left + right, @2x) |
| `../public/email/` | Hosted copies served at `/email/*` on production |

## Before you deploy

1. **Deploy the site** so `public/email/wing-left.png` and `wing-right.png` are live at:
   - `https://unrulytruly.eu/email/wing-left.png`
   - `https://unrulytruly.eu/email/wing-right.png`
2. **Update legal address** — the Impressum page still has placeholders. Fill `src/app/(site)/impressum/page.tsx`, then update the legal line in both footer HTML files to match.
3. Run validation: `node emails/validate.mjs`

## Platform setup

### Gmail / Apple Mail (personal signature)

1. Open `emails/preview.html` in a browser (`npm run dev` → visit the file or serve from project root).
2. Copy the rendered signature block, or paste `footer-signature.html` HTML using an “Insert HTML” browser extension.
3. In Gmail: Settings → See all settings → General → Signature → paste.
4. In Apple Mail: Settings → Signatures → create/edit → paste (use “Paste and Match Style” may strip formatting — paste raw HTML via extension if needed).

**Plain-text fallback** is in the HTML comment at the top of `footer-signature.html`.

### Mailchimp

1. Campaign or template editor → Footer content block → Code view.
2. Paste contents of `footer.html`.
3. Add unsubscribe merge tag below the footer: `*|UNSUB|*`

### Brevo (Sendinblue)

1. Template editor → Footer block → HTML mode.
2. Paste `footer.html`.
3. Add `{{ unsubscribe }}` merge tag below the footer.

### Resend / SendGrid (future transactional)

Wrap `footer.html` as a partial and inject at send time. Same HTML works in React Email when you add transactional email later.

## Local preview

```bash
npm run dev
# Open emails/preview.html in browser, or:
open http://localhost:3000/email/wing-left.png  # verify assets
```

`preview.html` uses `/email/*` paths for local asset loading. Production snippets use absolute `https://unrulytruly.eu/email/*` URLs.

## Cross-client test checklist

Run after deploy (images must load over HTTPS):

| Client | What to check |
|--------|---------------|
| Gmail (web) | Wings visible, black background, links work |
| Gmail (mobile) | Layout doesn't overflow; text readable |
| Apple Mail (light) | Wings + typography match preview |
| Apple Mail (dark) | Black bg not inverted badly; wings still visible |
| Outlook (web) | Table layout intact; no broken columns |

Automated checks: `node emails/validate.mjs` (structure, inline CSS, HTTPS images, no `<style>` blocks).

## Customization

To change copy or URLs, edit both `footer.html` and `footer-signature.html`:

- **Name / tagline** — center `<p>` blocks
- **Domain** — find/replace `https://unrulytruly.eu`
- **Legal line** — bottom `<p>` in zinc-400
- **Wing size** — `width`/`height` on `<img>` tags (assets are 200×197px @2x)

## Content reference

| Field | Value |
|-------|-------|
| Name | rupert c. lohse |
| Tagline | munich photodesigner |
| Email | contact@unrulytruly.eu |
| Website | https://unrulytruly.eu |
| Impressum | https://unrulytruly.eu/impressum |
