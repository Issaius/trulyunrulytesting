import PortfolioPageClient from '@/components/PortfolioPageClient';

async function getImages() {
  // fetching all documents of type "post" or "image" - adjusting this later when we know the schema
  // for now, just returning empty to prevent errors
  return [];
}

export default async function Portfolio() {
  await getImages();

  return <PortfolioPageClient />;
}
