'use client';

import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { galleryShadowBoxCss } from '@/lib/gallery-shadow';

export type AboutSlide = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type AboutImageSliderProps = {
  slides: AboutSlide[];
  /** Auto-advance interval in ms (default 2000); set to 0 to disable. */
  autoAdvanceMs?: number;
};

type BoxSize = {
  width: number;
  height: number;
};

/** Contain `imageWidth`×`imageHeight` inside `frame` (same math as homepage `CoverflowSlider`). */
function getContainedImageBox(
  frame: BoxSize | null,
  imageWidth: number,
  imageHeight: number,
): BoxSize | null {
  if (!frame || frame.width <= 0 || frame.height <= 0) {
    return null;
  }

  const imageAspect = imageWidth / imageHeight;
  const frameAspect = frame.width / frame.height;

  if (frameAspect > imageAspect) {
    return {
      width: frame.height * imageAspect,
      height: frame.height,
    };
  }

  return {
    width: frame.width,
    height: frame.width / imageAspect,
  };
}

export default function AboutImageSlider({
  slides,
  autoAdvanceMs = 2000,
}: AboutImageSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [frameSize, setFrameSize] = useState<BoxSize | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const next = useCallback(() => {
    if (slides.length < 2) return;
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || !autoAdvanceMs || paused) return;
    const id = window.setInterval(next, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [slides.length, autoAdvanceMs, next, paused]);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) {
      return;
    }
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setFrameSize((previous) => {
        if (
          previous &&
          Math.abs(previous.width - width) < 0.5 &&
          Math.abs(previous.height - height) < 0.5
        ) {
          return previous;
        }
        return { width, height };
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [slides.length]);

  const shellClass =
    'relative w-full max-w-[min(100%,min(calc(90vw_*_1.3),calc(42rem_*_1.3)))] mx-auto md:mx-0 md:ml-auto';

  if (slides.length === 0) {
    return (
      <div className={shellClass}>
        <div className="aspect-[3/2] w-full bg-zinc-900/35 flex items-center justify-center text-zinc-500 text-sm px-4 text-center">
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
      <div
        ref={frameRef}
        className="relative aspect-[3/2] w-full overflow-visible bg-zinc-900/35"
      >
        {slides.map((slide, i) => {
          const iw = slide.width ?? 2400;
          const ih = slide.height ?? 1600;
          const imageBox = getContainedImageBox(frameSize, iw, ih);

          return (
            <div
              key={`${slide.src}-${i}`}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out"
              style={{
                opacity: i === index ? 1 : 0,
                pointerEvents: i === index ? 'auto' : 'none',
              }}
            >
              {imageBox ? (
                <div
                  className="relative shrink-0"
                  style={{
                    width: `${imageBox.width}px`,
                    height: `${imageBox.height}px`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    boxShadow: galleryShadowBoxCss(Math.min(imageBox.width, imageBox.height)),
                  }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) min(100vw, calc(90vw * 1.3)), min(calc(42rem * 1.3), calc(90vw * 1.3))"
                    priority={i === 0}
                  />
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) min(100vw, calc(90vw * 1.3)), min(calc(42rem * 1.3), calc(90vw * 1.3))"
                    priority={i === 0}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
