export default function Impressum() {
  return (
    <main className="min-h-screen pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Impressum & AGB</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-white">Impressum</h2>
        <div className="text-zinc-400 space-y-2">
          <p>Name of Operator</p>
          <p>Address Line 1</p>
          <p>City, Country</p>
          <p>Email: contact@example.com</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-white">Allgemeine Geschäftsbedingungen (AGB)</h2>
        <div className="text-zinc-400 space-y-4">
          <p>1. Geltungsbereich</p>
          <p>2. Vertragsschluss</p>
          <p>3. ...</p>
        </div>
      </section>
    </main>
  );
}
