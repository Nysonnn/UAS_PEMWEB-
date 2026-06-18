# E-Inventory - Sistem Stok Barang

E-Inventory adalah aplikasi manajemen inventaris barang untuk studi kasus UAS Web 2. Aplikasi ini membantu administrator gudang memantau stok, kategori, supplier, data barang, serta riwayat barang masuk dan keluar melalui tampilan web yang sederhana dan siap digunakan.

Tema yang dipilih: **Sistem Manajemen Inventaris Barang (E-Inventory)**.

## Link Demo dan Video

- Demo lokal: `http://127.0.0.1:5500`
- Video presentasi: [YouTube E-Inventory UAS Web 2](https://youtu.be/ROaN5DY0xys?si=L9mfSCXG_rvX3ilV)

## Gambaran Aplikasi

Pengunjung tanpa login hanya dapat melihat halaman beranda berisi informasi umum dan ringkasan inventaris. Administrator wajib login untuk membuka dashboard, mengelola master data, menambah data, mengedit data, menghapus data, dan logout.

## Screenshot Dokumentasi

### Skema Database

Screenshot skema tabel database dari phpMyAdmin.

![Skema database phpMyAdmin](docs/images/database-schema-phpmyadmin.png)

### Proteksi Token API

Screenshot uji coba request tanpa token melalui Postman yang menghasilkan **401 Unauthorized**.

![Postman 401 Unauthorized](docs/images/postman-401-unauthorized.png)

### Halaman Login

![Halaman login admin](docs/images/app-login.png)

### Dashboard Admin

![Dashboard admin](docs/images/app-dashboard.png)

### Form Modal Tambah/Edit Data

![Modal tambah data barang](docs/images/app-modal-barang.png)

### Tabel Data TailwindCSS

![Tabel data barang](docs/images/app-table-barang.png)

### Thumbnail Video

![Thumbnail video presentasi](docs/images/youtube-thumbnail.png)

## Fitur Utama

- Beranda publik berisi ringkasan inventaris.
- Login administrator.
- Dashboard admin dengan ringkasan total barang, kategori, supplier, stok menipis, total stok, dan estimasi nilai persediaan.
- Kelola data barang.
- Kelola kategori.
- Kelola supplier.
- Kelola mutasi stok masuk dan keluar.
- Form tambah dan edit data menggunakan modal.
- Tabel data dengan tampilan TailwindCSS.
- Proteksi akses admin menggunakan login.
- Proteksi manipulasi data API menggunakan Bearer Token.

## Struktur Database

Database menggunakan 6 tabel utama:

- `users`: data akun administrator.
- `categories`: data kategori barang.
- `suppliers`: data supplier.
- `items`: data master barang.
- `stock_movements`: riwayat barang masuk dan keluar.
- `migrations`: pencatatan migration CodeIgniter.

Relasi utama:

- `categories.id` terhubung ke `items.category_id`.
- `suppliers.id` terhubung ke `items.supplier_id`.
- `items.id` terhubung ke `stock_movements.item_id`.

File SQL tersedia di [docs/schema.sql](docs/schema.sql).

## Teknologi

- Backend: CodeIgniter 4 REST API.
- Frontend: VueJS 3 SPA.
- Routing: Vue Router.
- HTTP Client: Axios.
- Tampilan: TailwindCSS.
- Database: MySQL/MariaDB.
- Server lokal: XAMPP.

## Cara Menjalankan Backend

1. Pastikan Apache/MySQL XAMPP aktif, lalu buat database:

```sql
CREATE DATABASE e_inventory;
```

2. Masuk ke folder backend:

```bash
cd backend-api
```

3. Install dependency:

```bash
composer install
```

4. Salin file environment:

```bash
copy .env.example .env
```

5. Jalankan migration dan seeder:

```bash
php spark migrate
php spark db:seed InventorySeeder
```

6. Jalankan server backend:

```bash
php spark serve --host 127.0.0.1 --port 8080
```

Backend berjalan di `http://127.0.0.1:8080`.

## Cara Menjalankan Frontend

1. Buka terminal baru, lalu masuk ke folder frontend:

```bash
cd frontend-spa
```

2. Jalankan server lokal:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

3. Buka aplikasi:

```text
http://127.0.0.1:5500
```

## Akun Demo Administrator

```text
Email    : admin@einventory.test
Password : admin123
```

## Token API

Token digunakan untuk melindungi request tambah, edit, dan hapus data.

```text
Authorization: Bearer uas-web2-e-inventory-token
```

Jika request manipulasi data dikirim tanpa token atau token salah, API akan mengembalikan status **401 Unauthorized**.

## Catatan Presentasi

Panduan narasi presentasi tersedia di [docs/panduan-presentasi.md](docs/panduan-presentasi.md). Pada video presentasi, tampilkan alur dari beranda publik, login admin, dashboard, tabel data, form tambah/edit, relasi database, lalu bukti proteksi token di Postman.
