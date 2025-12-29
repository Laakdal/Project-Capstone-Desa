# Dashboard Role-Specific Implementation

## Overview
Implementasi dashboard yang berbeda untuk setiap role dengan layout yang konsisten sesuai PBI#6, PBI#7, dan PBI#8.

## Features Implemented

### PBI#6: Dashboard Pegawai Desa
**Fitur:**
- ✅ Ringkasan jumlah draft surat
- ✅ Jumlah surat yang menunggu persetujuan
- ✅ Jumlah surat disposisi yang masuk (placeholder)
- ✅ Ringkasan surat pribadi (total, disetujui, ditolak, dicabut)
- ✅ Tabel surat yang perlu tindakan

**Statistik yang Ditampilkan:**
1. **Draft Surat** - Surat yang belum dikirim
2. **Menunggu Persetujuan** - Surat dalam proses review (sent + continued)
3. **Disposisi Masuk** - Surat disposisi (TODO: implementasi disposisi)

### PBI#7: Dashboard Kepala Desa
**Fitur:**
- ✅ Daftar surat yang perlu persetujuan
- ✅ Jumlah surat disetujui bulan ini
- ✅ Total surat bulan ini
- ✅ Tabel surat menunggu persetujuan dengan aksi langsung
- ✅ Statistik sistem keseluruhan

**Statistik yang Ditampilkan:**
1. **Perlu Persetujuan** - Surat dengan status 'continued' (highlighted)
2. **Disetujui Bulan Ini** - Surat yang disetujui bulan berjalan
3. **Total Bulan Ini** - Semua surat yang dibuat bulan ini

### PBI#8: Dashboard Sekretaris Desa
**Fitur:**
- ✅ Ringkasan statistik sistem
- ✅ Total surat bulan ini
- ✅ Jumlah pengguna aktif
- ✅ Daftar surat yang perlu diverifikasi
- ✅ Tabel surat pending dengan aksi review
- ✅ Statistik sistem lengkap

**Statistik yang Ditampilkan:**
1. **Perlu Verifikasi** - Surat dengan status 'sent' (highlighted)
2. **Surat Bulan Ini** - Total surat bulan berjalan
3. **Pengguna Aktif** - Jumlah pegawai dengan status aktif

## Layout Consistency

Semua dashboard mengikuti layout yang konsisten:

### 1. Header Section
```
[Judul Dashboard]
[Deskripsi singkat]
```

### 2. Statistics Cards (3 kolom)
```
[Card 1]  [Card 2]  [Card 3]
```
- Menggunakan komponen `StatCard` yang sama
- Warna konsisten berdasarkan jenis data
- Icon yang relevan
- Highlight untuk data penting

### 3. Summary Section
```
[Ringkasan dengan 4 mini cards]
```
- Menggunakan komponen `MiniStatCard`
- Grid 2x2 atau 4 kolom

### 4. Table Section
```
[Tabel surat dengan aksi]
```
- Menggunakan komponen `LettersTable`
- Kolom konsisten: Nomor, Perihal, Pembuat, Status, Tanggal, Aksi
- Aksi berbeda per role (Review/Setujui/Lihat)

## Components

### StatCard
```jsx
<StatCard
    title="Judul"
    value={angka}
    icon="emoji"
    color="blue|green|yellow|red|orange|gray"
    description="Deskripsi"
    link="/optional/link"
    highlight={true/false}
/>
```

### MiniStatCard
```jsx
<MiniStatCard
    label="Label"
    value={angka}
    color="blue|green|yellow|red|orange|gray"
/>
```

### LettersTable
```jsx
<LettersTable
    letters={array}
    showReviewActions={true/false}
    showApprovalActions={true/false}
/>
```

## Color Scheme

Konsisten di semua dashboard:
- **Blue** - Informasi umum, total
- **Green** - Positif, disetujui, aktif
- **Yellow** - Pending, menunggu
- **Red** - Urgent, ditolak, perlu perhatian
- **Orange** - Warning, dicabut
- **Gray** - Netral, draft

## Backend Changes

### DashboardController.php
- Menambahkan logika role-specific
- Query data sesuai kebutuhan masing-masing role
- Return data `pendingLetters` untuk tabel
- Return `userRole` untuk conditional rendering

## Testing

### Test sebagai Pegawai:
1. Login sebagai pegawai (siti.aminah@example.com)
2. Lihat dashboard - harus tampil 3 card: Draft, Waiting Approval, Dispositions
3. Lihat tabel surat pribadi yang pending

### Test sebagai Sekdes:
1. Login sebagai sekdes
2. Lihat dashboard - harus tampil: Pending Review, Surat Bulan Ini, Pengguna Aktif
3. Lihat tabel surat yang perlu diverifikasi

### Test sebagai Kades:
1. Login sebagai kades
2. Lihat dashboard - harus tampil: Pending Approval (highlighted), Approved This Month, Total This Month
3. Lihat tabel surat yang perlu disetujui

## Next Steps

1. ✅ Implementasi disposisi system untuk Pegawai
2. ✅ Tambahkan filter tanggal untuk statistik
3. ✅ Tambahkan chart/grafik untuk visualisasi data
4. ✅ Implementasi notifikasi real-time
5. ✅ Export data statistik ke Excel/PDF
