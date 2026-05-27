import type { ReactNode } from 'react';

export default function UnderlineHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="relative inline-block pb-4 pt-0">
      {children}
      <span
        className="pointer-events-none absolute bottom-0 left-[-40px] right-[-40px] h-px bg-zinc-700"
        aria-hidden
      />
    </h3>
  );
}
