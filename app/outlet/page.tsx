import type { Metadata } from "next";
import { Arrow } from "@/components/Arrow";
import { PageHero } from "@/components/PageHero";
import { siteContact } from "@/data/site";

export const metadata: Metadata = {
  title: "Outlet Indofishmart Bekasi",
  description: "Informasi outlet Indofishmart di Bekasi untuk melihat produk dan berkonsultasi mengenai kebutuhan ikan serta seafood.",
};

export default function OutletPage() {
  return (
    <main>
      <PageHero
        eyebrow="OUTLET INDOFISHMART"
        title="Kunjungi outlet dan lihat pilihan produk secara langsung."
        description="Hubungi tim terlebih dahulu untuk memastikan alamat lengkap, jam operasional, serta ketersediaan produk."
      />
      <section className="section">
        <div className="container detail-grid">
          <div className="detail-image"><img src="/images/outlet-bekasi.webp" alt="Outlet Indofishmart Bekasi" /></div>
          <div className="detail-copy">
            <p className="eyebrow">BEKASI, JAWA BARAT</p>
            <h2>Indofishmart Bekasi</h2>
            <p>Outlet menjadi titik konsultasi untuk pembelian retail, kebutuhan usaha, dan informasi ketersediaan produk.</p>
            <div className="contact-option-list">
              <div><span>Wilayah</span><strong>{siteContact.location}</strong></div>
              <div><span>Email</span><strong>{siteContact.email}</strong></div>
              <div><span>Status alamat</span><strong>Konfirmasi melalui tim Indofishmart</strong></div>
            </div>
            <div className="stack-actions">
              <a className="button button-primary" href={siteContact.whatsapp} target="_blank" rel="noopener noreferrer">Tanya via WhatsApp <Arrow /></a>
              <a className="text-link" href={`mailto:${siteContact.email}`}>Kirim email <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
