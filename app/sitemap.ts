import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://indofishmart.id";
  const staticRoutes = [
    "",
    "/artikel",
    "/produk",
    "/kemitraan",
    "/outlet",
    "/kontak",
    "/permintaan-khusus",
    "/tentang-kami",
    "/privacy-policy-indofishmart-id",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route || "/"}`,
      lastModified: new Date("2026-08-23T00:00:00+07:00"),
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/${article.slug}/`,
      lastModified: article.date ? new Date(article.date) : new Date("2026-08-23T00:00:00+07:00"),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
