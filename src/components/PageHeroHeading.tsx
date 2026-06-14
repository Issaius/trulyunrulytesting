'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { animatePageHeroFadeIn } from '@/lib/page-hero-fade-in';

type PageHeroHeadingProps = {
  children: ReactNode;
  className?: string;
};

export default function PageHeroHeading({ children, className }: PageHeroHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    animatePageHeroFadeIn(headingRef.current);
  });

  return (
    <h1 ref={headingRef} className={className}>
      {children}
    </h1>
  );
}
