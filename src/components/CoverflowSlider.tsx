'use client';

import { useState } from 'react';
import Image from 'next/image';

export type Slide = {
    src: string;
    alt: string;
    /** Legacy / unused in UI; kept for compatibility. */
    text?: string;
    /** From CMS; when set, used instead of parsing the filename from `src`. */
    title?: string;
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

    return (
        <div className="relative w-full flex flex-col items-center">

            {/* 3:2 landscape; reserve for title row so image + chrome ≤ 100dvh */}
            <div className="w-full max-w-[min(100%,calc((100dvh-16rem)*3/2))] min-w-0">
                <div className="flex flex-row justify-between items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="min-w-0 flex-1 text-left">
                        <h3
                            className="text-2xl lg:text-3xl font-serif mb-1 text-left"
                            style={{ padding: 0 }}
                        >
                            {current.title?.trim() || getFileName(current.src)}
                        </h3>
                        <p
                            className="text-zinc-500 text-left"
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

                <div className="relative w-full aspect-[3/2] bg-black min-w-0">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{
                                opacity: index === currentIndex ? 1 : 0,
                                pointerEvents: index === currentIndex ? 'auto' : 'none',
                            }}
                        >
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                className="object-contain"
                                priority={index === currentIndex}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
