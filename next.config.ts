import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.0.38"],
  // @asclepius/ui ships TypeScript source; Next compiles it with the app.
  transpilePackages: ["@asclepius/ui"],
  turbopack: {
    // @asclepius/ui is a sibling folder linked into node_modules; Turbopack
    // only reads files under its root, so the root is the workspace.
    root: path.join(__dirname, ".."),
  },
  images: {
    // Item images and lab reports live in the B2 bucket behind B2_PUBLIC_URL.
    remotePatterns: [
      { protocol: "https", hostname: "f005.backblazeb2.com", pathname: "/file/**" },
    ],
  },
};

export default nextConfig;
