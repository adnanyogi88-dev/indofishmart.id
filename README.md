# Indofishmart — Website Lengkap

> Buka `MULAI-DI-SINI.md` terlebih dahulu. Paket rekonstruksi ini menampilkan seluruh halaman dan 457 artikel unik secara jelas di root project.

Repo Indofishmart yang dibangun ulang dari arsip situs lama. Paket ini sudah menyatukan UI, interface, halaman utama, katalog produk, kemitraan, outlet, kontak, formulir permintaan khusus, dan 457 artikel unik. Sebanyak 447 artikel dipulihkan dari salinan HTML crawl publik dan sisanya berasal dari ZIP awal.

Proyek menggunakan React, TypeScript, Next.js, dan Vinext agar mudah dikembangkan melalui VS Code.

## Menjalankan di VS Code

1. Pastikan Node.js versi 22.13 atau lebih baru sudah terpasang.
2. Buka folder proyek ini di VS Code.
3. Buka Terminal di VS Code.
4. Jalankan:

```bash
npm install
npm run dev
```

5. Buka alamat lokal yang tampil di Terminal.

## Build produksi

```bash
npm run build
```

## Upload ke GitHub

Buat repo kosong di GitHub, lalu jalankan perintah berikut dari Terminal VS Code:

```bash
git init
git add .
git commit -m "Initial Indofishmart UI"
git branch -M main
git remote add origin https://github.com/USERNAME/indofishmart-ui.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda.

## File utama

- `app/page.tsx` - struktur dan isi halaman utama.
- `app/produk/` - halaman katalog produk.
- `app/kemitraan/` - halaman kemitraan bisnis.
- `app/outlet/` - halaman outlet Bekasi.
- `app/kontak/` - halaman kontak.
- `app/permintaan-khusus/` - formulir kebutuhan produk.
- `app/tentang-kami/` - halaman profil Indofishmart.
- `app/artikel/` - daftar artikel dan halaman baca artikel.
- `components/` - header, footer, kartu artikel, formulir, dan komponen bersama.
- `content/articles.json` - data 457 artikel yang digunakan langsung oleh website.
- `ARTIKEL_MD/` - 447 artikel hasil rekonstruksi dalam file Markdown terpisah.
- `LAPORAN-PEMULIHAN.md` - jumlah URL kandidat, artikel valid, dan data yang gagal dipulihkan.
- `data/products.ts` - data katalog produk.
- `data/site.ts` - email, WhatsApp, dan lokasi.
- `app/globals.css` - seluruh styling responsif.
- `app/layout.tsx` - judul dan metadata situs.
- `public/images/` - logo dan gambar produk dari arsip Indofishmart.
- `public/articles/` - gambar utama artikel yang berhasil dipulihkan.
- `public/og.png` - gambar pratinjau saat tautan situs dibagikan.

## Bagian yang mudah diubah

- Menu navigasi terdapat di `components/SiteHeader.tsx`.
- Warna merek berada di bagian `:root` dalam `app/globals.css`.
- Data produk berada di `data/products.ts`.
- Data artikel berada di `content/articles.json`.
- Data kontak berada di `data/site.ts`.

## Catatan

Alamat email dan tautan WhatsApp berasal dari materi website lama. Periksa kembali `data/site.ts` sebelum situs dipublikasikan.

Sebagian gambar utama artikel tidak tersedia di arsip lama yang rusak. Artikel tersebut memakai gambar produk Indofishmart yang relevan agar semua halaman tetap dapat ditampilkan tanpa tautan gambar yang rusak.
