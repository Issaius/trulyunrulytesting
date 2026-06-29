'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import { GALLERY_IMAGE_BORDER_CLASS } from '@/lib/gallery-shadow';
import { getFileNameFromSrc } from '@/lib/image-filename';
import { renderSanityRichText, richTextToPlainText } from '@/lib/sanity-richtext';

import PointerNavButton from '@/components/PointerNavButton';

import type { LightboxItem } from './types';

type ImageLightboxProps = {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function ImageLightbox({ items, index, onClose, onPrev, onNext }: ImageLightboxProps) {
  const current = items[index];
  const titlePlain = richTextToPlainText(current?.title);
  const captionPlain = richTextToPlainText(current?.caption);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!current) {
    return null;
  }

  const w = current.width ?? 2400;
  const h = current.height ?? 1600;

  const CloseIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="h-5 w-5 md:h-6 md:w-6 text-zinc-200"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-0 flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div className="absolute inset-0 z-0 bg-black/88" onClick={onClose} aria-hidden />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col pointer-events-none">
        <div className="pointer-events-auto absolute right-4 top-4 z-20 flex flex-col items-end gap-2 md:right-6 md:top-6">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-200 transition-colors hover:bg-zinc-800 md:h-12 md:w-12"
            aria-label="Close viewer"
          >
            {CloseIcon}
          </button>
          {items.length > 1 ? (
            <div className="flex flex-col items-end gap-2">
              <PointerNavButton direction="right" onClick={onNext} ariaLabel="Next image" />
              <PointerNavButton direction="left" onClick={onPrev} ariaLabel="Previous image" />
            </div>
          ) : null}
        </div>

        <div
          className="pointer-events-auto flex min-h-0 flex-1 flex-col px-4 pb-4 pt-14 md:px-8 md:pb-6 md:pt-16"
          onClick={onClose}
        >
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div
              className={`relative w-fit max-h-[min(72dvh,760px)] max-w-full ${GALLERY_IMAGE_BORDER_CLASS}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.alt}
                width={w}
                height={h}
                className="block h-auto w-auto max-h-[min(72dvh,760px)] max-w-[min(100vw-2rem,1400px)] object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>

        <footer
          className="pointer-events-auto shrink-0 border-t border-zinc-800 bg-black/50 px-4 py-5 md:px-8 md:py-6"
        >
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3">
            <div
              className="min-w-0 text-left text-2xl font-bold md:text-3xl"
              style={{ padding: 0, fontFamily: 'var(--font-body)' }}
            >
              {titlePlain ? renderSanityRichText(current.title) : getFileNameFromSrc(current.src)}
            </div>
            <div
              className="text-left text-zinc-400"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: `${Math.round(28 * 0.8)}px`,
              }}
            >
              {captionPlain ? renderSanityRichText(current.caption) : current.alt}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
