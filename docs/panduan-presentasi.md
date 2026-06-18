# Panduan Presentasi E-Inventory

## Alur Lead Presentasi

1. Buka dengan konteks masalah.
   "Saya memilih tema E-Inventory karena banyak organisasi perlu mencatat barang, kategori, supplier, dan perubahan stok secara rapi. Masalah yang ingin diselesaikan adalah stok sulit dipantau jika pencatatan masih manual."

2. Jelaskan arsitektur.
   "Project ini memakai decoupled architecture. Backend CodeIgniter 4 hanya bertugas sebagai RESTful API server, sedangkan frontend VueJS 3 berdiri terpisah sebagai SPA. Komunikasi dilakukan lewat Axios dan data dikirim dalam format JSON."

3. Jelaskan database.
   "Database memiliki lima tabel: users untuk admin, categories untuk kategori barang, suppliers untuk pemasok, items untuk master barang, dan stock_movements untuk histori barang masuk/keluar. Relasi utamanya adalah items terhubung ke categories dan suppliers, lalu stock_movements terhubung ke items."

4. Demo public page.
   "Pengunjung tanpa login hanya bisa melihat landing page dan ringkasan data. Ini sesuai user matrix bahwa public tidak boleh mengelola data."

5. Demo login.
   "Admin login lewat endpoint POST /api/login. Setelah berhasil, token dan status login disimpan di localStorage. Token ini dipakai oleh Axios interceptor untuk semua request berikutnya."

6. Demo proteksi token.
   "Jika endpoint manipulasi seperti POST /api/items ditembak tanpa Authorization Bearer Token, server mengembalikan 401 Unauthorized. Proteksi ini dibuat menggunakan CodeIgniter Filter."

7. Demo dashboard dan CRUD.
   "Setelah login, admin dapat melihat dashboard, mengelola kategori, supplier, barang, dan histori stok. Form tambah/edit dibuat dalam modal, tabel menggunakan TailwindCSS, dan navigasi menggunakan Vue Router tanpa reload halaman."

8. Demo mutasi stok.
   "Saat admin membuat barang masuk, stok item bertambah. Saat membuat barang keluar, stok item berkurang. Jika stok tidak cukup, API menolak request dengan validasi."

9. Tutup dengan kesimpulan.
   "Jadi aplikasi ini memenuhi requirement UAS: backend CI4 REST API, frontend VueJS SPA, TailwindCSS, Axios, CORS, token security, route guard, interceptor, CRUD, dan database relasional."

## Akun Demo

- Email: admin@einventory.test
- Password: admin123
- Token demo: uas-web2-e-inventory-token

## Bagian yang Perlu Discreenshot untuk README

- Skema relasi tabel database di phpMyAdmin.
- Postman 401 saat POST/PUT/DELETE tanpa Bearer Token.
- Halaman login.
- Dashboard admin.
- Modal tambah/edit data barang.
- Tabel barang, kategori, supplier, atau mutasi stok.

## Contoh Uji Postman 401

Request:

```http
POST http://localhost:8080/api/categories
Content-Type: application/json

{
  "name": "Peralatan Baru",
  "description": "Contoh tanpa token"
}
```

Ekspektasi:

```json
{
  "status": 401,
  "message": "Unauthorized. Bearer token tidak valid atau tidak dikirim."
}
```

## Contoh Uji Postman Berhasil

Tambahkan header:

```http
Authorization: Bearer uas-web2-e-inventory-token
```

Lalu kirim body yang sama. Server akan membuat data baru.
