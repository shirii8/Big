import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ["@/lib/auth"],

  async rewrites() {
    return [
      // Your proxy rules go here
    ];
  },
};

export default nextConfig;