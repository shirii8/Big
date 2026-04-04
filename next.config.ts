import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    turbo: {
      root: './', // Tells Next.js the root is where THIS config file sits
    },
  },
};

export default nextConfig;