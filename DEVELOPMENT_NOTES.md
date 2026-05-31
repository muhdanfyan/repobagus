# RepoBagus - Catatan Pengembangan (Development Log)

Dokumen ini berisi progres, struktur, dan catatan penting selama proses pengembangan aplikasi **RepoBagus** yang merupakan kloningan fitur dari `repodir.com`.

## Tujuan Proyek
Mengumpulkan dan mendokumentasikan semua repository bagus di GitHub yang pernah dilihat atau ditemukan secara kurasi, tetapi tetap menampilkan metrik yang selalu *up-to-date* (seperti jumlah bintang, jumlah *fork*, dan deskripsi) langsung dari API GitHub.

## Progres Implementasi
- [x] Inisialisasi proyek dengan Vite + React.js
- [x] Konfigurasi *routing* halaman menggunakan `react-router-dom`.
- [x] **Desain & UI**: Membuat *design system* menggunakan Vanilla CSS dengan gaya *glassmorphism* (elemen transparan dan blur) dan tema gelap (*dark mode*) yang modern dan premium.
- [x] **Arsitektur Data Kurasi**: Membuat file lokal `src/data/repos.json` sebagai tempat penyimpanan daftar repository kurasi.
- [x] **Integrasi API**: Menghubungkan *frontend* dengan GitHub API (`https://api.github.com/repos/{owner}/{repo}`) untuk melakukan *fetch* data secara *live* saat aplikasi dimuat.
- [x] **Komponen Utama**: 
  - `Sidebar.jsx`: Navigasi kategori (Trending, React, Vue, Python, AI, Tools).
  - `Header.jsx`: Navigasi pencarian dan antarmuka *submit*.
  - `RepoList.jsx` & `RepoCard.jsx`: Menampilkan daftar repository yang sudah dikurasi berdasarkan kategori, lengkap dengan indikator *loading* dan *error state*.

## Struktur Data Kurasi
Jika Anda ingin menambahkan repository bagus lainnya yang baru saja ditemukan, Anda hanya perlu mengedit file `src/data/repos.json`. 

Contoh struktur datanya:
```json
[
  {
    "fullName": "facebook/react",
    "category": "react"
  },
  {
    "fullName": "nama-user/nama-repo",
    "category": "ai"
  }
]
```
Aplikasi akan secara otomatis memuat data detail terbaru dari GitHub berdasarkan `fullName` tersebut.

## Cara Menjalankan Aplikasi
1. Buka terminal dan pastikan Anda berada di direktori ini (`/Users/pondokit/Herd/repobagus`).
2. Instal dependensi terlebih dahulu jika belum:
   ```bash
   npm install
   ```
3. Jalankan server *development*:
   ```bash
   npm run dev
   ```
4. Buka URL yang muncul di terminal (biasanya `http://localhost:5173`) pada browser Anda.
