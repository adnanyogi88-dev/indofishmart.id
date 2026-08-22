import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleDetail } from "@/components/ArticleDetail";
import { articles, getArticle, getArticleContent } from "@/data/articles";

type LegacyPageProps = {
  params: Promise<{ slug: string }>;
};

const legacyPageRedirects: Record<string, string> = {
  "about-us-indofishmart-id": "/tentang-kami",
  "contact-indofishmart-id": "/kontak",
  "formulir-permintaan-khusus": "/permintaan-khusus",
  "gabung-kemitraan": "/kemitraan",
  "outlet-indofishmart": "/outlet",
  "produk-kami": "/produk",
  "tentang-indofishmart-id": "/tentang-kami",
  "trend-pasar-ikan-indonesia": "/artikel",
};

export function generateStaticParams() {
  return [
    ...articles.map((article) => ({ slug: article.slug })),
    ...Object.keys(legacyPageRedirects).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: LegacyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Halaman Indofishmart" };
  return {
    title: `${article.title} | Indofishmart`,
    description: article.excerpt,
    alternates: { canonical: `/${article.slug}/` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date || undefined,
      images: [{ url: article.image, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function LegacyArticlePage({ params }: LegacyPageProps) {
  const { slug } = await params;
  const redirectTarget = legacyPageRedirects[slug];
  if (redirectTarget) permanentRedirect(redirectTarget);

  const article = getArticle(slug);
  if (!article) notFound();
  const contentHtml = await getArticleContent(article);
  if (!contentHtml) notFound();

  return <ArticleDetail article={article} contentHtml={contentHtml} />;
}
