'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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

type TextSliderProps = {
  className?: string;
};

export default function TextSlider({ className = '' }: TextSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className={`mt-8 text-[calc(1.5rem+4px)] font-body italic text-zinc-400 flex items-center justify-center gap-2 max-w-full ${className}`.trim()}
    >
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
  );
}
