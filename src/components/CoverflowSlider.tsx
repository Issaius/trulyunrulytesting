'use client';

import { useState } from 'react';
import Image from 'next/image';

type Slide = {
    src: string;
    alt: string;
    text: string;
};

interface CoverflowSliderProps {
    slides: Slide[];
}

/** Extract a readable filename from the src path (strip path + extension) */
function getFileName(src: string): string {
    const segments = src.split('/');
    const file = segments[segments.length - 1];
    // Remove extension
    return file.replace(/\.[^/.]+$/, '');
}

export default function CoverflowSlider({ slides }: CoverflowSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const current = slides[currentIndex];

    return (
        <div className="relative w-full flex flex-col items-center px-6">

            {/* Title (file name) */}
            <h3 className="text-2xl lg:text-3xl font-serif mb-1" style={{ padding: 0 }}>
                {getFileName(current.src)}
            </h3>

            {/* Caption (just below the title) */}
            <p
                className="text-zinc-500 mb-4"
                style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '28px',
                }}
            >
                {current.alt}
            </p>

            {/* Wrapper for buttons and image */}
            <div className="flex items-center justify-center w-full max-w-full gap-3 md:gap-6">
                
                {/* Navigation Button (Prev) */}
                <button
                    onClick={prevSlide}
                    className="flex-shrink-0 w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous Slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Image container */}
                <div className="relative w-full max-w-[500px] aspect-[2/3] md:max-w-[min(100%,90vh,1100px)] md:aspect-[3/2] bg-zinc-900 min-w-0">
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
                                className="object-cover"
                                priority={index === currentIndex}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Button (Next) */}
                <button
                    onClick={nextSlide}
                    className="flex-shrink-0 w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next Slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

            </div>



            {/* Slide indicators */}
            <div className="flex gap-2 mt-6">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="w-2 h-2 rounded-full transition-colors cursor-pointer"
                        style={{
                            backgroundColor: index === currentIndex ? '#fff' : '#555',
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

        </div>
    );
}
