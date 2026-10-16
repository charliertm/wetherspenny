import type { MetadataRoute } from "next";

// Home screen icons are generated from assets/app-icon.svg; the browser tab
// favicon is separate (src/app/favicon.ico and public/favicon)
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "wetherspenny",
    short_name: "wetherspenny",
    description: "The best value drinks at any Wetherspoon pub",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f6f9",
    theme_color: "#f4f6f9",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
