import type { MetadataRoute } from "next";
import { SITE_URL } from "./sitemap";

// Everything public is crawlable except the bag and orders, which are
// per-visitor; /search is thin and endless, so it is left out too.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/bag", "/orders", "/search"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
