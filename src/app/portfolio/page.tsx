import { client } from "@/lib/sanity";

async function getImages() {
    // fetching all documents of type "post" or "image" - adjusting this later when we know the schema
    // for now, just returning empty to prevent errors
    return [];
}

export default async function Portfolio() {
    const images = await getImages();

    return (
        <main className="min-h-screen pt-24 px-6">
            <h1 className="text-4xl font-bold mb-12">Portfolio</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder for images */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-zinc-900 animate-pulse rounded-lg"></div>
                ))}
            </div>
        </main>
    );
}
