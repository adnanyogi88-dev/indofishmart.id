import { Arrow } from "@/components/Arrow";
import { siteContact } from "@/data/site";

export function ContactBanner() {
  return (
    <section id="kontak" className="contact-section">
      <div className="container contact-card">
        <div>
          <p className="eyebrow eyebrow-light">MULAI DARI SINI</p>
          <h2>Ceritakan kebutuhan produk Anda.</h2>
          <p>Tim Indofishmart siap membantu memilih produk dan skala pembelian yang sesuai.</p>
        </div>
        <a className="button button-light button-large" href={`mailto:${siteContact.email}`}>
          Hubungi Tim Indofishmart <Arrow />
        </a>
      </div>
    </section>
  );
}
