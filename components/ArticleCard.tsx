import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { ArticleRecord, formatArticleDate } from "@/data/articles";

export function ArticleCard({ article }: { article: ArticleRecord }) {
  return (
    <article className="article-card">
      <Link className="article-image" href={`/artikel/${article.slug}`}>
        <img src={article.image} alt={article.title} />
      </Link>
      <div className="article-content">
        <span>{article.category}</span>
        <small>{formatArticleDate(article.date)}</small>
        <h3><Link href={`/artikel/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
        <Link href={`/artikel/${article.slug}`} aria-label={`Baca ${article.title}`}>
          Baca artikel <Arrow />
        </Link>
      </div>
    </article>
  );
}
