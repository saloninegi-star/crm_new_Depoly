import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;