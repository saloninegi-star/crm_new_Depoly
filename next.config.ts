import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // इससे Static hosting पर 404 CSS paths ठीक होते हैं
  images: {
    unoptimized: true,
  },
};

export default nextConfig;