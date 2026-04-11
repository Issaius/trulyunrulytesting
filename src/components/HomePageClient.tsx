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
        <section className="w-full pb-10 px-6">
          <div className="w-[66vw] mx-auto">
            <CoverflowSlider slides={slides} />
          </div>
        </section>
      ) : (
        <section className="w-full pb-10 px-6 text-zinc-400">
          <p className="w-[66vw] mx-auto">No slides yet. Add a &quot;Home Slider&quot; document in Sanity Studio and publish.</p>
        </section>
      )}

      <section className="px-6 w-[75vw] mx-auto mb-16">
        <h2 className="headline">the process</h2>

        <div className="flex overflow-x-auto snap-x snap-mandatory w-[calc(100%+3rem)] -ml-6 px-6 md:w-full md:ml-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-0 pb-16 px-6 w-[75vw] mx-auto">
        <h2 className="headline">pricing</h2>

        <div className="mb-16">
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-center table-fixed">
              <colgroup>
                <col className="w-[29%]" />
                <col className="w-[19%]" />
                <col className="w-[35%]" />
                <col className="w-[17%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-4 text-zinc-300 font-normal text-[28px]">Rates</th>
                  <th className="py-4 border-l border-zinc-800 px-2 text-zinc-300 font-normal text-[28px] whitespace-nowrap">
                    Travel Time
                  </th>
                  <th className="py-4 border-l border-zinc-800 px-2 text-zinc-300 font-normal text-[28px] whitespace-nowrap">
                    Included
                  </th>
                  <th className="py-4 border-l border-zinc-800 px-2 text-zinc-300 font-normal">Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '1/4 Day', shooting: '2 Hours', travel: '1 Hour', price: '200€' },
                  { label: '1/2 Day', shooting: '4 Hours', travel: '2 Hours', price: '350€' },
                  { label: 'Full Day', shooting: '8 Hours', travel: '3 Hours', price: '700€' },
                ].map((tier, index) => (
                  <tr
                    key={tier.label}
                    className="border-b border-zinc-800 last:border-b-0"
                  >
                    <td className="py-6 align-top">
                      <h3 className="text-4xl" style={{ padding: 0 }}>
                        {tier.label}
                      </h3>
                      <p className="mt-2 text-zinc-300 italic">
                        {tier.shooting} shooting time
                      </p>
                    </td>
                    <td className="py-6 border-l border-zinc-800 px-2 align-middle text-[28px] whitespace-nowrap text-zinc-300 italic">
                      {tier.travel}
                    </td>
                    {index === 0 ? (
                      <td
                        rowSpan={3}
                        className="py-6 border-l border-zinc-800 px-2 align-middle text-[28px]"
                      >
                        <ul className="space-y-2 text-zinc-300 list-none p-0 leading-normal [&_li]:whitespace-nowrap">
                          <li>The entire process</li>
                          <li>Commercial usage rights</li>
                          <li>Web &amp; print versions</li>
                          <li>Post processing</li>
                        </ul>
                      </td>
                    ) : null}
                    <td className="py-6 border-l border-zinc-800 px-2 align-middle">
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
              <div key={tier.label} className="border border-zinc-800 p-6">
                <h3 className="text-4xl" style={{ padding: 0 }}>
                  {tier.label}
                </h3>
                <div className="mt-5 space-y-3 text-zinc-300">
                  <p className="italic">{tier.shooting} shooting time</p>
                  <p className="text-[28px]">
                    <span className="text-zinc-400">Travel Time:</span> <span className="italic">{tier.travel}</span>
                  </p>
                  <div className="text-[28px]">
                    <p className="text-zinc-400 mb-1">Included:</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 text-center">
          <div>
            <h3 className="relative inline-block pb-4 pt-0">
              Disclaimer
              <span
                className="pointer-events-none absolute bottom-0 left-[-40px] right-[-40px] h-px bg-zinc-700"
                aria-hidden
              />
            </h3>
            <p className="mt-4 text-zinc-300 max-w-md mx-auto">
              The amount of photos you receive is case dependent.
              <br />
              Expect around 3 delivered images per hour of the shoot.
            </p>
          </div>

          <div>
            <h3 className="relative inline-block pb-4 pt-0">
              Optional Costs
              <span
                className="pointer-events-none absolute bottom-0 left-[-40px] right-[-40px] h-px bg-zinc-700"
                aria-hidden
              />
            </h3>
            <ul className="mt-4 space-y-2 text-zinc-300 max-w-md mx-auto list-none p-0">
              <li>Material, development &amp; scanning for analogue shoots</li>
              <li>Fees for specialty cameras &amp; lenses</li>
              <li>Studio costs</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
