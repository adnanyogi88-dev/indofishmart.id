import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { ContactBanner } from "@/components/ContactBanner";
import { ArticleRecord, articles, formatArticleDate } from "@/data/articles";
import { getMeatfishBacklink } from "@/data/meatfish-backlinks";
import { siteAsset, siteHtml, siteUrl } from "@/data/site";

export function ArticleDetail({
  article,
  contentHtml,
}: {
  article: ArticleRecord;
  contentHtml: string;
}) {
  const related = articles
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);
  const meatfishBacklink = getMeatfishBacklink(article);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Organization", name: "Indofishmart" },
    image: `${siteUrl}${article.image}`,
    mainEntityOfPage: `${siteUrl}/${article.slug}/`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
            <img src={siteAsset(article.image)} alt={article.title} />
          </div>
          <div className="article-body">
            <div dangerouslySetInnerHTML={{ __html: siteHtml(contentHtml) }} />
            <p className="article-contextual-backlink">
              <strong>Baca juga:</strong> {meatfishBacklink.context}{" "}
              <a href={meatfishBacklink.href} target="_blank" rel="noopener noreferrer">
                {meatfishBacklink.anchor}
              </a>{" "}
              dan{" "}
              <a href={meatfishBacklink.companionHref} target="_blank" rel="noopener noreferrer">
                {meatfishBacklink.companionAnchor}
              </a>
              .
            </p>
          </div>
          <aside className="article-archive-note">
            <strong>Catatan arsip</strong>
            <p>Artikel ini dipulihkan dari publikasi asli website Indofishmart.</p>
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
