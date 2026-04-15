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
  /** Original pixel size from Sanity asset metadata; used to size the slider without cropping. */
  width?: number;
  height?: number;
};

const HOME_SLIDER_QUERY = groq`
  *[_type == "homeSlider"][0]{
    slides[]{
      image{
        ...,
        asset->{
          ...,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      },
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
      image?: SanityImageSource & {
        asset?: {
          metadata?: { dimensions?: { width?: number; height?: number } | null } | null;
        } | null;
      };
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
    const dims = slide.image?.asset?.metadata?.dimensions;
    const w = dims?.width;
    const h = dims?.height;

    out.push({
      src,
      alt: caption || title || 'Photo',
      title,
      text: '',
      ...(typeof w === 'number' && typeof h === 'number' && w > 0 && h > 0
        ? { width: w, height: h }
        : {}),
    });
  }

  return out;
}

export type PortfolioGalleryImage = {
  src: string;
  alt: string;
  /** Optional CMS title (same as Home Slider). */
  title?: string;
  /** CMS caption for alt text (may be empty). */
  caption?: string;
  width?: number;
  height?: number;
};

const PORTFOLIO_QUERY = groq`
  *[_type == "portfolio"] | order(_updatedAt desc)[0]{
    intro,
    images[]{
      image{
        ...,
        asset->{
          ...,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      },
      title,
      caption
    }
  }
`;

export async function getPortfolioPage(): Promise<{
  intro: string;
  images: PortfolioGalleryImage[];
}> {
  if (!client) {
    return { intro: '', images: [] };
  }

  const data = await client.fetch<{
    intro?: string | null;
    images?: Array<{
      image?: SanityImageSource & {
        asset?: {
          metadata?: { dimensions?: { width?: number; height?: number } | null } | null;
        } | null;
      };
      title?: string | null;
      caption?: string | null;
    }> | null;
  } | null>(PORTFOLIO_QUERY);

  if (!data?.images?.length) {
    return { intro: data?.intro?.trim() ?? '', images: [] };
  }

  const images: PortfolioGalleryImage[] = [];

  for (const row of data.images) {
    if (!row?.image) continue;
    const src = urlFor(row.image).width(2000).quality(90).url();
    const caption = row.caption?.trim() ?? '';
    const title = row.title?.trim() || undefined;
    const dims = row.image?.asset?.metadata?.dimensions;
    const w = dims?.width;
    const h = dims?.height;

    images.push({
      src,
      alt: caption || title || 'Portfolio image',
      title,
      ...(caption ? { caption } : {}),
      ...(typeof w === 'number' && typeof h === 'number' && w > 0 && h > 0
        ? { width: w, height: h }
        : {}),
    });
  }

  return {
    intro: data.intro?.trim() ?? '',
    images,
  };
}
