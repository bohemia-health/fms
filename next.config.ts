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
  // The navbar's line links (/mito, /glp, …) are meant to become marketing
  // pages like apple.com/iphone. Until each exists it goes to the line's
  // store page, temporarily (307), so nothing caches the detour. Drop a line
  // here the day its page lands. /angiogenic has no store line yet.
  async redirects() {
    return [
      { source: "/mito", destination: "/shop/mito", permanent: false },
      { source: "/nootropic", destination: "/shop/nootropic", permanent: false },
      { source: "/bioregulator", destination: "/shop/bioregulator", permanent: false },
      { source: "/blends", destination: "/shop/blends", permanent: false },
      { source: "/glp", destination: "/shop/glp1", permanent: false },
    ];
  },
  images: {
    // Next 16 only serves the qualities listed here (default [75]). 70 is
    // what @asclepius/ui's images ask for, 100 the campaign renders.
    qualities: [70, 75, 100],
    // Item images and lab reports live in the B2 bucket behind B2_PUBLIC_URL.
    remotePatterns: [
      { protocol: "https", hostname: "f005.backblazeb2.com", pathname: "/file/**" },
    ],
  },
};

export default nextConfig;
