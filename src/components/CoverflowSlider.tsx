'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { GALLERY_SHADOW } from '@/lib/gallery-shadow';
import { getFileNameFromSrc } from '@/lib/image-filename';
import { renderSanityRichText, richTextToPlainText, type SanityRichText } from '@/lib/sanity-richtext';
import { useLightbox } from '@/components/lightbox/LightboxProvider';

export type Slide = {
    src: string;
    alt: string;
    /** Optional rich CMS title. */
    title?: SanityRichText;
    /** Optional rich CMS caption. */
    caption?: SanityRichText;
    /** From CMS asset metadata; optional for future use (slider uses one shared frame for stable vertical centering). */
    width?: number;
    height?: number;
};

interface CoverflowSliderProps {
    slides: Slide[];
}

export default function CoverflowSlider({ slides }: CoverflowSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageBandWidth, setImageBandWidth] = useState<number | null>(null);
    const imageBlockRef = useRef<HTMLButtonElement | null>(null);
    const { open: openLightbox } = useLightbox();
    const captionFontSizePx = Math.round(28 * 0.8);
    const titleFontSizePx = Math.round(captionFontSizePx * 1.5);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const current = slides[currentIndex];
    const titlePlain = richTextToPlainText(current.title);
    const captionPlain = richTextToPlainText(current.caption);

    /** Keep the frame contained on large desktop screens. */
    const imageMaxHeight = 'min(72dvh, 760px)';

    useLayoutEffect(() => {
        if (slides.length === 0) {
            return;
        }
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
    }, [slides.length, currentIndex, current?.src, current?.width, current?.height]);

    if (slides.length === 0) {
        return null;
    }

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
                        <div
                            className="text-2xl lg:text-3xl font-body mb-1 text-left"
                            style={{ padding: 0, fontSize: `${titleFontSizePx}px`, fontWeight: 700 }}
                        >
                            {titlePlain ? renderSanityRichText(current.title) : getFileNameFromSrc(current.src)}
                        </div>
                        <div
                            className="text-zinc-400 text-left"
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: `${captionFontSizePx}px`,
                            }}
                        >
                            {captionPlain ? renderSanityRichText(current.caption) : current.alt}
                        </div>
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
                    className="relative mx-auto flex w-full max-w-full min-h-0 aspect-[3/2] items-center justify-center overflow-hidden bg-black"
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
                                <button
                                    type="button"
                                    ref={index === currentIndex ? imageBlockRef : undefined}
                                    className={`relative w-fit max-h-full max-w-full border-0 bg-transparent p-0 cursor-pointer ${GALLERY_SHADOW}`}
                                    onClick={() => openLightbox(slides, currentIndex)}
                                    aria-label="Open image in full viewer"
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
