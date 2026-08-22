"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { ArticleCard } from "@/components/ArticleCard";
import { ContactBanner } from "@/components/ContactBanner";
import { articles } from "@/data/articles";
import { productCategories, ProductCategory, products } from "@/data/products";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("Semua");
  const visibleProducts = useMemo(
    () =>
      activeCategory === "Semua"
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  return (
    <main>
      <section id="beranda" className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">PASOKAN SEAFOOD TERPERCAYA</p>
            <h1>Produk laut berkualitas, siap untuk rumah dan usaha.</h1>
            <p className="hero-description">
              Indofishmart membantu kebutuhan ikan dan seafood dengan pilihan produk,
              kemasan, dan skala pembelian yang fleksibel.
            </p>
            <div className="hero-actions">
              <Link className="button button-light" href="/produk">
                Lihat Produk <Arrow />
              </Link>
              <Link className="text-link text-link-light" href="/kemitraan">
                Peluang kemitraan <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hero-proof" aria-label="Keunggulan layanan">
              <div><strong>Retail & Grosir</strong><span>Pembelian fleksibel</span></div>
              <div><strong>Cold Chain</strong><span>Produk tetap terjaga</span></div>
              <div><strong>Siap Kirim</strong><span>Jabodetabek</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Pilihan produk Indofishmart">
            <div className="hero-image-main">
              <img src="/images/dori-fillet.webp" alt="Dori fillet Indofishmart" />
            </div>
            <div className="hero-image-secondary">
              <img src="/images/udang-vaname.jpg" alt="Udang vaname" />
            </div>
            <div className="quality-card">
              <span className="quality-mark" aria-hidden="true">✓</span>
              <div><strong>Quality checked</strong><small>Dipilih sebelum dikirim</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="service-strip" aria-label="Layanan utama">
        <div className="container service-grid">
          {[
            ["01", "Produk terpilih", "Pilihan ikan dan seafood untuk beragam kebutuhan."],
            ["02", "Skala fleksibel", "Melayani pembelian rumah tangga hingga bisnis."],
            ["03", "Respon cepat", "Konsultasikan jenis produk dan jumlah kebutuhan."],
            ["04", "Mitra usaha", "Dukungan pasokan untuk reseller dan HORECA."],
          ].map(([number, title, copy]) => (
            <article className="service-item" key={number}>
              <span>{number}</span>
              <div><h2>{title}</h2><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="produk" className="section product-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">PILIHAN PRODUK</p>
              <h2>Produk yang siap mengikuti kebutuhan Anda</h2>
            </div>
            <p>
              Mulai dari fillet praktis hingga ikan utuh dan seafood untuk dapur
              keluarga, restoran, katering, atau kebutuhan distribusi.
            </p>
          </div>

          <div className="filter-row" role="group" aria-label="Filter kategori produk">
            {productCategories.map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "filter-button active" : "filter-button"}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-content">
                  <div className="product-title-row"><h3>{product.name}</h3><span aria-hidden="true">↗</span></div>
                  <p>{product.description}</p>
                  <div className="product-meta"><span>{product.size}</span><Link href="/kontak">Minta harga</Link></div>
                </div>
              </article>
            ))}
          </div>
          <div className="section-end-link">
            <Link className="button button-primary" href="/produk">Lihat Semua Produk <Arrow /></Link>
          </div>
        </div>
      </section>

      <section id="bisnis" className="business-section">
        <div className="container business-grid">
          <div className="business-image">
            <img src="/images/outlet-bekasi.webp" alt="Outlet Indofishmart Bekasi" />
            <div className="business-image-label"><span>Outlet Bekasi</span><strong>Indofishmart</strong></div>
          </div>
          <div className="business-copy">
            <p className="eyebrow eyebrow-light">UNTUK BISNIS</p>
            <h2>Satu mitra pasokan untuk usaha yang ingin bertumbuh.</h2>
            <p>
              Dapatkan pilihan produk yang relevan, jumlah pembelian yang dapat
              disesuaikan, dan komunikasi yang lebih sederhana untuk kebutuhan rutin.
            </p>
            <ul className="check-list">
              <li><span>✓</span> Kebutuhan restoran, katering, dan hotel</li>
              <li><span>✓</span> Reseller dan toko frozen food</li>
              <li><span>✓</span> Konsultasi produk serta ketersediaan</li>
            </ul>
            <Link className="button button-light" href="/kemitraan">Diskusikan Kemitraan <Arrow /></Link>
          </div>
        </div>
      </section>

      <section id="artikel" className="section article-section">
        <div className="container">
          <div className="section-heading section-heading-inline">
            <div>
              <p className="eyebrow">ARSIP ARTIKEL</p>
              <h2>Wawasan untuk konsumen dan pelaku usaha</h2>
            </div>
            <Link className="text-link" href="/artikel">
              Lihat seluruh {articles.length} artikel <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="article-grid">
            {articles.slice(0, 3).map((article) => <ArticleCard article={article} key={article.slug} />)}
          </div>
        </div>
      </section>

      <section id="outlet" className="outlet-section">
        <div className="container outlet-card">
          <div>
            <p className="eyebrow">KUNJUNGI OUTLET</p>
            <h2>Lihat produk dan konsultasikan kebutuhan secara langsung.</h2>
          </div>
          <div className="outlet-details">
            <p><strong>Indofishmart Bekasi</strong></p>
            <p>Hubungi tim kami untuk alamat lengkap, jam operasional, dan ketersediaan produk.</p>
            <Link className="button button-primary" href="/outlet">Informasi Outlet <Arrow /></Link>
          </div>
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}
