/** Readable label from a URL path (local or Sanity CDN). */
export function getFileNameFromSrc(src: string): string {
  try {
    const path = new URL(src).pathname;
    const file = path.split('/').pop() ?? '';
    return file.replace(/\.[^/.]+$/, '') || 'slide';
  } catch {
    const file = src.split('/').pop()?.split('?')[0] ?? '';
    return file.replace(/\.[^/.]+$/, '') || 'slide';
  }
}
