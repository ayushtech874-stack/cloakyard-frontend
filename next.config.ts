import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'cloakyard.in' },
      { protocol: 'http', hostname: 'cloakyard.in' },
    ],
  },
};

export default nextConfig;