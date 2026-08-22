import { loadGeneratedArticleBody } from "@/data/article-content.generated";
import { generatedArticleMetadata } from "@/data/article-metadata.generated";

export type ArticleRecord = {
  slug: string;
  title: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
  image: string;
  bodyShard: number;
};

export const articles = generatedArticleMetadata as ArticleRecord[];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export async function getArticleContent(article: ArticleRecord) {
  return loadGeneratedArticleBody(article.bodyShard, article.slug);
}

export function formatArticleDate(date: string) {
  if (!date) return "Tanggal tidak tersedia";
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00Z`)
    : new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
}
