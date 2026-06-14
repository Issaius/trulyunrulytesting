import PageHeroHeading from "@/components/PageHeroHeading";
import TextSlider from "@/components/TextSlider";

export default function Impressum() {
  return (
    <main>
      <section className="hero-section text-center md:px-6">
        <div className="hero-section-viewport flex min-h-svh flex-col items-center max-md:min-h-[calc(100svh-var(--mobile-hero-padding-top))]">
          <div className="hidden min-h-0 flex-1 md:block" aria-hidden />
          <div className="hero-section-inner flex flex-col items-center">
            <PageHeroHeading>Impressum & AGB</PageHeroHeading>

            <p className="mt-2 text-xl font-body lowercase tracking-wide text-zinc-500">
              (the necessary legalese)
            </p>

            <TextSlider />
          </div>
          <div className="min-h-0 w-full flex-1" aria-hidden />
        </div>
      </section>

      <div className="max-w-4xl mx-auto md:px-6">
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-white">Impressum</h2>
          <div className="text-zinc-400 space-y-2">
            <p>Name of Operator</p>
            <p>Address Line 1</p>
            <p>City, Country</p>
            <p>Email: contact@example.com</p>
          </div>
        </section>

        <section className="page-last-section">
          <h2 className="text-xl font-semibold mb-4 text-white">Allgemeine Geschäftsbedingungen (AGB)</h2>
          <div className="text-zinc-400 space-y-4">
            <p>1. Geltungsbereich</p>
            <p>2. Vertragsschluss</p>
            <p>3. ...</p>
          </div>
        </section>
      </div>
    </main>
  );
}
