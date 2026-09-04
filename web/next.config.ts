import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "tile.openstreetmap.org",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/login",
        destination: "/sign-in",
        permanent: true,
      },
      {
        source: "/admin/login/:path*",
        destination: "/sign-in/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
