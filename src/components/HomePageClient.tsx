'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';
import { useGSAP } from '@gsap/react';
import { animatePageHeroFadeIn } from '@/lib/page-hero-fade-in';
import CoverflowSlider from './CoverflowSlider';
import TextSlider from './TextSlider';
import UnderlineHeading from './UnderlineHeading';
import type { HomeSliderSlide } from '@/lib/sanity-queries';

// =============================================================================
// Data (copy + config only)
// =============================================================================

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
    desc: 'This is where the magic happens.',
  },
  {
    id: 5,
    title: '5. Selection',
    desc: 'After my initial culling you may choose the finale images you want to keep. After that I will do all the necessary post-processing.',
  },
  {
    id: 6,
    title: '6. Delivery',
    desc: 'You\'ll get em.',
  },
] as const;

const PRICING_TIERS = [
  { label: '1/4 Day', shooting: '2 Hours', travel: '1 Hour', price: '200 €' },
  { label: '1/2 Day', shooting: '4 Hours', travel: '2 Hours', price: '350 €' },
  { label: 'Full Day', shooting: '8 Hours', travel: '3 Hours', price: '700 €' },
] as const;

const PRICING_INCLUDED = [
  'The entire process',
  'Commercial usage rights',
  'Web & print versions',
  'Post processing',
] as const;

/** Fills the full column cell so content centers between the grid lines. */
const PRICING_PRICE_CELL =
  'flex w-full items-center justify-center px-4 text-center tabular-nums whitespace-nowrap leading-[1.3]';

function PricingGridScrew({ className }: { className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- mix-blend-screen; white keyed on page bg
    <img
      src="/pricing-screw.png"
      alt=""
      width={40}
      height={40}
      draggable={false}
      className={`pointer-events-none absolute z-10 size-10 select-none object-contain mix-blend-screen ${className}`}
      aria-hidden
    />
  );
}

function useHomeHeroGsap(
  scope: RefObject<HTMLElement | null>,
  h1Ref: RefObject<HTMLHeadingElement | null>,
) {
  useGSAP(
    () => {
      animatePageHeroFadeIn(h1Ref.current);
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

function HeroNavButton({
  href,
  label,
  imageSrc,
  ariaLabel,
  minWidthClass = 'min-w-[19rem]',
  imageClassName = '',
}: {
  href: string;
  label: string;
  imageSrc: string;
  ariaLabel: string;
  minWidthClass?: string;
  imageClassName?: string;
}) {
  return (
    <a
      href={href}
      className={`group relative inline-flex h-[240px] ${minWidthClass} shrink-0 items-center justify-center rounded-full border-0 bg-transparent px-8`}
      aria-label={ariaLabel}
    >
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-body text-[calc(3rem+8px)] tracking-wide text-white opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden
      >
        {label}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element -- mix-blend-screen; black keyed on page bg */}
      <img
        src={imageSrc}
        alt=""
        width={240}
        height={240}
        draggable={false}
        className={`pointer-events-none absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 select-none object-contain mix-blend-screen opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-40 group-focus-visible:opacity-40 ${imageClassName}`}
      />
    </a>
  );
}

function useMirroredGap(
  sourceRef: RefObject<HTMLDivElement | null>,
  mirrorRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const source = sourceRef.current;
    const mirror = mirrorRef.current;
    if (!source || !mirror) return;

    const sync = () => {
      mirror.style.height = `${source.getBoundingClientRect().height}px`;
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(source);
    window.addEventListener('resize', sync);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [mirrorRef, sourceRef]);
}

function HeroSection({ h1Ref }: { h1Ref: RefObject<HTMLHeadingElement | null> }) {
  const aboveButtonsGapRef = useRef<HTMLDivElement | null>(null);
  const belowButtonsGapRef = useRef<HTMLDivElement | null>(null);

  useMirroredGap(aboveButtonsGapRef, belowButtonsGapRef);

  return (
    <section className="hero-section hero-section--from-top text-center md:px-6">
      <div className="hero-section-viewport flex min-h-svh flex-col items-center max-md:min-h-[calc(100svh-var(--mobile-hero-padding-top))]">
        <div className="hidden min-h-0 flex-1 md:block" aria-hidden />
        <div className="hero-section-inner flex flex-col items-center">
          <h1 ref={h1Ref}>
            Photodesigner
            <br />
            based in munich
          </h1>

          <p className="mt-2 text-xl font-body lowercase tracking-wide text-zinc-500">
            (available worldwide)
          </p>

          <TextSlider />
        </div>
        <div ref={aboveButtonsGapRef} className="min-h-0 w-full flex-1" aria-hidden />
      </div>

      <div className="hero-section-buttons flex w-full max-w-full flex-wrap items-center justify-center gap-16">
        <HeroNavButton
          href="/about"
          label="Contact"
          imageSrc="/phone-button.png"
          ariaLabel="About and contact"
          imageClassName="rounded-full"
        />
        <HeroNavButton
          href="/portfolio"
          label="Portfolio"
          imageSrc="/portfolio-button.png"
          ariaLabel="Portfolio"
          minWidthClass="min-w-[22rem]"
        />
        <HeroNavButton
          href="#pricing"
          label="Pricing"
          imageSrc="/pricing-button.png"
          ariaLabel="Pricing"
        />
      </div>

      <div ref={belowButtonsGapRef} className="w-full shrink-0" aria-hidden />
    </section>
  );
}

function HomeSliderSection({ slides }: { slides: HomeSliderSlide[] }) {
  if (slides.length === 0) {
    return (
      <section className="content-section section-gap-after text-zinc-400">
        <p>
          No slides yet. Add a &quot;Home Slider&quot; document in Sanity Studio and publish.
        </p>
      </section>
    );
  }

  return (
    <section className="content-section section-gap-after">
      <CoverflowSlider slides={slides} />
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
    <section className="content-section section-gap-after">
      <h2 className="headline">the process</h2>

      <div className="md:w-[calc(100%+3rem)] md:-ml-6">
        <div className="md:px-0">
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
                  className="process-step-card flex-shrink-0 flex flex-col w-[420px] max-w-[85vw]"
                >
                  <div className="flex w-full flex-col justify-end items-center h-[120px] px-8">
                    <UnderlineHeading>{step.title}</UnderlineHeading>
                  </div>
                  <div className="w-full px-8 pb-8 h-[250px]">
                    <p className="mt-4 text-zinc-300 leading-relaxed whitespace-pre-wrap">{step.desc}</p>
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

function PricingSection() {
  return (
    <section id="pricing" className="content-section page-last-section pt-0 scroll-mt-24">
      <h2 className="headline">pricing</h2>

      <div className="mb-16">
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <colgroup>
              <col />
              <col className="w-0" />
              <col />
              <col className="w-0" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="relative p-0 text-zinc-300 font-normal text-[40px]">
                  <div className="py-4 px-4">Rates</div>
                  <PricingGridScrew className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
                </th>
                <th className="py-4 border-l border-zinc-800 px-4 text-zinc-300 font-normal text-[40px] whitespace-nowrap">
                  Travel Time
                </th>
                <th className="py-4 border-l border-zinc-800 px-4 text-zinc-300 font-normal text-[40px] whitespace-nowrap">
                  Included
                </th>
                <th className="border-l border-zinc-800 p-0 text-zinc-300 font-normal text-[40px]">
                  <div className={`${PRICING_PRICE_CELL} py-4`}>Price</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {PRICING_TIERS.map((tier, index) => (
                <tr key={tier.label} className="border-b border-zinc-800 last:border-b-0">
                  <td className="py-6 px-4 align-top">
                    <h3 style={{ padding: 0 }}>{tier.label}</h3>
                    <p className="mt-2 text-zinc-300 italic">{tier.shooting} shooting time</p>
                  </td>
                  <td className="py-6 border-l border-zinc-800 px-4 align-middle text-[28px] whitespace-nowrap text-zinc-300 italic">
                    {tier.travel}
                  </td>
                  {index === 0 ? (
                    <td
                      rowSpan={PRICING_TIERS.length}
                      className="py-6 border-l border-zinc-800 px-4 align-middle text-[28px] text-zinc-300"
                    >
                      <IncludedBulletList />
                    </td>
                  ) : null}
                  <td className="relative border-l border-zinc-800 p-0 align-middle text-[40px]">
                    {index === 1 ? (
                      <PricingGridScrew className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
                    ) : null}
                    <div className={`${PRICING_PRICE_CELL} py-6 font-bold`}>{tier.price}</div>
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

  useHomeHeroGsap(gsapScopeRef, h1Ref);

  const process = useProcessStripScrub();

  return (
    <main ref={gsapScopeRef} style={{ textAlign: 'center' }}>
      <HeroSection h1Ref={h1Ref} />
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
