# 📋 Tracer Study Alumni – GitHub Pages + Google Apps Script

Sistem tracer study alumni yang berjalan di **GitHub Pages** (frontend gratis) dengan **Google Apps Script** sebagai backend API yang terhubung ke Google Spreadsheet.

---

## 📁 Struktur File

```
tracer-study/
├── index.html      ← Halaman publik (tampil data alumni)
├── admin.html      ← Panel admin (kelola data)
├── config.js       ← ⚠️ WAJIB DIISI: URL API Google Apps Script
├── api.js          ← Komunikasi ke backend (jangan diubah)
├── Code.gs         ← Backend Google Apps Script (upload ke GAS)
└── README.md       ← Panduan ini
```

---

## 🚀 Cara Setup (Ikuti Urutan Ini)

### LANGKAH 1 — Siapkan Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com) → buat spreadsheet baru
2. Buat header di baris 1 (kolom A–L):
   ```
   Nama | NISN | TAHUN LULUS | JURUSAN KETUNAAN | Tempat,Tgl Lahir | Nomr HP/Wa | Alamat Domisili | Rutinitas keseharian | Melanjutkan Studi | Jika melanjutkan studi dimana? | Jika Berwirausaha tuliskan | Foto Tempat Usaha
   ```
3. Catat nama sheet (default: **Sheet1**)

---

### LANGKAH 2 — Deploy Google Apps Script

1. Di Spreadsheet → klik **Extensions → Apps Script**
2. Hapus kode yang ada, **paste seluruh isi `Code.gs`**
3. Ganti di baris awal jika perlu:
   ```javascript
   var SHEET_NAME     = 'Sheet1';   // sesuaikan nama sheet
   var ADMIN_PASSWORD = 'admin123'; // GANTI password Anda!
   ```
4. Klik **💾 Save** (Ctrl+S)
5. Klik **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Klik **Deploy** → **Authorize** (izinkan akses)
7. **Copy URL** yang muncul (bentuknya: `https://script.google.com/macros/s/AKfycb.../exec`)

---

### LANGKAH 3 — Isi config.js

Buka file `config.js`, ganti `API_URL`:

```javascript
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycb.../exec', // ← paste URL dari langkah 2
  APP_NAME: 'Tracer Study Alumni',
  SCHOOL_NAME: 'SMK Negeri 1 Contoh', // ← nama sekolah Anda
};
```

---

### LANGKAH 4 — Upload ke GitHub & Aktifkan GitHub Pages

1. Buat akun [GitHub](https://github.com) jika belum punya
2. Klik **+** → **New repository**
   - Repository name: `tracer-study` (atau nama lain)
   - Visibility: **Public**
   - Klik **Create repository**
3. Upload semua file (`index.html`, `admin.html`, `config.js`, `api.js`):
   - Klik **uploading an existing file**
   - Drag & drop semua file → **Commit changes**
4. Aktifkan GitHub Pages:
   - Masuk ke **Settings** repository
   - Klik **Pages** di menu kiri
   - Source: **Deploy from a branch**
   - Branch: **main** / root → **Save**
5. Tunggu ~1 menit → website aktif di:
   ```
   https://USERNAME.github.io/tracer-study/
   ```

---

## 🔗 URL Akses

| Halaman | URL |
|---------|-----|
| Publik  | `https://USERNAME.github.io/tracer-study/` |
| Admin   | `https://USERNAME.github.io/tracer-study/admin.html` |

---

## ⚙️ Update Data / Kode

Jika ada perubahan pada file:
1. Buka repository GitHub Anda
2. Klik file yang ingin diubah → ✏️ Edit → **Commit changes**
3. Perubahan otomatis live dalam ~30 detik

Jika mengubah `Code.gs` di Apps Script:
1. Klik **Deploy → Manage deployments**
2. Klik ✏️ Edit → Version: **New version** → **Deploy**
3. URL tidak berubah, tapi kode sudah update

---

## 🔒 Keamanan

- Password admin disimpan di `Code.gs` (server-side) — **aman**
- Ganti `ADMIN_PASSWORD` dari default `admin123` sebelum live
- Data hanya bisa diubah jika tahu password → via Admin Panel

---

## ❓ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Data tidak muncul | Pastikan `API_URL` di `config.js` sudah benar |
| "CORS error" di console | Di GAS: pastikan deploy sebagai **Web App** dengan akses **Anyone** |
| Login admin gagal | Cek `ADMIN_PASSWORD` di `Code.gs` sudah sesuai |
| Setelah edit GAS tidak berubah | Buat **New version** saat re-deploy |
| GitHub Pages belum muncul | Tunggu 1–2 menit, cek Settings → Pages |
