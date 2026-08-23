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
        eyebrow="FRANCHISE FROZEN FOOD INDOFISHMART"
        title="Bangun bisnis frozen food dan tumbuh bersama Indofishmart."
        description="Temukan peluang usaha, panduan produk, dan strategi bisnis frozen food untuk membantu Anda memulai, menjangkau pelanggan, serta mengembangkan pasar di wilayah Anda."
      />
      <section className="section article-index-section">
        <div className="container">
          <ArticleDirectory records={articles} />
        </div>
      </section>
    </main>
  );
}
