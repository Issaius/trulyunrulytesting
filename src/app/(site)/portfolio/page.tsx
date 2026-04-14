import PortfolioPageClient from '@/components/PortfolioPageClient';
import { getPortfolioPage } from '@/lib/sanity-queries';

export default async function Portfolio() {
  const { intro, images } = await getPortfolioPage();
  return <PortfolioPageClient intro={intro} images={images} />;
}
