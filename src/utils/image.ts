/**
 * Utility functions for image optimization, formats (WebP), sizes, and responsive loading.
 */

interface ImageResponsiveProps {
  src: string;
  srcSet?: string;
  sizes?: string;
}

/**
 * Optimizes Imgur URLs by forcing .webp extension and generating high-performance srcSet values.
 * Imgur provides suffix codes to resize images server-side:
 *  - m: Medium Thumbnail (320px)
 *  - l: Large Thumbnail (640px)
 *  - h: Huge Thumbnail (1024px)
 */
export function getImgurResponsiveProps(url: string, defaultSuffix: "m" | "l" | "h" = "l", sizes = "100vw"): ImageResponsiveProps {
  if (!url || !url.includes("i.imgur.com")) {
    return { src: url };
  }

  const match = url.match(/https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.(png|jpe?g|webp|gif)/i);
  if (!match) {
    return { src: url };
  }

  const id = match[1];
  const ext = match[2];
  
  // Exclude animated gifs or already suffixed/long IDs from resizing
  if (ext.toLowerCase() === "gif" || id.endsWith("g") || id.length > 7) {
    return { src: url };
  }

  // Generate responsive sizes utilizing the original extension to preserve crisp quality, transparency and avoid format breakage.
  // This allows mobile devices to load smaller, optimized variants (320px, 640px) instantly while high-res displays get the ultra-sharp version.
  const srcSet = `https://i.imgur.com/${id}m.${ext} 320w, https://i.imgur.com/${id}l.${ext} 640w, https://i.imgur.com/${id}h.${ext} 1024w, https://i.imgur.com/${id}.${ext} 1200w`;
  const defaultUrl = `https://i.imgur.com/${id}${defaultSuffix}.${ext}`;

  return {
    src: defaultUrl,
    srcSet,
    sizes
  };
}

/**
 * Optimizes Unsplash URLs by forcing .webp format and generating responsive width sizes dynamically.
 */
export function getUnsplashResponsiveProps(url: string, baseWidth = 640, sizes = "100vw"): ImageResponsiveProps {
  if (!url || !url.includes("images.unsplash.com")) {
    return { src: url };
  }

  const cleanUrl = url.split("?")[0];
  const srcSet = `${cleanUrl}?auto=format&fit=crop&w=320&q=75&fm=webp 320w, ${cleanUrl}?auto=format&fit=crop&w=640&q=75&fm=webp 640w, ${cleanUrl}?auto=format&fit=crop&w=1024&q=75&fm=webp 1024w`;
  const defaultUrl = `${cleanUrl}?auto=format&fit=crop&w=${baseWidth}&q=80&fm=webp`;

  return {
    src: defaultUrl,
    srcSet,
    sizes
  };
}

/**
 * Helper to get the correct responsive image properties based on host.
 */
export function getOptimizedImageProps(url: string, defaultSize: "m" | "l" | "h" = "l", sizes = "100vw"): ImageResponsiveProps {
  if (!url) return { src: "" };
  if (url.includes("i.imgur.com")) {
    return getImgurResponsiveProps(url, defaultSize, sizes);
  }
  if (url.includes("images.unsplash.com")) {
    const baseWidth = defaultSize === "m" ? 320 : defaultSize === "l" ? 640 : 1024;
    return getUnsplashResponsiveProps(url, baseWidth, sizes);
  }
  return { src: url };
}
