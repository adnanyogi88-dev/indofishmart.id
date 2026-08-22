# Konten Indofishmart

Folder ini menyimpan konten artikel yang berhasil dipulihkan dari arsip website lama.

## Struktur data

Semua artikel berada dalam `articles.json` dengan kolom:

- `slug` — alamat unik artikel.
- `title` — judul artikel.
- `date` — tanggal publikasi.
- `category` — kategori artikel.
- `author` — nama penulis yang ditampilkan.
- `excerpt` — ringkasan untuk kartu artikel dan metadata.
- `image` — lokasi gambar utama.
- `contentHtml` — isi lengkap artikel yang sudah dibersihkan dari script WordPress lama.

Gambar artikel yang berhasil dipulihkan berada di `public/articles/`. Jika gambar asli tidak tersedia di arsip, artikel menggunakan gambar yang relevan dari `public/images/`.
