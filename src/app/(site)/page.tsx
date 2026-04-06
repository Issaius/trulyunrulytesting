import HomePageClient from "@/components/HomePageClient";
import { getHomeSliderSlides } from "@/lib/sanity-queries";

export default async function Home() {
  const slides = await getHomeSliderSlides();

  return <HomePageClient slides={slides} />;
}
