# Konten Indofishmart

Folder ini menyimpan konten artikel yang berhasil dipulihkan dari arsip website lama.

## Struktur data

`articles.json` adalah manifest dataset. Metadata dan isi lengkap 733 artikel dibagi ke dalam file kecil di `article-data/` agar proses build dan pemuatan halaman tetap stabil.

Metadata artikel memiliki kolom:

- `slug` — alamat unik artikel.
- `title` — judul artikel.
- `date` — tanggal publikasi.
- `category` — kategori artikel.
- `author` — nama penulis yang ditampilkan.
- `excerpt` — ringkasan untuk kartu artikel dan metadata.
- `image` — lokasi gambar utama.
- `bodyShard` — nomor file isi artikel.

File `body-*.json` menyimpan `contentHtml` yang sudah dibersihkan dari script, form, dan markup WordPress yang tidak diperlukan.

Gambar artikel yang berhasil dipulihkan berada di `public/articles/`. Jika gambar asli tidak tersedia di arsip, artikel menggunakan gambar yang relevan dari `public/images/`.
