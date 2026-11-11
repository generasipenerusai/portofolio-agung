import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    '/**': ['./data/**/*', './src/data/**/*'],
  },
};

export default nextConfig;
