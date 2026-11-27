# Donghua History

Jurnal pribadi riwayat menonton Donghua. Data di Vercel disimpan per akun Discord (Firestore `users/{discordUserId}/donghua`). File `index.html` yang dibuka langsung (`file://`) memakai `localStorage` sebagai fallback.

## Login Discord
- Client ID: `1575860393132171344`
- Redirect URI: `https://dh.rstudiolab.tech/callback`
- Scope: `identify`

## Environment variables Vercel
- `FIREBASE_SERVICE_ACCOUNT` — JSON service account Firebase Admin SDK
- `DISCORD_CLIENT_SECRET` — client secret aplikasi Discord
- `DISCORD_REDIRECT_URI` — opsional, default `https://dh.rstudiolab.tech/callback`
- `DISCORD_OWNER_ID` — opsional, default `603891834858635274`

Jangan pernah menyimpan kredensial ini di frontend/repo.

## Data
- Dulu publik di collection `donghua`, sekarang dipindah ke `users/603891834858635274/donghua`.
- API `GET/PUT /api/donghua` hanya bekerja kalau sudah login Discord.
- `GET /api/me` → status login, `POST /api/logout` → keluar.

## Seed data awal
```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/ke/service-account.json npm run seed
```

## Fitur
- Field: Judul, Judul Lain (alternatif), Cover/Logo URL, Hari Update, Episode Terakhir Nonton, Lanjut Episode, Season, Status, Nonton Via
- Cover diambil dari Anichin (tersimpan sebagai field `cover`, fallback ke inisial judul kalau gagal dimuat)
- Nilai episode disimpan apa adanya (misalnya `26 [END]`, `Lanjut S2`, `164 Tengah`)
- Status & season merujuk ke serial donghuanya; tanda selesai menonton dituliskan dengan `[END]` pada kolom episode
- Tambah, edit, hapus data
- Tombol 🏁 untuk menandai/batalkan END
- Pencarian, filter status/hari, dan pengurutan (judul, episode, status, hari)
- Tombol 🎲 Pilihkan untuk memilih donghua Ongoing secara acak
- Ringkasan progres: total episode, rata-rata, dan episode tertinggi
- Grafik distribusi status dan filter cepat berjumlah
- Log aktivitas (tambah/edit/hapus/tandai episode/END) yang tersimpan di browser
- Statistik ringkas
- Ekspor/impor JSON
- Bagian "Akhir-akhir Ini Sering Ditonton" (bisa diatur dari form)
- Pilihan tampilan Tabel / Kartu
- Toggle tema gelap/terang
- Tombol kembali ke atas dan favicon khusus
