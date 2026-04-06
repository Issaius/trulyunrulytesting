import type { SanityImageSource } from '@sanity/image-url';
import { groq } from 'next-sanity';

import { urlFor } from './image';
import { client } from './sanity';

/** Props shape for `CoverflowSlider` (server-built from Sanity). */
export type HomeSliderSlide = {
  src: string;
  alt: string;
  /** Optional CMS headline; falls back to filename-style text from `src` in the UI. */
  title?: string;
  text?: string;
};

const HOME_SLIDER_QUERY = groq`
  *[_type == "homeSlider"][0]{
    slides[]{
      image,
      title,
      caption
    }
  }
`;

export async function getHomeSliderSlides(): Promise<HomeSliderSlide[]> {
  if (!client) {
    return [];
  }

  const data = await client.fetch<{
    slides?: Array<{
      image?: SanityImageSource;
      title?: string | null;
      caption?: string | null;
    }> | null;
  }>(HOME_SLIDER_QUERY);

  if (!data?.slides?.length) {
    return [];
  }

  const out: HomeSliderSlide[] = [];

  for (const slide of data.slides) {
    if (!slide?.image) continue;

    const src = urlFor(slide.image).width(2400).quality(90).url();
    const caption = slide.caption?.trim() ?? '';
    const title = slide.title?.trim() || undefined;

    out.push({
      src,
      alt: caption || title || 'Photo',
      title,
      text: '',
    });
  }

  return out;
}
