# SiArsip Desa - Sistem Informasi & Arsip Surat Desa Banjarsari

Aplikasi web modern untuk manajemen persuratan desa, pengarsipan digital, dan disposisi surat, dibangun dengan Laravel 10 dan React (Inertia.js).

## 🚀 Fitur Utama

### 👥 Multi-Role System
1. **Pegawai Desa**
   - Membuat surat baru (SK, SPPD, Surat Tugas, dll)
   - Mengelola surat sendiri (Draft, Edit, Hapus)
   - Melakukan revisi surat yang dikembalikan
2. **Sekretaris Desa (Verifikator)**
   - Review surat dari Pegawai
   - Kembalikan surat untuk revisi (dengan catatan)
   - Teruskan surat ke Kepala Desa
   - Akses Arsip Surat (Read-only)
   - Manajemen Akun Pengguna
3. **Kepala Desa (Approver)**
   - Approval akhir surat (Setujui/Tolak)
   - Tanda tangan elektronik (QR Code)
   - Akses Arsip Surat (Read-only)

### 📝 Manajemen Surat
- **Template Dinamis**: SK, SPPD, Surat Tugas, Surat Cuti, Surat Pengunduran Diri, Memo
- **Live Preview**: Lihat hasil surat saat mengetik
- **PDF Generation**: Auto-generate PDF surat resmi dengan Kop Surat
- **Alur Revisi**: Sistem revisi surat dengan catatan dari reviewer

### 📂 Arsip Digital
- Manajemen Folder Arsip
- Pencarian & Filter Surat (Status, Tanggal, Jenis)
- Download & Preview PDF

---

## 🛠️ Teknologi

- **Backend**: Laravel 10
- **Frontend**: React.js, Inertia.js, Tailwind CSS
- **Database**: MySQL
- **PDF**: DomPDF

---

## 💻 Cara Install & Jalankan

1. **Clone Repo**
   ```bash
   git clone https://github.com/username/siarsip-desa.git
   cd siarsip-desa
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Setup Environment**
   - Copy `.env.example` ke `.env`
   - Setup database di `.env`:
     ```env
     DB_DATABASE=desa_2
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Generate Key & Migrate**
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```

5. **Jalankan Aplikasi**
   - Terminal 1 (Laravel Server):
     ```bash
     php artisan serve
     ```
   - Terminal 2 (Vite):
     ```bash
     npm run dev
     ```

## 🔐 Akun Demo (Seeder)

| Role | Email | Password |
|------|-------|----------|
| **Kepala Desa** | kades@desa.com | password |
| **Sekretaris Desa** | sekdes@desa.com | password |
| **Pegawai Desa** | pegawai@desa.com | password |

---

## 📄 Struktur Menu

- **Dashboard**: Overview statistik surat
- **Pembuatan Surat**: Form surat dinamis (Pegawai & Sekdes)
- **Review Surat**: Queue review surat masuk (Sekdes)
- **Approval Surat**: Queue approval surat (Kades)
- **Pengelolaan Surat**: Manage surat sendiri (Pegawai)
- **Arsip Surat**: Arsip surat approved/rejected (Sekdes & Kades)
- **Manajemen Akun**: Kelola user (Sekdes only)
