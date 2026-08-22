"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";

const navigation = [
  ["Beranda", "/"],
  ["Produk", "/produk"],
  ["Kemitraan", "/kemitraan"],
  ["Artikel", "/artikel"],
  ["Outlet", "/outlet"],
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <p>Frozen seafood untuk retail, HORECA, reseller, dan distributor</p>
          <div className="utility-links">
            <Link href="/outlet">Outlet Bekasi</Link>
            <Link href="/permintaan-khusus">Permintaan khusus</Link>
          </div>
        </div>
      </div>

      <div className="container navigation">
        <Link className="brand" href="/" aria-label="Indofishmart beranda">
          <img src="/images/indofishmart-logo.png" alt="Indofishmart" />
        </Link>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link className="button button-primary button-small" href="/kontak">
            Hubungi Kami <Arrow />
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Navigasi seluler">
          {navigation.map(([label, href]) => (
            <Link href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <Link href="/permintaan-khusus" onClick={() => setMenuOpen(false)}>Permintaan Khusus</Link>
          <Link href="/kontak" onClick={() => setMenuOpen(false)}>Hubungi Kami</Link>
        </nav>
      )}
    </header>
  );
}
