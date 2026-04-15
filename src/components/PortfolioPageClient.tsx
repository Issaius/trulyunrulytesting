'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
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

type PortfolioPageClientProps = {
  intro: string;
  images: PortfolioGalleryImage[];
};

export default function PortfolioPageClient({ intro, images }: PortfolioPageClientProps) {
  const container = useRef(null);
  const h1Ref = useRef(null);
  const sliderRef = useRef(null);
  const galleryItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gallerySectionRef = useRef<HTMLElement | null>(null);
  const [centeredGalleryIndex, setCenteredGalleryIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isMobileMasonry = useSyncExternalStore(
    subscribeMobileMasonry,
    getMobileMasonrySnapshot,
    getServerMobileMasonrySnapshot,
  );

  const sliderWords = [
    'artisans',
    'artists',
    'extraordinaires',
    'tattoo artists',
    'people who care',
    'drug dealers',
    'outcasts',
    'dissidents',
    'felons',
  ];
  const displayWords = [...sliderWords, sliderWords[0]];

  useGSAP(
    () => {
      gsap.from(h1Ref.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.3,
      });

      const totalWords = sliderWords.length;
      const tl = gsap.timeline({ repeat: -1 });

      for (let i = 1; i < totalWords; i++) {
        tl.to(
          sliderRef.current,
          {
            yPercent: -(i * (100 / (totalWords + 1))),
            duration: 0.6,
            ease: 'power3.inOut',
          },
          '+=1.5',
        );
      }
    },
    { scope: container },
  );

  useEffect(() => {
    galleryItemRefs.current = galleryItemRefs.current.slice(0, images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isMobileMasonry || images.length === 0) {
      setCenteredGalleryIndex(null);
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

        galleryItemRefs.current.forEach((el, idx) => {
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

        setCenteredGalleryIndex(bestIdx >= 0 ? bestIdx : null);
      });
    };

    updateCentered();

    window.addEventListener('scroll', updateCentered, { passive: true, capture: true });
    window.addEventListener('resize', updateCentered);

    const section = gallerySectionRef.current;
    const ro = new ResizeObserver(updateCentered);
    if (section) ro.observe(section);

    return () => {
      window.removeEventListener('scroll', updateCentered, { capture: true });
      window.removeEventListener('resize', updateCentered);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobileMasonry, images.length]);

  return (
    <main ref={container} style={{ textAlign: 'center' }}>
      <section className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 ref={h1Ref} className="normal-case" style={{ padding: 0 }}>
          The Work
        </h1>

        <div className="mt-8 text-2xl font-body italic text-zinc-400 flex items-center justify-center gap-2 max-w-full">
          <span>for:</span>
          <div className="h-[1.5em] overflow-hidden text-left relative">
            <div ref={sliderRef} className="flex flex-col">
              {displayWords.map((word, i) => (
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
              <div
                key={`${item.src}-${i}`}
                ref={(el) => {
                  galleryItemRefs.current[i] = el;
                }}
                className={[
                  'mb-4 sm:mb-5 break-inside-avoid transition-shadow duration-[675ms] ease-out shadow-none',
                  isMobileMasonry
                    ? centeredGalleryIndex === i
                      ? GALLERY_SHADOW
                      : ''
                    : GALLERY_SHADOW_HOVER,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <figure className="overflow-hidden bg-zinc-900/40">
                  <button
                    type="button"
                    className="relative block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
                    aria-label={`Open image ${i + 1} in viewer`}
                    onClick={() => {
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width ?? 1200}
                      height={item.height ?? 1600}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="w-full h-auto object-cover align-bottom"
                      loading={i < 6 ? 'eager' : 'lazy'}
                    />
                  </button>
                </figure>
              </div>
            ))}
          </div>
        )}
      </section>

      <PhotoLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </main>
  );
}
