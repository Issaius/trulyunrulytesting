'use client';

type PointerNavButtonProps = {
  direction: 'left' | 'right';
  onClick: () => void;
  ariaLabel: string;
  className?: string;
};

const POINTER_SRC = {
  left: '/pointer-left.png',
  right: '/pointer-right.png',
} as const;

export default function PointerNavButton({
  direction,
  onClick,
  ariaLabel,
  className = '',
}: PointerNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex size-[48px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 md:size-[80px] ${className}`}
      aria-label={ariaLabel}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- mix-blend-screen; black keyed on page bg */}
      <img
        src={POINTER_SRC[direction]}
        alt=""
        width={80}
        height={80}
        draggable={false}
        className="pointer-events-none size-[48px] select-none object-contain mix-blend-screen opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-40 group-focus-visible:opacity-40 md:size-[80px]"
        aria-hidden
      />
    </button>
  );
}
