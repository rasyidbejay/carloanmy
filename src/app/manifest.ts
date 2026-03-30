import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CarLoan.my",
    short_name: "CarLoan.my",
    description: "Malaysia car loan calculator with ownership, EV, and comparison tools.",
    start_url: "./",
    scope: "./",
    display: "standalone",
    display_override: ["standalone", "browser"],
    background_color: "#f4f7fb",
    theme_color: "#0a84ff",
    categories: ["finance", "utilities", "productivity"],
    icons: [
      {
        src: "icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
    screenshots: [
      {
        src: "icon.svg",
        sizes: "1024x1024",
        type: "image/svg+xml",
      },
    ],
  };
}
