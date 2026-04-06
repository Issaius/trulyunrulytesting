import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from './sanity'

const imageBuilder =
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset })
    : null

export const urlFor = (source: SanityImageSource) => {
    if (!imageBuilder) {
        throw new Error('Sanity image URL builder: set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET')
    }
    return imageBuilder.image(source)
}
