# Form Pengumpulan UAS Pemrograman Web 2

## Identitas Mahasiswa

Nama: Moahamd Sony Hidayatullah  
Kelas: I243B  
Program Studi: Teknik Informatika  
Mata Kuliah: Pemrograman Web 2  

## Link Pengumpulan

Video Presentasi: https://youtu.be/ROaN5DY0xys?si=L9mfSCXG_rvX3ilV  
Repository GitHub: https://github.com/Nysonnn/UAS_PEMWEB-.git  

## Judul Proyek

E-Inventory - Sistem Manajemen Inventaris Barang

## Rangkuman Singkat

Proyek ini merupakan aplikasi E-Inventory berbasis web yang dibuat untuk memenuhi UAS mata kuliah Pemrograman Web 2. Aplikasi digunakan untuk membantu proses pencatatan dan pemantauan stok barang, kategori, supplier, serta riwayat barang masuk dan keluar.

Sistem memiliki dua jenis akses. Pengunjung tanpa login hanya dapat melihat halaman beranda yang berisi informasi umum dan ringkasan inventaris. Administrator wajib login untuk mengakses dashboard utama, mengelola data barang, kategori, supplier, mutasi stok, serta melakukan logout.

Backend dibangun menggunakan CodeIgniter 4 sebagai REST API, sedangkan frontend menggunakan VueJS 3, Vue Router, Axios, dan TailwindCSS. Endpoint manipulasi data dilindungi dengan Bearer Token, sehingga request tanpa token akan menghasilkan status 401 Unauthorized.

## Poin Utama yang Ditampilkan

1. Halaman beranda publik untuk pengunjung tanpa login.
2. Halaman login administrator.
3. Dashboard admin berisi ringkasan data inventaris.
4. Tabel data barang, kategori, supplier, dan mutasi stok.
5. Form modal untuk menambah dan mengedit data.
6. Skema database di phpMyAdmin.
7. Pengujian proteksi API melalui Postman dengan hasil 401 Unauthorized.
8. Dokumentasi instalasi dan penggunaan pada README GitHub.

## Kesimpulan

Aplikasi E-Inventory ini sudah memenuhi ketentuan utama tugas, yaitu memiliki pemisahan hak akses antara pengunjung dan administrator, menyediakan tampilan frontend yang dapat digunakan, memiliki REST API, menggunakan database relasional, serta menerapkan proteksi token pada endpoint tertentu.

Dengan adanya aplikasi ini, proses pengelolaan inventaris menjadi lebih terstruktur karena data barang, supplier, kategori, dan mutasi stok dapat dikelola melalui satu sistem. Dokumentasi proyek juga sudah dilengkapi dengan screenshot, panduan instalasi, link video presentasi, dan link repository GitHub.

## Lampiran

Dokumentasi lengkap, screenshot aplikasi, screenshot database, dan bukti pengujian Postman tersedia pada file README.md di repository GitHub.
