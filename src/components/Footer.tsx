import Image from "next/image";
import Link from "next/link";

/** Drop your PNG at public/corner-accent.png (served as /corner-accent.png). */
const CORNER_IMAGE = "/corner-accent.png";

const wingClass = "h-auto w-[min(42vw,320px)] select-none pointer-events-none";

export default function Footer() {
  return (
    <footer
      className="absolute inset-x-2 bottom-2 z-10 flex items-end justify-between"
      aria-label="Site footer"
    >
      <Image
        src={CORNER_IMAGE}
        alt=""
        width={400}
        height={400}
        className={`${wingClass} -scale-y-100`}
        aria-hidden
      />
      <Link
        href="/impressum"
        className="pointer-events-auto pb-2 text-sm tracking-widest text-white transition-colors hover:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
      >
        LEGAL
      </Link>
      <Image
        src={CORNER_IMAGE}
        alt=""
        width={400}
        height={400}
        className={`${wingClass} -scale-x-100 -scale-y-100`}
        aria-hidden
      />
    </footer>
  );
}
