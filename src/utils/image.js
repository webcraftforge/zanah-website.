/**
 * Responsive image helpers.
 *
 * Two kinds of source are supported:
 *  1. Unsplash URLs (placeholders)      -> width is requested from their CDN.
 *  2. Your own photos, as a base path   -> "/images/products/kurti-1"
 *     (no extension). Run `npm run images` to create kurti-1-400.webp,
 *     kurti-1-800.webp, ... in public/images (see scripts/optimize-images.mjs).
 *
 * Any other string (a normal full file URL) is used as-is.
 */

// Keep in sync with WIDTHS in scripts/optimize-images.mjs
export const IMAGE_WIDTHS = [160, 320, 400, 640, 800, 960, 1000, 1280, 1600, 2000];

export const HERO_WIDTHS = [640, 960, 1280, 1600, 2000];
export const CARD_WIDTHS = [400, 640, 800, 1000];
export const MAIN_WIDTHS = [640, 800, 1000, 1280, 1600];
export const THUMB_WIDTHS = [160, 320];

// "sizes" tell the browser how wide the image is on screen BEFORE it downloads,
// so a phone never downloads a desktop-size photo.
export const HERO_SIZES = "100vw"; // the hero photo grows to full width on scroll
export const CARD_HOME_SIZES = "(max-width: 560px) 90vw, 30vw";
export const CARD_SHOP_SIZES = "(max-width: 960px) 46vw, 30vw";
export const MAIN_SIZES = "(max-width: 800px) 100vw, 48vw";
export const THUMB_SIZES = "(max-width: 560px) 64px, 76px";

const isUnsplash = (src) => src.includes("images.unsplash.com");
const isLocalBase = (src) =>
  src.startsWith("/") && !/\.(jpe?g|png|webp|avif|gif|svg)$/i.test(src);

export function imageSrc(src, width) {
  if (isUnsplash(src)) {
    const url = new URL(src);
    url.searchParams.set("auto", "format"); // WebP/AVIF automatically
    url.searchParams.set("fit", "crop");
    url.searchParams.set("q", "75");
    url.searchParams.set("w", String(width));
    return url.toString();
  }
  if (isLocalBase(src)) return `${src}-${width}.webp`;
  return src;
}

export function imageSrcSet(src, widths = IMAGE_WIDTHS) {
  if (!isUnsplash(src) && !isLocalBase(src)) return undefined;
  return widths.map((w) => `${imageSrc(src, w)} ${w}w`).join(", ");
}

// Warm the browser cache (e.g. on hover) so the next page opens instantly.
const warmed = new Set();
export function prefetchImage(src, sizes, widths) {
  if (typeof Image === "undefined" || !src) return;
  const key = `${src}|${sizes}`;
  if (warmed.has(key)) return;
  warmed.add(key);

  const img = new Image();
  img.sizes = sizes;
  const set = imageSrcSet(src, widths);
  if (set) img.srcset = set;
  img.src = imageSrc(src, widths[Math.floor(widths.length / 2)]);
}