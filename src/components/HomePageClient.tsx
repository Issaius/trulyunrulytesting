'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import CoverflowSlider from './CoverflowSlider';
import type { HomeSliderSlide } from '@/lib/sanity-queries';

type HomePageClientProps = {
  slides: HomeSliderSlide[];
};

export default function HomePageClient({ slides }: HomePageClientProps) {
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

      {slides.length > 0 ? (
        <section className="w-full pb-20 overflow-hidden px-6">
          <div className="max-w-6xl mx-auto">
            <CoverflowSlider slides={slides} />
          </div>
        </section>
      ) : (
        <section className="w-full pb-20 px-6 text-zinc-500">
          <p className="max-w-6xl mx-auto">No slides yet. Add a &quot;Home Slider&quot; document in Sanity Studio and publish.</p>
        </section>
      )}

      <section className="px-6 max-w-6xl mx-auto mb-32">
        <h2 className="headline">the process</h2>

        <div className="flex overflow-x-auto snap-x snap-mandatory mt-10 w-[calc(100%+3rem)] -ml-6 px-6 md:w-full md:ml-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            {
              id: 1,
              title: '1. Discovery',
              desc: 'We get to know each other, talk about what general project you have in mind, and decide if it makes sense to work together.',
            },
            {
              id: 2,
              title: '2. Ideation',
              desc: "Here we discuss the details of the idea you have in mind. If you don't yet have a rough idea, I likely have one that you'll like.\n\nYou pay after this.",
            },
            {
              id: 3,
              title: '3. Organisation',
              desc: 'Here we set the details for the photoshoot. Time, Date, Location, necessary props, outfits and things to organize.',
            },
            {
              id: 4,
              title: '4. Photoshoot',
              desc: "This is where the magic happens. We'll spend the allotted time capturing the best possible frames based on our plan.",
            },
            {
              id: 5,
              title: '5. Selection',
              desc: 'We review all the raw shots together and select the final images that perfectly capture our desired artistic vision.',
            },
            {
              id: 6,
              title: '6. Delivery',
              desc: 'You get exactly what you paid for. The final, fully retouched high-resolution images will be securely delivered to you.',
            },
          ].map((step) => (
            <div
              key={step.id}
              className="flex-shrink-0 snap-start flex flex-col min-w-[300px] w-[85vw] sm:w-[50vw] md:w-[350px] border-r-2 border-zinc-700 last:border-r-0"
            >
              <div className="flex flex-col justify-end h-[120px] px-8 pb-6 border-b-2 border-zinc-700">
                <h3 className="text-2xl lg:text-3xl font-serif">{step.title}</h3>
              </div>
              <div className="p-8 h-[250px]">
                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-0 pb-32 px-6 max-w-6xl mx-auto">
        <h2 className="headline">pricing</h2>

        <div className="mb-16 -mt-6">
          <div className="hidden md:block max-w-5xl mx-auto">
            <table className="w-full border-collapse text-center">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[18%]" />
                <col className="w-[22%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="py-4 text-zinc-300 font-normal">Rates</th>
                  <th className="py-4 border-l border-zinc-700 px-3 text-zinc-300 font-normal">Travel Time</th>
                  <th className="py-4 border-l border-zinc-700 px-3 text-zinc-300 font-normal">Included</th>
                  <th className="py-4 border-l border-zinc-700 px-3 text-zinc-300 font-normal">Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '1/4 Day', shooting: '2 Hours', travel: '1 Hour', price: '200€' },
                  { label: '1/2 Day', shooting: '4 Hours', travel: '2 Hours', price: '350€' },
                  { label: 'Full Day', shooting: '8 Hours', travel: '3 Hours', price: '700€' },
                ].map((tier, index) => (
                  <tr key={tier.label} className="border-b border-zinc-800">
                    <td className="py-6">
                      <h3 className="text-4xl" style={{ padding: 0 }}>
                        {tier.label}
                      </h3>
                      <p className="mt-2 text-zinc-300 italic">{tier.shooting}</p>
                    </td>
                    <td className="py-6 border-l border-zinc-800 px-3 align-middle">
                      <p className="text-zinc-300 italic">{tier.travel}</p>
                    </td>
                    {index === 0 ? (
                      <td rowSpan={3} className="py-6 border-l border-zinc-800 px-3 align-middle">
                        <ul className="space-y-0.5 text-zinc-300 list-none p-0">
                          <li>The entire process</li>
                          <li>Commercial usage rights</li>
                          <li>Web &amp; print versions</li>
                          <li>Post processing</li>
                        </ul>
                      </td>
                    ) : null}
                    <td className="py-6 border-l border-zinc-800 px-3 align-middle">
                      <p
                        className="font-bold"
                        style={{ fontFamily: 'var(--font-body)', fontSize: '40px', lineHeight: 1.3 }}
                      >
                        {tier.price}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-6 text-left">
            {[
              { label: '1/4 Day', shooting: '2 Hours', travel: '1 Hour', price: '200€' },
              { label: '1/2 Day', shooting: '4 Hours', travel: '2 Hours', price: '350€' },
              { label: 'Full Day', shooting: '8 Hours', travel: '3 Hours', price: '700€' },
            ].map((tier) => (
              <div key={tier.label} className="border border-zinc-700 p-6">
                <h3 className="text-4xl" style={{ padding: 0 }}>
                  {tier.label}
                </h3>
                <div className="mt-5 space-y-3 text-zinc-300">
                  <p>
                    <span className="text-zinc-500">Shooting Time:</span> <span className="italic">{tier.shooting}</span>
                  </p>
                  <p>
                    <span className="text-zinc-500">Travel Time:</span> <span className="italic">{tier.travel}</span>
                  </p>
                  <div>
                    <p className="text-zinc-500 mb-1">Included:</p>
                    <ul className="space-y-1">
                      <li>The entire process</li>
                      <li>Commercial usage rights</li>
                      <li>Web &amp; print versions</li>
                      <li>Post processing</li>
                    </ul>
                  </div>
                  <p className="pt-3 text-5xl leading-none" style={{ fontFamily: 'var(--font-body)' }}>
                    {tier.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 text-left">
          <div>
            <h3 className="pb-4 border-b border-zinc-700 inline-block" style={{ paddingTop: 0 }}>
              Disclaimer
            </h3>
            <p className="mt-4 text-zinc-300 max-w-md">
              The amount of photos you receive is case dependent.
              <br />
              Expect around 3 delivered images per hour of the shoot.
            </p>
          </div>

          <div>
            <h3 className="pb-4 border-b border-zinc-700 inline-block" style={{ paddingTop: 0 }}>
              Optional costs
            </h3>
            <ul className="mt-4 space-y-2 text-zinc-300" style={{ listStyle: 'none', padding: 0 }}>
              <li>Studio costs</li>
              <li>Fees for specialty cameras &amp; lenses</li>
              <li>Material, development &amp; scanning</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
