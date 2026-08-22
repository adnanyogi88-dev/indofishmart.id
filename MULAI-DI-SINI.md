# MULAI DI SINI

Paket ini sudah dibuat tanpa folder pembungkus tambahan. Setelah ZIP diekstrak, buka langsung folder hasil ekstrak di VS Code.

## Menjalankan website

Buka Terminal PowerShell di VS Code, kemudian jalankan:

```powershell
npm install
npm run dev
```

## Lokasi isi website

- Halaman utama: `app/page.tsx`
- Halaman produk: `app/produk/page.tsx`
- Halaman artikel: `app/artikel/page.tsx`
- Template halaman detail artikel: `app/artikel/[slug]/page.tsx`
- Halaman kemitraan: `app/kemitraan/page.tsx`
- Halaman outlet: `app/outlet/page.tsx`
- Halaman kontak: `app/kontak/page.tsx`
- Halaman permintaan khusus: `app/permintaan-khusus/page.tsx`
- Halaman tentang kami: `app/tentang-kami/page.tsx`
- Artikel terpisah yang mudah dibaca: `ARTIKEL_MD/`
- Data artikel yang digunakan website: `content/articles.json`
- Laporan hasil rekonstruksi 447 artikel: `LAPORAN-PEMULIHAN.md`
- Gambar: `public/images/` dan `public/articles/`

Lihat `DAFTAR-HALAMAN.md` dan `DAFTAR-ARTIKEL.md` untuk daftar lengkap.
