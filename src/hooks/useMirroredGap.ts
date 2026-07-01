'use client';

import { useLayoutEffect, type RefObject } from 'react';

export function useMirroredGap(
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
