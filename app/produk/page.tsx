import type { Metadata } from "next";
import Link from "next/link";
import { ContactBanner } from "@/components/ContactBanner";
import { PageHero } from "@/components/PageHero";
import { products } from "@/data/products";
import { siteAsset } from "@/data/site";

export const metadata: Metadata = {
  title: "Produk Ikan dan Frozen Seafood | Indofishmart",
  description: "Pilihan dori fillet, gurame fillet, udang vaname, ikan laut, dan gurame untuk kebutuhan retail maupun bisnis.",
};

export default function ProductsPage() {
  return (
    <main>
      <PageHero
        eyebrow="PRODUK INDOFISHMART"
        title="Pilihan ikan dan seafood untuk beragam skala kebutuhan."
        description="Katalog dasar ini dapat dikembangkan sesuai stok, ukuran, kemasan, dan kebutuhan pengiriman Anda."
      />
      <section className="section">
        <div className="container">
          <div className="product-grid product-page-grid">
            {products.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image">
                  <img src={siteAsset(product.image)} alt={product.name} />
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-content">
                  <div className="product-title-row"><h2>{product.name}</h2><span aria-hidden="true">↗</span></div>
                  <p>{product.description}</p>
                  <div className="product-meta"><span>{product.size}</span><Link href="/permintaan-khusus">Minta penawaran</Link></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="process-section">
        <div className="container">
          <div className="section-heading"><p className="eyebrow">CARA PEMESANAN</p><h2>Mulai dari kebutuhan, lalu kami bantu sesuaikan.</h2></div>
          <div className="info-card-grid">
            {[
              ["01", "Kirim kebutuhan", "Sampaikan jenis produk, jumlah, kemasan, dan lokasi pengiriman."],
              ["02", "Konfirmasi ketersediaan", "Tim memeriksa stok, ukuran produk, dan pilihan pengiriman."],
              ["03", "Terima penawaran", "Dapatkan informasi harga dan langkah pemesanan selanjutnya."],
            ].map(([number, title, copy]) => (
              <article className="info-card" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}
