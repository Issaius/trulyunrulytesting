/** Same glow as desktop portfolio hover; full literals so Tailwind always scans complete class names. */
export const GALLERY_SHADOW =
  'shadow-[0_0_53px_-6px_color-mix(in_oklab,var(--color-zinc-400)_35%,transparent),0_0_24px_-2px_color-mix(in_oklab,var(--color-zinc-400)_22%,transparent)]';

export const GALLERY_SHADOW_HOVER =
  'md:hover:shadow-[0_0_53px_-6px_color-mix(in_oklab,var(--color-zinc-400)_35%,transparent),0_0_24px_-2px_color-mix(in_oklab,var(--color-zinc-400)_22%,transparent)]';

const GALLERY_SHADOW_COLOR_OUTER = 'color-mix(in oklab, var(--color-zinc-400) 35%, transparent)';
const GALLERY_SHADOW_COLOR_INNER = 'color-mix(in oklab, var(--color-zinc-400) 22%, transparent)';

/**
 * Same two-layer glow as {@link GALLERY_SHADOW}, scaled so blur/spread track the shorter side of the image box.
 * Use for large frames where fixed Tailwind shadows look proportionally invisible.
 */
export function galleryShadowBoxCss(minSidePx: number): string {
  const side = Math.max(1, minSidePx);
  /** Short side at which the Tailwind preset (~53px / ~24px blur) looks balanced. */
  const ref = 420;
  const scale = side / ref;
  const outerBlur = Math.max(8, Math.round(53 * scale));
  const outerSpread = Math.round(-6 * scale);
  const innerBlur = Math.max(4, Math.round(24 * scale));
  const innerSpread = Math.round(-2 * scale);
  return `0 0 ${outerBlur}px ${outerSpread}px ${GALLERY_SHADOW_COLOR_OUTER}, 0 0 ${innerBlur}px ${innerSpread}px ${GALLERY_SHADOW_COLOR_INNER}`;
}
