import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { ContactBanner } from "@/components/ContactBanner";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Kemitraan dan Pasokan Bisnis | Indofishmart",
  description: "Informasi kemitraan pasokan ikan dan frozen seafood untuk reseller, toko, restoran, katering, hotel, dan distributor.",
};

export default function PartnershipPage() {
  return (
    <main>
      <PageHero
        eyebrow="GABUNG KEMITRAAN"
        title="Pasokan yang lebih sederhana untuk usaha yang ingin bertumbuh."
        description="Kemitraan disiapkan untuk reseller, toko frozen food, HORECA, katering, serta pelaku distribusi."
      />
      <section className="section">
        <div className="container detail-grid">
          <div className="detail-image"><img src="/images/outlet-bekasi.webp" alt="Mitra dan outlet Indofishmart" /></div>
          <div className="detail-copy">
            <p className="eyebrow">MITRA USAHA</p>
            <h2>Sesuaikan produk, volume, dan jadwal kebutuhan.</h2>
            <p>Setiap usaha memiliki pola pembelian berbeda. Karena itu, pembicaraan dimulai dari kebutuhan produk dan kapasitas yang realistis.</p>
            <ul className="check-list check-list-dark">
              <li><span>✓</span> Reseller dan toko frozen food</li>
              <li><span>✓</span> Restoran, hotel, katering, dan kafe</li>
              <li><span>✓</span> Distributor dan kebutuhan pembelian rutin</li>
              <li><span>✓</span> Permintaan ukuran serta kemasan tertentu</li>
            </ul>
            <Link className="button button-primary" href="/permintaan-khusus">Ajukan Kebutuhan <Arrow /></Link>
          </div>
        </div>
      </section>
      <section className="process-section">
        <div className="container">
          <div className="section-heading"><p className="eyebrow">ALUR KEMITRAAN</p><h2>Tiga langkah untuk memulai.</h2></div>
          <div className="info-card-grid">
            {[
              ["01", "Konsultasi", "Jelaskan profil usaha, wilayah layanan, dan jenis produk yang dicari."],
              ["02", "Penyesuaian", "Cocokkan volume, ketersediaan, kemasan, serta jadwal pasokan."],
              ["03", "Mulai kerja sama", "Konfirmasikan penawaran dan lanjutkan proses pemesanan."],
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
