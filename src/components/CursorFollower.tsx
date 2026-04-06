'use client';

import { useEffect, useRef, useState } from 'react';

/** Put your file here: `public/images/cursor.png` — or change this path. */
export const CURSOR_IMAGE_SRC = '/images/cursor.png';

const SIZE = 48;

/**
 * Hotspot: where on the PNG should sit on the real pointer (clientX, clientY).
 * Measured in px from the image’s top-left to that point.
 *
 * Default (0, 0): top-left of the sprite = pointer. No extra transform, feels
 * tight with the RAF loop. If your needle tip is not in the top-left corner,
 * set these to (tipX, tipY) so that pixel lines up with the pointer.
 */
export const TIP_OFFSET_X = 0;
export const TIP_OFFSET_Y = 0;

/** 1 = no lag (visual tip matches click position). Lower = floatier but can feel “off” when clicking. */
const SMOOTH = 1;

export default function CursorFollower() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const [useCustom, setUseCustom] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  /** New value each full page load so dev reload picks up a replaced PNG (avoids stale cache). */
  const [imgSrc] = useState(
    () =>
      `${CURSOR_IMAGE_SRC}${process.env.NODE_ENV === 'development' ? `?v=${Date.now()}` : ''}`
  );

  useEffect(() => {
    const ok =
      !window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Client-only gate after mount; sync setState is intentional here
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fine-grained ESLint: client-only cursor enable
    setUseCustom(ok);
  }, []);

  useEffect(() => {
    if (!useCustom) return;

    document.documentElement.classList.add('cursor-custom');

    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * SMOOTH;
      pos.current.y += (target.current.y - pos.current.y) * SMOOTH;
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('cursor-custom');
    };
  }, [useCustom]);

  if (useCustom === null || !useCustom) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      <div
        className="transition-opacity duration-150"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translate(${-TIP_OFFSET_X}px, ${-TIP_OFFSET_Y}px)`,
        }}
      >
        {/* Plain <img>: avoids next/image cache; hotspot = tip, not image centre */}
        {/* eslint-disable-next-line @next/next/no-img-element -- intentional: uncached cursor asset */}
        <img
          src={imgSrc}
          alt=""
          width={SIZE}
          height={SIZE}
          draggable={false}
          className="select-none block"
          style={{ width: SIZE, height: SIZE }}
        />
      </div>
    </div>
  );
}
