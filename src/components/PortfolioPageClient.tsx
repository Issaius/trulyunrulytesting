'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function PortfolioPageClient() {
  const container = useRef(null);
  const h1Ref = useRef(null);
  const sliderRef = useRef(null);

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

  return (
    <main ref={container} style={{ textAlign: 'center' }}>
      <section className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 ref={h1Ref} style={{ padding: 0 }}>
          Photodesigner
          <br />
          based in munich
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

      <section className="w-full pb-16 px-6">
        <div className="w-[75vw] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-zinc-900 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
