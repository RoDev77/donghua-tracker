# Donghua Tracker

Website sederhana untuk mencatat riwayat menonton donghua. Data disimpan di browser melalui `localStorage`.

## Cara pakai
Buka `index.html` di browser, lalu tambah/edit data donghua.

## Field yang tersedia
- Judul
- Hari Update
- Episode Terakhir Nonton
- Lanjut Episode
- Season
- Status (Ongoing / Completed / Hiatus / Libur)
- Nonton Via

Nilai episode disimpan apa adanya sesuai catatan asli (misalnya `26 [END]`, `Lanjut S2`, `164 Tengah`).
Status dan season merujuk ke serial donghuanya; tanda selesai menonton dituliskan dengan `[END]` pada kolom episode.

## Fitur
- Tambah, edit, hapus data
- Pencarian dan filter status/hari
- Statistik ringkas
- Ekspor/impor JSON
- Tombol cepat untuk menandai episode selesai ditonton
