import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint warnings during build
  },
  /* config options here */
};

export default nextConfig;
