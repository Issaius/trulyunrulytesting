import gsap from 'gsap';

/** Portfolio hero entrance — shared across page loads. */
export const PAGE_HERO_FADE_IN = {
  y: 80,
  opacity: 0,
  duration: 1,
  ease: 'power4.out',
  delay: 0.3,
} as const;

export function animatePageHeroFadeIn(target: Element | null | undefined) {
  if (!target) return;
  gsap.from(target, PAGE_HERO_FADE_IN);
}
