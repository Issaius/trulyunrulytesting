export default function About() {
  return (
    <main className="min-h-screen pt-24 px-6 flex flex-col md:flex-row gap-12 items-center justify-center">
      <div className="w-full md:w-1/2 aspect-[3/4] bg-zinc-800 rounded-xl">
        {/* Image placeholder */}
      </div>
      <div className="w-full md:w-1/2 max-w-xl">
        <h1 className="text-4xl font-bold mb-6">About the Unruly</h1>
        <p className="text-zinc-400 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
        <p className="text-zinc-400">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </main>
  );
}
