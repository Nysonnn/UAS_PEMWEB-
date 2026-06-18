from pathlib import Path
import re
import textwrap


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "Pengumpulan_UAS_Web2_Moahamd_Sony_Hidayatullah.pdf"


content = [
    ("title", "FORM PENGUMPULAN UAS"),
    ("subtitle", "Pemrograman Web 2 - E-Inventory"),
    ("heading", "Identitas Mahasiswa"),
    ("text", "Nama            : Moahamd Sony Hidayatullah"),
    ("text", "Kelas           : I243B"),
    ("text", "Program Studi   : Teknik Informatika"),
    ("text", "Mata Kuliah     : Pemrograman Web 2"),
    ("heading", "Link Pengumpulan"),
    ("text", "Video Presentasi: https://youtu.be/ROaN5DY0xys?si=L9mfSCXG_rvX3ilV"),
    ("text", "Repository GitHub: https://github.com/Nysonnn/UAS_PEMWEB-.git"),
    ("heading", "Judul Proyek"),
    ("text", "E-Inventory - Sistem Manajemen Inventaris Barang"),
    ("heading", "Rangkuman Singkat"),
    ("paragraph", "Proyek ini merupakan aplikasi E-Inventory berbasis web yang dibuat untuk memenuhi UAS mata kuliah Pemrograman Web 2. Aplikasi digunakan untuk membantu proses pencatatan dan pemantauan stok barang, kategori, supplier, serta riwayat barang masuk dan keluar."),
    ("paragraph", "Sistem memiliki dua jenis akses. Pengunjung tanpa login hanya dapat melihat halaman beranda yang berisi informasi umum dan ringkasan inventaris. Administrator wajib login untuk mengakses dashboard utama, mengelola data barang, kategori, supplier, mutasi stok, serta melakukan logout."),
    ("paragraph", "Backend dibangun menggunakan CodeIgniter 4 sebagai REST API, sedangkan frontend menggunakan VueJS 3, Vue Router, Axios, dan TailwindCSS. Endpoint manipulasi data dilindungi dengan Bearer Token, sehingga request tanpa token akan menghasilkan status 401 Unauthorized."),
    ("heading", "Poin Utama yang Ditampilkan"),
    ("bullet", "Halaman beranda publik untuk pengunjung tanpa login."),
    ("bullet", "Halaman login administrator."),
    ("bullet", "Dashboard admin berisi ringkasan data inventaris."),
    ("bullet", "Tabel data barang, kategori, supplier, dan mutasi stok."),
    ("bullet", "Form modal untuk menambah dan mengedit data."),
    ("bullet", "Skema database di phpMyAdmin."),
    ("bullet", "Pengujian proteksi API melalui Postman dengan hasil 401 Unauthorized."),
    ("bullet", "Dokumentasi instalasi dan penggunaan pada README GitHub."),
    ("heading", "Kesimpulan"),
    ("paragraph", "Aplikasi E-Inventory ini sudah memenuhi ketentuan utama tugas, yaitu memiliki pemisahan hak akses antara pengunjung dan administrator, menyediakan tampilan frontend yang dapat digunakan, memiliki REST API, menggunakan database relasional, serta menerapkan proteksi token pada endpoint tertentu."),
    ("paragraph", "Dengan adanya aplikasi ini, proses pengelolaan inventaris menjadi lebih terstruktur karena data barang, supplier, kategori, dan mutasi stok dapat dikelola melalui satu sistem. Dokumentasi proyek juga sudah dilengkapi dengan screenshot, panduan instalasi, link video presentasi, dan link repository GitHub."),
    ("heading", "Lampiran"),
    ("paragraph", "Dokumentasi lengkap, screenshot aplikasi, screenshot database, dan bukti pengujian Postman tersedia pada file README.md di repository GitHub."),
]


def pdf_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def wrap_text(text: str, width: int = 88):
    return textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False) or [""]


def add_line(lines, x, y, text, size=11, font="F1"):
    lines.append(f"BT /{font} {size} Tf {x} {y} Td ({pdf_escape(text)}) Tj ET")


def build_pages():
    pages = []
    lines = []
    y = 780
    left = 56
    usable_bottom = 58

    def new_page():
        nonlocal lines, y
        pages.append(lines)
        lines = []
        y = 780

    def ensure(space):
        nonlocal y
        if y - space < usable_bottom:
            new_page()

    for kind, text in content:
        if kind == "title":
            ensure(52)
            add_line(lines, left, y, text, 22, "F2")
            y -= 30
        elif kind == "subtitle":
            add_line(lines, left, y, text, 14, "F1")
            y -= 34
        elif kind == "heading":
            ensure(42)
            y -= 10
            add_line(lines, left, y, text.upper(), 13, "F2")
            y -= 22
        elif kind == "text":
            ensure(22)
            for line in wrap_text(text, 86):
                add_line(lines, left, y, line, 11, "F1")
                y -= 16
            y -= 3
        elif kind == "paragraph":
            ensure(55)
            for line in wrap_text(text, 88):
                add_line(lines, left, y, line, 11, "F1")
                y -= 16
            y -= 8
        elif kind == "bullet":
            ensure(35)
            wrapped = wrap_text(text, 82)
            add_line(lines, left, y, "- " + wrapped[0], 11, "F1")
            y -= 16
            for line in wrapped[1:]:
                add_line(lines, left + 12, y, line, 11, "F1")
                y -= 16
            y -= 3

    if lines:
        pages.append(lines)
    return pages


def make_pdf(pages):
    objects = []

    def add_obj(data: str) -> int:
        objects.append(data)
        return len(objects)

    font_regular = add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    font_bold = add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

    page_ids = []
    content_ids = []
    for page_lines in pages:
        stream = "\n".join(page_lines)
        content_ids.append(add_obj(f"<< /Length {len(stream.encode('latin-1'))} >>\nstream\n{stream}\nendstream"))
        page_ids.append(None)

    pages_obj_number = len(objects) + len(page_ids) + 1
    for index, content_id in enumerate(content_ids):
        page_ids[index] = add_obj(
            f"<< /Type /Page /Parent {pages_obj_number} 0 R /MediaBox [0 0 595 842] "
            f"/Resources << /Font << /F1 {font_regular} 0 R /F2 {font_bold} 0 R >> >> "
            f"/Contents {content_id} 0 R >>"
        )

    kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
    pages_id = add_obj(f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>")
    catalog_id = add_obj(f"<< /Type /Catalog /Pages {pages_id} 0 R >>")

    output = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for obj_number, data in enumerate(objects, start=1):
        offsets.append(len(output))
        output.extend(f"{obj_number} 0 obj\n{data}\nendobj\n".encode("latin-1"))

    xref_offset = len(output)
    output.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
    output.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode("latin-1"))
    output.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\n"
        f"startxref\n{xref_offset}\n%%EOF\n".encode("latin-1")
    )
    return output


pdf_bytes = make_pdf(build_pages())
OUTPUT.write_bytes(pdf_bytes)
print(OUTPUT)
