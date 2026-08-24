import Link from "next/link";
import { siteAsset, siteContact } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src={siteAsset("/images/indofishmart-logo-footer.png")} alt="Indofishmart" />
          <p>Pasokan ikan dan seafood untuk kebutuhan rumah hingga bisnis.</p>
        </div>
        <div>
          <h2>Navigasi</h2>
          <Link href="/produk">Produk</Link>
          <Link href="/kemitraan">Kemitraan</Link>
          <Link href="/artikel">Artikel</Link>
        </div>
        <div>
          <h2>Informasi</h2>
          <Link href="/outlet">Outlet Bekasi</Link>
          <Link href="/permintaan-khusus">Permintaan khusus</Link>
          <Link href="/tentang-kami">Tentang Kami</Link>
        </div>
        <div>
          <h2>Kontak</h2>
          <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>
          <a href={siteContact.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <p>{siteContact.location}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Indofishmart. Semua hak dilindungi.</span>
        <a href="#top">Kembali ke atas ↑</a>
      </div>
    </footer>
  );
}
