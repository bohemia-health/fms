import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.0.38"],
  // @asclepius/ui ships TypeScript source; Next compiles it with the app.
  transpilePackages: ["@asclepius/ui"],
  // Locally @asclepius/ui may be a symlink to the sibling folder, which
  // Turbopack can only read if its root is the workspace. On Vercel the
  // package is a real copy inside node_modules, and widening the root there
  // breaks how server externals (e.g. the S3 client) are resolved.
  ...(process.env.VERCEL ? {} : { turbopack: { root: path.join(__dirname, "..") } }),
  images: {
    // Item images and lab reports live in the B2 bucket behind B2_PUBLIC_URL.
    remotePatterns: [
      { protocol: "https", hostname: "f005.backblazeb2.com", pathname: "/file/**" },
    ],
  },
};

export default nextConfig;
