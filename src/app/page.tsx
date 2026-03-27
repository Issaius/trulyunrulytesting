'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import CoverflowSlider from '../components/CoverflowSlider';

export default function Home() {
  const container = useRef(null);
  const h1Ref = useRef(null);
  const sliderRef = useRef(null);

  // Slider items — the first item is duplicated at the end to create a seamless looping effect
  const sliderWords = [
    'artisans',
    'artists',
    'extraordinaires',
    'tattoo artists',
    'people who care',
    'drug dealers',
    'outcasts',
    'dissidents',
    'felons'
  ];
  const displayWords = [...sliderWords, sliderWords[0]];

  useGSAP(() => {
    // 1. Initial fade in for H1
    gsap.from(h1Ref.current, {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
      delay: 0.3
    });

    // 2. Vertical text slider loop
    const totalWords = sliderWords.length;
    const tl = gsap.timeline({ repeat: -1 });

    for (let i = 1; i <= totalWords; i++) {
      tl.to(sliderRef.current, {
        yPercent: -(i * (100 / (totalWords + 1))),
        duration: 0.6,
        ease: 'power3.inOut'
      }, "+=1.5");
    }

  }, { scope: container });

  return (
    <main ref={container} style={{ textAlign: 'center' }}>

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 ref={h1Ref} style={{ padding: 0 }}>
          Photodesigner<br />
          based in munich
        </h1>

        <div className="mt-8 text-2xl font-body italic text-zinc-400 flex items-center justify-center gap-2 max-w-full">
          <span>for:</span>
          {/* Scroll container: restrict height to 1 item to hide the others */}
          <div className="h-[1.5em] overflow-hidden text-left relative">
            <div ref={sliderRef} className="flex flex-col">
              {displayWords.map((word, i) => (
                <span key={i} className="h-[1.5em] flex items-center whitespace-nowrap">{word}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Photo Slider ─────────────────────────────────────────── */}
      <section className="w-full pb-20 overflow-hidden">
        <CoverflowSlider
          slides={[
            {
              src: '/images/concert_bassist_1772358210739.png',
              alt: 'Concert bassist',
              text: 'yourself'
            },
            {
              src: '/images/graveyard_path_1772358235935.png',
              alt: 'Graveyard path',
              text: 'see'
            },
            {
              src: '/images/woman_lights_1772358222930.png',
              alt: 'Woman profile at night',
              text: 'for'
            }
          ]}
        />
      </section>

      {/* ─── Process ──────────────────────────────────────────────── */}
      <section className="px-6 max-w-6xl mx-auto mb-32">
        <h2 className="headline">the process</h2>

        <div className="flex flex-col gap-[210px] -mt-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800">
            <div className="bg-black p-10 flex flex-col justify-start">
              <div className="flex flex-col justify-end h-[120px]">
                <h3 style={{ paddingBottom: '20px' }}>1. Initial Call</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">We get to know each other, talk about what general project you have in mind, and decide if it makes sense to work together.</p>
            </div>

            <div className="bg-black p-10 flex flex-col justify-start">
              <div className="flex flex-col justify-end h-[120px]">
                <h3 style={{ paddingBottom: '20px' }}>2. Ideation Meeting</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">Here we discuss the details of the idea you have in mind. If you don't yet have a rough idea, I likely have one that you'll like.<br /><br />You pay after this.</p>
            </div>

            <div className="bg-black p-10 flex flex-col justify-start">
              <div className="flex flex-col justify-end h-[120px]">
                <h3 style={{ paddingBottom: '20px' }}>3. Preparation Meeting</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">Here we set the details for the photoshoot. Time, Date, Location, necessary props, outfits and things to organize.</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800">
            <div className="bg-black p-10 flex flex-col justify-start">
              <div className="flex flex-col justify-end h-[120px]">
                <h3 style={{ paddingBottom: '20px' }}>4. The Photoshoot</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">This is where the magic happens.</p>
            </div>

            <div className="bg-black p-10 flex flex-col justify-start">
              <div className="flex flex-col justify-end h-[120px]">
                <h3 style={{ paddingBottom: '20px' }}>5. Selection Meeting</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">We select the final images that are to be post processed.</p>
            </div>

            <div className="bg-black p-10 flex flex-col justify-start">
              <div className="flex flex-col justify-end h-[120px]">
                <h3 style={{ paddingBottom: '20px' }}>6. fin</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">You get what you paid for.</p>
            </div>
          </div>
        </div>

      </section>

      {/* ─── Pricing ──────────────────────────────────────────────── */}
      <section className="pt-0 pb-32 px-6 max-w-6xl mx-auto">
        <h2 className="headline">pricing</h2>

        {/* Pricing rows */}
        <div className="mb-20 -mt-5">
          {/* Quarter Day */}
          <div className="flex items-baseline py-8" style={{ borderBottom: '1px solid #333' }}>
            <h3 style={{ padding: 0, width: '40%', minWidth: '200px' }}>Quarter Day</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '2rem', lineHeight: 1, width: '25%' }}>200€</p>
            <p className="text-zinc-400" style={{ fontFamily: 'var(--font-body)' }}>up to 2 hours of shooting</p>
          </div>

          {/* Half Day */}
          <div className="flex items-baseline py-8" style={{ borderBottom: '1px solid #333' }}>
            <h3 style={{ padding: 0, width: '40%', minWidth: '200px' }}>Half Day</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '2rem', lineHeight: 1, width: '25%' }}>350€</p>
            <p className="text-zinc-400" style={{ fontFamily: 'var(--font-body)' }}>up to 4 hours of shooting</p>
          </div>

          {/* Full Day */}
          <div className="flex items-baseline py-8">
            <h3 style={{ padding: 0, width: '40%', minWidth: '200px' }}>Full Day</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '2rem', lineHeight: 1, width: '25%' }}>700€</p>
            <p className="text-zinc-400" style={{ fontFamily: 'var(--font-body)' }}>up to 8 hours of shooting</p>
          </div>
        </div>


        {/* Optional costs & Inclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          <div>
            <h3 style={{ padding: '40px 0' }}>Optional costs</h3>
            <ul className="space-y-3 text-zinc-300" style={{ listStyle: 'none', padding: 0 }}>
              <li>Studio fees if required</li>
              <li>Gear fees for rental of specialty cameras or lenses</li>
              <li>Purchase, development & scanning of film</li>
            </ul>
          </div>

          <div>
            <h3 style={{ padding: '40px 0' }}>All rates include</h3>
            <ul className="space-y-3 text-zinc-300" style={{ listStyle: 'none', padding: 0 }}>
              <li>120 minutes of travel time</li>
              <li>The entire process</li>
              <li>Commercial usage rights of images</li>
              <li>Web & print ready files</li>
            </ul>
            <p className="mt-8 text-zinc-500">
              The amount of photos you receive is case dependent.<br />
              Expect no less than one final image per hour of the shoot.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
