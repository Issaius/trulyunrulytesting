'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import CoverflowSlider from './CoverflowSlider';
import type { HomeSliderSlide } from '@/lib/sanity-queries';

// =============================================================================
// Data (copy + config only)
// =============================================================================

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

/** Extra first word at end so the loop can snap back off-screen. */
const SLIDER_WORDS_FOR_DISPLAY = [...SLIDER_WORDS, SLIDER_WORDS[0]];

const PROCESS_STEPS = [
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
] as const;

const PRICING_TIERS = [
  { label: '1/4 Day', shooting: '2 Hours', travel: '1 Hour', price: '200€' },
  { label: '1/2 Day', shooting: '4 Hours', travel: '2 Hours', price: '350€' },
  { label: 'Full Day', shooting: '8 Hours', travel: '3 Hours', price: '700€' },
] as const;

const PRICING_INCLUDED = [
  'The entire process',
  'Commercial usage rights',
  'Web & print versions',
  'Post processing',
] as const;

// =============================================================================
// Hero — vertical word carousel (GSAP)
// =============================================================================

function createWordCarousel(track: HTMLDivElement, wordCount: number) {
  let timeline: gsap.core.Timeline | null = null;
  let lastRowHeightPx = -1;

  const stop = () => {
    timeline?.kill();
    timeline = null;
    gsap.killTweensOf(track);
  };

  const rebuild = () => {
    const firstRow = track.firstElementChild as HTMLElement | null;
    const rowH = firstRow?.getBoundingClientRect().height ?? 0;
    if (rowH < 1) return;
    if (timeline && Math.abs(rowH - lastRowHeightPx) < 0.5) return;
    lastRowHeightPx = rowH;

    stop();
    gsap.set(track, { y: 0, yPercent: 0 });

    const next = gsap.timeline({ repeat: -1 });
    for (let step = 1; step <= wordCount; step++) {
      next.to(
        track,
        { y: -step * rowH, duration: 0.6, ease: 'power3.inOut', force3D: true },
        '+=1.5',
      );
    }
    next.set(track, { y: 0 });
    timeline = next;
  };

  const dispose = () => {
    stop();
    gsap.set(track, { y: 0, yPercent: 0 });
  };

  return { rebuild, dispose };
}

function useHomeHeroGsap(
  scope: RefObject<HTMLElement | null>,
  h1Ref: RefObject<HTMLHeadingElement | null>,
  wordTrackRef: RefObject<HTMLDivElement | null>,
) {
  useGSAP(
    () => {
      gsap.from(h1Ref.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.3,
      });

      const track = wordTrackRef.current;
      if (!track) return;

      const carousel = createWordCarousel(track, SLIDER_WORDS.length);
      carousel.rebuild();

      const firstRow = track.firstElementChild as HTMLElement | null;
      const resizeObserver =
        firstRow &&
        new ResizeObserver(() => {
          carousel.rebuild();
        });
      if (firstRow && resizeObserver) resizeObserver.observe(firstRow);

      let mounted = true;
      void document.fonts.ready.then(() => {
        if (mounted) carousel.rebuild();
      });

      return () => {
        mounted = false;
        resizeObserver?.disconnect();
        carousel.dispose();
      };
    },
    { scope },
  );
}

// =============================================================================
// Process — horizontal strip ↔ range slider
// =============================================================================

function useProcessStripScrub() {
  const stripRef = useRef<HTMLDivElement>(null);
  /** Ignore scroll events while we move the strip from the range input. */
  const scrubbingFromRangeRef = useRef(false);
  const rangeScrollUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [scrubPct, setScrubPct] = useState(0);
  const [stripPadding, setStripPadding] = useState({ pl: 0, pr: 0 });

  const clearUnlockTimer = useCallback(() => {
    if (rangeScrollUnlockTimerRef.current !== null) {
      clearTimeout(rangeScrollUnlockTimerRef.current);
      rangeScrollUnlockTimerRef.current = null;
    }
  }, []);

  const endRangeDrivenScroll = useCallback(() => {
    scrubbingFromRangeRef.current = false;
    clearUnlockTimer();
  }, [clearUnlockTimer]);

  const scrollStripToPercent = useCallback(
    (pct: number) => {
      const el = stripRef.current;
      if (!el) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        endRangeDrivenScroll();
        return;
      }

      scrubbingFromRangeRef.current = true;
      clearUnlockTimer();
      el.scrollTo({ left: (pct / 100) * maxScroll, behavior: 'auto' });

      const onScrollEnd = () => {
        el.removeEventListener('scrollend', onScrollEnd);
        endRangeDrivenScroll();
      };
      el.addEventListener('scrollend', onScrollEnd, { passive: true });

      rangeScrollUnlockTimerRef.current = setTimeout(() => {
        el.removeEventListener('scrollend', onScrollEnd);
        endRangeDrivenScroll();
      }, 900);
    },
    [clearUnlockTimer, endRangeDrivenScroll],
  );

  const setScrubFromRange = useCallback(
    (pct: number) => {
      setScrubPct(pct);
      scrollStripToPercent(pct);
    },
    [scrollStripToPercent],
  );

  const updateStripPadding = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const cards = strip.querySelectorAll<HTMLElement>('.process-step-card');
    const first = cards[0];
    if (!first) {
      setStripPadding((p) => (p.pl === 0 && p.pr === 0 ? p : { pl: 0, pr: 0 }));
      return;
    }

    const viewW = strip.clientWidth;
    const firstW = first.offsetWidth;
    const last = cards[cards.length - 1];
    const lastW = last?.offsetWidth ?? firstW;
    const pl = Math.max(0, (viewW - firstW) / 2);
    const pr = Math.max(0, (viewW - lastW) / 2);

    setStripPadding((prev) =>
      prev.pl === pl && prev.pr === pr ? prev : { pl, pr },
    );
  }, []);

  useLayoutEffect(() => {
    updateStripPadding();
    const strip = stripRef.current;
    if (!strip) return;

    const ro = new ResizeObserver(updateStripPadding);
    ro.observe(strip);
    strip.querySelectorAll('.process-step-card').forEach((node) => ro.observe(node));
    return () => ro.disconnect();
  }, [updateStripPadding]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const syncRangeFromStripScroll = () => {
      if (scrubbingFromRangeRef.current) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) {
        setScrubPct(0);
        return;
      }
      setScrubPct((el.scrollLeft / max) * 100);
    };

    el.addEventListener('scroll', syncRangeFromStripScroll, { passive: true });
    const ro = new ResizeObserver(syncRangeFromStripScroll);
    ro.observe(el);
    syncRangeFromStripScroll();

    return () => {
      el.removeEventListener('scroll', syncRangeFromStripScroll);
      ro.disconnect();
    };
  }, [stripPadding]);

  useEffect(
    () => () => {
      clearUnlockTimer();
    },
    [clearUnlockTimer],
  );

  const onRangeInput = useCallback(
    (e: { currentTarget: HTMLInputElement }) => {
      setScrubFromRange(Number(e.currentTarget.value));
    },
    [setScrubFromRange],
  );

  return { stripRef, scrubPct, stripPadding, onRangeInput };
}

// =============================================================================
// Sections (presentational)
// =============================================================================

function HeroSection({
  h1Ref,
  wordTrackRef,
}: {
  h1Ref: RefObject<HTMLHeadingElement | null>;
  wordTrackRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 ref={h1Ref}>
        Photodesigner
        <br />
        based in munich
      </h1>

      <p className="mt-2 text-xl font-body lowercase tracking-wide text-zinc-500">
        (available worldwide)
      </p>

      <div className="mt-8 flex items-center justify-center gap-2 font-body italic text-zinc-400 text-[calc(1.5rem+4px)] max-w-full">
        <span>for:</span>
        <div className="h-[1.5em] min-w-0 overflow-hidden">
          <div ref={wordTrackRef} className="flex flex-col">
            {SLIDER_WORDS_FOR_DISPLAY.map((word, i) => (
              <span
                key={i}
                className="h-[1.5em] flex items-center justify-center whitespace-nowrap"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeSliderSection({ slides }: { slides: HomeSliderSlide[] }) {
  if (slides.length === 0) {
    return (
      <section className="w-full px-6 pb-16 text-zinc-400">
        <p className="mx-auto w-full max-w-[min(66vw,1200px)]">
          No slides yet. Add a &quot;Home Slider&quot; document in Sanity Studio and publish.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full px-6 pb-16">
      <div className="mx-auto w-full max-w-[min(66vw,1400px)]">
        <CoverflowSlider slides={slides} />
      </div>
    </section>
  );
}

function ProcessSection({
  stripRef,
  scrubPct,
  stripPadding,
  onRangeInput,
}: {
  stripRef: RefObject<HTMLDivElement | null>;
  scrubPct: number;
  stripPadding: { pl: number; pr: number };
  onRangeInput: (e: { currentTarget: HTMLInputElement }) => void;
}) {
  const sliderStyle = {
    '--process-pct': scrubPct,
    width: 'min(100%, max(10rem, calc(100% - 280px)))',
  } as CSSProperties;

  return (
    <section className="px-6 w-full max-w-[min(75vw,1400px)] mx-auto mb-16">
      <h2 className="headline">the process</h2>

      <div className="w-[calc(100%+3rem)] -ml-6 md:w-full md:ml-0">
        <div className="px-6 md:px-0">
          <div className="flex w-full justify-center mb-0">
            <div
              className="process-cut-slider-wrap relative flex min-h-[var(--process-thumb-w)] items-center min-w-0"
              style={sliderStyle}
            >
              <div className="process-cut-line-track" aria-hidden />
              <div className="process-cut-line-cover" aria-hidden />
              <label className="sr-only" htmlFor="process-cut-slider">
                Scroll through process steps
              </label>
              <input
                id="process-cut-slider"
                type="range"
                min={0}
                max={100}
                step={0.01}
                value={scrubPct}
                onChange={onRangeInput}
                onInput={onRangeInput}
                className="process-cut-slider relative z-10 min-w-0 w-full flex-1"
              />
            </div>
          </div>

          <div
            ref={stripRef}
            className="process-steps-strip overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div
              className="process-steps-strip-track"
              style={{
                paddingLeft: stripPadding.pl,
                paddingRight: stripPadding.pr,
              }}
            >
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.id}
                  className="process-step-card flex-shrink-0 flex flex-col min-w-[300px] w-[85vw] sm:w-[50vw] md:w-[350px]"
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
          </div>
        </div>
      </div>
    </section>
  );
}

function IncludedBulletList({ compact }: { compact?: boolean }) {
  return (
    <ul
      className={
        compact
          ? 'space-y-1'
          : 'space-y-2 text-zinc-300 list-none p-0 leading-normal [&_li]:whitespace-nowrap'
      }
    >
      {PRICING_INCLUDED.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function UnderlineHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="relative inline-block pb-4 pt-0">
      {children}
      <span
        className="pointer-events-none absolute bottom-0 left-[-40px] right-[-40px] h-px bg-zinc-700"
        aria-hidden
      />
    </h3>
  );
}

function PricingSection() {
  return (
    <section className="pt-0 pb-16 px-6 w-full max-w-[min(75vw,1400px)] mx-auto">
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
              {PRICING_TIERS.map((tier, index) => (
                <tr key={tier.label} className="border-b border-zinc-800 last:border-b-0">
                  <td className="py-6 align-top">
                    <h3 className="text-4xl" style={{ padding: 0 }}>
                      {tier.label}
                    </h3>
                    <p className="mt-2 text-zinc-300 italic">{tier.shooting} shooting time</p>
                  </td>
                  <td className="py-6 border-l border-zinc-800 px-2 align-middle text-[28px] whitespace-nowrap text-zinc-300 italic">
                    {tier.travel}
                  </td>
                  {index === 0 ? (
                    <td
                      rowSpan={PRICING_TIERS.length}
                      className="py-6 border-l border-zinc-800 px-2 align-middle text-[28px] text-zinc-300"
                    >
                      <IncludedBulletList />
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
          {PRICING_TIERS.map((tier) => (
            <div key={tier.label} className="border border-zinc-800 p-6">
              <h3 className="text-4xl" style={{ padding: 0 }}>
                {tier.label}
              </h3>
              <div className="mt-5 space-y-3 text-zinc-300">
                <p className="italic">{tier.shooting} shooting time</p>
                <p className="text-[28px]">
                  <span className="text-zinc-400">Travel Time:</span>{' '}
                  <span className="italic">{tier.travel}</span>
                </p>
                <div className="text-[28px]">
                  <p className="text-zinc-400 mb-1">Included:</p>
                  <IncludedBulletList compact />
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
          <UnderlineHeading>Disclaimer</UnderlineHeading>
          <p className="mt-4 text-zinc-300 max-w-md mx-auto">
            The amount of photos you receive is case dependent.
            <br />
            Expect around 3 delivered images per hour of the shoot.
          </p>
        </div>

        <div>
          <UnderlineHeading>Optional Costs</UnderlineHeading>
          <ul className="mt-4 space-y-2 text-zinc-300 max-w-md mx-auto list-none p-0">
            <li>Material, development &amp; scanning for analogue shoots</li>
            <li>Fees for specialty cameras &amp; lenses</li>
            <li>Studio costs</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Page
// =============================================================================

type HomePageClientProps = {
  slides: HomeSliderSlide[];
};

export default function HomePageClient({ slides }: HomePageClientProps) {
  const gsapScopeRef = useRef<HTMLElement | null>(null);
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const wordTrackRef = useRef<HTMLDivElement | null>(null);

  useHomeHeroGsap(gsapScopeRef, h1Ref, wordTrackRef);

  const process = useProcessStripScrub();

  return (
    <main ref={gsapScopeRef} style={{ textAlign: 'center' }}>
      <HeroSection h1Ref={h1Ref} wordTrackRef={wordTrackRef} />
      <HomeSliderSection slides={slides} />
      <ProcessSection
        stripRef={process.stripRef}
        scrubPct={process.scrubPct}
        stripPadding={process.stripPadding}
        onRangeInput={process.onRangeInput}
      />
      <PricingSection />
    </main>
  );
}
