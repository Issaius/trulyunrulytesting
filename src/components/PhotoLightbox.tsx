'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';

export type LightboxImage = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  width?: number;
  height?: number;
};

const NAV_BUTTON_CLASS =
  'w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer shrink-0';

/** Room for close, footer row, gaps — viewbox max height budget (matches “green” frame idea). */
const VIEW_CHROME = '13rem';

const VIEWBOX_SHELL =
  'relative w-full overflow-hidden aspect-[3/2] bg-black shadow-[0_0_40px_-4px_color-mix(in_oklab,var(--color-zinc-400)_35%,transparent),0_0_18px_-2px_color-mix(in_oklab,var(--color-zinc-400)_22%,transparent)]';

function fileNameFromSrc(src: string): string {
  try {
    const path = new URL(src).pathname;
    const file = path.split('/').pop() ?? '';
    return file.replace(/\.[^/.]+$/, '') || 'Image';
  } catch {
    const file = src.split('/').pop()?.split('?')[0] ?? '';
    return file.replace(/\.[^/.]+$/, '') || 'Image';
  }
}

type PhotoLightboxProps = {
  open: boolean;
  onClose: () => void;
  images: LightboxImage[];
  index: number;
  onIndexChange: (next: number) => void;
};

export default function PhotoLightbox({
  open,
  onClose,
  images,
  index,
  onIndexChange,
}: PhotoLightboxProps) {
  const liveRegionRef = useRef<HTMLParagraphElement | null>(null);

  const safeIndex = images.length ? ((index % images.length) + images.length) % images.length : 0;
  const current = images[safeIndex];
  const hasMany = images.length > 1;

  const goPrev = useCallback(() => {
    if (!images.length) return;
    onIndexChange((safeIndex - 1 + images.length) % images.length);
  }, [images.length, onIndexChange, safeIndex]);

  const goNext = useCallback(() => {
    if (!images.length) return;
    onIndexChange((safeIndex + 1) % images.length);
  }, [images.length, onIndexChange, safeIndex]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasMany) goPrev();
      if (e.key === 'ArrowRight' && hasMany) goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, goPrev, goNext, hasMany]);

  useEffect(() => {
    if (!open || !liveRegionRef.current || !current) return;
    const label = current.title?.trim() || fileNameFromSrc(current.src);
    liveRegionRef.current.textContent = `Showing ${label}`;
  }, [open, current, safeIndex]);

  if (!open || !current) {
    return null;
  }

  const w = current.width ?? 2400;
  const h = current.height ?? 1600;

  const titleText = current.title?.trim() || fileNameFromSrc(current.src);
  const captionOnly = current.caption?.trim() ?? '';
  const altTrim = current.alt?.trim() ?? '';
  const descText = (
    captionOnly ||
    (altTrim && altTrim.toLowerCase() !== titleText.trim().toLowerCase() ? altTrim : '')
  ).trim();

  /** Landscape “green” width: never wider than fits max viewbox height at 3:2 (portrait letterboxes inside). */
  const columnWidthStyle = {
    width: `min(100%, 92vw, 1600px, calc((100dvh - ${VIEW_CHROME}) * 1.5))`,
  } as const;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <p ref={liveRegionRef} className="sr-only" aria-live="polite" />

      <div
        className="absolute inset-0 z-0 cursor-default bg-transparent"
        role="presentation"
        onClick={onClose}
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col px-4 pt-6 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-2">
          <div
            className="pointer-events-auto relative mx-auto flex max-h-full min-h-0 w-full max-w-full flex-col items-stretch overflow-visible"
            style={columnWidthStyle}
          >
            <button
              type="button"
              onClick={onClose}
              className={`pointer-events-auto absolute left-0 top-0 z-20 -translate-x-[calc(100%+30px)] ${NAV_BUTTON_CLASS}`}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5 text-white md:h-6 md:w-6"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className={VIEWBOX_SHELL}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={w}
                  height={h}
                  className="h-auto w-auto max-h-full max-w-full object-contain"
                  sizes="(max-width: 768px) 92vw, 1600px"
                  priority
                />
              </div>
            </div>

            <div className="mt-[30px] flex w-full min-w-0 flex-row items-start justify-between gap-4">
              <div className="min-w-0 max-w-[calc(100%-7rem)] flex-1 text-left md:max-w-[calc(100%-8.5rem)]">
                <h3 className="mb-1 text-left text-2xl font-serif text-white lg:text-3xl" style={{ padding: 0 }}>
                  {titleText}
                </h3>
                {descText ? (
                  <p
                    className="line-clamp-3 text-left text-zinc-400 sm:line-clamp-none"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(18px, 4vw, 28px)',
                    }}
                  >
                    {descText}
                  </p>
                ) : null}
              </div>
              {hasMany ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={goPrev} className={NAV_BUTTON_CLASS} aria-label="Previous image">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-white md:h-6 md:w-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button type="button" onClick={goNext} className={NAV_BUTTON_CLASS} aria-label="Next image">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-white md:h-6 md:w-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="h-5 shrink-0 sm:h-6" />
      </div>
    </div>
  );
}
