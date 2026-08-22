import type { Metadata } from "next";
import { ArticleDirectory } from "@/components/ArticleDirectory";
import { PageHero } from "@/components/PageHero";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Artikel Indofishmart | Resep, Frozen Food, dan Peluang Bisnis",
  description: "Kumpulan 733 artikel Indofishmart yang dipulihkan dari publikasi asli, mencakup resep ikan, frozen food, seafood, dan peluang bisnis.",
};

export default function ArticleIndexPage() {
  return (
    <main>
      <PageHero
        eyebrow="PUSAT INFORMASI"
        title={`${articles.length} artikel Indofishmart berhasil dipulihkan.`}
        description="Temukan kembali materi resep, panduan produk, informasi frozen food, serta peluang bisnis dari arsip situs lama."
      />
      <section className="section article-index-section">
        <div className="container">
          <ArticleDirectory records={articles} />
        </div>
      </section>
    </main>
  );
}
