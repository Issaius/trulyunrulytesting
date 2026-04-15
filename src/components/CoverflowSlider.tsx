'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';

import PhotoLightbox from './PhotoLightbox';

export type Slide = {
    src: string;
    alt: string;
    /** Legacy / unused in UI; kept for compatibility. */
    text?: string;
    /** From CMS; when set, used instead of parsing the filename from `src`. */
    title?: string;
    /** From CMS asset metadata; optional for future use (slider uses one shared frame for stable vertical centering). */
    width?: number;
    height?: number;
};

interface CoverflowSliderProps {
    slides: Slide[];
}

/** Extract a readable label from a URL path (local or Sanity CDN). */
function getFileName(src: string): string {
    try {
        const path = new URL(src).pathname;
        const file = path.split('/').pop() ?? '';
        return file.replace(/\.[^/.]+$/, '') || 'slide';
    } catch {
        const file = src.split('/').pop()?.split('?')[0] ?? '';
        return file.replace(/\.[^/.]+$/, '') || 'slide';
    }
}

export default function CoverflowSlider({ slides }: CoverflowSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [imageBandWidth, setImageBandWidth] = useState<number | null>(null);
    const imageBlockRef = useRef<HTMLDivElement | null>(null);

    if (slides.length === 0) {
        return null;
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const current = slides[currentIndex];

    /** Vertical budget: fixed nav + title/controls row + breathing room (slider sits below hero on home). ~12% under full budget so it stays clear of the header when scrolling. */
    const imageMaxHeight = 'calc(0.88 * (100dvh - 13.5rem))';

    useLayoutEffect(() => {
        const el = imageBlockRef.current;
        if (!el) {
            return;
        }
        const update = () => {
            setImageBandWidth(el.getBoundingClientRect().width);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [currentIndex, current.src, current.width, current.height]);

    return (
        <div className="relative w-full flex flex-col items-center min-w-0">
            <div className="w-full min-w-0">
                <div
                    className="flex flex-row justify-between items-center gap-3 md:gap-4 mb-3 md:mb-4 mx-auto w-full max-w-full min-w-0"
                    style={
                        imageBandWidth != null
                            ? { width: imageBandWidth, maxWidth: '100%' }
                            : undefined
                    }
                >
                    <div className="min-w-0 flex-1 text-left">
                        <h3
                            className="text-2xl lg:text-3xl font-serif mb-1 text-left"
                            style={{ padding: 0 }}
                        >
                            {current.title?.trim() || getFileName(current.src)}
                        </h3>
                        <p
                            className="text-zinc-400 text-left"
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '28px',
                            }}
                        >
                            {current.alt}
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={prevSlide}
                            className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Previous Slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Next Slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    className="relative flex w-full max-w-full mx-auto aspect-[3/2] min-h-0 items-center justify-center bg-black"
                    style={{ maxHeight: imageMaxHeight }}
                >
                    {slides.map((slide, index) => {
                        const w = slide.width ?? 2400;
                        const h = slide.height ?? 1600;
                        return (
                            <div
                                key={index}
                                className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
                                style={{
                                    opacity: index === currentIndex ? 1 : 0,
                                    pointerEvents: index === currentIndex ? 'auto' : 'none',
                                }}
                            >
                                <div
                                    ref={index === currentIndex ? imageBlockRef : undefined}
                                    className="relative w-fit max-h-full max-w-full shadow-[0_0_40px_-4px_color-mix(in_oklab,var(--color-zinc-400)_35%,transparent),0_0_18px_-2px_color-mix(in_oklab,var(--color-zinc-400)_22%,transparent)]"
                                >
                                    <button
                                        type="button"
                                        className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
                                        aria-label="Open image full screen"
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setLightboxOpen(true);
                                        }}
                                    >
                                        <Image
                                            src={slide.src}
                                            alt={slide.alt}
                                            width={w}
                                            height={h}
                                            className="block h-auto w-auto max-h-full max-w-full object-contain"
                                            priority={index === currentIndex}
                                            sizes="75vw"
                                        />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <PhotoLightbox
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                images={slides}
                index={currentIndex}
                onIndexChange={setCurrentIndex}
            />
        </div>
    );
}
