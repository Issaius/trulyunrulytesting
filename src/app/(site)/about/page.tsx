import AboutImageSlider from "@/components/AboutImageSlider";

const ABOUT_SLIDER_SLIDES = [
  { src: "/nav-placeholder.svg", alt: "Portrait sample one" },
  { src: "/Logo%20white.svg", alt: "Portrait sample two" },
  { src: "/globe.svg", alt: "Portrait sample three" },
];

export default function About() {
  return (
    <main>
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1>
          who I am:
        </h1>

        <div className="mt-8 flex items-center justify-center gap-2 font-body italic text-zinc-400 text-[calc(1.5rem+4px)] max-w-full">
          <span>for:</span>
          <div className="h-[1.5em] min-w-0 overflow-hidden">
            <div className="flex flex-col">
              <span className="h-[1.5em] flex items-center justify-center whitespace-nowrap">artisans</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[min(75vw,1400px)] mx-auto px-6 pb-16">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start md:items-center">
          <div className="w-full md:w-1/2 md:min-w-0">
            <h2 className="text-4xl font-bold mb-6">Rupert Cornelius Lohse</h2>
            <p className="text-zinc-400 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua.
            </p>
            <p className="text-zinc-400">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="w-full md:w-1/2 md:min-w-0">
            <AboutImageSlider slides={ABOUT_SLIDER_SLIDES} />
          </div>
        </div>
      </section>
    </main>
  );
}
