# Donghua Tracker

Pencatat riwayat menonton Donghua. Saat di-deploy di Vercel, data disimpan di **Cloud Firestore** melalui serverless function. Saat file `index.html` dibuka langsung dari komputer (`file://`), data tetap memakai `localStorage` sebagai fallback.

## Deploy
- Project Vercel: `rodiiis-projects/donghua-tracker`
- Environment variable yang dibutuhkan: `FIREBASE_SERVICE_ACCOUNT` (isi JSON service account Firebase Admin SDK). Jangan pernah menyimpan kunci ini di frontend.
- Firestore collection: `donghua`
- `firestore.rules`: menolak akses langsung dari client (data hanya lewat serverless function dengan Admin SDK)

## Seed data awal
```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/ke/service-account.json npm run seed
```

## API
- `GET /api/donghua` — ambil semua data
- `PUT /api/donghua` — timpa seluruh data dengan array yang dikirim

## Fitur
- Field: Judul, Judul Lain (alternatif), Hari Update, Episode Terakhir Nonton, Lanjut Episode, Season, Status, Nonton Via
- Nilai episode disimpan apa adanya (misalnya `26 [END]`, `Lanjut S2`, `164 Tengah`)
- Status & season merujuk ke serial donghuanya; tanda selesai menonton dituliskan dengan `[END]` pada kolom episode
- Tambah, edit, hapus data
- Pencarian dan filter status/hari
- Statistik ringkas
- Ekspor/impor JSON
- Toggle tema gelap/terang
- Pilihan tampilan Tabel / Kartu
- Tampilan kartu responsif di layar kecil
- Tombol kembali ke atas dan favicon khusus
- Tombol cepat untuk menandai episode selesai ditonton
