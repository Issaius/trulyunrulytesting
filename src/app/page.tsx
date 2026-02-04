'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function Home() {
  const container = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    gsap.from(textRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
      delay: 0.5
    });
  }, { scope: container });

  return (
    <main ref={container} className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <h1 ref={textRef} className="text-6xl font-bold tracking-tighter">
        Truly Unruly.
      </h1>
      <p className="mt-4 text-zinc-400">Photography Portfolio</p>
    </main>
  );
}
