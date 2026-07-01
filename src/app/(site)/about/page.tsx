import AboutImageSlider from "@/components/AboutImageSlider";
import AboutPageHero from "@/components/AboutPageHero";
import UnderlineHeading from "@/components/UnderlineHeading";
import { getAboutPage } from "@/lib/sanity-queries";

const ABOUT_INTRO_HEADING = "Rupert Cornelius Lohse";
const ABOUT_INTRO_BODY_TOP =
  "Most artists would put to some kind of pseudo-intellectual quote here.";
const ABOUT_INTRO_BODY_BOTTOM =
  "I don't know what to tell you, I just enjoy creating photos that go hard.";
const ABOUT_SECTION_HEADING_FALLBACK = "My take on AI";
const ABOUT_SECTION_BODY_TOP_FALLBACK =
  "I use AI. Specifically for: Denoising, some beauty retouching and the technical development of this website.";
const ABOUT_SECTION_BODY_BOTTOM_FALLBACK =
  "Outside of that, I am a big fan of actually doing the work myself, so rest assured that the photos I display are truly real images, with post processing practices that any \"old school\" professional photographer also would have used.";
const ABOUT_CONTACT_EMAIL_FALLBACK = "contact@unrulytruly.eu";
const ABOUT_WORK_TYPES_HEADING_FALLBACK = "Work I'd like to do";
const ABOUT_WORK_TYPES_PINTEREST_URL = "https://pin.it/2yR8hZV2H";

export default async function About() {
  const about = await getAboutPage();

  return (
    <main>
      <AboutPageHero
        introHeading={ABOUT_INTRO_HEADING}
        introBodyTop={ABOUT_INTRO_BODY_TOP}
        introBodyBottom={ABOUT_INTRO_BODY_BOTTOM}
      />

      <section className="content-section section-gap-after text-center">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start md:items-center">
          <div className="w-full md:basis-[65%] md:shrink-0 md:min-w-0">
            <AboutImageSlider slides={about.slides} />
          </div>

          <div className="w-full md:basis-[35%] md:shrink-0 md:min-w-0 flex flex-col gap-12 items-center">
            <div>
              <UnderlineHeading>Contact</UnderlineHeading>
              <p className="mt-4 text-zinc-300 max-w-md mx-auto">{ABOUT_CONTACT_EMAIL_FALLBACK}</p>
            </div>

            <div>
              <UnderlineHeading>{ABOUT_WORK_TYPES_HEADING_FALLBACK}</UnderlineHeading>
              <p className="mt-4 text-zinc-300 max-w-md mx-auto">
                Please see{" "}
                <a
                  href={ABOUT_WORK_TYPES_PINTEREST_URL}
                  className="underline decoration-1 underline-offset-4 hover:text-zinc-200 transition-colors"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  here
                </a>{" "}
                for types of work I am interested in shooting as well, but wasn&apos;t able to do yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section page-last-section pt-0 text-center">
        <h2 className="headline">{ABOUT_SECTION_HEADING_FALLBACK}</h2>
        <p className="text-zinc-400 max-w-3xl mx-auto">{ABOUT_SECTION_BODY_TOP_FALLBACK}</p>
        <p className="text-zinc-400 max-w-3xl mx-auto mt-4">
          {ABOUT_SECTION_BODY_BOTTOM_FALLBACK}
        </p>
      </section>
    </main>
  );
}
