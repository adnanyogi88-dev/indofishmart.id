import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { siteUrl } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl;
  const defaultLastModified = new Date("2026-08-23T00:00:00+07:00");
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
      lastModified: defaultLastModified,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...articles.map((article) => {
      const publishedAt = article.date ? new Date(article.date) : defaultLastModified;
      const lastModified = Number.isNaN(publishedAt.getTime())
        ? defaultLastModified
        : publishedAt;
      const imageUrl = article.image
        ? /^https?:\/\//i.test(article.image)
          ? article.image
          : `${baseUrl}/${article.image.replace(/^\/+/, "")}`
        : undefined;

      return {
        url: `${baseUrl}/${article.slug}/`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.6,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      };
    }),
  ];
}
