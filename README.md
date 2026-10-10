# Dicoding Jobs Technical Exercise

Aplikasi lowongan sederhana untuk membuat, mencari berdasarkan judul, melihat detail, dan mengelola lowongan lewat Dashboard. Solusi ini memakai Laravel 12 untuk REST API, Next.js 16 untuk antarmuka, TanStack Query untuk pengambilan data, dan database SQL. SQLite dipakai sebagai pilihan awal agar penilai dapat menjalankan proyek tanpa memasang server database; MySQL juga didukung oleh konfigurasi Laravel.

## Prasyarat

- PHP 8.2 atau lebih baru, Composer, serta ekstensi PHP SQLite (atau MySQL jika memilih MySQL).
- Node.js 20.9 atau lebih baru dan npm.
- Dua terminal untuk menjalankan backend dan frontend.

## Menjalankan aplikasi

1. Siapkan backend dari direktori `backend`:

   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan serve --host=127.0.0.1 --port=8000
   ```

   Di Command Prompt Windows, gunakan `copy .env.example .env` sebagai pengganti `cp .env.example .env`.

   Saat migrasi pertama, Laravel dapat menawarkan untuk membuat berkas SQLite. Setujui tawaran itu. Jika lingkungan tidak interaktif, buat berkas kosong `backend/database/database.sqlite` sebelum `php artisan migrate`.

2. Siapkan frontend pada terminal lain dari direktori `frontend`:

   ```bash
   npm ci
   npm run dev -- --hostname 127.0.0.1 --port 3000
   ```

3. Buka `http://127.0.0.1:3000`. Header menyediakan **Lowongan Kerja** untuk pencarian dan detail, serta **Dashboard** di `/dashboard` untuk membuat, mengedit, dan menghapus lowongan. Formulir pembuatan ada di `/buat-lowongan`.

Frontend meneruskan permintaan `/api/*` ke `http://127.0.0.1:8000`. Jika backend memakai alamat lain, set `LARAVEL_API_URL` saat menjalankan Next.js, misalnya `LARAVEL_API_URL=http://127.0.0.1:8080 npm run dev`.

### MySQL (opsional)

Buat database kosong, lalu ubah bagian database di `backend/.env` menjadi `DB_CONNECTION=mysql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` sesuai server lokal. Jalankan `php artisan migrate` setelahnya. Tes otomatis tetap memakai SQLite agar terisolasi.

## API

| Metode | Endpoint | Fungsi |
| --- | --- | --- |
| `GET` | `/api/vacancies` | Daftar lowongan aktif, terbaru lebih dahulu. `?q=judul` mencari sebagian judul tanpa membedakan kapital. |
| `POST` | `/api/vacancies` | Membuat lowongan (`201`); masukan tidak valid mengembalikan `422` dan `errors` per bidang. |
| `GET` | `/api/vacancies/{id}` | Detail lowongan; ID tidak ada menghasilkan `404`. |
| `GET` | `/api/dashboard/vacancies` | Semua lowongan untuk Dashboard, termasuk yang sudah kedaluwarsa. |
| `PUT` | `/api/vacancies/{id}` | Memperbarui lowongan dengan validasi yang sama seperti pembuatan. |
| `DELETE` | `/api/vacancies/{id}` | Menghapus lowongan (`204`). |

Respons sukses selain penghapusan memakai kunci `data`. Formulir memakai pilihan pekerjaan dan pengalaman yang sama dengan validasi backend, disimpan di `frontend/src/lib/vacancy-options.json`. Profil perusahaan demo ialah Dicoding Indonesia. Aplikasi latihan ini belum memakai autentikasi; Dashboard menampilkan semua lowongan dan endpoint edit/hapus tidak membatasi pemilik. Jangan gunakan apa adanya untuk data publik sungguhan.

## Menjalankan tes

Backend, dari direktori `backend`:

```bash
php artisan test
```

Perintah itu menjalankan tes unit validasi dan tes integrasi HTTP API dengan SQLite dalam memori. Frontend, dari direktori `frontend`:

```bash
npm ci
npx playwright install chromium
npm run test:e2e
npm run lint
npm run build
```

Playwright menyalakan Laravel dan Next.js sendiri. Sebelum tes, ia membuat `backend/database/playwright.sqlite` lalu menjalankan migrasi. Tes alur nyata mencakup pembuatan, pencarian, detail, Dashboard, edit, dan hapus melalui Laravel; tes browser lain memakai respons API tetap untuk memeriksa keadaan UI secara konsisten. Berkas database tes diabaikan Git. Hentikan server lokal di port 8000 dan 3000 sebelum menjalankan Playwright.

## Catatan desain

Antarmuka mengikuti referensi Dicoding Jobs pada brief: navigasi putih, hero gelap, kartu lowongan, halaman detail, formulir, Dashboard, dan footer. Logo serta foto hero diambil dari situs resmi Dicoding Jobs dan Dicoding. Input deskripsi memakai Editor.js dengan paragraf, judul, daftar, serta format tebal/miring. Hasil blok Editor.js diubah menjadi HTML terbatas sebelum dikirim ke API agar deskripsi lama tetap bisa diedit dan halaman detail tetap kompatibel; API membatasi tag HTML yang tersimpan. Daftar publik hanya menampilkan lowongan yang tanggal aktifnya belum lewat.
