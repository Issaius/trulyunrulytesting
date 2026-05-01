import type { PortableTextBlock } from '@portabletext/types';

export type LightboxItem = {
  src: string;
  alt: string;
  title?: PortableTextBlock[];
  caption?: PortableTextBlock[];
  width?: number;
  height?: number;
};
