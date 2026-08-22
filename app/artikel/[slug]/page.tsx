import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { ContactBanner } from "@/components/ContactBanner";
import { articles, formatArticleDate, getArticle } from "@/data/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Artikel tidak ditemukan | Indofishmart" };
  return {
    title: `${article.title} | Indofishmart`,
    description: article.excerpt,
    alternates: { canonical: `/artikel/${article.slug}` },
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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  return (
    <main>
      <article className="article-page">
        <header className="article-hero">
          <div className="container article-hero-inner">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Beranda</Link><span>/</span><Link href="/artikel">Artikel</Link><span>/</span><span>{article.category}</span>
            </nav>
            <p className="eyebrow eyebrow-light">{article.category}</p>
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span>{formatArticleDate(article.date)}</span>
              <span>Oleh {article.author}</span>
            </div>
          </div>
        </header>

        <div className="container article-reading-layout">
          <div className="article-feature-image">
            <img src={article.image} alt={article.title} />
          </div>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
          <aside className="article-archive-note">
            <strong>Catatan arsip</strong>
            <p>Artikel ini dipulihkan dari website Indofishmart lama dan disusun kembali ke dalam interface baru.</p>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section related-section">
          <div className="container">
            <div className="section-heading section-heading-inline">
              <div><p className="eyebrow">BACA SELANJUTNYA</p><h2>Artikel terkait</h2></div>
              <Link className="text-link" href="/artikel">Semua artikel <span aria-hidden="true">→</span></Link>
            </div>
            <div className="article-grid">
              {related.map((item) => <ArticleCard article={item} key={item.slug} />)}
            </div>
          </div>
        </section>
      )}
      <ContactBanner />
    </main>
  );
}
