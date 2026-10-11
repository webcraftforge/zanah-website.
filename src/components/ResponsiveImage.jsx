import { useCallback, useState } from "react";
import { imageSrc, imageSrcSet, IMAGE_WIDTHS } from "../utils/image";

/**
 * <img> with srcset/sizes, lazy loading and a soft fade-in once loaded.
 * - priority: use for the one image visible on first paint (hero, product photo).
 * - fade={false}: skip the fade (hero).
 */
export default function ResponsiveImage({
  src,
  alt = "",
  sizes = "100vw",
  widths = IMAGE_WIDTHS,
  ratio = 0.75, // width / height, reserves space so the page never jumps
  priority = false,
  fade = true,
  className = "",
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);

  // Already in the browser cache? Show it straight away.
  const ref = useCallback((node) => {
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  const width = 800;
  const height = Math.round(width / ratio);
  const fallbackWidth = widths[Math.floor(widths.length / 2)];

  const classes = [className, fade && "rimg", fade && loaded && "is-loaded"]
    .filter(Boolean)
    .join(" ");

  return (
    <img
      ref={ref}
      className={classes}
      src={imageSrc(src, fallbackWidth)}
      srcSet={imageSrcSet(src, widths)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      {...rest}
    />
  );
}