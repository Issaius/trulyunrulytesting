import Image from "next/image";
import Navigation from "@/components/Navigation";
import CursorFollower from "@/components/CursorFollower";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";

/** Drop your PNG at public/corner-accent.png (served as /corner-accent.png). */
const CORNER_IMAGE = "/corner-accent.png";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LightboxProvider>
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-2 top-2 z-10 flex justify-between"
          aria-hidden
        >
          <Image
            src={CORNER_IMAGE}
            alt=""
            width={400}
            height={400}
            className="h-auto w-[min(42vw,320px)] select-none"
            priority
          />
          <Image
            src={CORNER_IMAGE}
            alt=""
            width={400}
            height={400}
            className="h-auto w-[min(42vw,320px)] -scale-x-100 select-none"
            priority
          />
        </div>
        <CursorFollower />
        <Navigation />
        {children}
      </div>
    </LightboxProvider>
  );
}
