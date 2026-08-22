"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import type { ArticleRecord } from "@/data/articles";

export function ArticleDirectory({ records }: { records: ArticleRecord[] }) {
  const pageSize = 24;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(pageSize);
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

  const visibleRecords = filtered.slice(0, visibleCount);

  return (
    <>
      <div className="article-directory-tools">
        <label className="search-field">
          <span>Cari artikel</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(pageSize);
            }}
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
              onClick={() => {
                setCategory(item);
                setVisibleCount(pageSize);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        Menampilkan {visibleRecords.length} dari {filtered.length} hasil ({records.length} artikel tersedia).
      </p>
      {filtered.length > 0 ? (
        <>
          <div className="article-grid article-directory-grid">
            {visibleRecords.map((article) => <ArticleCard article={article} key={article.slug} />)}
          </div>
          {visibleCount < filtered.length && (
            <div className="article-load-more">
              <button
                className="button button-primary"
                type="button"
                onClick={() => setVisibleCount((count) => count + pageSize)}
              >
                Muat artikel lainnya
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <h2>Artikel belum ditemukan</h2>
          <p>Coba gunakan kata kunci lain atau pilih kategori “Semua”.</p>
        </div>
      )}
    </>
  );
}
