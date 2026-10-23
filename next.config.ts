import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Let the dev server be opened from other devices on the LAN (e.g. http://192.168.1.107:3000)
  allowedDevOrigins: ["192.168.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
