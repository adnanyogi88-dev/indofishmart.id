import type { Metadata } from "next";
import { ContactBanner } from "@/components/ContactBanner";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Tentang Indofishmart",
  description: "Indofishmart melayani kebutuhan ikan dan seafood untuk rumah tangga, reseller, HORECA, katering, dan distributor.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="TENTANG INDOFISHMART"
        title="Menghubungkan produk laut dengan kebutuhan rumah dan usaha."
        description="Interface baru ini menyatukan kembali materi Indofishmart yang sebelumnya tersimpan di website lama."
      />
      <section className="section">
        <div className="container detail-grid">
          <div className="detail-image"><img src="/images/ikan-laut.jpg" alt="Pilihan ikan laut Indofishmart" /></div>
          <div className="detail-copy">
            <p className="eyebrow">FOKUS LAYANAN</p>
            <h2>Produk relevan, pembelian fleksibel, komunikasi sederhana.</h2>
            <p>Indofishmart dikembangkan sebagai pusat informasi produk ikan dan seafood untuk pembeli retail maupun kebutuhan bisnis.</p>
            <p>Konten lama tentang frozen food, resep, komoditas ikan, dan peluang usaha kini tersedia kembali dalam satu proyek yang lebih mudah dikembangkan.</p>
          </div>
        </div>
      </section>
      <section className="process-section">
        <div className="container info-card-grid">
          <article className="info-card"><span>01</span><h3>Retail</h3><p>Pilihan praktis untuk kebutuhan rumah tangga dan menu harian.</p></article>
          <article className="info-card"><span>02</span><h3>HORECA</h3><p>Pasokan untuk restoran, hotel, katering, kafe, dan dapur usaha.</p></article>
          <article className="info-card"><span>03</span><h3>Reseller</h3><p>Informasi produk untuk toko frozen food dan jaringan penjualan.</p></article>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}
