import Image from "next/image";
import Link from "next/link";

/** Replace with your logo PNG at public/nav-logo.png (optional). SVG placeholder: /nav-placeholder.svg */
const NAV_GRAPHIC = "/nav-placeholder.svg";

const links = [
  { href: "/", label: "HOME" },
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/about", label: "ABOUT & CONTACT" },
  { href: "/impressum", label: "LEGAL" },
] as const;

export default function Navigation() {
  return (
    <nav
      className="fixed top-0 left-0 z-50 flex w-full justify-center p-6"
      aria-label="Site"
    >
      <div className="group relative inline-flex flex-col items-center">
        <div className="relative h-14 w-[200px] select-none">
          <Image
            src={NAV_GRAPHIC}
            alt=""
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>
        <div
          className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-max min-w-[12rem] -translate-x-1/2 -translate-y-1 pt-4 opacity-0 transition-[opacity,visibility] duration-150 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100"
          role="menu"
          aria-label="Pages"
        >
          {/* Curtain: row height 0fr → 1fr reveals links downward */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:duration-150 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col items-center gap-3 pb-1 text-center text-sm tracking-widest text-white">
                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-white transition-colors hover:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
                    role="menuitem"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
