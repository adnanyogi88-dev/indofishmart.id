"use client";

import { FormEvent } from "react";
import { siteContact } from "@/data/site";

export function RequestForm() {
  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Permintaan Produk Khusus — ${form.get("nama")}`);
    const body = encodeURIComponent(
      [
        `Nama: ${form.get("nama")}`,
        `Perusahaan/Usaha: ${form.get("usaha") || "-"}`,
        `Nomor kontak: ${form.get("kontak")}`,
        `Produk: ${form.get("produk")}`,
        `Jumlah kebutuhan: ${form.get("jumlah")}`,
        `Catatan: ${form.get("catatan") || "-"}`,
      ].join("\n"),
    );
    window.location.href = `mailto:${siteContact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="request-form" onSubmit={submitRequest}>
      <div className="form-grid">
        <label>
          <span>Nama lengkap</span>
          <input name="nama" required placeholder="Nama Anda" />
        </label>
        <label>
          <span>Perusahaan atau usaha</span>
          <input name="usaha" placeholder="Opsional" />
        </label>
        <label>
          <span>Nomor WhatsApp</span>
          <input name="kontak" required inputMode="tel" placeholder="08xxxxxxxxxx" />
        </label>
        <label>
          <span>Produk yang dibutuhkan</span>
          <input name="produk" required placeholder="Contoh: Dori fillet" />
        </label>
        <label>
          <span>Jumlah kebutuhan</span>
          <input name="jumlah" required placeholder="Contoh: 50 kg per minggu" />
        </label>
        <label className="form-span-full">
          <span>Catatan tambahan</span>
          <textarea name="catatan" rows={5} placeholder="Ukuran, jenis kemasan, jadwal pengiriman, dan informasi lainnya." />
        </label>
      </div>
      <p className="form-note">Formulir akan membuka aplikasi email Anda dan tidak menyimpan data di website.</p>
      <button className="button button-primary" type="submit">Kirim Permintaan ↗</button>
    </form>
  );
}
