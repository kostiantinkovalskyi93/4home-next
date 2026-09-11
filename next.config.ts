import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fvqpjnmqlhhbmgvjympf.supabase.co",
        pathname:
          "/storage/v1/object/public/portfolio-public/**",
      },
      {
        protocol: "https",
        hostname: "fvqpjnmqlhhbmgvjympf.supabase.co",
        pathname:
          "/storage/v1/object/public/portfolio-video-posters/**",
      },
    ],
  },
};

export default nextConfig;