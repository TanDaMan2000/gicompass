import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  basePath: "/gastrolens",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
