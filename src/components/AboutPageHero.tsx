'use client';

import { useRef } from 'react';
import PageHeroHeading from '@/components/PageHeroHeading';
import TextSlider from '@/components/TextSlider';
import { useMirroredGap } from '@/hooks/useMirroredGap';

type AboutPageHeroProps = {
  introHeading: string;
  introBodyTop: string;
  introBodyBottom: string;
};

export default function AboutPageHero({
  introHeading,
  introBodyTop,
  introBodyBottom,
}: AboutPageHeroProps) {
  const aboveGapRef = useRef<HTMLDivElement | null>(null);
  const belowGapRef = useRef<HTMLDivElement | null>(null);

  useMirroredGap(aboveGapRef, belowGapRef);

  return (
    <section className="hero-section hero-section--from-top text-center md:px-6">
      <div className="hero-section-viewport flex min-h-svh flex-col items-center max-md:min-h-[calc(100svh-var(--mobile-hero-padding-top))]">
        <div className="hidden min-h-0 flex-1 md:block" aria-hidden />
        <div className="hero-section-inner flex flex-col items-center">
          <PageHeroHeading>who I am:</PageHeroHeading>

          <p className="mt-2 text-xl font-body lowercase tracking-wide text-zinc-500">
            (a few pretentious paragraphs)
          </p>

          <TextSlider />
        </div>
        <div ref={aboveGapRef} className="min-h-0 w-full flex-1" aria-hidden />
      </div>

      <div className="w-full text-center">
        <h2 className="headline hero-below-fold-headline">{introHeading}</h2>
        <p className="text-zinc-400 max-w-3xl mx-auto">{introBodyTop}</p>
        <p className="text-zinc-400 max-w-3xl mx-auto mt-4">{introBodyBottom}</p>
      </div>

      <div ref={belowGapRef} className="w-full shrink-0" aria-hidden />
    </section>
  );
}
