'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export type AboutSlide = {
  src: string;
  alt: string;
};

type AboutImageSliderProps = {
  slides: AboutSlide[];
  /** Auto-advance interval in ms; set to 0 to disable. */
  autoAdvanceMs?: number;
};

export default function AboutImageSlider({
  slides,
  autoAdvanceMs = 5500,
}: AboutImageSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    if (slides.length < 2) return;
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length < 2) return;
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || !autoAdvanceMs || paused) return;
    const id = window.setInterval(next, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [slides.length, autoAdvanceMs, next, paused]);

  const shellClass =
    'relative w-full max-w-[min(100%,23rem)] mx-auto md:mx-0 md:ml-auto';

  if (slides.length === 0) {
    return (
      <div className={shellClass}>
        <div className="aspect-[4/5] w-full rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm px-4 text-center">
          Add images to the slider.
        </div>
      </div>
    );
  }

  return (
    <div
      className={shellClass}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-900">
        {slides.map((slide, i) => (
          <div
            key={`${slide.src}-${i}`}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: i === index ? 1 : 0,
              pointerEvents: i === index ? 'auto' : 'none',
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) min(100vw, 23rem), 23rem"
              priority={i === 0}
            />
          </div>
        ))}

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1} of ${slides.length}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-2 bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
