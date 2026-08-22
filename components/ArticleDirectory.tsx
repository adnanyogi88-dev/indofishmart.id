"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import type { ArticleRecord } from "@/data/articles";

export function ArticleDirectory({ records }: { records: ArticleRecord[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const categories = ["Semua", ...Array.from(new Set(records.map((article) => article.category)))];

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return records.filter((article) => {
      const matchesCategory = category === "Semua" || article.category === category;
      const matchesQuery = !normalizedQuery ||
        `${article.title} ${article.excerpt}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, records]);

  return (
    <>
      <div className="article-directory-tools">
        <label className="search-field">
          <span>Cari artikel</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Contoh: frozen food, udang, bisnis..."
          />
        </label>
        <div className="filter-row article-filter" role="group" aria-label="Filter kategori artikel">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? "filter-button active" : "filter-button"}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="result-count">Menampilkan {filtered.length} dari {records.length} artikel.</p>
      {filtered.length > 0 ? (
        <div className="article-grid article-directory-grid">
          {filtered.map((article) => <ArticleCard article={article} key={article.slug} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Artikel belum ditemukan</h2>
          <p>Coba gunakan kata kunci lain atau pilih kategori “Semua”.</p>
        </div>
      )}
    </>
  );
}
