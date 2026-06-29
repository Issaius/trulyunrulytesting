# Truly Unruly — Email Design Spec

Audit of the live site design system (`globals.css`, `Footer.tsx`, `Navigation.tsx`, `HomePageClient.tsx`) translated for email-safe HTML.

## Brand tokens

| Web token | Value | Email translation |
|-----------|-------|-------------------|
| Background | `#000000` | `bgcolor="#000000"` on outer table |
| Foreground | `#ffffff` | Primary text, links |
| Muted body | `zinc-400` → `#9f9fa9` | Tagline, legal line |
| Secondary | `zinc-300` → `#d4d4d8` | Contact email (optional) |
| Borders | `zinc-700` → `#3f3f46` | 1px horizontal rule above contact |
| Display font | Landsknecht | Not email-safe → Georgia serif fallback |
| Body font | Cormorant Garamond | `Georgia, 'Times New Roman', serif` |

## Typography (email)

| Element | Style |
|---------|-------|
| Name | `font-size: 22px`, lowercase, white, Georgia |
| Tagline | `font-size: 14px`, `#9f9fa9`, lowercase |
| Contact email | `font-size: 16px`, white, underlined link |
| Website / legal links | `font-size: 12px`, uppercase, `letter-spacing: 0.2em`, white |
| Legal address | `font-size: 11px`, `#9f9fa9`, `line-height: 1.5` |

## Patterns mirrored from site

1. **Wing accents** — `corner-accent.png` mirrored to match `Footer.tsx` transforms (left: flip-Y; right: flip-X+Y). Email wings scaled to 100px display width (200px @2x assets).
2. **Nav link style** — `text-sm tracking-widest uppercase` → 12px, `letter-spacing: 0.2em`, uppercase for WEBSITE and LEGAL links.
3. **Underline divider** — `UnderlineHeading.tsx` uses `bg-zinc-700` 1px rule; replicated above contact block.
4. **Black canvas** — full-width `#000000` footer strip, 24–32px padding.

## Content (confirmed)

| Field | Value |
|-------|-------|
| Name | Rupert C. Lohse |
| Tagline | munich photodesigner |
| Email | contact@unrulytruly.eu |
| Website | https://unrulytruly.eu |
| Impressum | https://unrulytruly.eu/impressum |
| Legal line | Rupert C. Lohse · Munich, Germany |

> **Note:** Full postal address on the Impressum page is still placeholder. Update `impressum/page.tsx` and the legal line in both footer HTML files together before sending commercial email.

## Asset URLs (production)

```
https://unrulytruly.eu/email/wing-left.png
https://unrulytruly.eu/email/wing-right.png
```

Replace domain with staging URL during pre-deploy testing.

## Screenshot checklist

Capture these from `npm run dev` for visual comparison:

1. Full page with corner wings (`(site)/layout.tsx` shell)
2. Site footer close-up (wings + LEGAL link)
3. About → Contact section (typography hierarchy)

Reference screenshots can be saved to `emails/screenshots/` during manual QA.

## Dark mode

Apple Mail and some clients may invert `#000000` backgrounds. Wing PNGs are opaque (not transparent-over-white). Test in Apple Mail light + dark before sign-off.
