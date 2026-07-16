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

  // Normalize extension to .webp for better compression, keeping exact path IDs
  const cleanUrl = url.replace(/\.(png|jpe?g)$/i, ".webp");
  
  const match = cleanUrl.match(/https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.webp/);
  if (!match) {
    return { src: cleanUrl };
  }

  const id = match[1];
  
  // Exclude animated gifs from resizing to prevent breakage
  if (id.endsWith("g")) {
    return { src: url };
  }

  const srcSet = `https://i.imgur.com/${id}m.webp 320w, https://i.imgur.com/${id}l.webp 640w, https://i.imgur.com/${id}h.webp 1024w, https://i.imgur.com/${id}.webp 1200w`;
  const defaultUrl = `https://i.imgur.com/${id}${defaultSuffix}.webp`;

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
