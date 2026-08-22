import type { Metadata } from "next";
import { Arrow } from "@/components/Arrow";
import { PageHero } from "@/components/PageHero";
import { siteContact } from "@/data/site";

export const metadata: Metadata = {
  title: "Hubungi Indofishmart",
  description: "Hubungi tim Indofishmart untuk konsultasi produk ikan, frozen seafood, outlet, dan peluang kemitraan.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="HUBUNGI KAMI"
        title="Mari diskusikan kebutuhan ikan dan seafood Anda."
        description="Pilih jalur kontak yang paling sesuai atau gunakan formulir permintaan khusus untuk kebutuhan yang lebih rinci."
      />
      <section className="section">
        <div className="container contact-options-grid">
          <article className="contact-option-card">
            <span>01</span><h2>Email</h2><p>Kirim pertanyaan, daftar produk, atau kebutuhan kerja sama.</p>
            <a className="button button-primary" href={`mailto:${siteContact.email}`}>{siteContact.email} <Arrow /></a>
          </article>
          <article className="contact-option-card">
            <span>02</span><h2>WhatsApp</h2><p>Gunakan jalur WhatsApp yang tersimpan dari website Indofishmart lama.</p>
            <a className="button button-primary" href={siteContact.whatsapp} target="_blank" rel="noopener noreferrer">Buka WhatsApp <Arrow /></a>
          </article>
          <article className="contact-option-card">
            <span>03</span><h2>Permintaan khusus</h2><p>Isi detail jenis produk, volume, dan jadwal kebutuhan Anda.</p>
            <a className="button button-primary" href="/permintaan-khusus">Isi Formulir <Arrow /></a>
          </article>
        </div>
      </section>
    </main>
  );
}
