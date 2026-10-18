import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.0.38"],
  images: {
    // Item images and lab reports live in the B2 bucket behind B2_PUBLIC_URL.
    remotePatterns: [
      { protocol: "https", hostname: "f005.backblazeb2.com", pathname: "/file/**" },
    ],
  },
};

export default nextConfig;
