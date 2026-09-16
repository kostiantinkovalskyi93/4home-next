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
      {
        protocol: "https",
        hostname: "vz-3950be91-be9.b-cdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;