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
            <h2 className="mb-1" style={{ padding: 0 }}>
                {getFileName(current.src)}
            </h2>

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

            {/* Image container */}
            <div className="relative w-full max-w-[500px] aspect-[2/3] bg-zinc-900">
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

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition-colors z-10 backdrop-blur-md cursor-pointer"
                    aria-label="Previous Slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition-colors z-10 backdrop-blur-md cursor-pointer"
                    aria-label="Next Slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
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
