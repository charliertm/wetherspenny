import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "wetherspenny",
    short_name: "wetherspenny",
    description: "The best value drinks at any Wetherspoon pub",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f9",
    theme_color: "#009245",
    icons: [
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
