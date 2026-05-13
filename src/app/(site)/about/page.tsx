import AboutImageSlider from "@/components/AboutImageSlider";
import { getAboutPage } from "@/lib/sanity-queries";

const ABOUT_NAME_FALLBACK = "Rupert C. Lohse";
const ABOUT_BIO_TOP_FALLBACK =
  "Most artists would put to some kind of pesudo-intellectual quote here.";
const ABOUT_BIO_BOTTOM_FALLBACK =
  "I don't know what to tell you, I just enjoy creating photos that go hard.";

export default async function About() {
  const about = await getAboutPage();

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
          <div className="w-full md:basis-[35%] md:shrink-0 md:min-w-0">
            <h2 className="text-4xl font-bold mb-6">{ABOUT_NAME_FALLBACK}</h2>
            <p className="text-zinc-400 mb-4">
              {ABOUT_BIO_TOP_FALLBACK}
            </p>
            <p className="text-zinc-400">
              {ABOUT_BIO_BOTTOM_FALLBACK}
            </p>
          </div>
          <div className="w-full md:basis-[65%] md:shrink-0 md:min-w-0">
            <AboutImageSlider slides={about.slides} />
          </div>
        </div>
      </section>
    </main>
  );
}
