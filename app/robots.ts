import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://indofishmart.id/sitemap.xml",
    host: "https://indofishmart.id",
  };
}
