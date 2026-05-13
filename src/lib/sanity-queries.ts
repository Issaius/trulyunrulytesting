import type { SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';
import { groq } from 'next-sanity';

import { urlFor } from './image';
import { client } from './sanity';

/** Props shape for `CoverflowSlider` (server-built from Sanity). */
export type HomeSliderSlide = {
  src: string;
  alt: string;
  /** Optional rich CMS headline; falls back to filename-style text from `src` in the UI. */
  title?: PortableTextBlock[];
  /** Optional rich caption with inline links. */
  caption?: PortableTextBlock[];
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
      caption,
      alt
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
      title?: PortableTextBlock[] | null;
      caption?: PortableTextBlock[] | null;
      alt?: string | null;
    }> | null;
  }>(HOME_SLIDER_QUERY);

  if (!data?.slides?.length) {
    return [];
  }

  const out: HomeSliderSlide[] = [];

  for (const slide of data.slides) {
    if (!slide?.image) continue;

    const src = urlFor(slide.image).width(2400).quality(90).url();
    const title = slide.title?.length ? slide.title : undefined;
    const caption = slide.caption?.length ? slide.caption : undefined;
    const alt = slide.alt?.trim() || 'Photo';
    const dims = slide.image?.asset?.metadata?.dimensions;
    const w = dims?.width;
    const h = dims?.height;

    out.push({
      src,
      alt,
      title,
      ...(caption ? { caption } : {}),
      ...(typeof w === 'number' && typeof h === 'number' && w > 0 && h > 0
        ? { width: w, height: h }
        : {}),
    });
  }

  return out;
}

export type AboutPageData = {
  slides: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
};

const ABOUT_PAGE_QUERY = groq`
  *[_type == "aboutPage"] | order(_updatedAt desc)[0]{
    sliderImages[]{
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
      alt
    }
  }
`;

export async function getAboutPage(): Promise<AboutPageData> {
  if (!client) {
    return { slides: [] };
  }

  const data = await client.fetch<{
    sliderImages?: Array<{
      image?: SanityImageSource & {
        asset?: {
          metadata?: { dimensions?: { width?: number; height?: number } | null } | null;
        } | null;
      };
      alt?: string | null;
    }> | null;
  } | null>(ABOUT_PAGE_QUERY);

  const slides: AboutPageData['slides'] = [];

  for (const row of data?.sliderImages ?? []) {
    if (!row?.image) continue;
    const dims = row.image.asset?.metadata?.dimensions;
    const w = dims?.width;
    const h = dims?.height;
    slides.push({
      src: urlFor(row.image).width(2000).quality(90).url(),
      alt: row.alt?.trim() || 'About photo',
      ...(typeof w === 'number' && typeof h === 'number' && w > 0 && h > 0 ? { width: w, height: h } : {}),
    });
  }

  return {
    slides,
  };
}

export type PortfolioGalleryImage = {
  src: string;
  alt: string;
  /** Optional rich CMS title (same as Home Slider). */
  title?: PortableTextBlock[];
  /** Rich caption content for display (may be empty). */
  caption?: PortableTextBlock[];
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
      caption,
      alt
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
      title?: PortableTextBlock[] | null;
      caption?: PortableTextBlock[] | null;
      alt?: string | null;
    }> | null;
  } | null>(PORTFOLIO_QUERY);

  if (!data?.images?.length) {
    return { intro: data?.intro?.trim() ?? '', images: [] };
  }

  const images: PortfolioGalleryImage[] = [];

  for (const row of data.images) {
    if (!row?.image) continue;
    const src = urlFor(row.image).width(2800).quality(90).url();
    const title = row.title?.length ? row.title : undefined;
    const caption = row.caption?.length ? row.caption : undefined;
    const alt = row.alt?.trim() || 'Portfolio image';
    const dims = row.image?.asset?.metadata?.dimensions;
    const w = dims?.width;
    const h = dims?.height;

    images.push({
      src,
      alt,
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
