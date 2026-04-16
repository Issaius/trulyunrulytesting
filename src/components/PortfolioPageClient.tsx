'use client';

import { memo, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import type { PortfolioGalleryImage } from '@/lib/sanity-queries';

import PhotoLightbox from './PhotoLightbox';

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

/** Same glow as desktop hover; duplicate literals so Tailwind always scans full class names. */
const GALLERY_SHADOW =
  'shadow-[0_0_53px_-6px_color-mix(in_oklab,var(--color-zinc-400)_35%,transparent),0_0_24px_-2px_color-mix(in_oklab,var(--color-zinc-400)_22%,transparent)]';
const GALLERY_SHADOW_HOVER =
  'md:hover:shadow-[0_0_53px_-6px_color-mix(in_oklab,var(--color-zinc-400)_35%,transparent),0_0_24px_-2px_color-mix(in_oklab,var(--color-zinc-400)_22%,transparent)]';

const SLIDER_WORDS = [
  'artisans',
  'artists',
  'extraordinaires',
  'tattoo artists',
  'people who care',
  'drug dealers',
  'outcasts',
  'dissidents',
  'felons',
] as const;

const SLIDER_DISPLAY_WORDS = [...SLIDER_WORDS, SLIDER_WORDS[0]];

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
  onOpen: (index: number) => void;
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
      <figure className="overflow-hidden bg-zinc-900/40">
        <button
          type="button"
          className="relative block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
          aria-label={`Open image ${index + 1} in viewer`}
          onClick={() => onOpen(index)}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width ?? 1200}
            height={item.height ?? 1600}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="w-full h-auto object-cover align-bottom"
            loading={index < 6 ? 'eager' : 'lazy'}
          />
        </button>
      </figure>
    </div>
  );
});

export default function PortfolioPageClient({ intro, images }: PortfolioPageClientProps) {
  const container = useRef(null);
  const h1Ref = useRef(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isMobileMasonry = useSyncExternalStore(
    subscribeMobileMasonry,
    getMobileMasonrySnapshot,
    getServerMobileMasonrySnapshot,
  );

  const { sectionRef: gallerySectionRef, registerItemRef, centeredIndex: centeredGalleryIndex } =
    useCenteredMasonryIndex(isMobileMasonry, images.length);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useGSAP(
    () => {
      gsap.from(h1Ref.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.3,
      });

      const track = sliderRef.current;
      if (!track) return;

      const totalWords = SLIDER_WORDS.length;
      let tl: gsap.core.Timeline | null = null;

      const killSlider = () => {
        tl?.kill();
        tl = null;
        gsap.killTweensOf(track);
      };

      let lastRowPx = -1;
      const buildSlider = () => {
        const firstRow = track.firstElementChild as HTMLElement | null;
        const rowPx = firstRow?.getBoundingClientRect().height ?? 0;
        if (rowPx < 1) return;
        if (tl && Math.abs(rowPx - lastRowPx) < 0.5) return;
        lastRowPx = rowPx;

        killSlider();
        gsap.set(track, { y: 0, yPercent: 0 });

        const nextTl = gsap.timeline({ repeat: -1 });
        for (let k = 1; k <= totalWords; k++) {
          nextTl.to(
            track,
            {
              y: -k * rowPx,
              duration: 0.6,
              ease: 'power3.inOut',
              force3D: true,
            },
            '+=1.5',
          );
        }
        nextTl.set(track, { y: 0 });
        tl = nextTl;
      };

      buildSlider();

      const firstRow = track.firstElementChild as HTMLElement | null;
      const ro =
        firstRow &&
        new ResizeObserver(() => {
          buildSlider();
        });
      if (firstRow && ro) ro.observe(firstRow);

      let alive = true;
      void document.fonts.ready.then(() => {
        if (alive) buildSlider();
      });

      return () => {
        alive = false;
        ro?.disconnect();
        killSlider();
        gsap.set(track, { y: 0, yPercent: 0 });
      };
    },
    { scope: container },
  );

  return (
    <main ref={container} className="text-center">
      <section className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 ref={h1Ref} className="normal-case p-0">
          The Work
        </h1>

        <div className="mt-8 text-[calc(1.5rem+4px)] font-body italic text-zinc-400 flex items-center justify-center gap-2 max-w-full">
          <span>for:</span>
          <div className="h-[1.5em] overflow-hidden text-left relative">
            <div ref={sliderRef} className="flex flex-col">
              {SLIDER_DISPLAY_WORDS.map((word, i) => (
                <span key={i} className="h-[1.5em] flex items-center whitespace-nowrap">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={gallerySectionRef}
        className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 pb-24 sm:pb-32"
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
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-5 [column-fill:_balance]">
            {images.map((item, i) => (
              <PortfolioGalleryCell
                key={`${item.src}-${i}`}
                item={item}
                index={i}
                isMobileMasonry={isMobileMasonry}
                isCentered={centeredGalleryIndex === i}
                registerItemRef={registerItemRef}
                onOpen={openLightbox}
              />
            ))}
          </div>
        )}
      </section>

      <PhotoLightbox
        open={lightboxOpen}
        onClose={closeLightbox}
        images={images}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </main>
  );
}
