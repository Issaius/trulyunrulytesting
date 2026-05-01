import Link from 'next/link';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

export type SanityRichText = PortableTextBlock[];

const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
    h1: ({ children }) => <>{children}</>,
    h2: ({ children }) => <>{children}</>,
    h3: ({ children }) => <>{children}</>,
    h4: ({ children }) => <>{children}</>,
    h5: ({ children }) => <>{children}</>,
    h6: ({ children }) => <>{children}</>,
    blockquote: ({ children }) => <>{children}</>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '';
      if (!href) return <>{children}</>;
      const isExternal = /^https?:\/\//.test(href);
      return (
        <Link
          href={href}
          className="underline decoration-1 underline-offset-4 hover:text-zinc-200 transition-colors"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer noopener' : undefined}
        >
          {children}
        </Link>
      );
    },
  },
};

function normalizeRichTextInput(value: unknown): SanityRichText {
  return Array.isArray(value) ? (value as SanityRichText) : [];
}

export function richTextToPlainText(value?: SanityRichText | string | null): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  const blocks = normalizeRichTextInput(value);
  if (!blocks.length) return '';

  return blocks
    .map((block) => {
      if (block._type !== 'block' || !Array.isArray(block.children)) return '';
      return block.children
        .map((child) => (typeof child === 'object' && child && 'text' in child ? String(child.text) : ''))
        .join('');
    })
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function renderSanityRichText(value?: SanityRichText | string | null) {
  if (typeof value === 'string') {
    const text = value.trim();
    return text ? <>{text}</> : null;
  }

  const blocks = normalizeRichTextInput(value);
  if (!blocks.length) return null;
  return <PortableText value={blocks} components={richTextComponents} />;
}
