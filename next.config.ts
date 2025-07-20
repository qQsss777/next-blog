import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "dist",
  basePath: process.env.NODE_ENV === "production" ? "/next-blog" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/next-blog" : "",
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
