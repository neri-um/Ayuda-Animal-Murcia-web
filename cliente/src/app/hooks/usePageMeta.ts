import { useEffect } from 'react';

export const SITE_URL = 'https://www.ayudaanimalmurcia.org';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

export function usePageMeta(opts?: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}) {
  const { title, description, image, path, type = 'website', noindex } = opts ?? {};

  useEffect(() => {
    if (title) document.title = title;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', image ?? DEFAULT_IMAGE);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('link[rel="canonical"]', 'rel', 'canonical', `${SITE_URL}${path ?? '/'}`, 'link');
    if (path) upsertMeta('meta[property="og:url"]', 'property', 'og:url', `${SITE_URL}${path}`);
    if (noindex) upsertMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
  }, [title, description, image, path, type, noindex]);
}

function upsertMeta(
  selector: string,
  attr: 'name' | 'property' | 'rel',
  attrValue: string,
  content?: string,
  tag: 'meta' | 'link' = 'meta',
) {
  if (!content) return;
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
