'use client';

import { memo, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';

import { GALLERY_SHADOW, GALLERY_SHADOW_HOVER } from '@/lib/gallery-shadow';
import { animatePageHeroFadeIn } from '@/lib/page-hero-fade-in';
import type { PortfolioGalleryImage } from '@/lib/sanity-queries';
import { useLightbox } from '@/components/lightbox/LightboxProvider';
import TextSlider from '@/components/TextSlider';

const MOBILE_MQ = '(max-width: 767px)';

function subscribeMobileMasonry(cb: () => void) {
  const mq = window.matchMedia(MOBILE_MQ);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getMobileMasonrySnapshot() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function getServerMobileMasonrySnapshot() {
  return false;
}

function galleryShellClassName(isMobileMasonry: boolean, isCentered: boolean): string {
  const base =
    'mb-4 sm:mb-5 break-inside-avoid transition-shadow duration-[675ms] ease-out shadow-none';
  if (isMobileMasonry) {
    return isCentered ? `${base} ${GALLERY_SHADOW}` : base;
  }
  return `${base} ${GALLERY_SHADOW_HOVER}`;
}

function useCenteredMasonryIndex(isMobileMasonry: boolean, imageCount: number) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [internalCenteredIndex, setInternalCenteredIndex] = useState<number | null>(null);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, imageCount);
  }, [imageCount]);

  useEffect(() => {
    if (!isMobileMasonry || imageCount === 0) {
      return;
    }

    let raf = 0;

    const updateCentered = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        let bestIdx = -1;
        let bestDist = Infinity;

        itemRefs.current.forEach((el, idx) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const d = (cx - centerX) ** 2 + (cy - centerY) ** 2;
          if (d < bestDist) {
            bestDist = d;
            bestIdx = idx;
          }
        });

        setInternalCenteredIndex(bestIdx >= 0 ? bestIdx : null);
      });
    };

    updateCentered();

    window.addEventListener('scroll', updateCentered, { passive: true, capture: true });
    window.addEventListener('resize', updateCentered);

    const section = sectionRef.current;
    const ro = new ResizeObserver(updateCentered);
    if (section) ro.observe(section);

    return () => {
      window.removeEventListener('scroll', updateCentered, { capture: true });
      window.removeEventListener('resize', updateCentered);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobileMasonry, imageCount]);

  const registerItemRef = useCallback((index: number, el: HTMLDivElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  const centeredIndex =
    isMobileMasonry && imageCount > 0 ? internalCenteredIndex : null;

  return { sectionRef, registerItemRef, centeredIndex };
}

type PortfolioPageClientProps = {
  intro: string;
  images: PortfolioGalleryImage[];
};

type PortfolioGalleryCellProps = {
  item: PortfolioGalleryImage;
  index: number;
  isMobileMasonry: boolean;
  isCentered: boolean;
  registerItemRef: (index: number, el: HTMLDivElement | null) => void;
  onOpen: () => void;
};

const PortfolioGalleryCell = memo(function PortfolioGalleryCell({
  item,
  index,
  isMobileMasonry,
  isCentered,
  registerItemRef,
  onOpen,
}: PortfolioGalleryCellProps) {
  return (
    <div
      ref={(el) => registerItemRef(index, el)}
      className={galleryShellClassName(isMobileMasonry, isCentered)}
    >
      <button
        type="button"
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
        onClick={onOpen}
        aria-label={`Open image ${index + 1} in viewer`}
      >
        <figure className="overflow-hidden bg-zinc-900/40">
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width ?? 1200}
            height={item.height ?? 1600}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 3840px) 25vw, 960px"
            className="w-full h-auto object-cover align-bottom"
            loading={index < 6 ? 'eager' : 'lazy'}
          />
        </figure>
      </button>
    </div>
  );
});

export default function PortfolioPageClient({ intro, images }: PortfolioPageClientProps) {
  const container = useRef(null);
  const h1Ref = useRef(null);

  const isMobileMasonry = useSyncExternalStore(
    subscribeMobileMasonry,
    getMobileMasonrySnapshot,
    getServerMobileMasonrySnapshot,
  );

  const { sectionRef: gallerySectionRef, registerItemRef, centeredIndex: centeredGalleryIndex } =
    useCenteredMasonryIndex(isMobileMasonry, images.length);

  const { open: openLightbox } = useLightbox();

  useGSAP(
    () => {
      animatePageHeroFadeIn(h1Ref.current);
    },
    { scope: container },
  );

  return (
    <main ref={container} className="text-center">
      <section className="hero-section text-center md:px-6">
        <div className="hero-section-viewport flex min-h-svh flex-col items-center max-md:min-h-[calc(100svh-var(--mobile-hero-padding-top))]">
          <div className="hidden min-h-0 flex-1 md:block" aria-hidden />
          <div className="hero-section-inner flex flex-col items-center">
            <h1 ref={h1Ref} className="normal-case p-0">
              The Work
            </h1>

            <p className="mt-2 text-xl font-body lowercase tracking-wide text-zinc-500">
              (selected excerpts)
            </p>

            <TextSlider />
          </div>
          <div className="min-h-0 w-full flex-1" aria-hidden />
        </div>
      </section>

      <section
        ref={gallerySectionRef}
        className="page-last-section w-full max-w-[min(100%,3840px)] mx-auto max-md:px-[10%] md:px-6 lg:px-8 xl:px-10 2xl:px-12"
        aria-label="Portfolio gallery"
      >
        {intro ? (
          <p className="font-body text-zinc-400 text-center max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed">
            {intro}
          </p>
        ) : null}

        {images.length === 0 ? (
          <p className="text-center text-zinc-500 font-body text-lg">
            Gallery images will appear here once added in Studio.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 [column-fill:_balance]">
            {images.map((item, i) => (
              <PortfolioGalleryCell
                key={`${item.src}-${i}`}
                item={item}
                index={i}
                isMobileMasonry={isMobileMasonry}
                isCentered={centeredGalleryIndex === i}
                registerItemRef={registerItemRef}
                onOpen={() => openLightbox(images, i)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
