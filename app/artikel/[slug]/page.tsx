import { permanentRedirect } from "next/navigation";
import { articles } from "@/data/articles";

type ArticleRedirectProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticleRedirect({ params }: ArticleRedirectProps) {
  const { slug } = await params;
  permanentRedirect(`/${slug}/`);
}
