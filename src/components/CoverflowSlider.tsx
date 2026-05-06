'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { GALLERY_SHADOW, galleryShadowBoxCss } from '@/lib/gallery-shadow';
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

type BoxSize = {
    width: number;
    height: number;
};

/**
 * When max-height caps the frame but width is still `w-full`, the measured box can be
 * wider than a 3:2 rectangle at that height. This returns the true 3:2 slot so the
 * header and image math line up with the visible picture edges.
 */
function effectiveThreeByTwoSlot(raw: BoxSize | null): BoxSize | null {
    if (!raw || raw.width <= 0 || raw.height <= 0) {
        return null;
    }
    const width = Math.min(raw.width, (raw.height * 3) / 2);
    const height = (width * 2) / 3;
    return { width, height };
}

function getContainedImageBox(frame: BoxSize | null, slide: Slide): BoxSize | null {
    if (!frame || frame.width <= 0 || frame.height <= 0) {
        return null;
    }

    const imageWidth = slide.width ?? 2400;
    const imageHeight = slide.height ?? 1600;
    const imageAspect = imageWidth / imageHeight;
    const frameAspect = frame.width / frame.height;

    if (frameAspect > imageAspect) {
        return {
            width: frame.height * imageAspect,
            height: frame.height,
        };
    }

    return {
        width: frame.width,
        height: frame.width / imageAspect,
    };
}

export default function CoverflowSlider({ slides }: CoverflowSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageFrameSize, setImageFrameSize] = useState<BoxSize | null>(null);
    const imageFrameRef = useRef<HTMLDivElement | null>(null);
    const { open: openLightbox } = useLightbox();
    const captionFontSizePx = Math.round(28 * 0.8);
    const titleFontSizePx = Math.round(captionFontSizePx * 1.5);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    /** Keep the frame contained on large desktop screens. */
    const imageMaxHeight = 'min(72dvh, 760px)';

    useLayoutEffect(() => {
        const el = imageFrameRef.current;
        if (!el) {
            return;
        }
        const update = () => {
            const { width, height } = el.getBoundingClientRect();
            setImageFrameSize((previous) => {
                if (
                    previous &&
                    Math.abs(previous.width - width) < 0.5 &&
                    Math.abs(previous.height - height) < 0.5
                ) {
                    return previous;
                }

                return { width, height };
            });
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [slides.length]);

    if (slides.length === 0) {
        return null;
    }

    const current = slides[currentIndex] ?? slides[0];
    const layoutFrame = effectiveThreeByTwoSlot(imageFrameSize);
    const slotFrame =
        layoutFrame == null
            ? null
            : (() => {
                  const width = Math.round(layoutFrame.width);
                  const height = Math.round((width * 2) / 3);
                  return { width, height };
              })();
    /** Aligns with the 3:2 slot (not an over-wide `w-full` rect when max-height binds). */
    const headerBandWidthPx = slotFrame?.width ?? null;
    const titlePlain = richTextToPlainText(current.title);
    const captionPlain = richTextToPlainText(current.caption);

    return (
        <div className="relative w-full flex flex-col items-center min-w-0">
            <div className="w-full min-w-0">
                <div
                    className="flex flex-row justify-between items-center gap-3 md:gap-4 mb-3 md:mb-4 mx-auto w-full max-w-full min-w-0"
                    style={
                        headerBandWidthPx != null
                            ? { width: headerBandWidthPx, maxWidth: '100%' }
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
                    ref={imageFrameRef}
                    className="relative mx-auto flex w-full max-w-full min-h-0 aspect-[3/2] items-center justify-center overflow-visible bg-black"
                    style={{
                        maxHeight: imageMaxHeight,
                        ...(headerBandWidthPx != null
                            ? { width: `${headerBandWidthPx}px`, maxWidth: '100%' }
                            : {}),
                    }}
                >
                    {slides.map((slide, index) => {
                        const w = slide.width ?? 2400;
                        const h = slide.height ?? 1600;
                        const imageBox = getContainedImageBox(slotFrame, slide);
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
                                    className={`relative ${imageBox ? 'block' : 'w-fit'} max-h-full max-w-full border-0 bg-transparent p-0 cursor-pointer ${imageBox ? '' : GALLERY_SHADOW}`}
                                    style={
                                        imageBox
                                            ? {
                                                width: `${imageBox.width}px`,
                                                height: `${imageBox.height}px`,
                                                boxShadow: galleryShadowBoxCss(
                                                    Math.min(imageBox.width, imageBox.height),
                                                ),
                                            }
                                            : undefined
                                    }
                                    onClick={() => openLightbox(slides, currentIndex)}
                                    aria-label="Open image in full viewer"
                                >
                                    <Image
                                        src={slide.src}
                                        alt={slide.alt}
                                        width={w}
                                        height={h}
                                        className={
                                            imageBox
                                                ? 'block h-full w-full object-contain'
                                                : 'block h-auto w-auto max-h-full max-w-full object-contain'
                                        }
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
