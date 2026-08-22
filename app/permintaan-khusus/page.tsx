import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { RequestForm } from "@/components/RequestForm";

export const metadata: Metadata = {
  title: "Formulir Permintaan Khusus | Indofishmart",
  description: "Sampaikan kebutuhan khusus produk, ukuran, jumlah, kemasan, dan jadwal pasokan kepada tim Indofishmart.",
};

export default function SpecialRequestPage() {
  return (
    <main>
      <PageHero
        eyebrow="PERMINTAAN KHUSUS"
        title="Sampaikan produk dan skala kebutuhan Anda."
        description="Formulir ini menyiapkan isi email secara otomatis sehingga detail kebutuhan dapat dikirimkan dengan lebih rapi."
      />
      <section className="section request-section">
        <div className="container request-layout">
          <div>
            <p className="eyebrow">INFORMASI YANG DIBUTUHKAN</p>
            <h2>Bantu tim memahami kebutuhan Anda sejak awal.</h2>
            <p>Masukkan jenis produk, jumlah, pola pembelian, serta catatan ukuran atau kemasan. Data tidak disimpan oleh website.</p>
            <ul className="check-list check-list-dark">
              <li><span>✓</span> Jenis ikan atau seafood</li>
              <li><span>✓</span> Jumlah kebutuhan per pembelian</li>
              <li><span>✓</span> Ukuran dan jenis kemasan</li>
              <li><span>✓</span> Wilayah serta jadwal pengiriman</li>
            </ul>
          </div>
          <RequestForm />
        </div>
      </section>
    </main>
  );
}
